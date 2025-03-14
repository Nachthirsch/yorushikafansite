import { motion, AnimatePresence } from "framer-motion";
import { Music, Loader } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import SongCard from "./SongCard";

const PAGE_SIZE = 12;

export default function SongsGrid({ searchTerm, sortBy, albumFilter, isGridView }) {
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["songs", albumFilter, searchTerm, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase.from("songs").select(`*, albums (*)`, { count: "exact" });

      // Apply filters
      if (albumFilter !== "all") {
        query = query.eq("album_id", albumFilter);
      }
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case "title":
          query = query.order("title");
          break;
        case "duration":
          query = query.order("duration", { ascending: false });
          break;
        case "album":
          query = query.order("album_id");
          break;
      }

      // Apply pagination
      const { data, count, error } = await query.range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (error) throw error;

      return {
        songs: data,
        nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
        totalCount: count,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const allSongs = data?.pages.flatMap((page) => page.songs) || [];

  const handleSongSelect = (songId) => {
    navigate(`/lyrics/${songId}`);
  };

  // Tampilkan loading state saat pertama kali memuat atau saat mencari
  if (isLoading && !allSongs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader className="w-8 h-8 animate-spin text-neutral-400 mb-4" />
        <p className="text-neutral-500 dark:text-neutral-400">Loading songs...</p>
      </div>
    );
  }

  if (!allSongs.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <Music className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" />
        <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">No songs found matching your criteria.</p>
        <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Try adjusting your search or filters</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid-cols-1 gap-4"}`}>
        <AnimatePresence mode="popLayout">
          {allSongs.map((song) => (
            <SongCard key={song.id} song={song} isGridView={isGridView} onClick={() => handleSongSelect(song.id)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="group relative px-6 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <span className={`flex items-center gap-2 text-neutral-600 dark:text-neutral-400 ${isFetchingNextPage ? "opacity-0" : "opacity-100"}`}>
              Load More
              <Music className="w-4 h-4" />
            </span>
            {isFetchingNextPage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin text-neutral-600 dark:text-neutral-400" />
              </div>
            )}
            {/* Decorative elements */}
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}
    </div>
  );
}
