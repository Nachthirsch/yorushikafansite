import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { usePodcastEpisodes } from "../../hooks/usePodcasts";
import { Radio, Loader, AlertCircle, RotateCw } from "lucide-react";
import PodcastCard from "./PodcastCard";

/**
 * Komponen untuk menampilkan daftar episode podcast dalam format grid
 * Mendukung infinite scroll, loading states, dan error handling
 *
 * @param {string} showId - ID Spotify untuk podcast
 * @param {number} limit - Jumlah episode per halaman
 * @param {string} searchTerm - Filter episode berdasarkan kata kunci (opsional)
 */
export default function PodcastGrid({ showId, limit = 12, searchTerm = "" }) {
  // Setup infinite query untuk mengambil episode
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePodcastEpisodes(showId, limit);

  // Intersection observer untuk infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "200px",
  });

  // Fetch halaman selanjutnya saat scroll mencapai ref
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter episode berdasarkan kata kunci pencarian
  const episodes = data?.pages.flatMap((page) => page.episodes || []).filter((episode) => (searchTerm ? episode.name.toLowerCase().includes(searchTerm.toLowerCase()) || episode.description.toLowerCase().includes(searchTerm.toLowerCase()) : true)) || [];

  // Loading state (initial load)
  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
        <div className="relative w-20 h-20">
          {/* Loading animation with double spinner */}
          <div className="absolute inset-0 border-4 border-t-neutral-400 dark:border-t-neutral-600 border-neutral-200 dark:border-neutral-800 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-t-neutral-600 dark:border-t-neutral-400 border-neutral-300 dark:border-neutral-700 rounded-full animate-spin-slow"></div>
        </div>
        <p className="mt-6 text-neutral-600 dark:text-neutral-400 animate-pulse">Loading podcast episodes...</p>
      </motion.div>
    );
  }

  // Error state
  if (isError) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {/* AlertCircle icon indicating error state */}
        <AlertCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">An error occurred</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">{error?.message || "Failed to load podcast episodes. Please try again later."}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 
                   text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-2"
        >
          {/* RotateCw icon representing refresh/retry */}
          <RotateCw className="w-4 h-4" aria-hidden="true" />
          Reload
        </button>
      </motion.div>
    );
  }

  // Empty state setelah filter
  if (episodes.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {/* Radio icon representing podcast */}
        <Radio className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">{searchTerm ? "No episodes found" : "No episodes yet"}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">{searchTerm ? `No episodes match your search for "${searchTerm}"` : "There are no podcast episodes available yet. Please check back later."}</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      <AnimatePresence mode="popLayout">
        {/* Grid layout untuk episode podcast dengan featured episode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {episodes.map((episode, index) => (
            <motion.div key={episode.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }} className={index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
              <PodcastCard episode={episode} featured={index === 0} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center items-center py-10">
          {isFetchingNextPage ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <Loader className="w-5 h-5 text-neutral-500 animate-spin" aria-hidden="true" />
              <span className="text-neutral-600 dark:text-neutral-400">Loading more episodes...</span>
            </motion.div>
          ) : (
            <div className="h-8" />
          )}
        </div>
      )}
    </div>
  );
}
