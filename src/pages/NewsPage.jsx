/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
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
            <p key={index} className="text-gray-600 dark:text-gray-300 line-clamp-3">
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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.some((block) => block.type === "text" && block.value.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => {
              setPage(1);
              fetchPosts();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Minimalist Header */}
      <header className="relative pt-32 pb-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-900 dark:to-transparent z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white">
            News & Updates
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest news and announcements from Yorushika
          </motion.p>
        </div>
      </header>

      {/* Minimalist Controls */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input type="text" placeholder="Search news..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-10 border-b border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors" />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex justify-between items-center">
            {/* Date Filter */}
            <div className="relative">
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors cursor-pointer">
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value} className="bg-white dark:bg-gray-800">
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-gray-400" />
            </div>

            {/* View Toggle */}
            <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors" aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-lg text-gray-500 dark:text-gray-400 italic">{loading ? "Loading posts..." : "No posts found matching your criteria."}</p>
          </motion.div>
        ) : (
          <>
            <motion.div layout className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" : "grid-cols-1 gap-8"}`}>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.article key={post.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} onHoverStart={() => setHoveredPost(post.id)} onHoverEnd={() => setHoveredPost(null)} className={`${viewMode === "grid" ? "flex flex-col" : "flex gap-6 items-start"} group`}>
                    <Link to={`/news/${post.id}`} className={viewMode === "grid" ? "w-full" : "w-1/3"}>
                      <div className="relative aspect-video overflow-hidden rounded-md">{post.cover_image ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />}</div>
                    </Link>

                    <div className={viewMode === "grid" ? "mt-4" : "flex-1"}>
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">{post.category || "News"}</span>
                        <span>•</span>
                        <time>{formatDate(post.publish_date)}</time>
                      </div>

                      <Link to={`/news/${post.id}`}>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mb-2">{post.title}</h2>
                      </Link>

                      <div className="mt-2 mb-4">
                        <BlogPostContent content={Array.isArray(post.content) ? post.content.slice(0, 1) : [{ type: "text", value: post.content }]} />
                      </div>

                      <Link to={`/news/${post.id}`} className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
                        <span>Read article</span>
                        <ChevronRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button onClick={loadMore} disabled={loading} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
