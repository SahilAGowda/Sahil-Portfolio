import { useEffect, useState } from "react";

/** Follows a CSS media query. The value is read once on first render, then kept in step with changes. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window === "undefined" ? false : window.matchMedia(query).matches));

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the visitor has asked their system for less motion. */
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
