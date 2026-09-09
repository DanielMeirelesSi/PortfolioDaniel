import { NextResponse } from "next/server";
import { getSpotifyNowPlaying, SpotifyError } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const track = await getSpotifyNowPlaying();
    if (!track) {
      return new Response(null, {
        status: 204,
        headers: { "Cache-Control": "no-store" },
      });
    }
    return NextResponse.json(track, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    if (error instanceof SpotifyError) {
      const headers = new Headers({ "Cache-Control": "no-store" });
      if (error.retryAfter) headers.set("Retry-After", error.retryAfter);
      return NextResponse.json(
        { error: { code: error.code, message: error.publicMessage } },
        { status: error.httpStatus, headers },
      );
    }
    return NextResponse.json(
      { error: { code: "SPOTIFY_INTERNAL_ERROR", message: "Não foi possível consultar o Spotify." } },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
