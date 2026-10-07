import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SiteShell } from "@/components/site/SiteShell";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter(
  [
    {
      element: <SiteShell />,
      children: [
        { path: "/", element: <Index /> },
        // Loaded before the navigation completes, so hash jumps and scroll restoration find the page's content.
        { path: "/projects/:slug", lazy: async () => ({ Component: (await import("./pages/Project")).default }) },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true } },
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </ThemeProvider>
);

export default App;
