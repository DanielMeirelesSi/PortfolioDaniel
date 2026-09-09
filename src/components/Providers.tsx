"use client";

import { ThemeProvider } from "@/context/theme";
import { LanguageProvider } from "@/context/lang";
import { SpotifyProvider } from "@/context/spotify";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SpotifyProvider>{children}</SpotifyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
