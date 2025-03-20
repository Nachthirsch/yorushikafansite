import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Share, Edit, X } from "lucide-react"; // Menggunakan Lucide React icons
import SecureImage from "../SecureImage";
import { useRef, useState, useEffect } from "react";
import ShareTextAsImage from "./ShareTextAsImage";
import { setHighlightMode } from "../../utils/eventBus";
import "./tiptap-content.css"; // Import file CSS terpisah untuk styling TipTap

/**
 * Komponen untuk menampilkan konten posting blog
 * Didesain dengan pendekatan minimalis artistik dengan elemen dekoratif
 * Mendukung mode highlight untuk berbagi kutipan teks
 * Mendukung konten HTML dari TipTap editor
 */
export default function PostContent({ post, contentPage, sectionsPerPage, navigateToContentPage, renderFormattedText, sectionTitleRef, onShare }) {
  const [showTextShareModal, setShowTextShareModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const contentRef = useRef(null);

  // State untuk menyimpan judul section saat ini (jika ada)
  const [currentSectionTitle, setCurrentSectionTitle] = useState("");

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

  /// Fungsi untuk ekstrak teks murni dari HTML untuk berbagi kutipan
  const getTextFromHtml = (html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  /// Penanganan seleksi teks yang disederhanakan, sekarang mendukung konten HTML
  const handleTextSelection = () => {
    if (!isHighlightMode) return;

    // Small delay to let the selection finalize
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText) {
        setSelectedText(selectedText);

        // Mencoba mendapatkan judul section tempat teks diseleksi
        let currentTitle = "";
        try {
          const selectionNode = selection?.anchorNode?.parentElement;
          if (selectionNode) {
            // Cari elemen heading terdekat di atas seleksi
            let node = selectionNode;
            while (node && node !== contentRef.current) {
              const prevSibling = node.previousElementSibling;
              if (prevSibling && prevSibling.getAttribute("data-section-title")) {
                currentTitle = prevSibling.getAttribute("data-section-title");
                break;
              }
              node = node.parentElement;
            }
          }
        } catch (e) {
          console.error("Error saat mencari judul section:", e);
        }

        setCurrentSectionTitle(currentTitle || "");
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
  const handleShareQuote = (text, sectionTitle) => {
    // Ekstrak teks dari HTML jika konten adalah HTML
    const plainText = getTextFromHtml(text);
    setSelectedText(plainText);
    setCurrentSectionTitle(sectionTitle || "");
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

      {/* Floating indicator that Quote Mode is active - dengan desain artistik */}
      <AnimatePresence>
        {isHighlightMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed left-0 right-0 mx-auto bottom-5 bg-neutral-800 dark:bg-neutral-700 
                      text-white py-2 px-4 shadow-lg z-30 flex items-center justify-center 
                      space-x-2 max-w-xs ${isMobileDevice ? "text-sm" : ""}`}
            style={{ width: isMobileDevice ? "calc(100% - 32px)" : "auto" }}
          >
            {/* Elemen dekoratif di sudut kiri atas */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-neutral-500"></div>

            {/* Elemen dekoratif di sudut kanan bawah */}
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-neutral-500"></div>

            {/* Icon Edit dari Lucide React untuk menunjukkan mode kutipan */}
            <Edit className="w-4 h-4" />
            <span>{isMobileDevice ? "Quote Mode - Select text to share" : "Quote Mode Active - Select text to share"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={contentRef}
        key={`content-page-${contentPage}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 
                  dark:border-neutral-800 p-6 md:p-10 post-content mb-20 relative"
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        {/* Elemen dekoratif di pojok kiri atas */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neutral-300 dark:border-neutral-700"></div>

        {/* Elemen dekoratif di pojok kanan bawah */}
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neutral-300 dark:border-neutral-700"></div>

        {/* Cover image section dengan desain kotak */}
        {post.cover_image && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="mb-10 overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg relative">
            {/* Elemen dekoratif di pojok kiri atas gambar */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-400/30 dark:border-neutral-600/30 z-10"></div>

            {/* Elemen dekoratif di pojok kanan bawah gambar */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-400/30 dark:border-neutral-600/30 z-10"></div>

            <figure className="overflow-hidden">
              <SecureImage src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-500 ease-out" />
            </figure>
          </motion.div>
        )}

        {/* Highlight mode toggle button - dengan desain artistik */}
        <div className="flex justify-end mb-6 items-center">
          <button
            onClick={toggleHighlightMode}
            className={`flex items-center px-3 py-1.5 ${isMobileDevice ? "py-2 px-4" : ""} text-sm
              relative overflow-hidden transition-colors border
              ${isHighlightMode ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-600" : "bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"}`}
            style={{ minHeight: isMobileDevice ? "40px" : "auto" }}
            aria-pressed={isHighlightMode}
            aria-label={isHighlightMode ? "Exit quote mode" : "Enter quote mode"}
          >
            {/* Elemen dekoratif di pojok kiri atas tombol */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-neutral-400 dark:border-neutral-500"></div>

            {/* Icon Edit dari Lucide React untuk tombol mode kutipan */}
            <Edit className="w-4 h-4 mr-2" />
            {isHighlightMode ? "Exit Quote Mode" : "Enter Quote Mode"}
          </button>
        </div>

        {/* Main content section dengan perbaikan CSS untuk seleksi teks dan dukungan untuk konten HTML dari TipTap */}
        <div
          className={`prose prose-neutral dark:prose-invert max-w-none text-justify
                     [&_::selection]:bg-neutral-200 dark:[&_::selection]:bg-neutral-700
                     [&_::selection]:text-neutral-900 dark:[&_::selection]:text-neutral-100
                     [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:mb-4 [&_h1]:mt-6
                     [&_h2]:text-xl [&_h2]:font-medium [&_h2]:mb-3 [&_h2]:mt-5
                     [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:dark:border-neutral-600 
                     [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-700 [&_blockquote]:dark:text-neutral-300
                     [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
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
                    {/* Section title with data attributes and artistic design */}
                    {block.title && (
                      <h3
                        className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-4 
                                 scroll-mt-24 pb-2 relative"
                        data-section-title={block.title}
                        data-section-index={originalIndex}
                        id={`section-${originalIndex}`}
                      >
                        {/* Garis dekoratif di bawah judul section */}
                        <div className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-neutral-400 to-transparent dark:from-neutral-600 dark:to-transparent"></div>
                        {block.title}
                      </h3>
                    )}

                    {/* Text block - Sekarang mendukung konten HTML dari TipTap */}
                    {block.type === "text" && (
                      <div className="relative group">
                        {/* Share paragraph button dengan desain baru */}
                        <button
                          onClick={() => handleShareQuote(block.value || "", block.title)}
                          className={`absolute right-0 top-0 opacity-0 group-hover:opacity-100 
                                    ${isMobileDevice ? "p-2" : "p-1.5"} bg-neutral-100 dark:bg-neutral-800 
                                    border border-neutral-300 dark:border-neutral-700
                                    transform -translate-y-1/2 translate-x-1/2 transition-opacity`}
                          aria-label="Share this paragraph"
                          style={{ minWidth: isMobileDevice ? "32px" : "24px", minHeight: isMobileDevice ? "32px" : "24px" }}
                        >
                          {/* Icon Share dari Lucide React untuk berbagi paragraf */}
                          <Share className={`${isMobileDevice ? "w-5 h-5" : "w-4 h-4"} text-neutral-700 dark:text-neutral-300`} />
                        </button>

                        {/* Konten HTML dari TipTap dengan styling yang sesuai */}
                        <div
                          className={`tiptap-content text-neutral-800 dark:text-neutral-200 text-justify
                                 ${isHighlightMode ? "cursor-text bg-transparent hover:bg-transparent" : ""}`}
                          style={{
                            WebkitUserSelect: isHighlightMode ? "text" : "auto",
                            userSelect: isHighlightMode ? "text" : "auto",
                          }}
                          dangerouslySetInnerHTML={{ __html: block.value || "" }}
                        />

                        {/* Fallback untuk backward compatibility dengan format lama */}
                        {!block.value && block.format?.selections && block.format.selections.length > 0 && (
                          <div
                            className={`whitespace-pre-line text-justify
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
                            {renderFormattedText(block.value || "", block.format.selections)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image block dengan desain kotak */}
                    {block.type === "image" && (
                      <figure className="my-8 flex flex-col items-center">
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-2 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                          {/* Elemen dekoratif di pojok kiri atas */}
                          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-neutral-400/30 dark:border-neutral-600/30"></div>

                          {/* Elemen dekoratif di pojok kanan bawah */}
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-neutral-400/30 dark:border-neutral-600/30"></div>

                          <SecureImage src={block.url} alt={block.title || block.caption || ""} className="max-w-full h-auto max-h-96 object-scale-down" />
                        </div>
                        {block.caption && <figcaption className="text-center text-neutral-600 dark:text-neutral-400 mt-3 text-sm italic">{block.caption}</figcaption>}
                      </figure>
                    )}
                  </motion.div>
                );
              })}

              {/* Content pagination dengan desain yang lebih artistik */}
              {post.content.length > sectionsPerPage && (
                <div className="flex items-center justify-center space-x-4 mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  {/* Tombol Previous dengan desain artistik minimalis */}
                  <button
                    onClick={() => navigateToContentPage(contentPage - 1)}
                    disabled={contentPage === 1}
                    aria-label="Previous page"
                    className={`flex items-center px-4 py-2 border
                              ${isMobileDevice ? "min-h-[44px] min-w-[100px]" : ""} 
                              ${contentPage === 1 ? "text-neutral-400 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" : "text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 shadow-sm hover:shadow border-neutral-300 dark:border-neutral-600"} 
                              transition-all relative`}
                  >
                    {/* Elemen dekoratif di pojok kiri atas */}
                    {contentPage !== 1 && <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-neutral-400 dark:border-neutral-500"></div>}

                    {/* Icon ChevronLeft dari Lucide React untuk navigasi halaman */}
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Previous</span>
                  </button>

                  {/* Indikator halaman saat ini dengan desain artistik */}
                  <span className="text-neutral-600 dark:text-neutral-400 px-2 border-b border-dashed border-neutral-300 dark:border-neutral-600">
                    {contentPage} / {Math.ceil(post.content.length / sectionsPerPage)}
                  </span>

                  {/* Tombol Next dengan desain artistik minimalis */}
                  <button
                    onClick={() => navigateToContentPage(contentPage + 1)}
                    disabled={contentPage === Math.ceil(post.content.length / sectionsPerPage)}
                    aria-label="Next page"
                    className={`flex items-center px-4 py-2 border
                              ${isMobileDevice ? "min-h-[44px] min-w-[100px]" : ""} 
                              ${contentPage === Math.ceil(post.content.length / sectionsPerPage) ? "text-neutral-400 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" : "text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 shadow-sm hover:shadow border-neutral-300 dark:border-neutral-600"} 
                              transition-all relative`}
                  >
                    {/* Elemen dekoratif di pojok kanan bawah */}
                    {contentPage !== Math.ceil(post.content.length / sectionsPerPage) && <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neutral-400 dark:border-neutral-500"></div>}

                    <span>Next</span>
                    {/* Icon ChevronRight dari Lucide React untuk navigasi halaman */}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Konten non-array, dengan styling yang konsisten
            <div
              className="whitespace-pre-line text-justify text-neutral-900 dark:text-neutral-100"
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
