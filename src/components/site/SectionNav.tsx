import { Link } from "react-router-dom";
import { sections } from "@/data/profile";
import { cn } from "@/lib/utils";

interface SectionNavProps {
  /** Id of the section the reader is in, or null on pages without sections. */
  active: string | null;
  onNavigate?: () => void;
}

/** The flowline: one node per section, joined by a line that fills down to the current one. */
export function SectionNav({ active, onNavigate }: SectionNavProps) {
  const activeIndex = sections.findIndex((section) => section.id === active);

  return (
    <nav aria-label="Sections">
      <ol>
        {sections.map((section, i) => {
          const isActive = i === activeIndex;
          const passed = activeIndex >= 0 && i < activeIndex;
          return (
            <li key={section.id} className="relative">
              {i < sections.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn("absolute left-[5px] top-1/2 h-full w-0.5", passed ? "bg-primary" : "bg-border")}
                />
              )}
              <Link
                to={{ pathname: "/", hash: `#${section.id}` }}
                onClick={onNavigate}
                aria-current={isActive ? "location" : undefined}
                className="relative flex min-h-11 items-center gap-4 text-[0.9375rem]"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 h-3 w-3 shrink-0 rounded-full border-2",
                    isActive ? "border-primary bg-primary" : passed ? "border-primary bg-background" : "border-input bg-background",
                  )}
                />
                <span
                  className={cn(
                    isActive ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground hover:underline underline-offset-4",
                  )}
                >
                  {section.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
