import { motion, AnimatePresence } from "framer-motion";
import { LanguageIcon } from "@heroicons/react/24/outline";

/**
 * Komponen untuk menampilkan konten lirik berdasarkan tab yang dipilih
 * Memiliki tiga tampilan berbeda: side by side, original only, dan translation only
 * @param {Object} props
 * @param {string} props.activeTab - Tab yang aktif ('sideBySide', 'original', atau 'translation')
 * @param {Object} props.song - Data lagu yang berisi lirik dan terjemahannya
 */
const LyricsContent = ({ activeTab, song }) => {
  // Animasi untuk efek transisi halus saat mengganti tabs
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      {/* Tampilan Side by Side - Menampilkan lirik asli dan terjemahan secara berdampingan */}
      {activeTab === "sideBySide" && (
        <motion.div key="sideBySide" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
          {/* Kolom Lirik Asli */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Original</h2>
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 
                       border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics"
            >
              {song.lyrics}
            </div>
          </div>

          {/* Kolom Terjemahan */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Translation</h2>
              </div>
              {song.translator && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                  <LanguageIcon className="w-4 h-4 mr-1" />
                  Translated by: {song.translator}
                </div>
              )}
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200
                       border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics"
            >
              {song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tampilan Original Only - Hanya menampilkan lirik asli */}
      {activeTab === "original" && (
        <motion.div key="original" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }} className="mb-12">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Original</h2>
              </div>
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 
                       border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics
                       max-w-2xl mx-auto"
            >
              {song.lyrics}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tampilan Translation Only - Hanya menampilkan terjemahan */}
      {activeTab === "translation" && (
        <motion.div key="translation" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }} className="mb-12">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Translation</h2>
              </div>
              {song.translator && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                  <LanguageIcon className="w-4 h-4 mr-1" />
                  Translated by: {song.translator}
                </div>
              )}
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 
                       border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics
                       max-w-2xl mx-auto"
            >
              {song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LyricsContent;
