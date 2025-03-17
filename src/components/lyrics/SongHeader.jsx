import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Music, Heart, Share } from "lucide-react"; // Menggunakan Lucide React icons

/**
 * Komponen untuk menampilkan header lagu dengan cover dan informasi dasar
 * Didesain dengan pendekatan minimalis artistik dan elemen dekoratif
 */
const SongHeader = ({ song, favorite, toggleFavorite, shareSong }) => {
  return (
    <header className="relative pt-28 pb-24 mb-16 overflow-hidden">
      {/* Background gradient dengan desain minimalis */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 z-0" />

      {/* Subtle Background Pattern dengan opacity rendah */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pattern-dots pattern-neutral-900 dark:pattern-neutral-100 pattern-size-2 pattern-bg-transparent z-0"></div>

      {/* Elemen dekoratif horizontal di bagian atas */}
      <div className="absolute top-14 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent z-10 opacity-50"></div>

      {/* Elemen dekoratif horizontal di bagian bawah */}
      <div className="absolute bottom-14 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent z-10 opacity-50"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-center mb-8">
          <Link
            to="/albums"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 
                     dark:text-neutral-400 dark:hover:text-neutral-200 text-base font-medium py-2 
                     px-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                     shadow-sm border border-neutral-200 dark:border-neutral-700 relative
                     transition-all duration-200 hover:shadow"
          >
            {/* Elemen dekoratif di pojok kiri atas tombol kembali */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-neutral-300 dark:border-neutral-600"></div>
            {/* Icon ArrowLeft dari Lucide React untuk navigasi kembali */}
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Songs
          </Link>

          <div className="flex space-x-2">
            <button
              onClick={toggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              className="p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                       shadow-sm border border-neutral-200 dark:border-neutral-700
                       text-neutral-600 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400
                       transition-all duration-200 hover:shadow relative"
            >
              {/* Elemen dekoratif di pojok kanan bawah tombol favorit */}
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neutral-300 dark:border-neutral-600"></div>

              {/* Icon Heart dari Lucide React untuk menampilkan status favorit */}
              {favorite ? <Heart className="w-5 h-5 text-rose-500 dark:text-rose-400 fill-rose-500 dark:fill-rose-400" /> : <Heart className="w-5 h-5" />}
            </button>
            <button
              onClick={shareSong}
              aria-label="Share this song"
              className="p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                       shadow-sm border border-neutral-200 dark:border-neutral-700
                       text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200
                       transition-all duration-200 hover:shadow relative"
            >
              {/* Elemen dekoratif di pojok kanan bawah tombol share */}
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neutral-300 dark:border-neutral-600"></div>

              {/* Icon Share dari Lucide React untuk membagikan lagu */}
              <Share className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Cover image container dengan desain kotak */}
          {song.thumbnail_cover_url || song.albums?.cover_image_url ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.02 }} className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 shadow-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
              {/* Elemen dekoratif pojok kiri atas */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/50 dark:border-neutral-600/50 z-20"></div>

              {/* Elemen dekoratif pojok kanan bawah */}
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/50 dark:border-neutral-600/50 z-20"></div>

              {/* Gradasi di atas gambar untuk efek artistik */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent z-10" />
              <img src={song.thumbnail_cover_url || song.albums.cover_image_url} alt={song.thumbnail_cover_url ? `${song.title} cover` : `${song.albums.title} album cover`} className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center shadow-lg relative">
              {/* Elemen dekoratif pojok kiri atas */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-400/30 dark:border-neutral-600/30"></div>

              {/* Elemen dekoratif pojok kanan bawah */}
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-400/30 dark:border-neutral-600/30"></div>

              {/* Icon Music dari Lucide React untuk menampilkan placeholder cover */}
              <Music className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
            </motion.div>
          )}

          {/* Song title and info */}
          <div className="text-center sm:text-left flex-1">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
              {song.title}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 space-y-1">
              {song.albums?.title && (
                <div className="flex items-center ">
                  <div className="w-[2px] h-4 bg-gradient-to-b from-neutral-400 to-neutral-600 mr-2 hidden sm:block"></div>
                  <p className="text-xl text-neutral-600  dark:text-neutral-300">{song.albums.title}</p>
                </div>
              )}
            </motion.div>

            {/* Song tags/categories dengan styling yang lebih artistik */}
            {song.tags && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-2 mt-4">
                {song.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-neutral-200/80 dark:bg-neutral-800/80 
                             text-neutral-700 dark:text-neutral-300 backdrop-blur-sm
                             border-l border-neutral-300 dark:border-neutral-700"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Garis dekoratif di bawah informasi lagu */}
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.5 }} className="h-[1px] bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-700 dark:to-transparent mt-6 sm:mt-8 opacity-70"></motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default SongHeader;
