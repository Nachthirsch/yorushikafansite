import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import React from "react";

export function usePost(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", postId).single();

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useRelatedPosts(category, postId, currentPage, pageSize = 3) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["relatedPosts", category, postId, currentPage],
    queryFn: async () => {
      if (!category) return { data: [], count: 0 };

      const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("category", category).neq("id", postId);

      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, cover_image, publish_date")
        .eq("category", category)
        .neq("id", postId)
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      return {
        data: data || [],
        count: count || 0,
      };
    },
    enabled: !!category,
    keepPreviousData: true,
  });

  // Prefetch next page of related posts
  const totalPages = result.data ? Math.ceil(result.data.count / pageSize) : 0;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // Prefetch next page if it exists and we're not already fetching it
  React.useEffect(() => {
    if (nextPage && category) {
      queryClient.prefetchQuery({
        queryKey: ["relatedPosts", category, postId, nextPage],
        queryFn: async () => {
          const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("category", category).neq("id", postId);

          const { data } = await supabase
            .from("blog_posts")
            .select("id, title, cover_image, publish_date")
            .eq("category", category)
            .neq("id", postId)
            .range((nextPage - 1) * pageSize, nextPage * pageSize - 1);

          return {
            data: data || [],
            count: count || 0,
          };
        },
        staleTime: 30000, // 30 seconds
      });
    }
  }, [queryClient, category, postId, currentPage, nextPage, pageSize]);

  return result;
}

export function prefetchPost(queryClient, postId) {
  if (!postId) return Promise.resolve();

  return queryClient.prefetchQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", postId).single();

      if (error) throw error;
      return data;
    },
    staleTime: 60000, // 1 minute
  });
}
