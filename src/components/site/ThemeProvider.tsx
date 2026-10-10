import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { themeColors } from "@/data/profile";
import { ThemeContext, type Theme } from "@/hooks/useTheme";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStored(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

/**
 * Light and dark themes. The class on <html> is set before first paint by the script in index.html;
 * this provider keeps it in step with the visitor's choice and the system setting. It only touches
 * the DOM when the class has to change, so loading the page causes no extra style recalculation.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStored);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(DARK_QUERY).matches);

  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("dark") !== (resolvedTheme === "dark")) root.classList.toggle("dark", resolvedTheme === "dark");
    // The two theme-color tags in index.html follow the system setting; an explicit choice has to override both.
    document.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.setAttribute("content", themeColors[resolvedTheme]));
  }, [resolvedTheme]);

  // Follow the system setting while the visitor has not chosen, and follow choices made in other tabs.
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onSystem = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setThemeState(readStored());
    };
    query.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    return () => {
      query.removeEventListener("change", onSystem);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the choice still applies for this visit.
    }
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
