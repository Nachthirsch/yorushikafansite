/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import AlbumDetail from "../components/AlbumDetail";
import { useAlbums } from "../hooks/useAlbums";
import { useQueryClient } from "@tanstack/react-query";

export default function AlbumPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isGridView, setIsGridView] = useState(true);
  const [yearFilter, setYearFilter] = useState("all");
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  const queryClient = useQueryClient();

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

  // Pre-fetch album details on hover
  const handleAlbumHover = (albumId) => {
    setHoveredAlbum(albumId);
    queryClient.prefetchQuery({
      queryKey: ["album", albumId],
      queryFn: () => fetchAlbum(albumId),
    });
  };

  // Get unique years from albums array
  const years = Array.isArray(albums) ? [...new Set(albums.map((album) => new Date(album.release_date).getFullYear()))].sort((a, b) => b - a) : [];

  // Filter and sort albums
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

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
          <h2 className="text-xl font-medium text-red-600 dark:text-red-400 mb-4">Error loading albums</h2>
          <p className="text-neutral-600 dark:text-neutral-400">{error?.message || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Floating Musical Notes - For Decoration */}
      <div className="hidden md:block absolute top-40 right-12 opacity-20 dark:opacity-10">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MusicalNoteIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      <div className="hidden md:block absolute bottom-40 left-12 opacity-20 dark:opacity-10">
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MusicalNoteIcon className="h-10 w-10 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      {/* Minimalist Header Section */}
      <header className="relative pt-32 pb-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Decorative Lines */}
        <div className="absolute left-0 right-0 top-44 flex justify-center z-0 opacity-20 dark:opacity-10 overflow-hidden">
          <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-block mb-4 mx-4">
            <div className="h-16 w-16 mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 relative inline-block">
            <span className="relative z-10">Discography</span>
            <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent opacity-40"></span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore Yorushika's musical journey through their albums and songs
          </motion.p>
        </div>
      </header>

      {/* Minimalist Controls */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8 items-start md:items-center relative bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-4 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
          <div className="relative w-full md:w-96">
            <input type="text" placeholder="Search albums..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-10 border-b border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors" />
            <svg className="absolute right-3 top-3 w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
                <option value="newest" className="bg-neutral-50 dark:bg-neutral-800">
                  Newest First
                </option>
                <option value="oldest" className="bg-neutral-50 dark:bg-neutral-800">
                  Oldest First
                </option>
                <option value="tracks" className="bg-neutral-50 dark:bg-neutral-800">
                  Most Tracks
                </option>
                <option value="title" className="bg-neutral-50 dark:bg-neutral-800">
                  Alphabetical
                </option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
            </div>

            <div className="relative">
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
                <option value="all" className="bg-neutral-50 dark:bg-neutral-800">
                  All Years
                </option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-neutral-50 dark:bg-neutral-800">
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
            </div>

            <button onClick={() => setIsGridView(!isGridView)} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}>
              {isGridView ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Albums Grid/List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredAlbums.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">No albums found matching your criteria.</p>
            <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
            <AnimatePresence mode="popLayout">
              {filteredAlbums.map((album, index) => (
                <motion.div key={album.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} onHoverStart={() => handleAlbumHover(album.id)} onHoverEnd={() => setHoveredAlbum(null)} className={`${isGridView ? "" : ""}`}>
                  <div className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${isGridView ? "block bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-1" : "flex items-center gap-6 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5"}`} onClick={() => setSelectedAlbum(album)}>
                    <div className={`relative ${isGridView ? "aspect-square" : "flex-shrink-0 w-24 h-24 md:w-32 md:h-32"} overflow-hidden rounded-md ${isGridView ? "rounded-b-none" : ""}`}>
                      <motion.img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" loading="lazy" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
                      <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 ${hoveredAlbum === album.id ? "opacity-100" : ""}`}>
                        <div className="bg-white/90 dark:bg-black/70 p-3 rounded-full backdrop-blur-sm">
                          <PlayIcon className="w-8 h-8 text-neutral-800 dark:text-white" />
                        </div>
                      </div>

                      {isGridView && <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                    </div>
                    <div className={`${isGridView ? "p-4" : "ml-4 flex-1"}`}>
                      <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{album.title}</h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 space-x-2">
                        <span>{new Date(album.release_date).getFullYear()}</span>
                        <span>•</span>
                        <span>{album.songs?.length || 0} tracks</span>
                      </p>

                      {isGridView && (
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            View Album
                          </span>
                          <div className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Decorative Footer Element */}
        {filteredAlbums.length > 0 && (
          <div className="mt-16 flex justify-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Album Detail Modal */}
      <AnimatePresence>{selectedAlbum && <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}</AnimatePresence>
    </div>
  );
}
