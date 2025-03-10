/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon, ChevronDownIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNewsPosts } from "../hooks/useNewsPosts";
import { useNewsFilters } from "../hooks/useNewsFilters";

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
            <p key={index} className="text-neutral-600 dark:text-neutral-300 line-clamp-3">
              {block.value}
            </p>
          );
        } else if (block.type === "image") {
          return <img key={index} src={block.url} alt="" className="w-full h-40 object-cover rounded-md" loading="lazy" />;
        }
        return null;
      })}
    </div>
  );
});

// Extract NewsCard component for better organization
const NewsCard = React.memo(({ post, viewMode, index }) => {
  return (
    <motion.article key={post.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`group transition-all duration-300 hover:shadow-lg ${viewMode === "grid" ? "bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-1" : "bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5"}`}>
      {post.cover_image && viewMode === "grid" && (
        <div className="aspect-video overflow-hidden relative">
          <img src={post.cover_image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      <div className={`${viewMode === "grid" ? "p-6" : ""}`}>
        <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">{post.category || "Lore"}</span>
          <span>•</span>
          <time className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.publish_date)}
          </time>
        </div>

        <Link to={`/news/${post.id}`}>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors mb-3">{post.title}</h2>
        </Link>

        {viewMode === "grid" && post.content && post.content.length > 0 && <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">{post.content.find((block) => block.type === "text")?.value.substring(0, 120)}...</div>}

        <div className={`${viewMode === "grid" ? "mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800" : "mt-3"}`}>
          <Link to={`/news/${post.id}`} className="inline-flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group">
            <span>Read article</span>
            <ChevronRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
});

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useNewsPosts(page);
  const { filters, setters, filteredPosts, categories, resetFilters, dateRanges } = useNewsFilters(data?.posts || []);

  const { searchTerm, dateFilter, categoryFilter, viewMode } = filters;
  const { setSearchTerm, setDateFilter, setCategoryFilter, setViewMode } = setters;

  // Fungsi loadMore yang diperbarui
  const loadMore = () => {
    if (!isLoading && data?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

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

  // ... rest of the component remains the same ...
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* ... existing decorative elements ... */}

      {/* Minimalist Header */}
      <header className="relative pt-32 pb-24 mb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Paper-like pattern lines - top right */}
        <div className="absolute top-20 right-10 z-0 opacity-20 dark:opacity-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`line-tr-${i}`}
              className="h-px bg-neutral-400 dark:bg-neutral-600 mb-5"
              style={{ width: `${60 + i * 30}px`, marginLeft: "auto" }}
              animate={{
                width: [`${60 + i * 30}px`, `${90 + i * 20}px`, `${60 + i * 30}px`],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -8, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Paragraph-like lines - bottom left */}
        <div className="absolute bottom-20 left-10 z-0 opacity-20 dark:opacity-10">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`line-bl-${i}`}
              className="h-px bg-neutral-400 dark:bg-neutral-600 mb-4"
              style={{ width: i === 3 ? `${80}px` : `${120 - i * 15}px` }}
              animate={{
                width: [i === 3 ? `${80}px` : `${120 - i * 15}px`, i === 3 ? `${60}px` : `${130 - i * 10}px`, i === 3 ? `${80}px` : `${120 - i * 15}px`],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 5, 0],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Abstract geometric elements */}
        <motion.div
          className="absolute left-1/4 top-40 w-40 h-40 border border-neutral-300/20 dark:border-neutral-600/20 rounded-md z-0 opacity-20 dark:opacity-10"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.div
          className="absolute right-1/3 bottom-10 w-24 h-24 border-b border-l border-neutral-300/20 dark:border-neutral-600/20 z-0 opacity-20 dark:opacity-10"
          animate={{
            rotate: [10, -10, 10],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Document-like diagonal lines */}
        <div className="absolute -right-10 top-1/3 w-40 h-40 z-0 opacity-15 dark:opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-neutral-400 dark:text-neutral-600">
            <motion.line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
            <motion.line x1="20" y1="0" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />
          </svg>
        </div>

        <div className="absolute left-10 bottom-30 w-40 h-40 z-0 opacity-15 dark:opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-neutral-400 dark:text-neutral-600">
            <motion.line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
            <motion.line x1="80" y1="0" x2="0" y2="80" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
          </svg>
        </div>

        {/* Text highlighting wave */}
        <div className="absolute left-0 right-0 top-52 flex justify-center z-0 opacity-20 dark:opacity-10 overflow-hidden">
          <div className="w-3/4 h-20 flex items-end">
            <svg width="100%" height="40" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <motion.path
                d="M0,80 Q250,60 500,80 Q750,100 1000,80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-neutral-400 dark:text-neutral-600"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.8],
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.path
                d="M0,80 Q250,100 500,80 Q750,60 1000,80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-neutral-400 dark:text-neutral-600"
                animate={{
                  y: [0, 5, 0],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>

        {/* Text cursor visualization */}
        <div className="absolute left-0 right-0 top-64 flex justify-center z-0 opacity-20 dark:opacity-10">
          <div className="flex items-end space-x-3">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`cursor-${i}`}
                className="w-0.5 h-3 rounded-full bg-neutral-400 dark:bg-neutral-600"
                animate={{
                  height: [3, 6 + 3 * Math.sin((i / 8) * Math.PI), 3],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon with animated outline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block mb-6 mx-auto relative">
            <div className="h-16 w-16 bg-white dark:bg-neutral-800 mx-auto shadow-sm flex items-center justify-center relative z-10 overflow-hidden">
              <motion.div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-700 origin-left" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>

            {/* Animated outline */}
            <motion.div className="absolute -inset-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <svg className="w-[calc(100%+8px)] h-[calc(100%+8px)] -ml-1 -mt-1 absolute" viewBox="0 0 72 72">
                <motion.rect x="0" y="0" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-300 dark:text-neutral-600" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} />
              </svg>
            </motion.div>
          </motion.div>

          {/* Title with line drawing animation */}
          <div className="relative inline-block mb-1">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
              Lore
            </motion.h1>
            <div className="absolute -bottom-2 left-0 right-0 overflow-hidden">
              <motion.div className="h-px bg-neutral-400 dark:bg-neutral-600" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }} />
              <motion.div className="h-px bg-neutral-400/50 dark:bg-neutral-600/50 mt-1" initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1, delay: 1, ease: "easeInOut" }} />
            </div>
          </div>

          {/* Description with subtle reveal */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-10 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Stay updated with the latest lore from Yorushika
          </motion.p>

          {/* Minimalist animated separator */}
          <div className="mt-12 flex justify-center items-center space-x-4">
            <motion.div className="h-px w-12 bg-neutral-300 dark:bg-neutral-700" animate={{ width: ["48px", "20px", "48px"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 0.8, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full"
            />
            <motion.div className="h-px w-12 bg-neutral-300 dark:bg-neutral-700" animate={{ width: ["20px", "48px", "20px"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </div>
      </header>

      {/* Minimalist Controls */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
          {/* Search Bar */}
          <div className="relative">
            <input type="text" placeholder="Search news..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-10 border-b border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors" />
            <svg className="absolute right-3 top-3 w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-4 justify-between items-center">
            {/* Date Filter */}
            <div className="relative">
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value} className="bg-neutral-50 dark:bg-neutral-800">
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
                <option value="all" className="bg-neutral-50 dark:bg-neutral-800">
                  All Categories
                </option>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category} className="bg-neutral-50 dark:bg-neutral-800">
                      {category || "Uncategorized"}
                    </option>
                  ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
            </div>

            {/* View Toggle and Reset Filters */}
            <div className="flex gap-2">
              <button onClick={resetFilters} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" title="Reset filters">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}>
                {viewMode === "grid" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* News Grid/List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">{loading ? "Loading posts..." : "No posts found matching your criteria."}</p>
            <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Try adjusting your search or filters</p>
            {searchTerm || dateFilter !== "all" || categoryFilter !== "all" ? (
              <button onClick={resetFilters} className="mt-6 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                Reset Filters
              </button>
            ) : null}
          </motion.div>
        ) : (
          <>
            <motion.div layout className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <NewsCard key={post.id} post={post} viewMode={viewMode} index={index} />
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
