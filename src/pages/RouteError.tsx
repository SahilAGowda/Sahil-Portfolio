import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { usePageMeta } from "@/hooks/usePageMeta";

/** Shown when a page fails to load or throws, for example when a redeploy leaves an old tab holding a stale file. */
const RouteError = () => {
  usePageMeta({
    title: `This page did not load | ${profile.name}`,
    description: "This page did not load. Reload it to try again.",
    path: "/",
    noindex: true,
  });

  return (
    <div className="pt-20 lg:pt-28">
      <h1 className="text-h1-sm font-bold sm:text-h1">This page did not load.</h1>
      <p className="mt-6 max-w-[64ch]">Reload it to try again. If it keeps failing, go back to the portfolio.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" size="lg" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/">Back to the portfolio</Link>
        </Button>
      </div>
    </div>
  );
};

export default RouteError;
