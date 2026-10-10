import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SiteShell } from "@/components/site/SiteShell";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RouteError from "./pages/RouteError";

const router = createBrowserRouter(
  [
    {
      element: <SiteShell />,
      children: [
        { path: "/", element: <Index />, errorElement: <RouteError /> },
        // Loaded before the navigation completes, so hash jumps and scroll restoration find the page's content.
        {
          path: "/projects/:slug",
          lazy: async () => {
            try {
              return { Component: (await import("./pages/Project")).default };
            } catch {
              // The file could not be loaded (a stale tab after a redeploy, or no connection): show the error page in the shell.
              return { Component: RouteError };
            }
          },
          errorElement: <RouteError />,
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true } },
);

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </ThemeProvider>
);

export default App;
