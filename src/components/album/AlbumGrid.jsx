import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAlbums } from "../../hooks/useAlbums";
import AlbumCard from "./AlbumCard";
import LoadingSpinner from "../LoadingSpinner";

export default function AlbumGrid({ searchTerm, sortBy, yearFilter, isGridView, onAlbumSelect, onAlbumHover, setAvailableYears }) {
  // Memindahkan logic fetching data dari AlbumPage
  const {
    data: albums = [],
    isLoading,
    isError,
    error,
  } = useAlbums({
    search: searchTerm,
    year: yearFilter,
    sortBy,
  });

  // Filter dan sort albums
  const filteredAlbums = Array.isArray(albums)
    ? albums
        .filter((album) => {
          const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesYear = yearFilter === "all" || new Date(album.release_date).getFullYear().toString() === yearFilter;
          return matchesSearch && matchesYear;
        })
        .sort((a, b) => {
          if (sortBy === "newest") return new Date(b.release_date) - new Date(a.release_date);
          if (sortBy === "oldest") return new Date(a.release_date) - new Date(b.release_date);
          if (sortBy === "tracks") return (b.songs?.length || 0) - (a.songs?.length || 0);
          if (sortBy === "title") return a.title.localeCompare(b.title);
          return 0;
        })
    : [];

  // Ekstrak tahun yang tersedia untuk filter
  const years = Array.isArray(albums) ? [...new Set(albums.map((album) => new Date(album.release_date).getFullYear()))].sort((a, b) => b - a) : [];

  // Update tahun yang tersedia untuk filter di AlbumControls
  useEffect(() => {
    if (years.length > 0) {
      setAvailableYears(years);
    }
  }, [years, setAvailableYears]);

  // Tampilan loading
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  // Tampilan error
  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-red-100 dark:border-red-900/30">
          <h2 className="text-xl font-medium text-red-600 dark:text-red-400 mb-4">Error loading albums</h2>
          <p className="text-neutral-600 dark:text-neutral-400">{error?.message || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }

  // Tampilan tidak ada album yang ditemukan
  if (filteredAlbums.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">No albums found matching your criteria.</p>
        <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Try adjusting your search or filters</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" : "grid-cols-1 gap-4"}`}>
        <AnimatePresence mode="popLayout">
          {filteredAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} isGridView={isGridView} onClick={() => onAlbumSelect(album)} onHover={onAlbumHover} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer decoration */}
      {filteredAlbums.length > 0 && (
        <div className="mt-20 flex justify-center">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
          <div className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
          <div className="h-[1px] w-20 bg-gradient-to-r from-neutral-300 dark:from-neutral-700 via-neutral-300 dark:via-neutral-700 to-transparent"></div>
        </div>
      )}
    </div>
  );
}
