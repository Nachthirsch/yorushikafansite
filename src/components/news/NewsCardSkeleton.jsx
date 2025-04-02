import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

// Komponen skeletal loading untuk NewsCard
// Digunakan saat konten berita sedang dimuat untuk memberikan indikasi visual kepada pengguna
export default function NewsCardSkeleton({ viewMode, index = 0 }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`group animate-pulse transition-all duration-300 relative flex flex-col ${viewMode === "grid" ? "bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60" : "bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70"}`}>
      {/* Elemen dekoratif pojok kanan atas */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-0 right-0 w-4 h-4 translate-x-1/2 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-neutral-200 dark:border-neutral-700 rounded-tr-2xl"></div>
      </div>

      {/* Area gambar - hanya ditampilkan dalam mode grid */}
      {viewMode === "grid" && (
        <div className="aspect-video overflow-hidden relative bg-neutral-200 dark:bg-neutral-800">
          {/* Efek gradient di bagian bawah gambar */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-neutral-300/30 dark:from-neutral-700/30 to-transparent"></div>

          {/* Garis horizontal dekoratif di bagian bawah gambar */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-300/50 dark:via-neutral-500/20 to-transparent"></div>
        </div>
      )}

      {/* Konten kartu */}
      <div className={`${viewMode === "grid" ? "p-6 relative" : "relative"} flex flex-col flex-grow`}>
        {/* Konten utama */}
        <div className="flex-grow flex flex-col">
          {/* Metadata berita dengan styling yang ditingkatkan */}
          <div className="flex items-center gap-2 mb-3 text-xs text-neutral-400 dark:text-neutral-500">
            {/* Tag kategori */}
            <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-full border border-transparent">
              <Tag className="w-3 h-3 mr-1.5 stroke-[1.5px]" aria-hidden="true" />
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
            </span>

            {/* Pemisah dekoratif */}
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" aria-hidden="true"></span>

            {/* Tanggal publikasi */}
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1.5 stroke-[1.5px]" aria-hidden="true" />
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
            </span>
          </div>

          {/* Judul berita skeleton */}
          <div className="mb-3">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4 mb-2"></div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2"></div>
          </div>

          {/* Area konten skeleton */}
          <div className="flex-grow">
            {/* Elemen dekoratif dengan desain elegan */}
            <div className="relative py-4">
              {/* Garis horizontal dengan efek gradien */}
              <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent opacity-70"></div>
              </div>

              {/* Elemen pusat dengan titik dan lingkaran */}
              <div className="flex justify-center items-center relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neutral-200 dark:from-neutral-800 to-neutral-300 dark:to-neutral-700 opacity-30 blur-sm"></div>
                <div className="relative w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full shadow-sm"></div>
                {/* Area skeleton logo */}
                <div className="relative mx-1.5 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                <div className="relative w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Container tombol - selalu di posisi bawah */}
        <div className={`${viewMode === "grid" ? "pt-3 border-t border-neutral-200 dark:border-neutral-800" : ""} mt-auto relative flex justify-between items-center`}>
          {/* Tombol skeleton */}
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/50 h-9 min-w-[110px]">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
          </div>

          {/* Elemen dekoratif - pola titik */}
          <div className="hidden sm:flex items-center space-x-1 opacity-30 dark:opacity-20">
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
          </div>
        </div>

        {/* Elemen dekoratif sudut kanan bawah */}
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-bl-lg border-b border-l border-neutral-200 dark:border-neutral-700 opacity-50"></div>
      </div>
    </motion.article>
  );
}

// Komponen untuk menampilkan beberapa skeleton cards
export function NewsCardSkeletonList({ viewMode, count = 6 }) {
  return (
    <motion.div layout className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
      {[...Array(count)].map((_, index) => (
        <NewsCardSkeleton key={`skeleton-${index}`} viewMode={viewMode} index={index} />
      ))}
    </motion.div>
  );
}
