import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, ShareIcon } from "@heroicons/react/24/solid";
import SecureImage from "../SecureImage";
import { useRef, useState, useEffect } from "react";
import ShareTextAsImage from "./ShareTextAsImage";
import { setHighlightMode } from "../../utils/eventBus";

export default function PostContent({ post, contentPage, sectionsPerPage, navigateToContentPage, renderFormattedText, sectionTitleRef, onShare }) {
  const [showTextShareModal, setShowTextShareModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const contentRef = useRef(null);

  // Reset when page changes
  useEffect(() => {
    setSelectedText("");
  }, [contentPage]);

  // Toggle highlight mode
  const toggleHighlightMode = () => {
    const newMode = !isHighlightMode;
    setIsHighlightMode(newMode);
    setHighlightMode(newMode); // Broadcast the change

    // Clear any existing selection
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  };

  // When in highlight mode, use mouseup to detect text selection
  const handleMouseUp = (e) => {
    if (!isHighlightMode) return;

    // Small delay to let the selection finalize
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText) {
        setSelectedText(selectedText);
        setShowTextShareModal(true);

        // Clear selection after a brief delay
        setTimeout(() => {
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          }
        }, 100);
      }
    }, 50);
  };

  // Handle paragraph click in highlight mode (for full paragraph)
  const handleParagraphClick = (e, paragraphText) => {
    // Only in highlight mode and only if no text is selected
    if (!isHighlightMode) return;

    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().trim().length > 0;

    // If there's a text selection, don't share the whole paragraph
    if (hasSelection) return;

    // Share the full paragraph
    setSelectedText(paragraphText);
    setShowTextShareModal(true);
  };

  // Share quote button handler for explicit share
  const handleShareQuote = (text) => {
    setSelectedText(text);
    setShowTextShareModal(true);
  };

  return (
    <>
      <ShareTextAsImage isOpen={showTextShareModal} onClose={() => setShowTextShareModal(false)} selectedText={selectedText} postTitle={post.title} />

      {/* Floating indicator that Quote Mode is active */}
      <AnimatePresence>
        {isHighlightMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="quote-mode-active-indicator">
            <span>✒️</span>
            <span>Quote Mode Active - Select text or click paragraph</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div ref={contentRef} key={`content-page-${contentPage}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-10 allow-select post-content" onMouseUp={handleMouseUp}>
        {post.cover_image && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="mb-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg">
            <figure className="overflow-hidden">
              <SecureImage src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-500 ease-out" />
            </figure>
          </motion.div>
        )}

        {/* Highlight mode toggle button - slightly improved styling */}
        <div className="flex justify-end mb-4 items-center">
          <button
            onClick={toggleHighlightMode}
            className={`flex items-center px-3 py-1.5 text-sm rounded-full transition-colors
              ${isHighlightMode ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500" : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300"}`}
          >
            <span className="mr-2">✒️</span>
            {isHighlightMode ? "Exit Quote Mode" : "Enter Quote Mode"}
          </button>
        </div>

        <div
          className={`prose prose-neutral dark:prose-invert max-w-none allow-select
            [&_::selection]:bg-blue-500/20 dark:[&_::selection]:bg-blue-500/30
            [&_::selection]:text-neutral-900 dark:[&_::selection]:text-neutral-100
            ${isHighlightMode ? "quote-mode" : ""}`}
        >
          {Array.isArray(post.content) ? (
            <>
              {post.content.slice((contentPage - 1) * sectionsPerPage, contentPage * sectionsPerPage).map((block, index) => (
                <motion.div key={index} className="mb-10 allow-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} ref={index === 0 ? sectionTitleRef : null}>
                  {block.title && (
                    <h3 id={block.title.toLowerCase().replace(/\s+/g, "-")} className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-4 allow-select">
                      {block.title}
                    </h3>
                  )}

                  {block.type === "text" && (
                    <div className="relative group">
                      {/* Share paragraph button visible in all modes */}
                      <button
                        onClick={() => handleShareQuote(block.value || "")}
                        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-1.5 bg-blue-100 dark:bg-blue-900/70 
                          rounded-full transform -translate-y-1/2 translate-x-1/2 transition-opacity"
                        aria-label="Share this paragraph"
                      >
                        <ShareIcon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                      </button>

                      {/* The paragraph itself - simplified event handling */}
                      <div
                        onClick={(e) => handleParagraphClick(e, block.value || "")}
                        className={`leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line allow-select
                          ${isHighlightMode ? "cursor-text hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors p-2 -m-2 rounded relative quote-paragraph" : ""}
                          ${block.format?.bold ? "font-bold" : ""}
                          ${block.format?.italic ? "italic" : ""}
                          ${block.format?.underline ? "underline" : ""}
                          ${block.format?.fontSize === "large" ? "text-lg" : block.format?.fontSize === "larger" ? "text-xl" : block.format?.fontSize === "largest" ? "text-2xl" : ""}`}
                      >
                        {block.format?.selections && block.format.selections.length > 0 ? renderFormattedText(block.value || "", block.format.selections) : block.value || ""}
                      </div>
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

              {/* Content pagination */}
              {post.content.length > sectionsPerPage && (
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
            <div
              onClick={(e) => handleParagraphClick(e, String(post.content))}
              className={`leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-line allow-select
                ${isHighlightMode ? "cursor-text hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors p-2 -m-2 rounded relative quote-paragraph" : ""}`}
            >
              {String(post.content)}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
