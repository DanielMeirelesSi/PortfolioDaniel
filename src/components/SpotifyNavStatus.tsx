"use client";

import { useLang } from "@/context/lang";
import { useSpotify } from "@/context/spotify";
import { getSpotifyUrl } from "@/data/spotify";
import SpotifyEqualizer from "./SpotifyEqualizer";

export default function SpotifyNavStatus() {
  const { t } = useLang();
  const { data, state } = useSpotify();
  if (state === "error" || state === "empty") return null;
  if (state === "loading") return <span className="spotify-nav-slot" aria-hidden="true" />;
  if (!data) return null;

  const playing = data.status === "playing";
  const status = playing ? t.spotifyPlaying : t.spotifyRecent;
  const description = `${data.track} \u00b7 ${data.artists.join(", ")}`;
  const href = getSpotifyUrl(data.spotifyUrl);

  return (
    <a
      className="spotify-nav"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={!href || undefined}
      aria-label={`${status}: ${description}. ${t.spotifyOpen}`}
      title={`${status}: ${description}`}
    >
      <SpotifyEqualizer playing={playing} />
      <span className="spotify-nav-text">{description}</span>
    </a>
  );
}
