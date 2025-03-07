import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", postId).single();

      if (error) throw error;
      setPost(data);

      // Fetch related posts with similar categories or tags
      if (data.category) {
        const { data: related } = await supabase.from("blog_posts").select("id, title, cover_image, publish_date").eq("category", data.category).neq("id", postId).limit(3);

        if (related) setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
        <p className="text-lg text-neutral-600 dark:text-neutral-300">Post not found</p>
        <Link to="/news" className="mt-4 text-neutral-500 hover:text-neutral-600 font-medium">
          Return to News
        </Link>
      </div>
    );
  }

  // Estimate reading time based on content length
  const getReadingTime = () => {
    const wordsPerMinute = 200;
    let textContent = "";

    if (Array.isArray(post.content)) {
      textContent = post.content
        .filter((block) => block.type === "text")
        .map((block) => block.value)
        .join(" ");
    } else {
      textContent = String(post.content);
    }

    const words = textContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Minimalist Header */}
      <header className="relative pt-32 pb-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/news"
            className="inline-flex items-center text-neutral-500 hover:text-neutral-600 
            dark:text-neutral-400 dark:hover:text-neutral-300 mb-6 text-base font-medium py-2 
            transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to News
          </Link>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
            {post.title}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap items-center gap-4 mt-6 text-lg text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{formatDate(post.publish_date)}</span>
            </div>

            {post.category && <div className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">{post.category}</div>}

            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5" />
              <span>{getReadingTime()} min read</span>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Content Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-12">
          {post.cover_image && (
            <div className="mb-8 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain" />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {Array.isArray(post.content) ? (
              post.content.map((block, index) => (
                <motion.div key={index} className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                  {block.type === "text" && <p className="leading-relaxed text-neutral-900 dark:text-neutral-100">{block.value}</p>}
                  {block.type === "image" && (
                    <figure className="my-8 flex flex-col items-center">
                      <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
                        <img src={block.url} alt={block.caption || ""} className="max-w-full h-auto max-h-96 object-scale-down" />
                      </div>
                      {block.caption && <figcaption className="text-center text-neutral-600 dark:text-neutral-400 mt-2 text-sm italic">{block.caption}</figcaption>}
                    </figure>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="leading-relaxed text-neutral-900 dark:text-neutral-100">{String(post.content)}</div>
            )}
          </div>
        </motion.div>

        {/* Author info section */}
        {(post.author || post.author_name) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-12">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Author</h2>
            </div>

            <div className="flex items-center space-x-4">
              {post.author_image ? (
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
                  <img src={post.author_image} alt={post.author || post.author_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white font-medium">{(post.author || post.author_name || "A").charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg text-neutral-900 dark:text-neutral-100">{post.author || post.author_name}</h3>
                {post.author_bio && <p className="text-neutral-600 dark:text-neutral-400 mt-2">{post.author_bio}</p>}
                {post.author_social_link && (
                  <a href={post.author_social_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 mt-2 text-sm">
                    <span>Follow</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Read More</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div key={relatedPost.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}>
                  <Link to={`/news/${relatedPost.id}`} className="group block rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all p-4">
                    <div className="h-40 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden mb-4">{relatedPost.cover_image ? <img src={relatedPost.cover_image} alt={relatedPost.title} className="max-w-full max-h-full object-contain px-2" /> : <BookOpenIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />}</div>
                    <h3 className="font-medium text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">{relatedPost.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">{formatDate(relatedPost.publish_date)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
