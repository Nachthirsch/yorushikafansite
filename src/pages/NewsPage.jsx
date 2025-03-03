import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("publish_date", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black h-[50vh] mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 opacity-60 animate-gradient" />
        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 backdrop-blur-2xl" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-wider mb-4">News & Updates</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light opacity-90">Stay updated with the latest news and announcements from Yorushika</p>
          </motion.div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg italic">No posts available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex flex-col h-full">
                  <div className="relative w-full aspect-square rounded-lg bg-gray-900 overflow-hidden group">
                    {post.cover_image ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-110" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-950" />}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 p-5 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <time className="text-sm text-amber-300 mb-2 block">{formatDate(post.publish_date)}</time>
                        <h2 className="text-lg font-medium text-white mb-3 line-clamp-2">{post.title}</h2>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => togglePostExpansion(post.id)} className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 transition-colors duration-300">
                          <span className="text-sm">Read {expandedPosts[post.id] ? "Less" : "More"}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {expandedPosts[post.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-6 bg-white dark:bg-gray-800/50 rounded-lg prose prose-sm dark:prose-invert max-w-none">
                      {post.content}
                    </motion.div>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
