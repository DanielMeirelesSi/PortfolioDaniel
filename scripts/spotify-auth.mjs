import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { parseEnv } from "node:util";

const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];
class AuthError extends Error {}

export function parseConfig(contents) {
  const env = parseEnv(contents);
  for (const name of ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REDIRECT_URI"]) {
    if (!env[name]?.trim()) throw new AuthError(`Preencha ${name} no .env.local.`);
  }

  let redirect;
  try {
    redirect = new URL(env.SPOTIFY_REDIRECT_URI.trim());
  } catch {
    throw new AuthError("SPOTIFY_REDIRECT_URI deve ser uma URL local valida.");
  }
  if (redirect.protocol !== "http:" || redirect.hostname !== "127.0.0.1" ||
      !redirect.port || Number(redirect.port) < 1 || redirect.username || redirect.password ||
      redirect.search || redirect.hash || redirect.pathname === "/") {
    throw new AuthError("Use um redirect HTTP em 127.0.0.1, com porta e caminho de callback, sem query ou fragmento.");
  }
  return {
    clientId: env.SPOTIFY_CLIENT_ID.trim(),
    clientSecret: env.SPOTIFY_CLIENT_SECRET.trim(),
    redirectUri: env.SPOTIFY_REDIRECT_URI.trim(),
    redirect,
  };
}

export async function exchangeCode(config, code, { fetchImpl = fetch, signal } = {}) {
  let response;
  let data;
  try {
    response = await fetchImpl("https://accounts.spotify.com/api/token", {
      method: "POST",
      redirect: "error",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: config.redirectUri }),
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new AuthError(`O Spotify recusou a troca do codigo (HTTP ${response.status}). Confira as credenciais e o redirect, e execute novamente.`);
    data = await response.json();
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Falha de rede, tempo esgotado ou resposta invalida na troca do codigo. Execute novamente.");
  }
  if (!data || typeof data.access_token !== "string" || !data.access_token.trim() ||
      typeof data.refresh_token !== "string" || !data.refresh_token.trim()) {
    throw new AuthError("O Spotify nao retornou os tokens esperados. Execute novamente e autorize a conta.");
  }
  return data.refresh_token;
}

export function authorize(config, {
  fetchImpl = fetch,
  timeoutMs = 10 * 60 * 1000,
  onReady = url => process.stderr.write(`Abra este link no navegador e autorize sua propria conta:\n${url}\nAguardando por ate 10 minutos. Ctrl+C cancela.\n`),
  writeRefreshToken = token => process.stdout.write(`${token}\n`),
} = {}) {
  const state = randomBytes(32).toString("hex");
  const startPath = `/spotify-auth/${state}`;
  const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
  authorizationUrl.search = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.redirectUri,
    scope: SCOPES.join(" "),
    state,
    show_dialog: "true",
  }).toString();

  return new Promise((resolve, reject) => {
    let finished = false;
    let exchanging = false;
    let timer;
    const controller = new AbortController();
    const reply = (res, status, text, headers = {}) => new Promise(done => {
      res.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
        Connection: "close",
        ...headers,
      });
      res.end(text, done);
    });
    const finish = error => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      controller.abort();
      process.removeListener("SIGINT", cancel);
      process.removeListener("SIGTERM", cancel);
      if (server.listening) {
        server.close();
        server.closeAllConnections();
      }
      if (error) reject(error);
      else resolve();
    };
    const cancel = () => finish(new AuthError("Autorizacao cancelada. Nenhum token foi salvo."));

    const server = createServer((req, res) => {
      void (async () => {
        const address = server.address();
        if (!address || req.headers.host !== `127.0.0.1:${address.port}`) {
          await reply(res, 400, "Host local invalido.");
          return;
        }
        if (req.method !== "GET") {
          await reply(res, 405, "Metodo nao permitido.", { Allow: "GET" });
          return;
        }
        let url;
        try {
          url = new URL(req.url, config.redirect.origin);
        } catch {
          await reply(res, 400, "Requisicao invalida.");
          return;
        }
        if (url.pathname === startPath) {
          await reply(res, 302, "Redirecionando ao Spotify.", { Location: authorizationUrl.href });
          return;
        }
        if (url.pathname !== config.redirect.pathname) {
          await reply(res, 404, "Pagina nao encontrada.");
          return;
        }
        if (exchanging || finished) {
          await reply(res, 409, "Este callback ja esta sendo processado. Aguarde no terminal.");
          return;
        }

        const states = url.searchParams.getAll("state");
        const received = Buffer.from(states[0] ?? "");
        const expected = Buffer.from(state);
        if (states.length !== 1 || received.length !== expected.length || !timingSafeEqual(received, expected)) {
          await reply(res, 400, "State invalido. Reinicie o script para autorizar novamente.");
          finish(new AuthError("Callback rejeitado: state ausente, duplicado ou invalido."));
          return;
        }
        if (url.searchParams.has("error")) {
          await reply(res, 400, "Autorizacao recusada ou cancelada. Volte ao terminal.");
          finish(new AuthError("A conta nao foi autorizada. Execute novamente quando desejar."));
          return;
        }
        const codes = url.searchParams.getAll("code");
        if (codes.length !== 1 || !codes[0].trim()) {
          await reply(res, 400, "Codigo ausente ou duplicado. Reinicie o script.");
          finish(new AuthError("O callback nao trouxe um unico codigo de autorizacao valido."));
          return;
        }

        exchanging = true;
        const refreshToken = await exchangeCode(config, codes[0], { fetchImpl, signal: controller.signal });
        if (finished) return;
        writeRefreshToken(refreshToken);
        await reply(res, 200, "Autorizacao concluida. O refresh token esta no terminal. Pode fechar esta aba.");
        finish();
      })().catch(async error => {
        if (finished) return;
        if (!res.headersSent && !res.destroyed) await reply(res, 502, "Nao foi possivel concluir a autorizacao. Confira o terminal.");
        finish(error instanceof AuthError ? error : new AuthError("Falha ao processar a autorizacao local. Execute novamente."));
      });
    });
    server.headersTimeout = 5000;
    server.requestTimeout = 10000;
    server.once("error", error => finish(new AuthError(error.code === "EADDRINUSE"
      ? `A porta ${config.redirect.port} esta ocupada. Pare o servidor Next.js (Ctrl+C no terminal dele) e execute npm run spotify:auth novamente. A porta nao pode ser trocada sem atualizar o redirect cadastrado.`
      : "Nao foi possivel abrir o servidor de callback em 127.0.0.1.")));
    process.once("SIGINT", cancel);
    process.once("SIGTERM", cancel);
    server.listen(Number(config.redirect.port), "127.0.0.1", () => {
      if (finished) { server.close(); return; }
      timer = setTimeout(() => finish(new AuthError("Tempo para autorizar esgotado. Execute npm run spotify:auth novamente.")), timeoutMs);
      // The terminal link stays local so even the Client ID is not printed.
      try {
        onReady(`http://127.0.0.1:${server.address().port}${startPath}`);
      } catch {
        finish(new AuthError("Nao foi possivel apresentar o link de autorizacao."));
      }
    });
  });
}

async function main() {
  let contents;
  try {
    contents = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    throw new AuthError("Nao foi possivel ler .env.local na raiz do projeto.");
  }
  await authorize(parseConfig(contents));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    process.stderr.write(`${error instanceof AuthError ? error.message : "Falha na autorizacao local."}\n`);
    process.exitCode = 1;
  });
}
