import { motion, AnimatePresence } from "framer-motion";
import { LanguageIcon } from "@heroicons/react/24/outline";
import YorushikaLogo from "../common/YorushikaLogo";

/**
 * Komponen untuk menampilkan konten lirik berdasarkan tab yang dipilih
 * Tiga tampilan berbeda: side by side, original only, dan translation only.
 * Desain menggunakan tema artsy dengan sentuhan minimalis.
 * @param {Object} props
 * @param {string} props.activeTab - Tab yang aktif ('sideBySide', 'original', atau 'translation')
 * @param {Object} props.song - Data lagu yang berisi lirik dan terjemahannya
 */
const LyricsContent = ({ activeTab, song }) => {
  // Variants animasi untuk efek transisi halus
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      {/* Tampilan Side by Side - Menampilkan lirik asli dan terjemahan secara berdampingan */}
      {activeTab === "sideBySide" && (
        <motion.div key="sideBySide" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }} className="mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Kolom Original */}
            <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                  </div>
                  <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Original</h2>
                </div>
              </div>
              <div className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 font-lyrics relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">{song.lyrics}</div>
              <div className="absolute bottom-3 right-3 opacity-10">
                <YorushikaLogo className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>

            {/* Kolom Translation */}
            <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                  </div>
                  <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Translation</h2>
                </div>
                {song.translator && (
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                    <LanguageIcon className="w-4 h-4 mr-1" />
                    Translated by: {song.translator}
                  </div>
                )}
              </div>
              <div className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 font-lyrics relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">{song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}</div>
              <div className="absolute bottom-3 right-3 opacity-10">
                <YorushikaLogo className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tampilan Original Only - Hanya menampilkan lirik asli */}
      {activeTab === "original" && (
        <motion.div key="original" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }} className="mb-12">
          <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                </div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Original</h2>
              </div>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 font-lyrics max-w-2xl mx-auto relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">{song.lyrics}</div>
            <div className="absolute bottom-3 right-3 opacity-10">
              <YorushikaLogo className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tampilan Translation Only - Hanya menampilkan terjemahan */}
      {activeTab === "translation" && (
        <motion.div key="translationOnly" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }} className="mb-12">
          <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                </div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Translation</h2>
              </div>
              {song.translator && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                  <LanguageIcon className="w-4 h-4 mr-1" />
                  Translated by: {song.translator}
                </div>
              )}
            </div>
            <div className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 font-lyrics max-w-2xl mx-auto relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">{song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}</div>
            <div className="absolute bottom-3 right-3 opacity-10">
              <YorushikaLogo className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LyricsContent;
