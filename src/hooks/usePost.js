import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

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
  return useQuery({
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
    keepPreviousData: false, // Ubah ini dari true ke false
    cacheTime: 0, // Tambahkan ini untuk menghindari caching
    refetchOnWindowFocus: false, // Tambahkan ini untuk menghindari refetch otomatis
  });
}
