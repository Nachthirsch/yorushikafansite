import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Tag } from "lucide-react";
import { formatDate } from "../../utils/dateFormat";

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
      <div className={`${viewMode === "grid" ? "p-6 relative" : "relative"} flex flex-col flex-grow`}>
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
          <Link to={`/news/${post.id}`} className="group/title block">
            <h2 id={`post-title-${post.id}`} className="text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover/title:text-neutral-600 dark:group-hover/title:text-neutral-300 transition-colors mb-3 relative">
              {post.title}
              {/* Decorative underline effect on hover */}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-600 transition-all duration-300 group-hover/title:w-1/4"></span>
            </h2>
          </Link>

          {/* Post Excerpt with fixed height to ensure button positioning */}
          <div className={`flex-grow ${viewMode === "grid" ? "mb-4" : ""}`}>
            {viewMode === "grid" && post.content && post.content.length > 0 ? (
              <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">{post.content.find((block) => block.type === "text")?.value.substring(0, 120)}...</div>
            ) : (
              // Empty div to maintain space when no excerpt
              <div className="min-h-[8px]"></div>
            )}
          </div>
        </div>

        {/* Button Container - Always positioned at the bottom */}
        <div className={`${viewMode === "grid" ? "pt-3 border-t border-neutral-200 dark:border-neutral-800" : ""} mt-auto relative flex justify-between items-center`}>
          {/* Precise button with consistent height and padding */}
          <Link to={`/news/${post.id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/50 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-all duration-200 group/link relative h-9 min-w-[110px]" aria-label={`Read more about ${post.title}`}>
            <span>Read article</span>
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
