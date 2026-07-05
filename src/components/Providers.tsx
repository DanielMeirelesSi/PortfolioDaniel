"use client";

import { ThemeProvider } from "@/context/theme";
import { LanguageProvider } from "@/context/lang";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
