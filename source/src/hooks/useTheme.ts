import { useCallback, useEffect, useState } from "react";

export type Theme = "day" | "night";
const KEY = "yam-theme";

function initialTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "day" || set === "night") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "night" ? "day" : "night";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Storage can be unavailable (private mode, sandboxed frames); the toggle still works for this visit.
      }
      return next;
    });
  }, []);
  return [theme, toggle];
}
