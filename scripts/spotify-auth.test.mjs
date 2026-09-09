import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { authorize, exchangeCode, parseConfig } from "./spotify-auth.mjs";

const config = parseConfig(`
SPOTIFY_CLIENT_ID=fake-client-id
SPOTIFY_CLIENT_SECRET="fake-client-secret"
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/spotify/callback
`);
const payload = { access_token: "fake-access-token", refresh_token: "fake-refresh-token" };

function session({ fetchImpl, timeoutMs = 3000, port = 0 } = {}) {
  const calls = [];
  const tokens = [];
  const redirect = new URL(config.redirectUri);
  redirect.port = String(port);
  let reportReady;
  const ready = new Promise(resolve => { reportReady = resolve; });
  const completion = authorize({ ...config, redirect, redirectUri: redirect.href }, {
    timeoutMs,
    fetchImpl: async (...args) => {
      calls.push(args);
      return fetchImpl ? fetchImpl(...args) : Response.json(payload);
    },
    onReady: reportReady,
    writeRefreshToken: token => tokens.push(token),
  }).then(() => ({ ok: true }), error => ({ error }));
  return { ready, completion, calls, tokens };
}

async function begin(flow) {
  const start = await flow.ready;
  const response = await fetch(start, { redirect: "manual" });
  assert.equal(response.status, 302);
  const authorization = new URL(response.headers.get("location"));
  const callback = new URL(config.redirect.pathname, start);
  callback.searchParams.set("state", authorization.searchParams.get("state"));
  callback.searchParams.set("code", "fake-authorization-code");
  return { start, authorization, callback };
}

test("reads dotenv syntax without requiring a real environment file", () => {
  assert.equal(config.clientSecret, "fake-client-secret");
  for (const name of ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REDIRECT_URI"]) {
    const values = {
      SPOTIFY_CLIENT_ID: "fake-id",
      SPOTIFY_CLIENT_SECRET: "fake-secret",
      SPOTIFY_REDIRECT_URI: config.redirectUri,
      [name]: "",
    };
    assert.throws(() => parseConfig(Object.entries(values).map(([key, value]) => `${key}=${value}`).join("\n")), new RegExp(name));
  }
  for (const uri of ["not-a-url", "https://example.com/callback", "http://localhost:3000/callback", "http://127.0.0.1:0/callback", `${config.redirectUri}?extra=1`]) {
    assert.throws(() => parseConfig(`SPOTIFY_CLIENT_ID=fake\nSPOTIFY_CLIENT_SECRET=fake\nSPOTIFY_REDIRECT_URI=${uri}`));
  }
});

test("authorizes only the requested scopes and emits only the refresh token", async () => {
  const flow = session();
  const { start, authorization, callback } = await begin(flow);
  assert.equal(authorization.origin + authorization.pathname, "https://accounts.spotify.com/authorize");
  assert.equal(authorization.searchParams.get("response_type"), "code");
  assert.equal(authorization.searchParams.get("scope"), "user-read-currently-playing user-read-recently-played");
  assert.equal(authorization.searchParams.get("show_dialog"), "true");
  assert.match(authorization.searchParams.get("state"), /^[a-f0-9]{64}$/);
  assert.ok(!start.includes(config.clientId) && !start.includes(config.clientSecret));
  assert.ok(!authorization.href.includes(config.clientSecret));

  const response = await fetch(callback);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  for (const value of [...Object.values(payload), config.clientSecret]) assert.ok(!body.includes(value));
  assert.deepEqual(await flow.completion, { ok: true });
  assert.deepEqual(flow.tokens, [payload.refresh_token]);
  assert.equal(flow.calls.length, 1);
  const [endpoint, options] = flow.calls[0];
  assert.equal(endpoint, "https://accounts.spotify.com/api/token");
  assert.equal(options.method, "POST");
  assert.equal(options.redirect, "error");
  assert.equal(options.headers.Authorization, `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`);
  assert.equal(options.body.get("grant_type"), "authorization_code");
  assert.equal(options.body.get("code"), "fake-authorization-code");
  assert.equal(options.body.get("redirect_uri"), authorization.searchParams.get("redirect_uri"));
});

for (const scenario of ["missing state", "wrong state", "duplicate state", "denied", "missing code", "duplicate code"]) {
  test(`rejects ${scenario} without exchanging or printing tokens`, async () => {
    const flow = session();
    const { callback } = await begin(flow);
    if (scenario === "missing state") callback.searchParams.delete("state");
    if (scenario === "wrong state") callback.searchParams.set("state", "f".repeat(64));
    if (scenario === "duplicate state") callback.searchParams.append("state", callback.searchParams.get("state"));
    if (scenario === "denied") { callback.searchParams.delete("code"); callback.searchParams.set("error", "access_denied"); }
    if (scenario === "missing code") callback.searchParams.delete("code");
    if (scenario === "duplicate code") callback.searchParams.append("code", "duplicate");
    assert.equal((await fetch(callback)).status, 400);
    assert.ok((await flow.completion).error);
    assert.equal(flow.calls.length, 0);
    assert.deepEqual(flow.tokens, []);
  });
}

test("does not exchange a code twice if the callback is repeated", async () => {
  let release;
  const responseReady = new Promise(resolve => { release = resolve; });
  const flow = session({ fetchImpl: () => responseReady });
  const { callback } = await begin(flow);
  const first = fetch(callback);
  while (!flow.calls.length) await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal((await fetch(callback)).status, 409);
  release(Response.json(payload));
  assert.equal((await first).status, 200);
  assert.deepEqual(await flow.completion, { ok: true });
  assert.equal(flow.calls.length, 1);
  assert.deepEqual(flow.tokens, [payload.refresh_token]);
});

test("occupied port fails before offering authorization or calling Spotify", async () => {
  const occupied = createServer();
  occupied.listen(0, "127.0.0.1");
  await once(occupied, "listening");
  try {
    const flow = session({ port: occupied.address().port });
    const { error } = await flow.completion;
    assert.match(error.message, /ocupada.*Pare o servidor Next.js/);
    assert.deepEqual(flow.calls, []);
    assert.deepEqual(flow.tokens, []);
  } finally {
    await new Promise(resolve => occupied.close(resolve));
  }
});

test("timeout closes the session without printing tokens", async () => {
  const flow = session({ timeoutMs: 50 });
  await flow.ready;
  assert.match((await flow.completion).error.message, /esgotado/);
  assert.deepEqual(flow.calls, []);
  assert.deepEqual(flow.tokens, []);
});

test("token errors never expose response bodies or credentials", async () => {
  const responses = [
    () => Response.json({ error_description: config.clientSecret }, { status: 401 }),
    () => new Response(`invalid-json-${config.clientSecret}`),
    () => Response.json({ access_token: payload.access_token }),
    () => Response.json({ ...payload, refresh_token: " " }),
    () => Response.json(null),
    () => { throw new Error(config.clientSecret); },
  ];
  for (const fetchImpl of responses) {
    await assert.rejects(exchangeCode(config, "fake-code", { fetchImpl }), error => {
      for (const value of [...Object.values(payload), config.clientSecret]) assert.ok(!error.message.includes(value));
      return true;
    });
  }
});
