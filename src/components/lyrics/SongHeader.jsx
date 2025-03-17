import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, MusicalNoteIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

/**
 * Komponen untuk menampilkan header lagu dengan cover dan informasi dasar
 */
const SongHeader = ({ song, favorite, toggleFavorite, shareSong }) => {
  return (
    <header className="relative pt-28 pb-24 mb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 z-0" />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pattern-dots pattern-neutral-900 dark:pattern-neutral-100 pattern-size-2 pattern-bg-transparent z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-center mb-8">
          <Link
            to="/albums"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 
            dark:text-neutral-400 dark:hover:text-neutral-200 text-base font-medium py-2 
            px-3 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
            shadow-sm border border-neutral-200 dark:border-neutral-700
            transition-all duration-200 hover:shadow"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Songs
          </Link>

          <div className="flex space-x-2">
            <button
              onClick={toggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                      shadow-sm border border-neutral-200 dark:border-neutral-700
                      text-neutral-600 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400
                      transition-all duration-200 hover:shadow"
            >
              {favorite ? <HeartIconSolid className="w-5 h-5 text-rose-500 dark:text-rose-400" /> : <HeartIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={shareSong}
              aria-label="Share this song"
              className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                      shadow-sm border border-neutral-200 dark:border-neutral-700
                      text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200
                      transition-all duration-200 hover:shadow"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Cover image container */}
          {song.thumbnail_cover_url || song.albums?.cover_image_url ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.02 }} className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 rounded-xl shadow-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent z-10" />
              <img src={song.thumbnail_cover_url || song.albums.cover_image_url} alt={song.thumbnail_cover_url ? `${song.title} cover` : `${song.albums.title} album cover`} className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 rounded-xl flex items-center justify-center shadow-lg">
              <MusicalNoteIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
            </motion.div>
          )}

          {/* Song title and info */}
          <div className="text-center sm:text-left flex-1">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
              {song.title}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 space-y-1">
              <p className="text-xl text-neutral-600 dark:text-neutral-300">{song.albums?.title}</p>
            </motion.div>

            {/* Song tags/categories */}
            {song.tags && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-2 mt-4">
                {song.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 
                            text-neutral-700 dark:text-neutral-300 backdrop-blur-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default SongHeader;
