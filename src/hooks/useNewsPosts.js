import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useNewsPosts = (page = 1, dateFilter = "all") => {
  const PAGE_SIZE = 9;

  return useQuery({
    queryKey: ["posts", page, dateFilter],
    queryFn: async () => {
      const offset = (page - 1) * PAGE_SIZE;

      const { data, error, count } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      const filteredData =
        data?.filter((post) => {
          const isPublished = post.published && new Date(post.publish_date) <= new Date();
          const user = supabase.auth.getUser();
          return isPublished || user;
        }) || [];

      return {
        posts: filteredData,
        hasMore: count > offset + filteredData.length,
        total: count,
      };
    },
    keepPreviousData: true,
  });
};
