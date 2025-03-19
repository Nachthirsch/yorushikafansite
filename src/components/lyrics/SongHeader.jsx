import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share, Music, Disc, Clock, Sparkles } from "lucide-react";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

/**
 * Header lagu dengan desain minimalis dan elemen dekoratif
 * Mengadaptasi desain yang konsisten dengan komponen LyricsContent
 * Menampilkan judul, album, dan tombol-tombol interaksi dengan estetika unified
 */
export default function SongHeader({ song, favorite, toggleFavorite, shareSong, onBackClick, fromPage = "songs" }) {
  // Memformat durasi lagu ke format menit:detik
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative bg-neutral-50 dark:bg-neutral-950 pt-24 pb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigasi kembali dengan spacing yang konsisten */}
        <div className="mb-4">
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }} onClick={onBackClick} className="group inline-flex items-center py-1.5 px-3 -ml-3 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all" aria-label={`Back to ${fromPage === "album" ? "Albums" : "Songs"}`}>
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{fromPage === "album" ? "Back to Albums" : "Back to Songs"}</span>
          </motion.button>
        </div>

        {/* Konten utama dengan spacing yang diselaraskan */}
        <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 sm:p-6 lg:p-8 relative mb-6 before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
          {/* Header info dengan layout responsif dan spacing yang tepat */}
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 relative">
            {/* Cover album dengan ukuran yang konsisten */}
            <div className="relative">
              {song.albums?.cover_image_url ? (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-none overflow-hidden relative group shadow-md border border-neutral-200 dark:border-neutral-700">
                  <img src={song.albums.cover_image_url} alt={`${song.albums.title} cover`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-md border border-neutral-200 dark:border-neutral-700">
                  <Music className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
                </div>
              )}

              {/* Elemen dekoratif sudut */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r border-b border-neutral-300 dark:border-neutral-700 opacity-60"></div>
              <div className="absolute -top-1 -left-1 w-4 h-4 border-l border-t border-neutral-300 dark:border-neutral-700 opacity-60"></div>
            </div>

            {/* Informasi lagu dengan spacing yang dioptimalkan */}
            <div className="flex-1">
              {/* Judul lagu dengan elemen dekoratif yang konsisten */}
              <div className="flex items-center mb-3">
                <div className="relative mr-2">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 px-4">{song.title}</h1>
              </div>

              {/* Detail lagu dengan spacing yang selaras */}
              <div className="pl-6 border-l border-dashed border-neutral-300 dark:border-neutral-600 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">
                <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
                  {/* Album info */}
                  {song.albums && (
                    <div className="flex items-center gap-2">
                      <Disc className="w-4 h-4 text-neutral-500 dark:text-neutral-500" />
                      <span className="text-sm">{song.albums.title}</span>
                    </div>
                  )}

                  {/* Durasi */}
                  {song.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-500" />
                      <span className="text-sm">{formatDuration(song.duration)}</span>
                    </div>
                  )}

                  {/* Tag atau klasifikasi jika ada */}
                  {song.classification && (
                    <div className="mt-2.5">
                      <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">{song.classification}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons dengan posisi yang disesuaikan */}
            <div className="absolute top-1 right-1 flex gap-1.5">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleFavorite} className={`p-2 rounded-full ${favorite ? "text-red-500 hover:text-red-600" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`} aria-label={favorite ? "Remove from favorites" : "Add to favorites"}>
                {favorite ? <HeartSolidIcon className="h-4.5 w-4.5" /> : <Heart className="h-4.5 w-4.5" />}
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareSong} className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-label="Share song">
                <Share className="h-4.5 w-4.5" />
              </motion.button>
            </div>
          </div>

          {/* Elemen dekoratif */}
          <div className="absolute bottom-2 right-2 opacity-10">
            <Sparkles className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
