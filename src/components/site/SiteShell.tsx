import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration, useLocation, useSearchParams } from "react-router-dom";
import { sections } from "@/data/profile";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useSearchHighlight } from "@/hooks/useSearchHighlight";
import { HighlightNotice } from "./HighlightNotice";
import { MobileBar } from "./MobileBar";
import { QuietBoundary } from "./QuietBoundary";
import { Rail } from "./Rail";

const SearchDialog = lazy(() => import("./SearchDialog"));

const sectionIds = sections.map((section) => section.id);

export function SiteShell() {
  const location = useLocation();
  const onHome = location.pathname === "/";
  const active = useScrollSpy(sectionIds, onHome);
  const previousPath = useRef(location.pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const highlight = params.get("q");
  useSearchHighlight(highlight);

  // "/" opens the search, unless the reader is typing somewhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))) return;
      event.preventDefault();
      setSearchOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const clearHighlight = useCallback(() => {
    const next = new URLSearchParams(params);
    next.delete("q");
    setParams(next, { replace: true, preventScrollReset: true });
  }, [params, setParams]);
  const openSearch = () => setSearchOpen(true);

  // Escape clears the highlight when nothing else (the search or the menu) is open.
  useEffect(() => {
    if (!highlight) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("dialog[open], #mobile-menu")) return;
      clearHighlight();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [highlight, clearHighlight]);

  // After a hash jump, move focus to the target so keyboard and screen-reader users land there.
  useEffect(() => {
    if (!location.hash) return;
    try {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.focus({ preventScroll: true });
    } catch {
      // A hash with a broken percent sequence points at nothing.
    }
  }, [location.key, location.hash]);

  // After moving to another page, focus the main area (not on the first load).
  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    if (!location.hash) document.getElementById("content")?.focus({ preventScroll: true });
  }, [location.pathname, location.hash]);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-input focus:bg-background focus:px-4 focus:py-3"
      >
        Skip to content
      </a>
      <MobileBar active={active} onSearch={openSearch} />
      <div className="mx-auto min-h-screen max-w-[70rem] px-5 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-12 lg:px-8">
        <Rail active={active} onSearch={openSearch} />
        <main id="content" tabIndex={-1} className="min-w-0 pb-32 outline-none">
          {highlight && <HighlightNotice query={highlight} onClear={clearHighlight} />}
          <Outlet />
        </main>
      </div>
      {searchOpen && (
        <QuietBoundary onError={() => setSearchOpen(false)}>
          <Suspense fallback={null}>
            <SearchDialog onClose={() => setSearchOpen(false)} />
          </Suspense>
        </QuietBoundary>
      )}
      <ScrollRestoration />
    </>
  );
}
