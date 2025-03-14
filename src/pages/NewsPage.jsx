/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { useNewsPosts } from "../hooks/useNewsPosts";
import { useNewsFilters } from "../hooks/useNewsFilters";
import NewsHeader from "../components/news/NewsHeader";
import NewsFilters from "../components/news/NewsFilters";
import NewsCard from "../components/news/NewsCard";

// Extract BlogPostContent as a memoized component
const BlogPostContent = React.memo(({ content }) => {
  if (!content) return null;

  // Parse content if it's a string
  let contentBlocks = content;
  if (typeof content === "string") {
    try {
      contentBlocks = JSON.parse(content);
    } catch (e) {
      contentBlocks = [{ type: "text", value: content }];
    }
  }

  // Ensure contentBlocks is an array
  if (!Array.isArray(contentBlocks)) {
    contentBlocks = [{ type: "text", value: String(content) }];
  }

  return (
    <div className="space-y-4">
      {contentBlocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <div key={index}>
              {block.title && <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">{block.title}</h4>}
              <p className="text-neutral-600 dark:text-neutral-300 line-clamp-3">{block.value}</p>
            </div>
          );
        } else if (block.type === "image") {
          return (
            <div key={index}>
              {block.title && <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">{block.title}</h4>}
              <img src={block.url} alt={block.title || ""} className="w-full h-40 object-cover rounded-md" loading="lazy" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
});

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useNewsPosts(page);
  const { filters, setters, filteredPosts, categories, resetFilters, dateRanges } = useNewsFilters(data?.posts || []);

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 dark:text-red-400 mb-4 font-medium">{error.message || "Failed to load posts"}</p>
          <button
            onClick={() => {
              setPage(1);
            }}
            className="px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !data?.posts.length) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <NewsHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <NewsFilters filters={filters} setters={setters} categories={categories} dateRanges={dateRanges} resetFilters={resetFilters} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">{loading ? "Loading posts..." : "No posts found matching your criteria."}</p>
            <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Try adjusting your search or filters</p>
            {filters.searchTerm || filters.dateFilter !== "all" || filters.categoryFilter !== "all" ? (
              <button onClick={resetFilters} className="mt-6 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                Reset Filters
              </button>
            ) : null}
          </motion.div>
        ) : (
          <>
            <motion.div layout className={`grid ${filters.viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <NewsCard key={post.id} post={post} viewMode={filters.viewMode} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {data?.hasMore && (
              <div className="mt-12 text-center">
                <button onClick={loadMore} disabled={isLoading} className="px-6 py-3 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 disabled:opacity-50 transition-colors shadow-sm hover:shadow">
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}

            {/* Decorative Footer Element */}
            <div className="mt-16 flex justify-center">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
