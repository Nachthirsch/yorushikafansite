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
      <header className="relative pt-32 pb-24 mb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Minimalist line patterns - top left */}
        <div className="absolute top-20 left-10 z-0 opacity-20 dark:opacity-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`line-tl-${i}`}
              className="h-px bg-neutral-400 dark:bg-neutral-600 mb-8"
              style={{ width: `${80 + i * 40}px` }}
              animate={{
                width: [`${80 + i * 40}px`, `${120 + i * 20}px`, `${80 + i * 40}px`],
                opacity: [0.2, 0.5, 0.2],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Minimalist line patterns - bottom right */}
        <div className="absolute bottom-10 right-10 z-0 opacity-20 dark:opacity-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`line-br-${i}`}
              className="h-px bg-neutral-400 dark:bg-neutral-600 mb-8 ml-auto"
              style={{ width: `${100 + i * 30}px` }}
              animate={{
                width: [`${100 + i * 30}px`, `${160 + i * 20}px`, `${100 + i * 30}px`],
                opacity: [0.3, 0.6, 0.3],
                x: [0, -15, 0],
              }}
              transition={{
                duration: 7 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Animated geometric elements */}
        <motion.div
          className="absolute left-1/4 top-40 w-40 h-40 border border-neutral-300/20 dark:border-neutral-600/20 rounded-full z-0 opacity-20 dark:opacity-10"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.div
          className="absolute right-1/4 bottom-10 w-24 h-24 border-t border-r border-neutral-300/20 dark:border-neutral-600/20 z-0 opacity-20 dark:opacity-10"
          animate={{
            rotate: [-10, 10, -10],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated diagonal lines */}
        <div className="absolute -left-10 top-1/4 w-40 h-40 z-0 opacity-15 dark:opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-neutral-400 dark:text-neutral-600">
            <motion.line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.line x1="0" y1="70" x2="70" y2="0" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
          </svg>
        </div>

        <div className="absolute right-0 bottom-20 w-40 h-40 z-0 opacity-15 dark:opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-neutral-400 dark:text-neutral-600">
            <motion.line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
            <motion.line x1="30" y1="0" x2="100" y2="70" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
          </svg>
        </div>

        {/* Minimalist wave element */}
        <div className="absolute left-0 right-0 top-44 flex justify-center z-0 opacity-20 dark:opacity-10 overflow-hidden">
          <div className="w-3/4 h-20 flex items-end">
            <svg width="100%" height="40" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <motion.path
                d="M0,50 Q250,20 500,50 Q750,80 1000,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-neutral-400 dark:text-neutral-600"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.8],
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.path
                d="M0,50 Q250,80 500,50 Q750,20 1000,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-neutral-400 dark:text-neutral-600"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>

        {/* Animated dots - subtle frequency visualization */}
        <div className="absolute left-0 right-0 top-60 flex justify-center z-0 opacity-20 dark:opacity-10">
          <div className="flex items-end space-x-2">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600"
                animate={{
                  y: [0, -8 * Math.sin((i / 12) * Math.PI), 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Minimalist icon with animated outline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block mb-6 mx-auto relative">
            <div className="h-16 w-16 bg-white dark:bg-neutral-800 mx-auto shadow-sm flex items-center justify-center relative z-10 overflow-hidden">
              <motion.div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-700 origin-left" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>

            {/* Animated outline */}
            <motion.div className="absolute -inset-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <svg className="w-[calc(100%+8px)] h-[calc(100%+8px)] -ml-1 -mt-1 absolute" viewBox="0 0 72 72">
                <motion.rect x="0" y="0" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-300 dark:text-neutral-600" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} />
              </svg>
            </motion.div>
          </motion.div>

          {/* Title with line drawing animation */}
          <div className="relative inline-block mb-1">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
              Discography
            </motion.h1>
            <div className="absolute -bottom-2 left-0 right-0 overflow-hidden">
              <motion.div className="h-px bg-neutral-400 dark:bg-neutral-600" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }} />
              <motion.div className="h-px bg-neutral-400/50 dark:bg-neutral-600/50 mt-1" initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1, delay: 1, ease: "easeInOut" }} />
            </div>
          </div>

          {/* Description with subtle reveal */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-10 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Explore Yorushika's musical journey through their albums and songs
          </motion.p>

          {/* Minimalist animated separator */}
          <div className="mt-12 flex justify-center items-center space-x-4">
            <motion.div className="h-px w-12 bg-neutral-300 dark:bg-neutral-700" animate={{ width: ["48px", "20px", "48px"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 0.8, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full"
            />
            <motion.div className="h-px w-12 bg-neutral-300 dark:bg-neutral-700" animate={{ width: ["20px", "48px", "20px"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          </div>
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
          <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" : "grid-cols-1 gap-4"}`}>
            <AnimatePresence mode="popLayout">
              {filteredAlbums.map((album, index) => (
                <motion.div key={album.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} onHoverStart={() => handleAlbumHover(album.id)} onHoverEnd={() => setHoveredAlbum(null)}>
                  {/* Desain kartu album minimalis dengan detail halus */}
                  <div className={`group cursor-pointer ${isGridView ? "block bg-white/70 dark:bg-neutral-900/80 rounded-lg overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 hover:shadow-[0_0_25px_-5px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.05)] transition-all duration-500" : "flex items-center gap-5 bg-white/80 dark:bg-neutral-900/80 p-4 rounded-lg border-l-2 border-neutral-200/80 dark:border-neutral-800/80 hover:border-l-neutral-400 dark:hover:border-l-neutral-600 transition-all duration-300"}`} onClick={() => setSelectedAlbum(album)}>
                    {/* Desain cover album dengan efek hover yang elegan */}
                    <div className={`relative ${isGridView ? "aspect-square overflow-hidden" : "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden rounded-md"}`}>
                      {/* Bayangan tipis di bagian atas cover untuk menambah dimensi */}
                      {isGridView && <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent z-10 opacity-60"></div>}

                      <motion.img src={album.cover_image_url} alt={album.title} className={`w-full h-full object-cover ${isGridView ? "" : "rounded-md"}`} loading="lazy" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} />

                      {/* Overlay pada hover dengan animasi gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 ease-out`}>
                        <motion.div className="bg-white/80 dark:bg-black/70 p-2.5 rounded-full backdrop-blur-sm border border-white/20 dark:border-neutral-700/30 shadow-lg" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                          <PlayIcon className="w-7 h-7 text-neutral-800 dark:text-white" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Konten album dengan tipografi yang elegan */}
                    <div className={`${isGridView ? "p-4 pb-5" : "ml-3 flex-1"}`}>
                      <div className="flex flex-col">
                        <h2 className="text-base font-medium tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">{album.title}</h2>

                        <div className="flex items-center mt-1.5 space-x-2">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-light">{new Date(album.release_date).getFullYear()}</span>
                          <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-light flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            {album.songs?.length || 0}
                          </span>
                        </div>
                      </div>

                      {/* Detail tambahan untuk view grid dengan desain minimalis */}
                      {isGridView && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/70 flex justify-between items-center">
                          <span className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500 font-light letter-spacing-wider">View Details</span>
                          <motion.div className="h-6 w-6 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors" whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.02)" }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </div>
                      )}

                      {/* Badge untuk list view */}
                      {!isGridView && (
                        <div className="mt-1 flex items-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-light bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">View</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Elemen dekoratif footer dengan desain minimalis */}
        {filteredAlbums.length > 0 && (
          <div className="mt-20 flex justify-center">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
            <div className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
            <div className="h-[1px] w-20 bg-gradient-to-r from-neutral-300 dark:from-neutral-700 via-neutral-300 dark:via-neutral-700 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Album Detail Modal */}
      <AnimatePresence>{selectedAlbum && <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}</AnimatePresence>
    </div>
  );
}
