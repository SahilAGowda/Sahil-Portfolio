import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "@/data/profile";
import { SearchButton } from "./SearchButton";
import { SectionNav } from "./SectionNav";
import { ThemeToggle } from "./ThemeToggle";

/** Below 1024 px: a 56 px bar with the name, Search and a labelled Menu button that opens the flowline. */
export function MobileBar({ active, onSearch }: { active: string | null; onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [location.key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header data-mobile-bar className="sticky top-0 z-40 border-b border-border bg-background lg:hidden">
      <div className="flex h-14 items-center justify-between px-5">
        <Link to={{ pathname: "/", hash: "#about" }} className="inline-flex min-h-11 items-center font-semibold">
          {profile.name}
        </Link>
        <div className="flex items-center gap-2">
          <SearchButton
            onClick={() => {
              setOpen(false);
              onSearch();
            }}
          />
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="min-h-11 rounded-md border border-input px-4 text-[0.9375rem] hover:bg-accent active:translate-y-px"
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-border bg-background px-5 pb-6 pt-2"
        >
          <SectionNav active={active} onNavigate={() => setOpen(false)} />
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
