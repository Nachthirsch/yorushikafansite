import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Tag, Loader2 } from "lucide-react";
import { formatDate } from "../../utils/dateFormat";
import { useNewsPosts } from "../../hooks/useNewsPosts";
import { useState } from "react";
import YorushikaLogo from "../common/YorushikaLogo"; // Import logo Yorushika

// Komponen untuk menampilkan daftar berita dengan fetching data
export function NewsCardList({ filters, resetFilters, viewMode }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useNewsPosts(page, filters?.dateFilter);

  // Fungsi untuk memuat lebih banyak berita
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Tampilkan error jika terjadi masalah
  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 dark:text-red-400 mb-4 font-medium">{error.message || "Gagal memuat berita"}</p>
          <button
            onClick={() => {
              setPage(1);
            }}
            className="px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
          >
            Try Again!
          </button>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada berita yang ditemukan
  if (data?.posts?.length === 0 || !data?.posts) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">{isLoading ? "Loading Lores" : "TThere's no lore :'( "}</p>
        <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Adjust tour keyword and filter</p>
        {filters.searchTerm || filters.dateFilter !== "all" || filters.categoryFilter !== "all" ? (
          <button onClick={resetFilters} className="mt-6 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
            Reset Filter
          </button>
        ) : null}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div layout className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
        {data?.posts?.map((post, index) => (
          <NewsCard key={post.id} post={post} viewMode={viewMode} index={index} />
        ))}
      </motion.div>

      {/* Tombol Load More */}
      {data?.hasMore && (
        <div className="mt-12 text-center">
          <button onClick={loadMore} disabled={isLoading} className="px-6 py-3 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 disabled:opacity-50 transition-colors shadow-sm hover:shadow">
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" aria-hidden="true" />
                Memuat...
              </span>
            ) : (
              "Muat Lebih Banyak"
            )}
          </button>
        </div>
      )}

      {/* Dekorasi elemen footer */}
      <div className="mt-16 flex justify-center">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
      </div>
    </>
  );
}

// Komponen Card berita tetap seperti sebelumnya
export default function NewsCard({ post, viewMode, index }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`group transition-all duration-300 relative flex flex-col ${viewMode === "grid" ? "bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]" : "bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.3)]"}`} role="article" aria-labelledby={`post-title-${post.id}`}>
      {/* Subtle decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-0 right-0 w-4 h-4 translate-x-1/2 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-neutral-200 dark:border-neutral-700 rounded-tr-2xl"></div>
      </div>

      {/* Cover Image - Only shown in grid mode */}
      {post.cover_image && viewMode === "grid" && (
        <div className="aspect-video overflow-hidden relative">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          {/* Decorative horizontal line at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-neutral-400/20 to-transparent"></div>
        </div>
      )}

      {/* Using flex-col and flex-grow to create consistent card layouts */}
      <div className={`${viewMode === "grid" ? "p-6 relative" : "relative"} flex flex-col flex-grow group/rotate`}>
        {/* Card Content Container - Using flex-grow to push button to bottom */}
        <div className="flex-grow flex flex-col">
          {/* Post Metadata with enhanced styling */}
          <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500 dark:text-neutral-400">
            {/* Category Tag with subtle hover effect */}
            <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-full border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors">
              <Tag className="w-3 h-3 mr-1.5 stroke-[1.5px]" aria-hidden="true" />
              <span className="font-medium">{post.category || "Lore"}</span>
            </span>

            {/* Decorative separator */}
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" aria-hidden="true"></span>

            {/* Publication Date with improved styling */}
            <time className="flex items-center group/date" dateTime={post.publish_date}>
              <Calendar className="w-3 h-3 mr-1.5 stroke-[1.5px] transition-colors group-hover/date:text-neutral-700 dark:group-hover/date:text-neutral-300" aria-hidden="true" />
              <span className="transition-colors group-hover/date:text-neutral-700 dark:group-hover/date:text-neutral-300">{formatDate(post.publish_date)}</span>
            </time>
          </div>

          {/* Post Title with enhanced hover effect */}
          <Link to={`/lore/${post.id}`} className="group/title block">
            <h2 id={`post-title-${post.id}`} className="text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover/title:text-neutral-600 dark:group-hover/title:text-neutral-300 transition-colors mb-3 relative">
              {post.title}
              {/* Decorative underline effect on hover */}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-600 transition-all duration-300 group-hover/title:w-1/4"></span>
            </h2>
          </Link>

          {/* Post Excerpt with fixed height to ensure button positioning */}
          <div className={`flex-grow ${viewMode === "grid" ? "mb-4" : ""}`}>
            {/* Elemen dekoratif dengan desain yang lebih elegan */}
            <div className="relative py-4">
              {/* Garis horizontal dengan efek gradien yang lebih halus */}
              <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent opacity-70"></div>
              </div>

              {/* Elemen pusat dengan overlay yang lebih menarik */}
              <div className="flex justify-center items-center relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neutral-200 dark:from-neutral-800 to-neutral-300 dark:to-neutral-700 opacity-30 blur-sm"></div>
                <div className="relative w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full shadow-sm"></div>
                {/* Logo Yorushika dengan animasi rotasi 360 derajat saat hover pada card atau tombol */}
                <div className="relative mx-1.5 text-neutral-400 dark:text-neutral-500 transition-all duration-700 group-hover:scale-110 group-hover/rotate:rotate-[360deg] hover:rotate-[360deg]">
                  <YorushikaLogo className="w-8 h-8 opacity-100 group-hover:opacity-100 transition-all cursor-pointer" />
                </div>
                <div className="relative w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full shadow-sm"></div>
              </div>

              {/* Elemen dekoratif tambahan dengan animasi subtle */}
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 opacity-10">
                <div className="absolute inset-0 border-t border-r border-neutral-500 dark:border-neutral-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-500 dark:border-neutral-400 rounded-bl-sm"></div>
              </div>

              {/* Elemen dekoratif tambahan di sisi kiri */}
              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-8 h-8 opacity-10">
                <div className="absolute inset-0 border-t border-l border-neutral-500 dark:border-neutral-400 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-500 dark:border-neutral-400 rounded-br-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Button Container - Always positioned at the bottom */}
        <div className={`${viewMode === "grid" ? "pt-3 border-t border-neutral-200 dark:border-neutral-800" : ""} mt-auto relative flex justify-between items-center`}>
          {/* Precise button with consistent height and padding */}
          <Link to={`/lore/${post.id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/50 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-all duration-200 group/link relative h-9 min-w-[110px]" aria-label={`Read more about ${post.title}`}>
            <span>Read lore</span>
            {/* Chevron icon with consistent positioning */}
            <ChevronRight className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />

            {/* Decorative accent line beneath button */}
            <span className="absolute -bottom-1 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
          </Link>

          {/* Decorative element - dots pattern */}
          <div className="hidden sm:flex items-center space-x-1 opacity-30 dark:opacity-20">
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
          </div>
        </div>

        {/* Bottom right decorative element */}
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-bl-lg border-b border-l border-neutral-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </motion.article>
  );
}
