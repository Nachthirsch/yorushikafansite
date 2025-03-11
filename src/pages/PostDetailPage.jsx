import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon, UserIcon, TagIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import SecureImage, { preloadImage } from "../components/SecureImage";
import { usePost, useRelatedPosts, prefetchPost } from "../hooks/usePost";
import { preloadContentImages, preloadPostsImages } from "../utils/prefetchUtils";
import { useQueryClient } from "@tanstack/react-query";
import useReadingProgress from "../hooks/useReadingProgress";

export default function PostDetailPage() {
  const { postId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const sectionTitleRef = useRef(null);
  const relatedPostsRef = useRef(null);
  const pageSize = 3; // Number of related posts per page
  const sectionsPerPage = 2; // Number of content sections per page
  const queryClient = useQueryClient();
  const completion = useReadingProgress(); // Use the new reading progress hook

  // Add scroll effect when contentPage changes
  useEffect(() => {
    if (sectionTitleRef.current) {
      sectionTitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [contentPage]);

  // Check if post is bookmarked on initial load
  useEffect(() => {
    const checkBookmarkStatus = () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");
      setIsBookmarked(bookmarks.includes(postId));
    };

    checkBookmarkStatus();
  }, [postId]);

  // Setup reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      // This would be implemented in a real useReadingProgress hook
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Handle pagination with scroll to top
  const handleNextPage = () => {
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, totalPages);
      if (newPage !== prev) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      return newPage;
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      if (newPage !== prev) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      return newPage;
    });
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

  // Function to handle content page navigation with preloading and scroll to top
  const navigateToContentPage = (newPage) => {
    const totalContentPages = Math.ceil((post?.content?.length || 0) / sectionsPerPage);

    if (newPage >= 1 && newPage <= totalContentPages) {
      setContentPage(newPage);

      // Scroll to the top of the page (header)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Preload the page after the new page we're navigating to
      if (newPage < totalContentPages) {
        const pageToPreload = newPage + 1;
        const preloadContent = post.content.slice((pageToPreload - 1) * sectionsPerPage, pageToPreload * sectionsPerPage);

        preloadContentImages(preloadContent);
      }
    }
  };

  // Share functionality
  const sharePost = (platform) => {
    const postUrl = window.location.href;
    const shareText = `Check out this post: ${post.title}`;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard
          .writeText(postUrl)
          .then(() => {
            alert("Link copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy link: ", err);
          });
        break;
      default:
        if (navigator.share) {
          navigator
            .share({
              title: post.title,
              text: shareText,
              url: postUrl,
            })
            .catch((error) => console.log("Error sharing", error));
        }
        break;
    }
    setShowShareOptions(false);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id) => id !== postId);
    } else {
      newBookmarks = [...bookmarks, postId];
    }

    localStorage.setItem("bookmarkedPosts", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
        <div className="mb-4 text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">Post not found</p>
        <Link to="/news" className="mt-6 px-5 py-2.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200">
          Return to News
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative">
      {/* Reading progress indicator */}
      <div className="fixed top-0 left-0 z-50 w-full h-1 bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full bg-gradient-to-r from-neutral-500 via-neutral-600 to-neutral-800 dark:from-neutral-400 dark:via-neutral-500 dark:to-neutral-600"
          style={{ width: `${completion}%` }} // Now uses the reading progress value
        />
      </div>

      <header className="relative pt-28 pb-24 mb-16 overflow-hidden">
        {/* Enhanced layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 z-0" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pattern-dots pattern-neutral-900 dark:pattern-neutral-100 pattern-size-2 pattern-bg-transparent z-0"></div>

        {/* Cover image background */}
        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute inset-0 z-0 overflow-hidden">
          {post.cover_image && (
            <div className="absolute inset-0 opacity-10 dark:opacity-8">
              <div className="absolute inset-0 backdrop-blur-xl"></div>
              <img src={post.cover_image} alt="" className="w-full h-full object-cover transform scale-105" />
            </div>
          )}
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-center mb-8">
            <Link
              to="/news"
              className="inline-flex items-center text-neutral-600 hover:text-neutral-800 
              dark:text-neutral-400 dark:hover:text-neutral-200 text-base font-medium py-2 
              px-3 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
              shadow-sm border border-neutral-200 dark:border-neutral-700
              transition-all duration-200 hover:shadow"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to News
            </Link>

            <div className="flex space-x-2">
              <button
                onClick={toggleBookmark}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                        shadow-sm border border-neutral-200 dark:border-neutral-700
                        text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200
                        transition-all duration-200 hover:shadow"
              >
                {isBookmarked ? <BookmarkSolidIcon className="w-5 h-5" /> : <BookmarkIcon className="w-5 h-5" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  aria-label="Share this post"
                  className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                        shadow-sm border border-neutral-200 dark:border-neutral-700
                        text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200
                        transition-all duration-200 hover:shadow"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg 
                                border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => sharePost("twitter")}
                          className="flex items-center w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 
                                   hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                          Twitter
                        </button>
                        <button
                          onClick={() => sharePost("facebook")}
                          className="flex items-center w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 
                                   hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                          Facebook
                        </button>
                        <button
                          onClick={() => sharePost("whatsapp")}
                          className="flex items-center w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 
                                   hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          WhatsApp
                        </button>
                        <button
                          onClick={() => sharePost("telegram")}
                          className="flex items-center w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 
                                   hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                          </svg>
                          Telegram
                        </button>
                        <button
                          onClick={() => sharePost("copy")}
                          className="flex items-center w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 
                                   hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            {/* Category badge with enhanced design */}
            {post.category && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block px-4 py-1.5 rounded-full bg-neutral-200/80 backdrop-blur-sm dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 text-sm font-medium shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <TagIcon className="w-4 h-4" />
                  <span>{post.category}</span>
                </div>
              </motion.div>
            )}

            {/* Enhanced title with better typography */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
              {post.title}
            </motion.h1>

            {/* Enhanced metadata row with improved spacing and dividers */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-600 dark:text-neutral-400 pt-2">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-500" />
                <span>{formatDate(post.publish_date)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-500" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>

              {(post.author || post.author_name) && (
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-500" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{post.author || post.author_name}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Content Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 mb-10">
          {post.cover_image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="mb-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg">
              <figure className="overflow-hidden">
                <SecureImage src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-500 ease-out" />
              </figure>
            </motion.div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none select-auto">
            {Array.isArray(post.content) ? (
              <>
                {post.content.slice((contentPage - 1) * sectionsPerPage, contentPage * sectionsPerPage).map((block, index) => (
                  <motion.div key={index} className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} ref={index === 0 ? sectionTitleRef : null}>
                    {block.title && (
                      <h3 id={block.title.toLowerCase().replace(/\s+/g, "-")} className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                        {block.title}
                      </h3>
                    )}

                    {block.type === "text" && (
                      <div
                        className={`leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line
                          ${block.format?.bold ? "font-bold" : ""}
                          ${block.format?.italic ? "italic" : ""}
                          ${block.format?.underline ? "underline" : ""}
                          ${block.format?.fontSize === "large" ? "text-lg" : block.format?.fontSize === "larger" ? "text-xl" : block.format?.fontSize === "largest" ? "text-2xl" : ""}`}
                      >
                        {block.format?.selections && block.format.selections.length > 0 ? renderFormattedText(block.value || "", block.format.selections) : block.value || ""}
                      </div>
                    )}

                    {block.type === "image" && (
                      <figure className="my-8 flex flex-col items-center">
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                          <SecureImage src={block.url} alt={block.title || block.caption || ""} className="max-w-full h-auto max-h-96 object-scale-down rounded" />
                        </div>
                        {block.caption && <figcaption className="text-center text-neutral-600 dark:text-neutral-400 mt-3 text-sm italic">{block.caption}</figcaption>}
                      </figure>
                    )}
                  </motion.div>
                ))}

                {/* Hidden preload component for next page images */}
                {Array.isArray(post.content) && contentPage < Math.ceil(post.content.length / sectionsPerPage) && <div className="hidden">{post.content.slice(contentPage * sectionsPerPage, (contentPage + 1) * sectionsPerPage).map((block, i) => block.type === "image" && <SecureImage key={`preload-${i}`} src={block.url} preload={true} />)}</div>}

                {/* Content pagination */}
                {Array.isArray(post.content) && post.content.length > sectionsPerPage && (
                  <div className="flex items-center justify-center space-x-4 mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <button onClick={() => navigateToContentPage(contentPage - 1)} disabled={contentPage === 1} aria-label="Previous page" className={`flex items-center px-4 py-2 rounded-lg ${contentPage === 1 ? "text-neutral-400 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800" : "text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"} transition-colors`}>
                      <ChevronLeftIcon className="w-5 h-5 mr-1" />
                      <span>Previous</span>
                    </button>

                    <span className="text-neutral-600 dark:text-neutral-400">
                      {contentPage} / {Math.ceil(post.content.length / sectionsPerPage)}
                    </span>

                    <button onClick={() => navigateToContentPage(contentPage + 1)} disabled={contentPage === Math.ceil(post.content.length / sectionsPerPage)} aria-label="Next page" className={`flex items-center px-4 py-2 rounded-lg ${contentPage === Math.ceil(post.content.length / sectionsPerPage) ? "text-neutral-400 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800" : "text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"} transition-colors`}>
                      <span>Next</span>
                      <ChevronRightIcon className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-line">{String(post.content)}</div>
            )}
          </div>
        </motion.div>

        {/* Author info section with enhanced design */}
        {(post.author || post.author_name) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 mb-10">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">About the Author</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {post.author_image ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700">
                  <img src={post.author_image} alt={post.author || post.author_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-full flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                  <span className="text-2xl text-white font-medium">{(post.author || post.author_name || "A").charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-xl text-neutral-900 dark:text-neutral-100 mb-2">{post.author || post.author_name}</h3>
                {post.author_bio && <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">{post.author_bio}</p>}
                {post.author_social_link && (
                  <a href={post.author_social_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200">
                    <span>Follow</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Related posts with improved cards */}
        {relatedPosts.length > 0 && (
          <motion.div ref={relatedPostsRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Read More</h2>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Previous page" className={`p-2 rounded-full ${currentPage === 1 ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Next page" className={`p-2 rounded-full ${currentPage === totalPages ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
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
                    <Link
                      to={`/news/${relatedPost.id}`}
                      className="group block h-full rounded-xl bg-white dark:bg-neutral-800 shadow-sm 
                        border border-neutral-200 dark:border-neutral-700 hover:shadow-md 
                        transition-all duration-300 overflow-hidden"
                    >
                      <div
                        className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-neutral-100 
                          dark:bg-neutral-700 overflow-hidden"
                      >
                        {relatedPost.cover_image ? (
                          <img src={relatedPost.cover_image} alt={relatedPost.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out" />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-neutral-200 dark:bg-neutral-700">
                            <BookOpenIcon className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3
                          className="font-medium text-lg text-neutral-900 dark:text-neutral-100 
                            group-hover:text-neutral-600 dark:group-hover:text-neutral-400 
                            transition-colors line-clamp-2"
                        >
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                          <CalendarIcon className="w-4 h-4 mr-1.5" />
                          {formatDate(relatedPost.publish_date)}
                        </div>
                        {relatedPost.category && (
                          <div className="mt-3">
                            <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">{relatedPost.category}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Hidden preload component for related post images */}
            <div className="hidden">{relatedPosts.map((relatedPost, index) => relatedPost.cover_image && <SecureImage key={`preload-related-${index}`} src={relatedPost.cover_image} preload={true} />)}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Improved renderFormattedText function with better font size support
function renderFormattedText(text, selections) {
  if (!selections?.length) return text;

  try {
    let result = [];
    let lastIndex = 0;

    // Sort selections by start position
    const sortedSelections = [...selections].sort((a, b) => a.start - b.start);

    // Filter out invalid selections
    const validSelections = sortedSelections.filter((sel) => sel.start >= 0 && sel.end <= text.length && sel.start < sel.end);

    validSelections.forEach((selection, index) => {
      // Add unformatted text before selection
      if (selection.start > lastIndex) {
        result.push(text.substring(lastIndex, selection.start));
      }

      // Get font size class based on selection's fontSize
      const fontSizeClass = selection.fontSize === "large" ? "text-lg" : selection.fontSize === "larger" ? "text-xl" : selection.fontSize === "largest" ? "text-2xl" : "";

      // Add formatted selection
      const formattedText = text.substring(selection.start, selection.end);
      result.push(
        <span
          key={`sel-${index}`}
          className={`
            ${selection.bold ? "font-bold" : ""}
            ${selection.italic ? "italic" : ""}
            ${selection.underline ? "underline" : ""}
            ${fontSizeClass}
          `}
        >
          {formattedText}
        </span>
      );

      lastIndex = selection.end;
    });

    // Add remaining unformatted text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result;
  } catch (err) {
    console.error("Error rendering formatted text:", err);
    return text; // Fallback to plain text
  }
}
