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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner className="w-10 h-10 text-amber-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-300">Post not found</p>
        <Link to="/news" className="mt-4 text-amber-500 hover:text-amber-600 font-medium">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
          <Link
            to="/news"
            className="inline-flex items-center text-amber-500 hover:text-amber-600 
            dark:text-amber-400 dark:hover:text-amber-300 mb-6 text-base font-medium py-2 
            transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to News
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-2">
            {post.cover_image ? (
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg shadow-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{formatDate(post.publish_date)}</span>
                </div>

                {post.category && <div className="px-3 py-1 rounded-full bg-amber-700/70 text-amber-50">{post.category}</div>}

                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-5 h-5" />
                  <span>{getReadingTime()} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-6 bg-amber-500 rounded mr-3"></div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Article</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert mx-auto prose-headings:text-amber-900 dark:prose-headings:text-amber-400 prose-a:text-red-700 dark:prose-a:text-red-400">
            {Array.isArray(post.content) ? (
              post.content.map((block, index) => (
                <motion.div key={index} className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                  {block.type === "text" && <p className="leading-relaxed text-neutral-100">{block.value}</p>}
                  {block.type === "image" && (
                    <figure className="my-8 flex flex-col items-center">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <img
                          src={block.url}
                          alt={block.caption || ""}
                          className="max-w-full h-auto max-h-96"
                          style={{
                            objectFit: "scale-down",
                          }}
                        />
                      </div>
                      {block.caption && <figcaption className="text-center text-gray-600 dark:text-gray-400 mt-2 text-sm italic w-full">{block.caption}</figcaption>}
                    </figure>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="leading-relaxed">{String(post.content)}</div>
            )}
          </div>
        </div>

        {/* Author info if available */}
        {post.author && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-pink-500 rounded mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Author</h2>
            </div>
            <div className="flex items-center space-x-4">
              {post.author_image && (
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img src={post.author_image} alt={post.author} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg text-gray-900 dark:text-white">{post.author}</h3>
                {post.author_bio && <p className="text-gray-600 dark:text-gray-400 border-l-2 border-pink-100 dark:border-gray-700 pl-4 mt-2">{post.author_bio}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Author info section */}
        {post.author_name && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-pink-500 rounded mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Author</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white font-medium">{post.author_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">{post.author_name}</h3>
                </div>
              </div>
              {post.author_social_link && (
                <a href={post.author_social_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                  <span>Follow</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-indigo-500 rounded mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Read More</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/news/${relatedPost.id}`} className="group block rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-50 dark:bg-gray-750">
                  <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    {relatedPost.cover_image ? (
                      <img src={relatedPost.cover_image} alt={relatedPost.title} className="max-w-full max-h-full object-contain px-2" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-700 to-red-800 flex items-center justify-center">
                        <BookOpenIcon className="w-12 h-12 text-white/70" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{relatedPost.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{formatDate(relatedPost.publish_date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
