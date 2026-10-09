import { Link } from "react-router-dom";
import { profile } from "@/data/profile";
import { SectionNav } from "./SectionNav";
import { ThemeToggle } from "./ThemeToggle";

/** Desktop rail: the name, the flowline nav and the theme toggle, fixed to the viewport height. Search sits at the top right of the page. */
export function Rail({ active }: { active: string | null }) {
  return (
    <header data-rail className="sticky top-0 -mx-2 hidden h-screen flex-col overflow-y-auto px-2 py-10 lg:flex">
      <Link to={{ pathname: "/", hash: "#about" }} className="inline-flex min-h-11 items-center text-lg font-semibold leading-tight">
        {profile.name}
      </Link>
      <div className="mt-10">
        <SectionNav active={active} />
      </div>
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
