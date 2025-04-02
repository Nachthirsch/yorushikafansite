import { motion } from "framer-motion";
import { Music, Clock3 } from "lucide-react";

// Komponen skeleton loading untuk menampilkan placeholder saat data lagu sedang dimuat
// Mendukung dua mode tampilan: grid dan list, sama seperti SongCard asli
export default function SongCardSkeleton({ isGridView, index = 0 }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`animate-pulse ${isGridView ? "bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-sm border border-neutral-200/60 dark:border-neutral-800/60" : "flex items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70"}`}>
      {/* Thumbnail container skeleton */}
      <div className={`relative ${isGridView ? "aspect-square" : "w-16 h-16"} bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded-lg`}>
        {/* Overlay dekoratif untuk memberikan kedalaman visual */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/10 to-transparent dark:from-neutral-700/10"></div>

        {/* Ikon Music sebagai placeholder */}
        <div className="w-full h-full flex items-center justify-center">
          <Music className="w-1/3 h-1/3 text-neutral-300 dark:text-neutral-700 opacity-40" />
        </div>

        {/* Elemen dekoratif diagonal */}
        <div className="absolute top-0 left-0 bottom-0 right-0">
          <div className="absolute top-1/4 right-1/4 w-1/2 h-[1px] bg-neutral-300/30 dark:bg-neutral-600/30 rotate-45"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[1px] bg-neutral-300/30 dark:bg-neutral-600/30 rotate-45"></div>
        </div>
      </div>

      {/* Konten info lagu skeleton */}
      <div className={`${isGridView ? "p-4" : "flex-1"}`}>
        {/* Judul skeleton */}
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4"></div>

        {/* Album skeleton */}
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2 mt-2"></div>

        {/* Durasi skeleton */}
        <div className="flex items-center gap-2 mt-2 text-neutral-300 dark:text-neutral-600">
          <Clock3 className="w-4 h-4" />
          <div className="h-3 w-12 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        </div>
      </div>

      {/* Elemen dekoratif tambahan untuk tampilan grid */}
      {isGridView && (
        <div className="absolute bottom-0 right-0 w-12 h-12">
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-neutral-200 dark:border-neutral-800 rounded-bl-lg opacity-50"></div>
        </div>
      )}
    </motion.div>
  );
}

// Komponen untuk menampilkan beberapa skeleton cards sekaligus
export function SongCardSkeletonList({ isGridView, count = 12 }) {
  return (
    <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid-cols-1 gap-4"}`}>
      {[...Array(count)].map((_, index) => (
        <SongCardSkeleton key={`skeleton-${index}`} isGridView={isGridView} index={index} />
      ))}
    </motion.div>
  );
}
