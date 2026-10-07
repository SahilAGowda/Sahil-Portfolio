import { Link } from "react-router-dom";
import { profile } from "@/data/profile";
import { SectionNav } from "./SectionNav";
import { ThemeToggle } from "./ThemeToggle";

/** Desktop rail: the name, the flowline nav and the theme toggle, fixed to the viewport height. */
export function Rail({ active }: { active: string | null }) {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col py-10 lg:flex">
      <Link to={{ pathname: "/", hash: "#about" }} className="inline-flex min-h-11 items-center text-lg font-semibold leading-tight">
        {profile.name}
      </Link>
      <div className="mt-10">
        <SectionNav active={active} />
      </div>
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </aside>
  );
}
