# Spotify integration

This guide covers the optional Spotify feature shown in the contact section. It is intended for maintainers who need to configure or troubleshoot the integration.

## Configuration

Create or edit `.env.local` at the repository root. Do not commit this file or share its values.

| Variable | Used by | Requirement |
| --- | --- | --- |
| `SPOTIFY_CLIENT_ID` | Authorization helper and server route | Required. |
| `SPOTIFY_CLIENT_SECRET` | Authorization helper and server route | Required and sensitive. |
| `SPOTIFY_REDIRECT_URI` | Authorization helper | Required for authorization only. Must be an HTTP callback on `127.0.0.1` with an explicit port and path, without credentials, query string or fragment. |
| `SPOTIFY_REFRESH_TOKEN` | Server route | Required after authorization and sensitive. |

The Spotify application and its redirect registration are configured outside this repository. The callback value in `.env.local` must match the registered local callback. A repository test uses this shape as an example:

```dotenv
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/spotify/callback
```

The other variables must contain the values issued for the Spotify application and authorized account; this document intentionally does not include real values.

## Authorize a local account

The helper requests only `user-read-currently-playing` and `user-read-recently-played`.

1. Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REDIRECT_URI` in `.env.local`.
2. Run `npm run spotify:auth`.
3. Open the authorization link printed in the terminal and authorize the intended Spotify account.
4. Copy the refresh token printed in the terminal into `SPOTIFY_REFRESH_TOKEN` in `.env.local`.
5. Start the application with `npm run dev`.

The helper starts its own temporary callback server on the port in `SPOTIFY_REDIRECT_URI`. If that port is already used by Next.js, stop the Next.js process, run the authorization helper, and start Next.js again afterward. The helper does not write `.env.local` automatically.

The local callback server validates the host, method, path, authorization `state`, and code before exchanging the code. Repeated callbacks are rejected while the first exchange is in progress. The session also expires after its configured timeout or when interrupted.

## Runtime flow

The browser-side `SpotifyProvider` requests the same-origin `GET /api/spotify` endpoint immediately and every 20 seconds. The server route:

1. Reads the three runtime variables: client ID, client secret and refresh token.
2. Exchanges the refresh token for a short-lived Spotify access token.
3. Requests the currently playing track.
4. If Spotify returns no current track, requests the most recent track instead.
5. Returns only the public track fields used by the UI.

While a track is playing, the browser updates the displayed progress every second. A missing or invalid album image uses the local `public/spotify-album-placeholder.svg` fallback.

The card is hidden when the endpoint returns no track or when the client receives an error. The initial loading state displays a placeholder card.

## Endpoint behavior

`GET /api/spotify` is an internal same-origin route used by the portfolio UI. Responses are marked `no-store`.

| Response | Meaning |
| --- | --- |
| `200` | JSON object containing `status`, `track`, `artists`, `album`, `imageUrl`, `spotifyUrl`, `progressMs`, `durationMs` and `playedAt`. |
| `204` | Neither a current nor a recent track was available. |
| `429` | Spotify rate-limited a request; `Retry-After` is forwarded when it contains an integer value. |
| `500` | Required runtime configuration is missing. |
| `502` | Spotify could not be reached, rejected the request, or returned an invalid response. |

The route returns structured errors with an `error.code` and public `error.message`. Access tokens, client secrets and refresh tokens are not part of the response contract.

## Testing

Run the authorization helper tests directly with Node:

```bash
node --test scripts/spotify-auth.test.mjs
```

These tests use fake credentials and mocked responses. They cover configuration validation, requested scopes, state and code validation, repeated callbacks, occupied ports, timeouts and credential non-disclosure. The repository does not currently expose this command through an npm script.

## Troubleshooting

- **Missing configuration:** for the runtime card, confirm `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN`; `npm run spotify:auth` additionally requires `SPOTIFY_REDIRECT_URI`.
- **Port already in use:** stop the Next.js process if it is using the callback port, then run `npm run spotify:auth` again.
- **Invalid or repeated callback:** restart `npm run spotify:auth` and use the newly printed link. The helper rejects missing, duplicated or mismatched `state` and authorization codes.
- **Card is not visible:** the endpoint may have returned `204`, or the client may have received an integration error. Check the runtime variables and the Spotify account authorization without exposing their values.
