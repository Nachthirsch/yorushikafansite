import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import SecureImage, { preloadImage } from "../components/SecureImage";
import { usePost, useRelatedPosts, prefetchPost } from "../hooks/usePost";
import { preloadContentImages, preloadPostsImages } from "../utils/prefetchUtils";
import { useQueryClient } from "@tanstack/react-query";

export default function PostDetailPage() {
  const { postId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);
  const sectionTitleRef = useRef(null);
  const pageSize = 3; // Number of related posts per page
  const sectionsPerPage = 2; // Number of content sections per page
  const queryClient = useQueryClient();

  // Add scroll effect when contentPage changes
  useEffect(() => {
    if (sectionTitleRef.current) {
      sectionTitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [contentPage]);

  const { data: post, isLoading: postLoading, error: postError } = usePost(postId);

  const { data: relatedPostsData, isLoading: relatedLoading } = useRelatedPosts(post?.category, postId, currentPage, pageSize);

  const relatedPosts = relatedPostsData?.data || [];
  const totalPages = relatedPostsData ? Math.ceil(relatedPostsData.count / pageSize) : 0;

  // Prefetch next content page when the current page is loaded
  useEffect(() => {
    if (!post || !Array.isArray(post.content)) return;

    const totalContentPages = Math.ceil(post.content.length / sectionsPerPage);

    if (contentPage < totalContentPages) {
      const nextPage = contentPage + 1;
      const nextPageContent = post.content.slice((nextPage - 1) * sectionsPerPage, nextPage * sectionsPerPage);

      // Preload images from the next page content
      preloadContentImages(nextPageContent);
    }
  }, [post, contentPage, sectionsPerPage]);

  // Prefetch next post in related posts if any
  useEffect(() => {
    if (relatedPosts.length === 0) return;

    // Try to preload the next post content if user might navigate to it
    const nextPostIndex = 0; // Default to first related post
    const nextPostId = relatedPosts[nextPostIndex]?.id;

    if (nextPostId) {
      prefetchPost(queryClient, nextPostId);

      // Also preload the cover image of next post if available
      if (relatedPosts[nextPostIndex].cover_image) {
        preloadImage(relatedPosts[nextPostIndex].cover_image);
      }
    }

    // Preload all cover images of visible related posts
    preloadPostsImages(relatedPosts);
  }, [relatedPosts, queryClient]);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Estimate reading time based on content length
  const getReadingTime = (postContent) => {
    const wordsPerMinute = 200;
    let textContent = "";

    if (Array.isArray(postContent)) {
      textContent = postContent
        .filter((block) => block.type === "text")
        .map((block) => block.value)
        .join(" ");
    } else {
      textContent = String(postContent);
    }

    const words = textContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Function to handle content page navigation with preloading
  const navigateToContentPage = (newPage) => {
    const totalContentPages = Math.ceil((post?.content?.length || 0) / sectionsPerPage);

    if (newPage >= 1 && newPage <= totalContentPages) {
      setContentPage(newPage);

      // Preload the page after the new page we're navigating to
      if (newPage < totalContentPages) {
        const pageToPreload = newPage + 1;
        const preloadContent = post.content.slice((pageToPreload - 1) * sectionsPerPage, pageToPreload * sectionsPerPage);

        preloadContentImages(preloadContent);
      }
    }
  };

  if (postLoading) {
    return <LoadingSpinner />;
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
        <p className="text-lg text-neutral-600 dark:text-neutral-300">Post not found</p>
        <Link to="/news" className="mt-4 text-neutral-500 hover:text-neutral-600 font-medium">
          Return to News
        </Link>
      </div>
    );
  }

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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap items-center gap-4 mt-6 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{formatDate(post.publish_date)}</span>
            </div>

            {post.category && <div className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">{post.category}</div>}

            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5" />
              <span>{getReadingTime(post.content)} min read</span>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Content Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 mb-8">
          {post.cover_image && (
            <div className="mb-8 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <SecureImage src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain" />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none select-none">
            {Array.isArray(post.content) ? (
              <>
                {post.content.slice((contentPage - 1) * sectionsPerPage, contentPage * sectionsPerPage).map((block, index) => (
                  <motion.div key={index} className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} ref={index === 0 ? sectionTitleRef : null}>
                    {block.title && <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3">{block.title}</h3>}
                    {block.type === "text" && <p className="leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-line">{block.value}</p>}
                    {block.type === "image" && (
                      <figure className="my-8 flex flex-col items-center">
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
                          <SecureImage src={block.url} alt={block.title || block.caption || ""} className="max-w-full h-auto max-h-96 object-scale-down" />
                        </div>
                        {block.caption && <figcaption className="text-center text-neutral-600 dark:text-neutral-400 mt-2 text-sm italic">{block.caption}</figcaption>}
                      </figure>
                    )}
                  </motion.div>
                ))}

                {/* Hidden preload component for next page images */}
                {Array.isArray(post.content) && contentPage < Math.ceil(post.content.length / sectionsPerPage) && <div className="hidden">{post.content.slice(contentPage * sectionsPerPage, (contentPage + 1) * sectionsPerPage).map((block, index) => block.type === "image" && <SecureImage key={`preload-${index}`} src={block.url} preload={true} />)}</div>}

                {Array.isArray(post.content) && post.content.length > sectionsPerPage && (
                  <div className="flex items-center justify-center space-x-4 mt-8">
                    <button onClick={() => navigateToContentPage(contentPage - 1)} disabled={contentPage === 1} className={`p-2 rounded-full ${contentPage === 1 ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {contentPage} / {Math.ceil(post.content.length / sectionsPerPage)}
                    </span>
                    <button onClick={() => navigateToContentPage(contentPage + 1)} disabled={contentPage === Math.ceil(post.content.length / sectionsPerPage)} className={`p-2 rounded-full ${contentPage === Math.ceil(post.content.length / sectionsPerPage) ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="leading-relaxed text-neutral-900 dark:text-neutral-100">{String(post.content)}</div>
            )}
          </div>
        </motion.div>

        {/* Author info section */}
        {(post.author || post.author_name) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 md:p-8 mb-8">
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
                  <a href={post.author_social_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 mt-2">
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

        {/* Related posts with pagination */}
        {relatedPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Read More</h2>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button onClick={handlePrevPage} disabled={currentPage === 1} className={`p-2 rounded-full ${currentPage === 1 ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"}`}>
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`p-2 rounded-full ${currentPage === totalPages ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"}`}>
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {relatedLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="small" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div key={relatedPost.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}>
                    <Link to={`/news/${relatedPost.id}`} className="group block rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all p-4 h-full">
                      <div className="h-40 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden mb-4">{relatedPost.cover_image ? <img src={relatedPost.cover_image} alt={relatedPost.title} className="w-full h-full object-cover" loading="lazy" /> : <BookOpenIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600" />}</div>
                      <h3 className="font-medium text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">{relatedPost.title}</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">{formatDate(relatedPost.publish_date)}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="hidden">{relatedPosts.map((relatedPost, index) => relatedPost.cover_image && <SecureImage key={`preload-related-${index}`} src={relatedPost.cover_image} preload={true} />)}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
