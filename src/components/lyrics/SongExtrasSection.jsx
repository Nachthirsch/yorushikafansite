import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Info, Heart, Share, X } from "lucide-react"; // Menggunakan Lucide React icons
import FocusTrap from "focus-trap-react";

/**
 * Komponen untuk menampilkan bagian extras dan modal yang terkait
 * Didesain dengan pendekatan minimalis dan artistik dengan elemen-elemen dekoratif
 */
const SongExtrasSection = ({ song, favorite, toggleFavorite, shareSong }) => {
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const extrasButtonRef = useRef(null);
  const extrasModalRef = useRef(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative mb-8">
      {/* Tombol pemicu dengan desain kotak dan elemen dekoratif */}
      <div
        ref={extrasButtonRef}
        className="group bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 
                 dark:border-neutral-700 p-6 cursor-pointer hover:shadow-md transform 
                 hover:-translate-y-0.5 transition-all duration-300 relative
                 hover:border-neutral-300 dark:hover:border-neutral-600"
        onClick={() => setShowExtrasModal(!showExtrasModal)}
      >
        {/* Elemen dekoratif di pojok kiri atas */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-400 dark:border-neutral-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

        {/* Elemen dekoratif di pojok kanan bawah */}
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="w-[3px] h-8 bg-gradient-to-b from-neutral-400 to-neutral-600
                        group-hover:from-neutral-500 group-hover:to-neutral-700
                        transition-all duration-300"
            ></div>
            <h2
              className="text-xl font-medium text-neutral-900 dark:text-neutral-100 
                       flex items-center group-hover:text-neutral-700 
                       dark:group-hover:text-neutral-200 transition-colors duration-300"
            >
              {/* Icon Plus dari Lucide React untuk menandakan konten tambahan */}
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Additional Content
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">Extra</span>
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className="text-sm text-neutral-500 dark:text-neutral-400 
                        group-hover:text-neutral-600 dark:group-hover:text-neutral-300
                        transition-colors duration-200"
            >
              Click to explore
            </span>
            <motion.div className="bg-neutral-200 dark:bg-neutral-700 p-1" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 dark:text-neutral-300" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </motion.svg>
            </motion.div>
          </div>
        </div>

        {/* Interactive preview hint dengan border dashed untuk efek dekoratif */}
        <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            {/* Icon Info dari Lucide React untuk menandakan informasi tambahan */}
            <Info className="w-4 h-4 mr-2" />
            <p className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              {song.extras.substring(0, 100).trim()}
              {song.extras.length > 100 ? "..." : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Extras dengan desain yang lebih artistik dan kotak */}
      <AnimatePresence>
        {showExtrasModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 flex items-center justify-center p-4 z-50">
            {/* Backdrop dengan blur */}
            <motion.div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExtrasModal(false)} />

            <FocusTrap active={showExtrasModal}>
              <motion.div
                ref={extrasModalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-white dark:bg-neutral-800 shadow-xl 
                          border border-neutral-200 dark:border-neutral-700 
                          w-full max-w-2xl max-h-[85vh] overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="extras-modal-title"
              >
                {/* Elemen dekoratif di pojok kiri atas */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neutral-300 dark:border-neutral-600"></div>

                {/* Elemen dekoratif di pojok kanan atas */}
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neutral-300 dark:border-neutral-600"></div>

                {/* Elemen dekoratif di pojok kiri bawah */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neutral-300 dark:border-neutral-600"></div>

                {/* Elemen dekoratif di pojok kanan bawah */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neutral-300 dark:border-neutral-600"></div>

                {/* Header dengan garis dekoratif */}
                <div
                  className="flex items-center justify-between p-6 border-b 
                            border-neutral-200 dark:border-neutral-700 sticky top-0 
                            bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md z-10"
                >
                  <h3 id="extras-modal-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                    <span className="w-[3px] h-6 bg-gradient-to-b from-neutral-400 to-neutral-600 mr-3 hidden sm:block"></span>
                    Additional Content for "{song.title}"
                  </h3>
                  <button
                    onClick={() => setShowExtrasModal(false)}
                    className="p-2 text-neutral-500 hover:bg-neutral-100 
                              dark:hover:bg-neutral-700 hover:text-neutral-700 
                              dark:hover:text-neutral-300 transition-all duration-200 
                              focus:outline-none focus:ring-2 focus:ring-neutral-400 
                              dark:focus:ring-neutral-500"
                    aria-label="Close dialog"
                  >
                    {/* Icon X dari Lucide React untuk tombol tutup */}
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Scroll indicator dengan gaya gradien */}
                <div className="absolute top-[72px] left-0 right-0 h-4 bg-gradient-to-b from-white/50 to-transparent dark:from-neutral-800/50 pointer-events-none z-10"></div>

                <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(85vh - 140px)" }}>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {song.extras ? (
                      <div
                        className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 
                                  leading-relaxed font-lyrics"
                      >
                        {/* Konten dengan tipografi yang lebih baik */}
                        <div className="space-y-6">
                          {song.extras.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="first-letter:text-lg first-letter:font-medium">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        {/* Icon Info dari Lucide React untuk menampilkan tidak ada konten */}
                        <Info className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                        <p className="text-neutral-500 dark:text-neutral-400 italic">No additional content available for this song.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom scroll indicator */}
                <div className="absolute bottom-[72px] left-0 right-0 h-4 bg-gradient-to-t from-white/50 to-transparent dark:from-neutral-800/50 pointer-events-none z-10"></div>

                <div
                  className="p-6 border-t border-neutral-200 dark:border-neutral-700 
                           bg-neutral-50 dark:bg-neutral-900 flex justify-between items-center"
                >
                  {/* Tombol Share dengan icon dari Lucide React */}
                  <button
                    onClick={() => {
                      setShowExtrasModal(false);
                      shareSong();
                    }}
                    className="flex items-center px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400
                           hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowExtrasModal(false)}
                      className="px-5 py-2.5 bg-neutral-200 hover:bg-neutral-300 
                              dark:bg-neutral-700 dark:hover:bg-neutral-600
                              text-neutral-900 dark:text-neutral-100
                              transition-colors duration-200 font-medium focus:outline-none 
                              focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500
                              shadow-sm hover:shadow"
                    >
                      Close
                    </button>

                    {/* Optional: Tombol favorit dengan icon dari Lucide React */}
                    {song.extras && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFavorite}
                        className="px-5 py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-800 
                                dark:from-neutral-600 dark:to-neutral-700
                                text-white shadow-sm hover:shadow
                                transition-all duration-200 font-medium focus:outline-none 
                                focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500
                                flex items-center"
                      >
                        {favorite ? (
                          <>
                            {/* Icon Heart dari Lucide React menunjukkan status favorit */}
                            <Heart className="w-5 h-5 mr-2 text-rose-400 fill-rose-400" />
                            Favorited
                          </>
                        ) : (
                          <>
                            {/* Icon Heart dari Lucide React untuk tambahkan ke favorit */}
                            <Heart className="w-5 h-5 mr-2" />
                            Add to Favorites
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </FocusTrap>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SongExtrasSection;
