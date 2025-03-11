import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import SecureImage, { preloadImage } from "../components/SecureImage";
import { usePost, useRelatedPosts, prefetchPost } from "../hooks/usePost";
import { preloadContentImages, preloadPostsImages } from "../utils/prefetchUtils";
import { useQueryClient } from "@tanstack/react-query";
import useReadingProgress from "../hooks/useReadingProgress";
import PostHeader from "../components/post/PostHeader";
import PostContent from "../components/post/PostContent";
import PostRelated from "../components/post/PostRelated";
import ReadingProgress from "../components/post/ReadingProgress";
import PostAuthor from "../components/post/PostAuthor";
import ShareOptions from "../components/post/ShareOptions";

export default function PostDetailPage() {
  const { postId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [selectedShareText, setSelectedShareText] = useState("");
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

  // Share handlers
  const handlePostShare = () => {
    setSelectedShareText("");
    setShowShareOptions(true);
  };

  const handleTextShare = (text) => {
    setSelectedShareText(text);
    setShowShareOptions(true);
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
      <ReadingProgress completion={completion} />
      <PostHeader post={post} onShare={handlePostShare} getReadingTime={getReadingTime} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <PostContent post={post} contentPage={contentPage} sectionsPerPage={sectionsPerPage} navigateToContentPage={navigateToContentPage} renderFormattedText={renderFormattedText} sectionTitleRef={sectionTitleRef} onShare={handleTextShare} />

        {/* Author section */}
        {(post.author || post.author_name) && <PostAuthor post={post} />}

        {/* Related posts section */}
        {relatedPosts.length > 0 && <PostRelated relatedPosts={relatedPosts} currentPage={currentPage} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} isLoading={relatedLoading} relatedPostsRef={relatedPostsRef} />}

        <ShareOptions isOpen={showShareOptions} onClose={() => setShowShareOptions(false)} post={post} selectedText={selectedShareText} />
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
