import { motion } from "framer-motion";

// Komponen ini menampilkan skeleton card saat album sedang dimuat
// Mendukung dua mode tampilan (grid dan list) agar konsisten dengan AlbumCard
export default function AlbumCardSkeleton({ isGridView }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className={`${isGridView ? "block" : "flex"}`}>
      {/* Wrapper utama dengan efek pulse untuk menunjukkan loading state */}
      <div
        className={`
        animate-pulse
        ${isGridView ? "block bg-white/80 dark:bg-neutral-900/90 rounded-lg overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm" : "flex items-center gap-5 bg-white/90 dark:bg-neutral-900/90 p-4 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70"}
      `}
      >
        {/* Container untuk skeleton gambar album */}
        <div
          className={`relative bg-neutral-200 dark:bg-neutral-800 
          ${isGridView ? "aspect-square overflow-hidden" : "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg"}`}
        >
          {/* Elemen dekoratif untuk memberikan kedalaman visual */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-transparent dark:from-neutral-700/20"></div>

          {/* Garis diagonal dekoratif */}
          <div className="absolute top-1/4 right-1/4 w-1/2 h-[1px] bg-neutral-300/30 dark:bg-neutral-600/30 rotate-45"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[1px] bg-neutral-300/30 dark:bg-neutral-600/30 rotate-45"></div>
        </div>

        {/* Konten skeleton untuk informasi album */}
        <div className={`${isGridView ? "p-4 pb-5" : "ml-3 flex-1"}`}>
          {/* Judul skeleton */}
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-2"></div>

          {/* Detail skeleton */}
          <div className="flex items-center mt-1.5 space-x-2">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-10"></div>
            <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-12"></div>
          </div>

          {/* Footer skeleton untuk tampilan grid */}
          {isGridView && (
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/70 flex justify-between items-center">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-12"></div>
              <div className="h-5 w-5 rounded-full border border-neutral-200 dark:border-neutral-800"></div>
            </div>
          )}

          {/* Label skeleton untuk tampilan list */}
          {!isGridView && (
            <div className="mt-1 flex items-center">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-12"></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
