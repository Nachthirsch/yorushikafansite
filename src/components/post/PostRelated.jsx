import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { ShareIcon } from "@heroicons/react/24/outline"; // Fix: Add missing ShareIcon import
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/dateFormat";
import SecureImage from "../SecureImage";
import { useState, useEffect, useRef } from "react";
import ShareTextAsImage from "./ShareTextAsImage";
import FloatingShareButton from "./FloatingShareButton";

export default function PostRelated({ relatedPosts, currentPage, totalPages, handlePrevPage, handleNextPage, isLoading, relatedPostsRef }) {
  const [selection, setSelection] = useState({
    text: "",
    position: { x: 0, y: 0 },
  });
  const [showTextShareModal, setShowTextShareModal] = useState(false);
  const [selectedPostTitle, setSelectedPostTitle] = useState("");
  const [isHighlightMode, setIsHighlightMode] = useState(false); // Added highlight mode state
  const [hasActiveSelection, setHasActiveSelection] = useState(false);
  const clickTimeoutRef = useRef(null);

  // Sync highlight mode with PostContent component
  useEffect(() => {
    const handleHighlightModeChange = (event) => {
      if (event.detail && typeof event.detail.isHighlightMode === "boolean") {
        setIsHighlightMode(event.detail.isHighlightMode);
      }
    };

    window.addEventListener("highlightModeChanged", handleHighlightModeChange);
    return () => window.removeEventListener("highlightModeChanged", handleHighlightModeChange);
  }, []);

  // Reset selection when page changes
  useEffect(() => {
    setSelection({ text: "", position: { x: 0, y: 0 } });
  }, [currentPage]);

  // Handle text selection via the selection API
  useEffect(() => {
    let timeoutId;

    function handleSelectionChange() {
      if (!relatedPostsRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const text = selection.toString().trim();

      if (text) {
        try {
          // Check if the selection is within our related posts area
          const range = selection.getRangeAt(0);
          const selectionNode = range.commonAncestorContainer;

          let node = selectionNode;
          let isInRelatedPosts = false;

          while (node != null) {
            if (node === relatedPostsRef.current || node.closest(".related-posts-container")) {
              isInRelatedPosts = true;
              break;
            }
            node = node.parentNode;
          }

          if (!isInRelatedPosts) return;

          // Set flag that we have an active selection
          setHasActiveSelection(true);

          // Get title and position...
          // ...existing code...

          const rect = range.getBoundingClientRect();
          const viewportX = Math.min(Math.max(rect.left + rect.width / 2, 50), window.innerWidth - 50);
          const viewportY = Math.max(rect.top + window.scrollY, window.scrollY + 100);

          setSelection({
            text,
            position: {
              x: viewportX,
              y: viewportY,
            },
          });
        } catch (err) {
          console.error("Error handling selection:", err);
        }
      } else {
        timeoutId = setTimeout(() => {
          setSelection({ text: "", position: { x: 0, y: 0 } });
          setHasActiveSelection(false);
        }, 250);
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [relatedPostsRef, currentPage]);

  const handleShare = () => {
    if (selection.text) {
      setShowTextShareModal(true);

      // Clear selection after sharing
      setTimeout(() => {
        window.getSelection().removeAllRanges();
      }, 100);
    }
  };

  // Handle selecting a specific card's description
  const handleShareCard = (description, title) => {
    setSelectedPostTitle(title);
    setShowTextShareModal(true);
    setSelection({
      text: description,
      position: { x: 0, y: 0 }, // We don't need position for direct sharing
    });
  };

  // Handle card click in highlight mode
  const handleCardClick = (e, description, title) => {
    if (!isHighlightMode) return;

    // If we have an active text selection, don't do anything
    if (hasActiveSelection) return;

    // Add delay to allow text selection to happen first
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      // Check if there's an active selection before sharing whole card
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (!selectedText) {
        handleShareCard(description, title);
      }
    }, 200);
  };

  return (
    <>
      <FloatingShareButton isVisible={!!selection.text} position={selection.position} onClick={handleShare} isQuoteMode={isHighlightMode} />
      <ShareTextAsImage isOpen={showTextShareModal} onClose={() => setShowTextShareModal(false)} selectedText={selection.text || ""} postTitle={selectedPostTitle} />

      <motion.div
        ref={relatedPostsRef}
        key={`related-page-${currentPage}`} // Add key to force remount on page change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 allow-select related-posts-container ${isHighlightMode ? "quote-mode" : ""}`}
        onMouseUp={isHighlightMode ? handleMouseUp : undefined}
      >
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

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="small" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 allow-select">
            {relatedPosts.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                className={`related-post-card ${isHighlightMode ? "quote-card" : ""}`} // Add class for selection detection
              >
                <div
                  className={`group block h-full rounded-xl bg-white dark:bg-neutral-800 shadow-sm 
                  border border-neutral-200 dark:border-neutral-700 hover:shadow-md 
                  transition-all duration-300 overflow-hidden allow-select relative
                  ${isHighlightMode ? "quote-card !cursor-text" : ""}`}
                >
                  {/* Link only when not in highlight mode */}
                  {!isHighlightMode ? (
                    <Link to={`/news/${relatedPost.id}`} className="block h-full">
                      {/* Card content */}
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
                      <div className="p-5 allow-select">
                        <h3
                          className="font-medium text-lg text-neutral-900 dark:text-neutral-100 
                          group-hover:text-neutral-600 dark:group-hover:text-neutral-400 
                          transition-colors line-clamp-2 allow-select related-post-title post-title"
                        >
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center mt-3 text-sm text-neutral-500 dark:text-neutral-400 allow-select">
                          <CalendarIcon className="w-4 h-4 mr-1.5" />
                          {formatDate(relatedPost.publish_date)}
                        </div>
                        {relatedPost.category && (
                          <div className="mt-3 allow-select">
                            <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">{relatedPost.category}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ) : (
                    // In highlight mode, use the improved click handler
                    <div className="block h-full" onClick={(e) => handleCardClick(e, `${relatedPost.title} - ${formatDate(relatedPost.publish_date)}`, relatedPost.title)}>
                      {/* Same card content as in Link */}
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
                      <div className="p-5 allow-select">
                        <h3
                          className="font-medium text-lg text-neutral-900 dark:text-neutral-100 
                          group-hover:text-neutral-600 dark:group-hover:text-neutral-400 
                          transition-colors line-clamp-2 allow-select related-post-title post-title"
                        >
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center mt-3 text-sm text-neutral-500 dark:text-neutral-400 allow-select">
                          <CalendarIcon className="w-4 h-4 mr-1.5" />
                          {formatDate(relatedPost.publish_date)}
                        </div>
                        {relatedPost.category && (
                          <div className="mt-3 allow-select">
                            <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">{relatedPost.category}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Share button that appears on hover */}
                  {!isHighlightMode && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShareCard(`${relatedPost.title} - ${formatDate(relatedPost.publish_date)}`, relatedPost.title);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 rounded-full
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                      aria-label="Share this post"
                    >
                      <ShareIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Hidden preload component for related post images */}
        <div className="hidden">{relatedPosts.map((relatedPost, index) => relatedPost.cover_image && <SecureImage key={`preload-related-${index}`} src={relatedPost.cover_image} preload={true} />)}</div>
      </motion.div>
    </>
  );
}
