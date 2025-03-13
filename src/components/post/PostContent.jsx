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
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const contentRef = useRef(null);

  /// Deteksi apakah perangkat adalah mobile
  useEffect(() => {
    const checkIfMobile = () => {
      // Menggunakan kombinasi dari user agent dan ukuran layar untuk deteksi mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      setIsMobileDevice(isMobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Reset when page changes
  useEffect(() => {
    setSelectedText("");
  }, [contentPage]);

  /// Toggle highlight mode
  const toggleHighlightMode = () => {
    const newMode = !isHighlightMode;
    setIsHighlightMode(newMode);
    setHighlightMode(newMode); // Broadcast the change

    // Clear any existing selection
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  };

  /// Penanganan seleksi teks yang disederhanakan
  const handleTextSelection = () => {
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

  /// Event handler untuk mouse up (desktop)
  const handleMouseUp = (e) => {
    if (!isHighlightMode || isMobileDevice) return;
    handleTextSelection();
  };

  /// Event handler untuk touch end (mobile)
  const handleTouchEnd = (e) => {
    if (!isHighlightMode) return;

    // Untuk mobile, berikan waktu lebih lama untuk memastikan seleksi teks selesai
    setTimeout(() => {
      handleTextSelection();
    }, 200);
  };

  // Share quote button handler untuk tombol berbagi di setiap paragraf
  const handleShareQuote = (text) => {
    setSelectedText(text);
    setShowTextShareModal(true);
  };

  /// Fungsi untuk membuat ID yang konsisten dari judul
  const generateSectionId = (title) => {
    if (!title) return "";

    // Penanganan khusus untuk format tanggal di awal judul (seperti "5/29", "3/21 Deep Indigo")
    const dateMatch = title.match(/^(\d+)\/(\d+)(\s+.*)?$/);
    if (dateMatch) {
      // Format ID untuk judul dengan tanggal: [bulan]-[tanggal]-[teks tambahan jika ada]
      const month = dateMatch[1];
      const day = dateMatch[2];
      const restText = dateMatch[3]
        ? dateMatch[3]
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
        : "";

      return restText ? `${month}-${day}-${restText}` : `${month}-${day}`;
    }

    // Untuk judul lain, gunakan metode standar
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <>
      <ShareTextAsImage isOpen={showTextShareModal} onClose={() => setShowTextShareModal(false)} selectedText={selectedText} postTitle={post.title} />

      {/* Floating indicator that Quote Mode is active - lebih jelas di mobile */}
      <AnimatePresence>
        {isHighlightMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed left-0 right-0 mx-auto bottom-5 bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg z-30 flex items-center justify-center space-x-2 max-w-xs ${isMobileDevice ? "text-sm" : ""}`} style={{ width: isMobileDevice ? "calc(100% - 32px)" : "auto" }}>
            <span>✒️</span>
            <span>{isMobileDevice ? "Quote Mode - Select text to share" : "Quote Mode Active - Select text to share"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div ref={contentRef} key={`content-page-${contentPage}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-10 post-content mb-20" onMouseUp={handleMouseUp} onTouchEnd={handleTouchEnd}>
        {/* Cover image section */}
        {post.cover_image && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="mb-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg">
            <figure className="overflow-hidden">
              <SecureImage src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-500 ease-out" />
            </figure>
          </motion.div>
        )}

        {/* Highlight mode toggle button - lebih besar di mobile */}
        <div className="flex justify-end mb-4 items-center">
          <button
            onClick={toggleHighlightMode}
            className={`flex items-center px-3 py-1.5 ${isMobileDevice ? "py-2 px-4" : ""} text-sm rounded-full transition-colors
              ${isHighlightMode ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500" : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300"}`}
            style={{ minHeight: isMobileDevice ? "40px" : "auto" }}
          >
            <span className="mr-2">✒️</span>
            {isHighlightMode ? "Exit Quote Mode" : "Enter Quote Mode"}
          </button>
        </div>

        {/* Main content section dengan perbaikan CSS untuk seleksi teks */}
        <div
          className={`prose prose-neutral dark:prose-invert max-w-none
            [&_::selection]:bg-blue-500/20 dark:[&_::selection]:bg-blue-500/30
            [&_::selection]:text-neutral-900 dark:[&_::selection]:text-neutral-100
            ${isHighlightMode ? "quote-mode" : ""}`}
          style={{
            touchAction: "manipulation",
            WebkitUserSelect: isHighlightMode ? "text" : "auto",
            userSelect: isHighlightMode ? "text" : "auto",
          }}
        >
          {Array.isArray(post.content) ? (
            <>
              {post.content.slice((contentPage - 1) * sectionsPerPage, contentPage * sectionsPerPage).map((block, index) => {
                const originalIndex = post.content.indexOf(block);

                return (
                  <motion.div key={index} className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} ref={index === 0 ? sectionTitleRef : null}>
                    {/* Section title with data attributes for improved targeting */}
                    {block.title && (
                      <h3 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-4 scroll-mt-24" data-section-title={block.title} data-section-index={originalIndex} id={`section-${originalIndex}`}>
                        {block.title}
                      </h3>
                    )}

                    {/* Text block */}
                    {block.type === "text" && (
                      <div className="relative group">
                        {/* Share paragraph button hanya untuk tombol berbagi paragraf */}
                        <button
                          onClick={() => handleShareQuote(block.value || "")}
                          className={`absolute right-0 top-0 opacity-0 group-hover:opacity-100 
                          ${isMobileDevice ? "p-2" : "p-1.5"} bg-blue-100 dark:bg-blue-900/70 
                          rounded-full transform -translate-y-1/2 translate-x-1/2 transition-opacity`}
                          aria-label="Share this paragraph"
                          style={{ minWidth: isMobileDevice ? "32px" : "24px", minHeight: isMobileDevice ? "32px" : "24px" }}
                        >
                          <ShareIcon className={`${isMobileDevice ? "w-5 h-5" : "w-4 h-4"} text-blue-600 dark:text-blue-300`} />
                        </button>

                        {/* The paragraph itself - tanpa event handler onClick */}
                        <div
                          className={`leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line
                          ${isHighlightMode ? "cursor-text bg-transparent hover:bg-transparent" : ""}
                          ${block.format?.bold ? "font-bold" : ""}
                          ${block.format?.italic ? "italic" : ""}
                          ${block.format?.underline ? "underline" : ""}
                          ${block.format?.lineThrough ? "line-through" : ""}
                          ${block.format?.fontSize === "large" ? "text-lg" : block.format?.fontSize === "larger" ? "text-xl" : block.format?.fontSize === "largest" ? "text-2xl" : ""}`}
                          style={{
                            WebkitUserSelect: isHighlightMode ? "text" : "auto",
                            userSelect: isHighlightMode ? "text" : "auto",
                          }}
                        >
                          {block.format?.selections && block.format.selections.length > 0 ? renderFormattedText(block.value || "", block.format.selections) : block.value || ""}
                        </div>
                      </div>
                    )}

                    {/* Image block */}
                    {block.type === "image" && (
                      <figure className="my-8 flex flex-col items-center">
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                          <SecureImage src={block.url} alt={block.title || block.caption || ""} className="max-w-full h-auto max-h-96 object-scale-down rounded" />
                        </div>
                        {block.caption && <figcaption className="text-center text-neutral-600 dark:text-neutral-400 mt-3 text-sm italic">{block.caption}</figcaption>}
                      </figure>
                    )}
                  </motion.div>
                );
              })}

              {/* Content pagination dengan tombol yang lebih besar di mobile */}
              {post.content.length > sectionsPerPage && (
                <div className="flex items-center justify-center space-x-4 mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  {/* Tombol Previous dengan ukuran lebih besar untuk mobile */}
                  <button
                    onClick={() => navigateToContentPage(contentPage - 1)}
                    disabled={contentPage === 1}
                    aria-label="Previous page"
                    className={`flex items-center px-4 py-2 rounded-lg
                      ${isMobileDevice ? "min-h-[44px] min-w-[100px]" : ""} 
                      ${contentPage === 1 ? "text-neutral-400 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800" : "text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 shadow-sm hover:shadow"} transition-all`}
                  >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    <span>Previous</span>
                  </button>

                  {/* Indikator halaman saat ini */}
                  <span className="text-neutral-600 dark:text-neutral-400 px-2">
                    {contentPage} / {Math.ceil(post.content.length / sectionsPerPage)}
                  </span>

                  {/* Tombol Next dengan ukuran lebih besar untuk mobile */}
                  <button
                    onClick={() => navigateToContentPage(contentPage + 1)}
                    disabled={contentPage === Math.ceil(post.content.length / sectionsPerPage)}
                    aria-label="Next page"
                    className={`flex items-center px-4 py-2 rounded-lg
                      ${isMobileDevice ? "min-h-[44px] min-w-[100px]" : ""} 
                      ${contentPage === Math.ceil(post.content.length / sectionsPerPage) ? "text-neutral-400 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800" : "text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 shadow-sm hover:shadow"} transition-all`}
                  >
                    <span>Next</span>
                    <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Konten non-array, tanpa event handler onClick
            <div
              className="leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-line"
              style={{
                WebkitUserSelect: isHighlightMode ? "text" : "auto",
                userSelect: isHighlightMode ? "text" : "auto",
              }}
            >
              {String(post.content)}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
