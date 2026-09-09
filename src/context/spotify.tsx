"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { parseSpotifyTrack, type SpotifyTrack } from "@/data/spotify";

const REFRESH_INTERVAL_MS = 20_000;
type SpotifyState = "loading" | "success" | "empty" | "error";

interface SpotifyContextValue {
  data: SpotifyTrack | null;
  progressMs: number | null;
  state: SpotifyState;
}

const SpotifyContext = createContext<SpotifyContextValue>({ data: null, progressMs: null, state: "loading" });

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SpotifyTrack | null>(null);
  const [progressMs, setProgressMs] = useState<number | null>(null);
  const [state, setState] = useState<SpotifyState>("loading");
  const progressRef = useRef<number | null>(null);

  const fetchSpotify = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch("/api/spotify", { cache: "no-store", headers: { Accept: "application/json" }, signal });
      if (response.status === 204) {
        setData(null); setProgressMs(null); setState("empty"); return;
      }
      if (!response.ok) throw new Error("Spotify request failed");
      const next = parseSpotifyTrack(await response.json());
      if (!next) throw new Error("Spotify response was invalid");
      setData(next);
      setProgressMs(next.status === "playing" ? next.progressMs : null);
      setState("success");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setData(null); setProgressMs(null); setState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchSpotify(controller.signal);
    const interval = window.setInterval(() => void fetchSpotify(controller.signal), REFRESH_INTERVAL_MS);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [fetchSpotify]);

  useEffect(() => {
    progressRef.current = progressMs;
  }, [progressMs]);

  useEffect(() => {
    if (!data || data.status !== "playing" || progressRef.current === null) return;
    const interval = window.setInterval(() => {
      setProgressMs(current => current === null ? null : Math.min(current + 1000, data.durationMs));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [data]);

  return <SpotifyContext.Provider value={{ data, progressMs, state }}>{children}</SpotifyContext.Provider>;
}

export const useSpotify = () => useContext(SpotifyContext);
