export default function SpotifyEqualizer({ playing }: { playing: boolean }) {
  return (
    <span className="spotify-equalizer" data-playing={playing} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
