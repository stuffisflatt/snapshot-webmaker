import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Every page change animates, including the browser's Back and Forward.
    defaultViewTransition: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
