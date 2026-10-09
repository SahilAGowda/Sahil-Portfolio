import { Link } from "react-router-dom";
import { profile } from "@/data/profile";
import { SectionNav } from "./SectionNav";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Desktop rail: the name, the flowline nav and the theme toggle, fixed to the viewport height. Search sits at the top right
 * of the page, in a 4rem strip (see TopSearch); the name has a 4rem line of its own, so the two share one centre line.
 */
export function Rail({ active }: { active: string | null }) {
  return (
    <header data-rail className="sticky top-0 -mx-2 hidden h-screen flex-col overflow-y-auto px-2 pb-10 lg:flex">
      <div className="flex h-16 shrink-0 items-center">
        <Link to={{ pathname: "/", hash: "#about" }} className="inline-flex min-h-11 items-center text-lg font-semibold leading-tight">
          {profile.name}
        </Link>
      </div>
      <div className="mt-[3.75rem]">
        <SectionNav active={active} />
      </div>
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
