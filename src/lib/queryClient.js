import { QueryClient } from "@tanstack/react-query";
import { handleError } from "./queries";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: (failureCount, error) => {
        if (error.message.includes("Invalid query parameters")) return false;
        return failureCount < 3;
      },
      onError: (error) => {
        const message = handleError(error);
        console.error(message);
      },
    },
  },
});
