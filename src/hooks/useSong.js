import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useSong(id) {
  return useQuery({
    queryKey: ["song", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(
          `
          *,
          albums (
            title,
            cover_image_url
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
