/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import AlbumDetail from "../components/AlbumDetail";

export default function AlbumPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isGridView, setIsGridView] = useState(true);
  const [yearFilter, setYearFilter] = useState("all");
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      const { data, error } = await supabase
        .from("albums")
        .select(
          `
          *,
          songs (
            id,
            title,
            track_number,
            duration
          )
        `
        )
        .order("release_date", { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  }

  const years = [...new Set(albums.map((album) => new Date(album.release_date).getFullYear()))].sort((a, b) => b - a);

  const filteredAlbums = albums
    .filter((album) => {
      const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = yearFilter === "all" || new Date(album.release_date).getFullYear().toString() === yearFilter;
      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.release_date) - new Date(a.release_date);
      if (sortBy === "oldest") return new Date(a.release_date) - new Date(b.release_date);
      if (sortBy === "tracks") return b.songs.length - a.songs.length;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Minimalist Header Section */}
      <header className="relative pt-32 pb-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-900 dark:to-transparent z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white">
            Discography
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore Yorushika's musical journey through their albums and songs
          </motion.p>
        </div>
      </header>

      {/* Minimalist Controls */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8 items-start md:items-center">
          <div className="relative w-full md:w-96">
            <input type="text" placeholder="Search albums..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-10 border-b border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors" />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors cursor-pointer">
                <option value="newest" className="bg-white dark:bg-gray-800">
                  Newest First
                </option>
                <option value="oldest" className="bg-white dark:bg.gray-800">
                  Oldest First
                </option>
                <option value="tracks" className="bg-white dark:bg-gray-800">
                  Most Tracks
                </option>
                <option value="title" className="bg-white dark:bg-gray-800">
                  Alphabetical
                </option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-gray-400" />
            </div>

            <div className="relative">
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors cursor-pointer">
                <option value="all" className="bg-white dark:bg-gray-800">
                  All Years
                </option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-white dark:bg-gray-800">
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-gray-400" />
            </div>

            <button onClick={() => setIsGridView(!isGridView)} className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors" aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-lg text-gray-500 dark:text-gray-400 italic">No albums found matching your criteria.</p>
          </motion.div>
        ) : (
          <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
            <AnimatePresence mode="popLayout">
              {filteredAlbums.map((album, index) => (
                <motion.div key={album.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} onHoverStart={() => setHoveredAlbum(album.id)} onHoverEnd={() => setHoveredAlbum(null)}>
                  <div className={`group cursor-pointer ${isGridView ? "block" : "flex items-center gap-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg"}`} onClick={() => setSelectedAlbum(album)}>
                    <div className={`relative ${isGridView ? "aspect-square" : "flex-shrink-0 w-24 h-24 md:w-32 md:h-32"} overflow-hidden rounded-md`}>
                      <motion.img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" loading="lazy" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
                      <div className={`absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 ${hoveredAlbum === album.id ? "opacity-100" : ""}`}>
                        <PlayIcon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className={`${isGridView ? "mt-3" : "ml-4 flex-1"}`}>
                      <h2 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{album.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                        <span>{new Date(album.release_date).getFullYear()}</span>
                        <span>•</span>
                        <span>{album.songs?.length || 0} tracks</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Album Detail Modal */}
      <AnimatePresence>{selectedAlbum && <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}</AnimatePresence>
    </div>
  );
}
