import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import SecureImage from "../SecureImage";
import { useRef, useState, useEffect } from "react";
import FloatingShareButton from "./FloatingShareButton";

export default function PostContent({ post, contentPage, sectionsPerPage, navigateToContentPage, renderFormattedText, sectionTitleRef, onShare }) {
  const [selection, setSelection] = useState({
    text: "",
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    let timeoutId;

    function handleSelectionChange() {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text) {
        // Clear any existing timeout to prevent flickering
        if (timeoutId) clearTimeout(timeoutId);

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Calculate position relative to viewport for fixed positioning
        const viewportX = Math.min(Math.max(rect.left + rect.width / 2, 50), window.innerWidth - 50);
        const viewportY = Math.max(rect.top + window.scrollY, window.scrollY + 100);

        setSelection({
          text,
          position: {
            x: viewportX,
            y: viewportY,
          },
        });
      } else {
        // Add small delay before hiding to prevent flickering during selection
        timeoutId = setTimeout(() => {
          setSelection({ text: "", position: { x: 0, y: 0 } });
        }, 250);
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleShare = () => {
    if (selection.text) {
      onShare(selection.text);
      window.getSelection().removeAllRanges();
      setSelection({ text: "", position: { x: 0, y: 0 } });
    }
  };

  return (
    <>
      <FloatingShareButton isVisible={!!selection.text} position={selection.position} onClick={handleShare} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 mb-10">
        {post.cover_image && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="mb-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg">
            <figure className="overflow-hidden">
              <SecureImage src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-500 ease-out" />
            </figure>
          </motion.div>
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none select-auto
          [&_::selection]:bg-blue-500/20 dark:[&_::selection]:bg-blue-500/30
          [&_::selection]:text-neutral-900 dark:[&_::selection]:text-neutral-100"
        >
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
            <div className="leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-line">{String(post.content)}</div>
          )}
        </div>
      </motion.div>
    </>
  );
}
