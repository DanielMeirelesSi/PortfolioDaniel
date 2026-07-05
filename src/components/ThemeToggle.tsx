"use client";

import { useTheme } from "@/context/theme";

const Sun = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
  </svg>
);

const Moon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" />
  </svg>
);

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const color = isDark ? "#F6C544" : "#2440ff";

  return (
    <button
      className="ic ic-theme"
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      onClick={toggle}
      style={{ color }}
    >
      {isDark ? Sun : Moon}
    </button>
  );
}
