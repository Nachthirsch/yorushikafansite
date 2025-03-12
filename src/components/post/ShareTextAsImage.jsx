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

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setGeneratedImage(null);
      setIsGenerating(false);
      setShowSocialOptions(false);
      setError(null);
    }
  }, [isOpen]);

  const generateImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Build a new element from scratch
      const outputContainer = document.createElement("div");
      outputContainer.style.position = "absolute";
      outputContainer.style.top = "-9999px";
      outputContainer.style.left = "-9999px";
      document.body.appendChild(outputContainer);

      // Set dimensions for 9:16 aspect ratio
      const baseWidth = 360; // Base width for output
      const baseHeight = 640; // Base height for 9:16 ratio

      // Theme configuration
      const themeStyles = {
        dark: {
          background: "linear-gradient(to bottom right, #1f2937, #111827)",
          color: "#ffffff",
          metaColor: "#d1d5db",
          footerBg: "rgba(17, 24, 39, 0.7)",
        },
        light: {
          background: "#ffffff",
          color: "#1f2937",
          metaColor: "#6b7280",
          footerBg: "rgba(229, 231, 235, 0.7)",
        },
        gradient: {
          background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
          color: "#ffffff",
          metaColor: "#e9d5ff",
          footerBg: "rgba(91, 33, 182, 0.7)",
        },
      };

      const currentTheme = themeStyles[theme];

      // Main container styling
      outputContainer.style.width = `${baseWidth}px`;
      outputContainer.style.minHeight = `${baseHeight}px`;
      outputContainer.style.background = currentTheme.background;
      outputContainer.style.color = currentTheme.color;
      outputContainer.style.borderRadius = "12px";
      outputContainer.style.fontFamily = "Arial, sans-serif";
      outputContainer.style.boxSizing = "border-box";
      outputContainer.style.padding = "36px";
      outputContainer.style.overflow = "hidden";

      // Pattern background
      const patternBg = document.createElement("div");
      patternBg.style.position = "absolute";
      patternBg.style.inset = "0";
      patternBg.style.opacity = "0.1";
      patternBg.style.backgroundImage = "radial-gradient(#ffffff 1px, transparent 1px)";
      patternBg.style.backgroundSize = "12px 12px";
      patternBg.style.zIndex = "0";
      outputContainer.appendChild(patternBg);

      // Content wrapper
      const contentWrapper = document.createElement("div");
      contentWrapper.style.position = "relative";
      contentWrapper.style.zIndex = "1";
      contentWrapper.style.height = "100%";
      contentWrapper.style.display = "flex";
      contentWrapper.style.flexDirection = "column";
      contentWrapper.style.width = "100%";
      outputContainer.appendChild(contentWrapper);

      // Quote text element
      const quoteElement = document.createElement("div");
      // Adjust font size based on text length
      quoteElement.style.fontSize = selectedText.length > 1000 ? "16px" : selectedText.length > 500 ? "18px" : "22px";
      quoteElement.style.fontWeight = "500";
      quoteElement.style.lineHeight = "1.6";
      quoteElement.style.marginBottom = "36px";
      quoteElement.style.wordBreak = "break-word";
      quoteElement.style.overflowWrap = "break-word";
      quoteElement.textContent = `"${selectedText}"`;
      contentWrapper.appendChild(quoteElement);

      // Attribution section
      const attributionContainer = document.createElement("div");
      attributionContainer.style.marginTop = "auto";
      attributionContainer.style.paddingTop = "24px";
      attributionContainer.style.marginBottom = "24px";
      contentWrapper.appendChild(attributionContainer);

      // "From the article" text
      const fromLabel = document.createElement("div");
      fromLabel.style.fontSize = "15px";
      fromLabel.style.marginBottom = "8px";
      fromLabel.style.color = currentTheme.metaColor;
      fromLabel.textContent = "From the article";
      attributionContainer.appendChild(fromLabel);

      // Article title
      const titleElement = document.createElement("div");
      titleElement.style.fontSize = "17px";
      titleElement.style.fontWeight = "600";
      titleElement.style.maxWidth = "90%";
      titleElement.style.whiteSpace = "nowrap";
      titleElement.style.overflow = "hidden";
      titleElement.style.textOverflow = "ellipsis";
      titleElement.textContent = postTitle;
      attributionContainer.appendChild(titleElement);

      // Website attribution with background
      const footerWrapper = document.createElement("div");
      footerWrapper.style.position = "absolute";
      footerWrapper.style.bottom = "22px";
      footerWrapper.style.right = "22px";
      footerWrapper.style.padding = "6px 12px";
      footerWrapper.style.borderRadius = "6px";
      footerWrapper.style.background = currentTheme.footerBg;
      footerWrapper.style.backdropFilter = "blur(4px)";
      footerWrapper.style.webkitBackdropFilter = "blur(4px)";
      footerWrapper.style.zIndex = "10";
      footerWrapper.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

      const footerText = document.createElement("div");
      footerText.style.fontSize = "14px";
      footerText.style.fontWeight = "500";
      footerText.style.opacity = "0.95";
      footerText.textContent = "yorushikafansite.com";
      footerWrapper.appendChild(footerText);

      outputContainer.appendChild(footerWrapper);

      // Wait for layout to calculate correct sizes
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Dynamically adjust height based on content
      const quoteHeight = quoteElement.scrollHeight;
      const attributionHeight = attributionContainer.scrollHeight;
      const requiredContentHeight = quoteHeight + attributionHeight + 150;

      // Set final container height (minimum 9:16 ratio, or taller if needed)
      const finalHeight = Math.max(baseHeight, requiredContentHeight);
      outputContainer.style.height = `${finalHeight}px`;

      // Use html-to-image instead of html2canvas
      const image = await toPng(outputContainer, {
        quality: 0.95,
        pixelRatio: 3, // Higher resolution
        fontEmbedCSS: true, // Embed fonts for better rendering
        skipAutoScale: true,
        canvasWidth: baseWidth * 3, // Higher resolution
        canvasHeight: finalHeight * 3,
      });

      // Clean up
      document.body.removeChild(outputContainer);

      // Set generated image
      setGeneratedImage(image);

      // Download
      const link = document.createElement("a");
      link.href = image;
      link.download = `yorushika-quote-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show social sharing options
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
          <div className="flex justify-center space-x-3">
            <button onClick={() => setTheme("dark")} className={`w-8 h-8 rounded-full border-2 ${theme === "dark" ? "border-blue-500" : "border-transparent"}`} aria-label="Dark theme" style={{ background: "linear-gradient(to bottom right, #1f2937, #111827)" }}></button>
            <button onClick={() => setTheme("light")} className={`w-8 h-8 rounded-full border-2 ${theme === "light" ? "border-blue-500" : "border-transparent"}`} aria-label="Light theme" style={{ background: "#ffffff" }}></button>
            <button onClick={() => setTheme("gradient")} className={`w-8 h-8 rounded-full border-2 ${theme === "gradient" ? "border-blue-500" : "border-transparent"}`} aria-label="Gradient theme" style={{ background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)" }}></button>
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
                background: theme === "dark" ? "linear-gradient(to bottom right, #1f2937, #111827)" : theme === "gradient" ? "linear-gradient(to bottom right, #3b82f6, #8b5cf6)" : "#ffffff",
                color: theme === "light" ? "#1f2937" : "#ffffff",
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

              <div className="flex flex-col h-full relative z-10">
                {/* Quote with scrollable area */}
                <div
                  className="overflow-y-auto mb-2 pr-1 text-sm font-medium leading-tight"
                  style={{
                    wordBreak: "break-word",
                    maxHeight: "105px", // Limit height for preview
                  }}
                >
                  "{selectedText.length > 200 ? `${selectedText.substring(0, 200)}...` : selectedText}"
                </div>

                {/* Attribution */}
                <div className="mt-auto">
                  <div
                    style={{
                      color: theme === "light" ? "#6b7280" : "#d1d5db",
                      fontSize: "10px",
                      marginBottom: "2px",
                    }}
                  >
                    From the article
                  </div>
                  <div className="font-medium text-xs truncate pr-12">{postTitle}</div>

                  {/* Website footer with background */}
                  <div className="absolute bottom-1 right-2 text-[9px] px-2 py-1 rounded-sm bg-black/20 dark:bg-white/20">yorushikafansite.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Note about output format */}
          <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">Preview shows 16:9 format. Final image will be exported in 9:16 portrait format.</p>

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
