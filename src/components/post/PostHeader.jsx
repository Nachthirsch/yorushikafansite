import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, TagIcon, CalendarIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { formatDate } from "../../utils/dateFormat";
import ShareOptions from "./ShareOptions";

export default function PostHeader({ post, getReadingTime }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");
      setIsBookmarked(bookmarks.includes(post.id));
    };
    checkBookmarkStatus();
  }, [post.id]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id) => id !== post.id);
    } else {
      newBookmarks = [...bookmarks, post.id];
    }

    localStorage.setItem("bookmarkedPosts", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <header className="relative pt-28 pb-24 mb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 z-0" />
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pattern-dots pattern-neutral-900 dark:pattern-neutral-100 pattern-size-2 pattern-bg-transparent z-0"></div>

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

              <ShareOptions isOpen={showShareOptions} onClose={() => setShowShareOptions(false)} post={post} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 allow-select">
          {post.category && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block px-4 py-1.5 rounded-full bg-neutral-200/80 backdrop-blur-sm dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-medium text-sm">
              <div className="flex items-center space-x-1.5">
                <TagIcon className="w-4 h-4" />
                <span className="allow-select">{post.category}</span>
              </div>
            </motion.div>
          )}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight allow-select">
            {post.title}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-600 dark:text-neutral-400 allow-select">
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
  );
}
