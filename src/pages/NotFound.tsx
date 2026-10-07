import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";

const NotFound = () => {
  const { pathname } = useLocation();
  usePageMeta({
    title: "Page not found | Sahil A Gowda",
    description: "This page does not exist. Go back to the portfolio.",
    path: pathname,
  });

  return (
    <div className="pt-20 lg:pt-28">
      <p className="text-muted-foreground">404</p>
      <h1 className="mt-3 text-h1-sm font-bold sm:text-h1">This page does not exist.</h1>
      <p className="mt-6 max-w-[64ch]">Check the address, or go back to the portfolio.</p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link to="/">Back to the portfolio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
