/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon, ChevronDownIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function BlogPostContent({ content }) {
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
}

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [dateFilter, setDateFilter] = useState("all");
  const [hoveredPost, setHoveredPost] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [page, dateFilter]);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      // Simplified query to debug
      console.log("Fetching posts...");
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); // Changed from publish_date to created_at

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        setPosts([]);
        return;
      }

      // Process the posts data with better error handling
      const processedPosts = data.map((post) => {
        try {
          return {
            ...post,
            content: formatPostContent(post.content),
          };
        } catch (e) {
          console.error("Error processing post:", e);
          return {
            ...post,
            content: [{ type: "text", value: "Error loading content" }],
          };
        }
      });

      setPosts(processedPosts);
      setHasMore(false); // Temporarily disable pagination until basic fetch works
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function formatPostContent(content) {
    if (!content) return [{ type: "text", value: "" }];

    try {
      if (typeof content === "string") {
        try {
          const parsed = JSON.parse(content);
          return Array.isArray(parsed) ? parsed : [{ type: "text", value: content }];
        } catch {
          // If JSON parsing fails, treat it as plain text
          return [{ type: "text", value: content }];
        }
      }
      // If content is already an array, use it directly
      if (Array.isArray(content)) {
        return content;
      }
      // For any other type, convert to string
      return [{ type: "text", value: String(content) }];
    } catch (e) {
      console.error("Error formatting content:", e);
      return [{ type: "text", value: "Error formatting content" }];
    }
  }

  const dateRanges = [
    { label: "All Time", value: "all" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
    { label: "Last Year", value: "lastYear" },
  ];

  const categories = ["all", ...new Set(posts.map((post) => post.category || "Uncategorized"))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.some((block) => block.type === "text" && block.value.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 dark:text-red-400 mb-4 font-medium">{error}</p>
          <button
            onClick={() => {
              setPage(1);
              fetchPosts();
            }}
            className="px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Floating News Icons - For Decoration */}
      <div className="hidden md:block absolute top-40 right-12 opacity-20 dark:opacity-10">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <NewspaperIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      <div className="hidden md:block absolute bottom-40 left-12 opacity-20 dark:opacity-10">
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <NewspaperIcon className="h-10 w-10 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      {/* Minimalist Header */}
      <header className="relative pt-32 pb-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Decorative Lines */}
        <div className="absolute left-0 right-0 top-44 flex justify-center z-0 opacity-20 dark:opacity-10 overflow-hidden">
          <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-block mb-4">
            <div className="h-14 w-14 mx-auto rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 relative inline-block">
            <span className="relative z-10">Lore</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent opacity-40"></span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Stay updated with the latest lore from Yorushika
          </motion.p>
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

            {/* View Toggle */}
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
          </motion.div>
        ) : (
          <>
            <motion.div layout className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-6"}`}>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.article key={post.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} onHoverStart={() => setHoveredPost(post.id)} onHoverEnd={() => setHoveredPost(null)} className={`group transition-all duration-300 hover:shadow-lg ${viewMode === "grid" ? "bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-1" : "bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5"}`}>
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
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button onClick={loadMore} disabled={loading} className="px-6 py-3 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 disabled:opacity-50 transition-colors shadow-sm hover:shadow">
                  {loading ? (
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
