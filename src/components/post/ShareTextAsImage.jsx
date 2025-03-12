import { useRef, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function ShareTextAsImage({ isOpen, onClose, selectedText, postTitle }) {
  const cardRef = useRef(null);
  const [theme, setTheme] = useState("dark"); // dark, light, gradient
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [error, setError] = useState(null);
  const [decoration, setDecoration] = useState("corner"); // corner, border, dots, none

  // Additional refs for image generation
  const fullImageRef = useRef(null);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setGeneratedImage(null);
      setIsGenerating(false);
      setShowSocialOptions(false);
      setError(null);
    }
  }, [isOpen]);

  // Enhanced theme styles with decorative elements
  const themeStyles = {
    dark: {
      background: "linear-gradient(to bottom right, #1f2937, #111827)",
      color: "#ffffff",
      metaColor: "#d1d5db",
      footerBg: "rgba(255, 255, 255, 0.2)",
      accentColor: "#60a5fa",
      borderColor: "rgba(255, 255, 255, 0.1)",
      quotesColor: "rgba(255, 255, 255, 0.07)",
    },
    light: {
      background: "#ffffff",
      color: "#1f2937",
      metaColor: "#6b7280",
      footerBg: "rgba(0, 0, 0, 0.05)",
      accentColor: "#3b82f6",
      borderColor: "rgba(0, 0, 0, 0.08)",
      quotesColor: "rgba(0, 0, 0, 0.04)",
    },
    gradient: {
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      color: "#ffffff",
      metaColor: "#e9d5ff",
      footerBg: "rgba(255, 255, 255, 0.2)",
      accentColor: "#c4b5fd",
      borderColor: "rgba(255, 255, 255, 0.15)",
      quotesColor: "rgba(255, 255, 255, 0.1)",
    },
  };

  const generateImage = async () => {
    if (!fullImageRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Ensure fonts are loaded first
      await document.fonts.ready;

      // 2. Wait a bit for any final rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Generate image using html-to-image with optimized settings
      const dataUrl = await toPng(fullImageRef.current, {
        quality: 0.95,
        pixelRatio: 3,
        cacheBust: true, // Prevent caching issues
        includeQueryParams: true, // Include background images
        fontEmbedCSS: true, // Embed fonts
        skipAutoScale: true,
        style: {
          // Override any problematic styles during capture
          opacity: "1",
          visibility: "visible",
        },
      });

      // 4. Set generated image and show preview
      setGeneratedImage(dataUrl);

      // 5. Download the image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `yorushika-quote-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 6. Show social sharing options
      setShowSocialOptions(true);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to share to social media
  const shareToSocial = (platform) => {
    if (!generatedImage) {
      alert("Please generate the image first");
      return;
    }

    const shareText = `"${selectedText.substring(0, 100)}${selectedText.length > 100 ? "..." : ""}" from ${postTitle}`;
    const url = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "instagram":
        alert("To share on Instagram:\n1. Download the image\n2. Open Instagram\n3. Create a new post or story with the downloaded image");
        break;
      default:
        break;
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get current theme values
  const currentTheme = themeStyles[theme];

  // Render corner decorations based on selected style
  const renderDecorations = (forPreview = false) => {
    const size = forPreview ? "20px" : "40px";
    const thickness = forPreview ? "1px" : "2px";
    const cornerSize = forPreview ? "10px" : "20px";

    switch (decoration) {
      case "corner":
        return (
          <>
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                width: size,
                height: size,
                borderLeft: `${thickness} solid ${currentTheme.accentColor}`,
                borderTop: `${thickness} solid ${currentTheme.accentColor}`,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: size,
                height: size,
                borderRight: `${thickness} solid ${currentTheme.accentColor}`,
                borderTop: `${thickness} solid ${currentTheme.accentColor}`,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                width: size,
                height: size,
                borderLeft: `${thickness} solid ${currentTheme.accentColor}`,
                borderBottom: `${thickness} solid ${currentTheme.accentColor}`,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                width: size,
                height: size,
                borderRight: `${thickness} solid ${currentTheme.accentColor}`,
                borderBottom: `${thickness} solid ${currentTheme.accentColor}`,
              }}
            ></div>
          </>
        );

      case "border":
        return (
          <div
            style={{
              position: "absolute",
              inset: "8px",
              border: `${thickness} solid ${currentTheme.borderColor}`,
              borderRadius: forPreview ? "8px" : "10px",
              pointerEvents: "none",
            }}
          ></div>
        );

      case "dots":
        // Create dot pattern corners
        return (
          <>
            {/* Top left dots */}
            <div style={{ position: "absolute", top: "12px", left: "12px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: forPreview ? "3px" : "5px",
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`tl-${i}`}
                    style={{
                      width: forPreview ? "2px" : "4px",
                      height: forPreview ? "2px" : "4px",
                      borderRadius: "50%",
                      backgroundColor: i % 2 === 0 ? currentTheme.accentColor : "transparent",
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Top right dots */}
            <div style={{ position: "absolute", top: "12px", right: "12px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: forPreview ? "3px" : "5px",
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`tr-${i}`}
                    style={{
                      width: forPreview ? "2px" : "4px",
                      height: forPreview ? "2px" : "4px",
                      borderRadius: "50%",
                      backgroundColor: i % 2 === 0 ? currentTheme.accentColor : "transparent",
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Bottom left dots */}
            <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: forPreview ? "3px" : "5px",
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`bl-${i}`}
                    style={{
                      width: forPreview ? "2px" : "4px",
                      height: forPreview ? "2px" : "4px",
                      borderRadius: "50%",
                      backgroundColor: i % 2 === 0 ? currentTheme.accentColor : "transparent",
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Bottom right dots */}
            <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: forPreview ? "3px" : "5px",
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`br-${i}`}
                    style={{
                      width: forPreview ? "2px" : "4px",
                      height: forPreview ? "2px" : "4px",
                      borderRadius: "50%",
                      backgroundColor: i % 2 === 0 ? currentTheme.accentColor : "transparent",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Render quote decoration
  const renderQuoteMark = (forPreview = false) => {
    const fontSize = forPreview ? "60px" : "120px";
    const positionTop = forPreview ? "10px" : "20px";
    const positionLeft = forPreview ? "10px" : "20px";

    return (
      <div
        style={{
          position: "absolute",
          top: positionTop,
          left: positionLeft,
          fontSize: fontSize,
          fontFamily: "Georgia, serif",
          lineHeight: "1",
          color: currentTheme.quotesColor,
          pointerEvents: "none",
          fontWeight: "bold",
          zIndex: "0",
          userSelect: "none",
        }}
      >
        "
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-neutral-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Share Quote as Image</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme selector */}
          <div className="flex justify-center space-x-3 mb-2">
            <button onClick={() => setTheme("dark")} className={`w-8 h-8 rounded-full border-2 ${theme === "dark" ? "border-blue-500" : "border-transparent"}`} aria-label="Dark theme" style={{ background: "linear-gradient(to bottom right, #1f2937, #111827)" }}></button>
            <button onClick={() => setTheme("light")} className={`w-8 h-8 rounded-full border-2 ${theme === "light" ? "border-blue-500" : "border-transparent"}`} aria-label="Light theme" style={{ background: "#ffffff" }}></button>
            <button onClick={() => setTheme("gradient")} className={`w-8 h-8 rounded-full border-2 ${theme === "gradient" ? "border-blue-500" : "border-transparent"}`} aria-label="Gradient theme" style={{ background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)" }}></button>
          </div>

          {/* Decoration style selector */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Decoration Style:</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDecoration("corner")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${decoration === "corner" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Corner decoration"
              >
                <span className="text-xs">⌜⌝</span>
              </button>
              <button
                onClick={() => setDecoration("border")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${decoration === "border" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Border decoration"
              >
                <span className="text-xs">□</span>
              </button>
              <button
                onClick={() => setDecoration("dots")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${decoration === "dots" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Dots decoration"
              >
                <span className="text-xs">⁙⁘</span>
              </button>
              <button
                onClick={() => setDecoration("none")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${decoration === "none" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="No decoration"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          </div>

          {/* Preview card with 16:9 ratio */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative shadow-lg rounded-lg overflow-hidden"
              style={{
                width: "320px",
                height: "180px", // 16:9 ratio
                padding: "16px",
                background: currentTheme.background,
                color: currentTheme.color,
              }}
            >
              {/* Pattern background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Decorative elements */}
              {renderDecorations(true)}
              {renderQuoteMark(true)}

              <div className="flex flex-col h-full relative z-10">
                {/* Quote with scrollable area */}
                <div
                  className="overflow-y-auto mb-2 pr-1 text-sm font-medium leading-tight"
                  style={{
                    wordBreak: "break-word",
                    maxHeight: "105px", // Limit height for preview
                    paddingLeft: decoration === "none" ? "0" : "12px", // Space for quote mark
                  }}
                >
                  "{selectedText.length > 200 ? `${selectedText.substring(0, 200)}...` : selectedText}"
                </div>

                {/* Attribution */}
                <div className="mt-auto">
                  <div
                    style={{
                      color: currentTheme.metaColor,
                      fontSize: "10px",
                      marginBottom: "2px",
                    }}
                  >
                    From the article
                  </div>
                  <div className="font-medium text-xs truncate pr-12">{postTitle}</div>

                  {/* Website footer with refined styling */}
                  <div
                    className="absolute bottom-2 right-2 text-[9px] px-2 py-1 rounded-sm"
                    style={{
                      background: currentTheme.footerBg,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    yorushikafansite.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note about output format */}
          <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">Preview shows 16:9 format. Final image will be exported in 9:16 portrait format.</p>

          {/* HIDDEN: Element that will be captured */}
          <div className="relative" style={{ height: 0, overflow: "hidden" }}>
            <div
              ref={fullImageRef}
              style={{
                width: "360px",
                height: "640px",
                padding: "32px",
                background: currentTheme.background,
                color: currentTheme.color,
                fontFamily: "Arial, sans-serif",
                borderRadius: "12px",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {/* Pattern background */}
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  opacity: "0.1",
                  backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                  zIndex: "0",
                }}
              ></div>

              {/* Decorative elements */}
              {renderDecorations()}
              {renderQuoteMark()}

              {/* Content container */}
              <div
                style={{
                  position: "relative",
                  zIndex: "1",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Quote text - full version */}
                <div
                  style={{
                    fontSize: selectedText.length > 500 ? "18px" : "22px",
                    fontWeight: "500",
                    lineHeight: "1.5",
                    marginBottom: "24px",
                    wordBreak: "break-word",
                    paddingLeft: decoration === "none" ? "0" : "24px", // Space for quote mark
                  }}
                >
                  "{selectedText}"
                </div>

                {/* Attribution at bottom */}
                <div style={{ marginTop: "auto", paddingTop: "24px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      color: currentTheme.metaColor,
                    }}
                  >
                    From the article
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "85%",
                    }}
                  >
                    {postTitle}
                  </div>
                </div>

                {/* Website footer with refined styling */}
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "16px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    background: currentTheme.footerBg,
                    backdropFilter: "blur(4px)",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  yorushikafansite.com
                </div>
              </div>
            </div>
          </div>

          {/* Image preview after generation */}
          {generatedImage && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mb-2">Generated Image:</p>
              <img src={generatedImage} alt="Generated quote" className="max-h-[200px] rounded-md shadow-md border border-neutral-200 dark:border-neutral-700" />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              {error}
              <button className="ml-2 underline text-red-600 dark:text-red-400" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            {/* Download button */}
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                transition-colors font-medium flex items-center justify-center 
                ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              {isGenerating ? "Generating..." : "Download Image"}
            </button>

            {/* Social share buttons */}
            {showSocialOptions && (
              <div className="flex flex-col space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
                <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">Share to social media:</p>
                <div className="flex justify-center space-x-4">
                  {/* Twitter */}
                  <button onClick={() => shareToSocial("twitter")} className="p-2 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605 1.013 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button onClick={() => shareToSocial("facebook")} className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </button>

                  {/* Instagram */}
                  <button onClick={() => shareToSocial("instagram")} className="p-2 rounded-full bg-[#E1306C] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.51.5.905 1.104 1.153 1.772.247.636.416 1.363.465 2.427.045 1.013.06 1.366.06 3.808 0 2.43-.013 2.784-.06 3.808-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.5.5-1.104.904-1.772 1.153-.636.247-1.363.416-2.427.465-1.013.045-1.366.06-3.808.06-2.43 0-2.784-.013-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.045-1.013-.06-1.366-.06-3.808 0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807 0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
