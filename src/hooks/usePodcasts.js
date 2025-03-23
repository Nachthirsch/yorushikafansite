import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { getShow, getShowEpisodes, getEpisode, YORUSHIKA_PODCAST_ID } from "../lib/spotify";

/**
 * Hook untuk mendapatkan informasi show podcast
 * @param {string} showId - ID podcast (default: YORUSHIKA_PODCAST_ID)
 * @returns {Object} Query result dengan data podcast
 */
export function usePodcastShow(showId = YORUSHIKA_PODCAST_ID) {
  return useQuery({
    queryKey: ["podcast", "show", showId],
    queryFn: () => getShow(showId),
    staleTime: 1000 * 60 * 60, // Data dianggap fresh selama 1 jam
    cacheTime: 1000 * 60 * 60 * 24, // Cache bertahan selama 24 jam
  });
}

/**
 * Hook untuk mendapatkan daftar episode podcast dengan pagination
 * @param {string} showId - ID podcast (default: YORUSHIKA_PODCAST_ID)
 * @param {number} limit - Jumlah episode per halaman
 * @returns {Object} Infinite query result dengan data episode
 */
export function usePodcastEpisodes(showId = YORUSHIKA_PODCAST_ID, limit = 10) {
  return useInfiniteQuery({
    queryKey: ["podcast", "episodes", showId, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getShowEpisodes(showId, limit, pageParam * limit);
      return {
        episodes: response.items,
        nextOffset: response.next ? pageParam + 1 : undefined,
        total: response.total,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 1000 * 60 * 30, // Data dianggap fresh selama 30 menit
  });
}

/**
 * Hook untuk mendapatkan detail episode podcast
 * @param {string} episodeId - ID episode
 * @returns {Object} Query result dengan data detail episode
 */
export function usePodcastEpisode(episodeId) {
  return useQuery({
    queryKey: ["podcast", "episode", episodeId],
    queryFn: () => getEpisode(episodeId),
    enabled: !!episodeId, // Query hanya dijalankan jika episodeId tersedia
    staleTime: 1000 * 60 * 60, // Data dianggap fresh selama 1 jam
  });
}

/**
 * Hook untuk mendapatkan transkrip episode podcast dari database
 * @param {string} episodeId - ID episode
 * @returns {Object} Query result dengan data transkrip
 */
export function useEpisodeTranscript(episodeId) {
  return useQuery({
    queryKey: ["podcast", "transcript", episodeId],
    queryFn: async () => {
      // Mengambil transkrip dari Supabase
      const { data, error } = await supabase.from("podcast_transcripts").select("*").eq("episode_id", episodeId).single();

      if (error) {
        // Jika tidak ditemukan, kembalikan objek kosong
        if (error.code === "PGRST116") {
          return { content: "", episode_id: episodeId };
        }
        throw error;
      }

      return data;
    },
    enabled: !!episodeId,
  });
}

/**
 * Hook untuk mendapatkan episode terbaru
 * @param {string} showId - ID podcast (default: YORUSHIKA_PODCAST_ID)
 * @returns {Object} Query result dengan data episode terbaru
 */
export function useLatestEpisode(showId = YORUSHIKA_PODCAST_ID) {
  return useQuery({
    queryKey: ["podcast", "latest", showId],
    queryFn: async () => {
      const response = await getShowEpisodes(showId, 1, 0);
      return response.items[0];
    },
    staleTime: 1000 * 60 * 15, // Data dianggap fresh selama 15 menit
  });
}

/**
 * Hook untuk mendapatkan episode terkait dari episode saat ini
 * @param {string} currentEpisodeId - ID episode saat ini
 * @param {string} showId - ID podcast (default: YORUSHIKA_PODCAST_ID)
 * @param {number} limit - Jumlah episode terkait yang akan ditampilkan
 * @returns {Object} Query result dengan data episode terkait
 */
export function useRelatedEpisodes(currentEpisodeId, showId = YORUSHIKA_PODCAST_ID, limit = 3) {
  return useQuery({
    queryKey: ["podcast", "related", currentEpisodeId, showId],
    queryFn: async () => {
      // Mendapatkan semua episode (maksimal 20)
      const response = await getShowEpisodes(showId, 20, 0);

      // Filter episode untuk menghilangkan episode saat ini
      const filteredEpisodes = response.items.filter((episode) => episode.id !== currentEpisodeId);

      // Ambil jumlah episode sesuai limit
      return filteredEpisodes.slice(0, limit);
    },
    enabled: !!currentEpisodeId,
    staleTime: 1000 * 60 * 30, // Data dianggap fresh selama 30 menit
  });
}
