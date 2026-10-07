import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { sections } from "@/data/profile";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { MobileBar } from "./MobileBar";
import { Rail } from "./Rail";

const sectionIds = sections.map((section) => section.id);

export function SiteShell() {
  const location = useLocation();
  const onHome = location.pathname === "/";
  const active = useScrollSpy(sectionIds, onHome);
  const previousPath = useRef(location.pathname);

  // After a hash jump, move focus to the target so keyboard and screen-reader users land there.
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.focus({ preventScroll: true });
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
      <MobileBar active={active} />
      <div className="mx-auto min-h-screen max-w-[70rem] px-5 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-12 lg:px-8">
        <Rail active={active} />
        <main id="content" tabIndex={-1} className="min-w-0 pb-32 outline-none">
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </>
  );
}
