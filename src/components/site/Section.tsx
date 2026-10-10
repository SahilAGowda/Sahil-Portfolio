import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/** A home-page section: anchor target, labelled region, and a heading with a flowline dot on phones. */
export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={cn("mt-20 scroll-mt-20 outline-none lg:mt-28", className)}
    >
      <h2
        id={`${id}-title`}
        className="relative text-h2-sm font-semibold md:text-h2 before:absolute before:-left-6 before:top-[0.55em] before:h-3 before:w-3 before:rounded-full before:border-2 before:border-primary before:bg-background lg:before:hidden"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
