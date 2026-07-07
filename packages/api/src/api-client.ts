import { QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface QueryClientOptions {
  logout?: () => void;
  NotFound?: () => void;
  errorPageNavigation?: () => void;
}

const ApiClient = ({ logout, NotFound, errorPageNavigation }: QueryClientOptions) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
        },
        refetchOnWindowFocus: true,
        staleTime: 10 * 1000, // 10s
      },
      mutations: {
        onError: (error) => {
          // handleServerError(error)

          if (error instanceof AxiosError) {
            if (error.response?.status === 304) {
              toast.error("Content not modified!");
            }
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Session expired!");
            logout?.();
          }
          if (error.response?.status === 500) {
            toast.error("Internal Server Error!");
            errorPageNavigation?.();
          }
          if (error.response?.status === 403) {
            NotFound?.();
          }
        }
      },
    }),
  });

export { ApiClient };
