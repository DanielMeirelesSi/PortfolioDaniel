export interface SpotifyTrack {
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

export function formatSpotifyTime(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return "--:--";
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function getSpotifyProgress(data: Pick<SpotifyTrack, "progressMs" | "durationMs">) {
  const duration = data.durationMs !== null && Number.isFinite(data.durationMs) && data.durationMs > 0
    ? data.durationMs : null;
  const elapsed = data.progressMs !== null && Number.isFinite(data.progressMs)
    ? Math.max(0, data.progressMs) : null;
  const progress = duration !== null && elapsed !== null ? Math.min(elapsed, duration) : null;
  return { duration, progress, percent: duration && progress !== null ? progress / duration * 100 : 0 };
}

export function parseSpotifyTrack(value: unknown): SpotifyTrack | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (data.status !== "playing" && data.status !== "recent") return null;
  if (typeof data.track !== "string" || !data.track.trim()) return null;
  if (!Array.isArray(data.artists) || data.artists.length === 0 ||
      data.artists.some(artist => typeof artist !== "string" || !artist.trim())) return null;
  if (typeof data.album !== "string" || !data.album.trim()) return null;
  if (data.imageUrl !== null && (typeof data.imageUrl !== "string" || !data.imageUrl.trim())) return null;
  if (data.spotifyUrl !== null && (typeof data.spotifyUrl !== "string" || !data.spotifyUrl.trim())) return null;
  if (data.progressMs !== null && (typeof data.progressMs !== "number" || !Number.isFinite(data.progressMs) || data.progressMs < 0)) return null;
  if (typeof data.durationMs !== "number" || !Number.isFinite(data.durationMs) || data.durationMs < 0) return null;
  if (data.playedAt !== null && (typeof data.playedAt !== "string" || !data.playedAt.trim())) return null;
  return {
    status: data.status,
    track: data.track,
    artists: data.artists,
    album: data.album,
    imageUrl: data.imageUrl,
    spotifyUrl: data.spotifyUrl,
    progressMs: data.progressMs,
    durationMs: data.durationMs,
    playedAt: data.playedAt,
  };
}

export function getSpotifyUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "open.spotify.com" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
