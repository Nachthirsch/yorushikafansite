import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

export function useSupabaseQuery(key, query, options = {}) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { data, count };
    },
    ...options,
  });
}

export function useInfiniteSupabaseQuery(key, getQuery, options = {}) {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error, count } = await getQuery(pageParam);
      if (error) throw new Error(error.message);
      return { data, nextPage: pageParam + 1, count };
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.length === 0 ? undefined : lastPage.nextPage;
    },
    ...options,
  });
}
