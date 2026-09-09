const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export interface SpotifyPublicTrack {
  status: "playing" | "recent";
  track: string;
  artists: string[];
  album: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
  progressMs: number | null;
  durationMs: number;
  playedAt: string | null;
}

interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export class SpotifyError extends Error {
  constructor(
    public readonly code: string,
    public readonly httpStatus: number,
    public readonly publicMessage: string,
    public readonly retryAfter?: string,
  ) {
    super(publicMessage);
    this.name = "SpotifyError";
  }
}

function getConfig(): SpotifyConfig {
  const missing = [
    ["SPOTIFY_CLIENT_ID", process.env.SPOTIFY_CLIENT_ID],
    ["SPOTIFY_CLIENT_SECRET", process.env.SPOTIFY_CLIENT_SECRET],
    ["SPOTIFY_REFRESH_TOKEN", process.env.SPOTIFY_REFRESH_TOKEN],
  ].filter(([, value]) => !value?.trim()).map(([name]) => name);

  if (missing.length > 0) {
    throw new SpotifyError(
      "SPOTIFY_CONFIGURATION_MISSING",
      500,
      "A integração com o Spotify não está configurada.",
    );
  }

  return {
    clientId: process.env.SPOTIFY_CLIENT_ID!.trim(),
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!.trim(),
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN!.trim(),
  };
}

function retryAfterValue(response: Response): string | undefined {
  const value = response.headers.get("retry-after")?.trim();
  return value && /^\d+$/.test(value) ? value : undefined;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new SpotifyError(
      "SPOTIFY_INVALID_RESPONSE",
      502,
      "O Spotify retornou uma resposta inválida.",
    );
  }
}

async function getAccessToken(config: SpotifyConfig): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: config.refreshToken,
      }),
    });
  } catch {
    throw new SpotifyError("SPOTIFY_TOKEN_REFRESH_FAILED", 502, "Não foi possível renovar o acesso ao Spotify.");
  }

  if (!response.ok) {
    throw new SpotifyError("SPOTIFY_TOKEN_REFRESH_FAILED", response.status === 429 ? 429 : 502,
      "Não foi possível renovar o acesso ao Spotify.", retryAfterValue(response));
  }

  const data = await readJson(response);
  if (!isRecord(data) || typeof data.access_token !== "string" || !data.access_token.trim()) {
    throw new SpotifyError("SPOTIFY_INVALID_RESPONSE", 502, "O Spotify não retornou um acesso válido.");
  }
  return data.access_token;
}

async function spotifyGet(path: string, accessToken: string): Promise<Response> {
  try {
    return await fetch(`${SPOTIFY_API_URL}${path}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    throw new SpotifyError("SPOTIFY_UNAVAILABLE", 502, "Não foi possível consultar o Spotify.");
  }
}

function handleSpotifyError(response: Response): never {
  if (response.status === 429) {
    throw new SpotifyError("SPOTIFY_RATE_LIMITED", 429, "O Spotify limitou temporariamente as consultas.", retryAfterValue(response));
  }
  if (response.status === 401) {
    throw new SpotifyError("SPOTIFY_UNAUTHORIZED", 502, "O acesso ao Spotify não está autorizado.");
  }
  if (response.status === 403) {
    throw new SpotifyError("SPOTIFY_FORBIDDEN", 502, "O Spotify recusou o acesso solicitado.");
  }
  throw new SpotifyError("SPOTIFY_API_FAILED", 502, "Não foi possível consultar o Spotify.");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function nonNegativeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function publicTrack(item: unknown, status: SpotifyPublicTrack["status"], progressMs: number | null, playedAt: string | null): SpotifyPublicTrack {
  if (!isRecord(item)) throw new SpotifyError("SPOTIFY_INVALID_RESPONSE", 502, "O Spotify retornou uma faixa inválida.");
  const track = requiredString(item.name);
  const albumValue = isRecord(item.album) ? requiredString(item.album.name) : null;
  const artistsValue = Array.isArray(item.artists)
    ? item.artists.map(artist => isRecord(artist) ? requiredString(artist.name) : null)
    : [];
  const artists = artistsValue.filter((artist): artist is string => artist !== null);
  const durationMs = nonNegativeNumber(item.duration_ms);
  if (!track || !albumValue || artists.length === 0 || durationMs === null) {
    throw new SpotifyError("SPOTIFY_INVALID_RESPONSE", 502, "O Spotify retornou uma faixa inválida.");
  }

  const images = isRecord(item.album) && Array.isArray(item.album.images) ? item.album.images : [];
  const imageUrl = images.length > 0 && isRecord(images[0]) ? requiredString(images[0].url) : null;
  const externalUrls = isRecord(item.external_urls) ? requiredString(item.external_urls.spotify) : null;
  return {
    status,
    track,
    artists,
    album: albumValue,
    imageUrl,
    spotifyUrl: externalUrls,
    progressMs,
    durationMs,
    playedAt,
  };
}

function tryPublicTrack(
  item: unknown,
  status: SpotifyPublicTrack["status"],
  progressMs: number | null,
  playedAt: string | null,
): SpotifyPublicTrack | null {
  try {
    return publicTrack(item, status, progressMs, playedAt);
  } catch (error) {
    if (error instanceof SpotifyError && error.code === "SPOTIFY_INVALID_RESPONSE") return null;
    throw error;
  }
}

async function getRecentTrack(accessToken: string): Promise<SpotifyPublicTrack | null> {
  const response = await spotifyGet("/me/player/recently-played?limit=1", accessToken);
  if (!response.ok) handleSpotifyError(response);
  const data = await readJson(response);
  if (!isRecord(data) || !Array.isArray(data.items)) {
    throw new SpotifyError("SPOTIFY_INVALID_RESPONSE", 502, "O Spotify retornou um histórico inválido.");
  }
  const first = data.items[0];
  if (first === undefined) return null;
  if (!isRecord(first) || typeof first.played_at !== "string" || !first.played_at.trim()) {
    throw new SpotifyError("SPOTIFY_INVALID_RESPONSE", 502, "O Spotify retornou um histórico inválido.");
  }
  return publicTrack(first.track, "recent", null, first.played_at);
}

export async function getSpotifyNowPlaying(): Promise<SpotifyPublicTrack | null> {
  const config = getConfig();
  const accessToken = await getAccessToken(config);
  const response = await spotifyGet("/me/player/currently-playing", accessToken);
  if (response.status === 204) return getRecentTrack(accessToken);
  if (!response.ok) handleSpotifyError(response);

  const data = await readJson(response);
  if (!isRecord(data) || typeof data.is_playing !== "boolean") {
    throw new SpotifyError("SPOTIFY_INVALID_RESPONSE", 502, "O Spotify retornou um estado de reprodução inválido.");
  }
  const progressMs = nonNegativeNumber(data.progress_ms) ?? 0;
  const currentTrack = tryPublicTrack(
    data.item,
    data.is_playing ? "playing" : "recent",
    data.is_playing ? progressMs : null,
    null,
  );
  return currentTrack ?? getRecentTrack(accessToken);
}
