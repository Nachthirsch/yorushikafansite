import { useQuery } from "@tanstack/react-query";
import { fetchAlbums } from "../lib/queries";
import { supabase } from "../lib/supabase";

export function useAlbums(filters = {}) {
  return useQuery({
    queryKey: ["albums", filters],
    queryFn: async () => {
      const response = await fetchAlbums({ filters });
      if (response.error) {
        throw response.error;
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // Data dianggap stale setelah 5 menit
    cacheTime: 1000 * 60 * 30, // Data dihapus dari cache setelah 30 menit
  });
}

export function useAlbum(id) {
  return useQuery({
    queryKey: ["album", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albums")
        .select(
          `
          *,
          songs (
            id,
            title,
            track_number,
            duration,
            lyrics,
            lyrics_translation
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
