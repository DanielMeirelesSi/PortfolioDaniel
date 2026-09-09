"use client";

import { useId, useState, type CSSProperties } from "react";
import { useLang } from "@/context/lang";
import { useSpotify } from "@/context/spotify";
import { formatSpotifyTime, getSpotifyProgress, getSpotifyUrl } from "@/data/spotify";
import { ExternalIcon, SpotifyIcon } from "./Icons";
import SpotifyEqualizer from "./SpotifyEqualizer";

const PLACEHOLDER = "/spotify-album-placeholder.svg";

export default function SpotifyNowPlayingCard() {
  const { t } = useLang();
  const { data, progressMs, state } = useSpotify();
  const titleId = useId();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  if (state === "error" || state === "empty") return null;
  if (state === "loading") return <div className="spotify-card spotify-card-placeholder" aria-hidden="true" />;
  if (!data) return null;

  const playing = data.status === "playing";
  const status = playing ? t.spotifyPlaying : t.spotifyRecent;
  const displayData = { ...data, progressMs };
  const { duration, progress, percent } = getSpotifyProgress(displayData);
  const showProgress = playing && progress !== null;
  const imageUrl = data.imageUrl?.trim() || PLACEHOLDER;
  const href = getSpotifyUrl(data.spotifyUrl);

  return (
    <article className="spotify-card" data-status={data.status} aria-labelledby={titleId}>
      <div className="spotify-card-header">
        <p className="spotify-status">
          <SpotifyEqualizer playing={playing} />
          <span>{status}</span>
        </p>
        <span className="spotify-brand">{SpotifyIcon}</span>
      </div>

      <div className="spotify-track">
        <div className="spotify-cover">
          <img
            src={failedImage === imageUrl ? PLACEHOLDER : imageUrl}
            alt={data.album}
            width={92}
            height={92}
            onError={() => setFailedImage(imageUrl)}
          />
        </div>
        <div className="spotify-track-info">
          <h3 id={titleId} className="spotify-track-name" title={data.track}>{data.track}</h3>
          <p className="spotify-artist" title={data.artists.join(", ")}>{data.artists.join(", ")}</p>
        </div>
      </div>

      <div className="spotify-timeline" data-active={showProgress}>
        <div
          className="spotify-progress"
          style={{ "--spotify-progress": `${showProgress ? percent : 0}%` } as CSSProperties}
          role={showProgress ? "progressbar" : undefined}
          aria-label={showProgress ? `${status}: ${data.track}` : undefined}
          aria-valuemin={showProgress ? 0 : undefined}
          aria-valuemax={showProgress ? duration! : undefined}
          aria-valuenow={showProgress ? progress! : undefined}
          aria-valuetext={showProgress ? `${formatSpotifyTime(progress)} / ${formatSpotifyTime(duration)}` : undefined}
          aria-hidden={!showProgress || undefined}
        >
          <span className="spotify-progress-fill" />
        </div>
        <div className="spotify-times" aria-hidden="true">
          <span>{formatSpotifyTime(showProgress ? progress : null)}</span>
          <span>{formatSpotifyTime(duration)}</span>
        </div>
      </div>

      <a className="spotify-open" href={href} target="_blank" rel="noopener noreferrer" aria-disabled={!href || undefined}>
        <span>{t.spotifyOpen}</span>
        {ExternalIcon}
      </a>
    </article>
  );
}
