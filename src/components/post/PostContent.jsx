import { useRef, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function ShareTextAsImage({ isOpen, onClose, selectedText, postTitle }) {
  const cardRef = useRef(null);
  const [theme, setTheme] = useState("spotify"); // spotify, appleLight, appleDark
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [error, setError] = useState(null);

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

  // Music streaming platform inspired themes
  const themeStyles = {
    spotify: {
      background: "linear-gradient(160deg, #121212 0%, #181818 100%)",
      accentColor: "#1ED760", // Spotify green
      color: "#FFFFFF",
      metaColor: "#B3B3B3",
      footerBg: "rgba(40, 40, 40, 0.8)",
      fontFamily: "'Circular Std', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
      secondaryBg: "#282828",
      progressBarBg: "#535353",
      waveformColor: "#1DB954",
    },
    appleLight: {
      background: "linear-gradient(160deg, #F5F5F7 0%, #FFFFFF 100%)",
      accentColor: "#FF2D55", // Apple Music pink/red
      color: "#1D1D1F",
      metaColor: "#86868B",
      footerBg: "rgba(255, 255, 255, 0.8)",
      fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
      secondaryBg: "#FFFFFF",
      progressBarBg: "#EAEAEA",
      waveformColor: "#FF2D55",
    },
    appleDark: {
      background: "linear-gradient(160deg, #151515 0%, #1C1C1E 100%)",
      accentColor: "#FC3C44", // Apple Music red in dark mode
      color: "#FFFFFF",
      metaColor: "#98989D",
      footerBg: "rgba(34, 34, 36, 0.8)",
      fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
      secondaryBg: "#2C2C2E",
      progressBarBg: "#3A3A3C",
      waveformColor: "#FC3C44",
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
      link.download = `quote-${Date.now()}.png`;
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

  // Time duration calculation - mimicking music length based on quote length
  const getQuoteDuration = () => {
    const words = selectedText.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.floor(words / 30)); // ~30 words per minute
    const seconds = Math.floor((words % 30) * 2); // Remainder converted to seconds
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Audio waveform visualization - simplified version
  const renderWaveform = (forPreview = false) => {
    const barCount = forPreview ? 15 : 30;
    const maxHeight = forPreview ? 20 : 40;
    const barWidth = forPreview ? 2 : 4;
    const barGap = forPreview ? 1 : 2;
    const containerStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: forPreview ? "28px" : "50px",
      marginTop: forPreview ? "8px" : "16px",
      marginBottom: forPreview ? "8px" : "16px",
    };

    const generateBars = () => {
      const bars = [];

      // Create a specific pattern based on the quote length
      const seed = selectedText.length % 100;

      for (let i = 0; i < barCount; i++) {
        // Generate a semi-random height based on position and seed
        let height;
        const pos = i / barCount;

        // Create a wave-like pattern
        if (i % 4 === 0) {
          height = maxHeight * (0.3 + 0.5 * Math.sin(seed + i * 0.8));
        } else if (i % 3 === 0) {
          height = maxHeight * (0.5 + 0.5 * Math.sin(seed + i * 0.4));
        } else if (i % 2 === 0) {
          height = maxHeight * (0.6 + 0.4 * Math.cos(seed + i * 0.7));
        } else {
          height = maxHeight * (0.4 + 0.3 * Math.sin(seed + i * 0.6));
        }

        // Round to integer
        height = Math.max(4, Math.floor(height));

        bars.push(
          <div
            key={i}
            style={{
              width: `${barWidth}px`,
              height: `${height}px`,
              marginRight: `${barGap}px`,
              background: currentTheme.waveformColor,
              opacity: 0.7 + 0.3 * (height / maxHeight),
              borderRadius: "1px",
            }}
          />
        );
      }
      return bars;
    };

    return <div style={containerStyle}>{generateBars()}</div>;
  };

  // Player progress bar
  const renderProgressBar = (forPreview = false) => {
    const progress = 35; // Fixed progress percentage
    const barHeight = forPreview ? 2 : 4;

    return (
      <div
        style={{
          width: "100%",
          height: `${barHeight}px`,
          background: currentTheme.progressBarBg,
          borderRadius: `${barHeight}px`,
          marginTop: forPreview ? "4px" : "8px",
          marginBottom: forPreview ? "4px" : "8px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: currentTheme.accentColor,
            borderRadius: `${barHeight}px`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-neutral-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Share Quote as Music Card</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme selector */}
          <div className="flex justify-center space-x-3 mb-2">
            <button onClick={() => setTheme("spotify")} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${theme === "spotify" ? "border-green-400" : "border-transparent"}`} aria-label="Spotify theme" style={{ background: "#121212" }}>
              <span className="text-green-400 font-bold text-xs">S</span>
            </button>
            <button onClick={() => setTheme("appleLight")} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${theme === "appleLight" ? "border-pink-500" : "border-transparent"}`} aria-label="Apple Music Light theme" style={{ background: "#FFFFFF" }}>
              <span className="text-pink-500 font-bold text-xs">A</span>
            </button>
            <button onClick={() => setTheme("appleDark")} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${theme === "appleDark" ? "border-red-500" : "border-transparent"}`} aria-label="Apple Music Dark theme" style={{ background: "#1C1C1E" }}>
              <span className="text-red-500 font-bold text-xs">A</span>
            </button>
          </div>

          {/* Preview card with 16:9 ratio */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative shadow-lg rounded-lg overflow-hidden"
              style={{
                width: "320px",
                height: "180px", // 16:9 ratio
                background: currentTheme.background,
                color: currentTheme.color,
                fontFamily: currentTheme.fontFamily,
              }}
            >
              {/* Main content area */}
              <div className="flex flex-col h-full p-3">
                {/* Quote as "song" title */}
                <div
                  className="text-sm font-semibold leading-tight overflow-hidden"
                  style={{
                    maxHeight: "60px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  "{selectedText.length > 120 ? `${selectedText.substring(0, 120)}...` : selectedText}"
                </div>

                {/* Mini waveform visualization */}
                {renderWaveform(true)}

                {/* Article title as "artist" */}
                <div className="overflow-hidden text-xs font-medium truncate" style={{ color: currentTheme.metaColor }}>
                  {postTitle}
                </div>

                {/* Progress bar */}
                {renderProgressBar(true)}

                {/* Player controls */}
                <div className="flex items-center justify-between mt-1 px-2">
                  <div style={{ color: currentTheme.metaColor, fontSize: "9px" }}>1:14</div>

                  <div className="flex items-center space-x-2">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: currentTheme.accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "6px",
                      }}
                    >
                      ▶
                    </div>
                  </div>

                  <div style={{ color: currentTheme.metaColor, fontSize: "9px" }}>{getQuoteDuration()}</div>
                </div>

                {/* Website branding */}
                <div className="absolute bottom-2 right-2 text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: currentTheme.footerBg }}>
                  yorushikafansite.com
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
                background: currentTheme.background,
                color: currentTheme.color,
                fontFamily: currentTheme.fontFamily,
                borderRadius: "12px",
                position: "relative",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* Main content area with padding */}
              <div
                style={{
                  padding: "32px 24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Music Platform Logo */}
                <div
                  style={{
                    marginBottom: "32px",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {theme === "spotify" ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: currentTheme.accentColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "8px",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        S
                      </div>
                      <span>Now Playing</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: currentTheme.accentColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "8px",
                          color: "#FFF",
                          fontWeight: "bold",
                        }}
                      >
                        A
                      </div>
                      <span>Now Playing</span>
                    </div>
                  )}
                </div>

                {/* Album art placeholder - large waveform */}
                <div
                  style={{
                    width: "100%",
                    padding: "32px 0",
                    background: currentTheme.secondaryBg,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  {renderWaveform()}
                </div>

                {/* Quote as "song" title */}
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    marginBottom: "12px",
                    lineHeight: "1.3",
                  }}
                >
                  "{selectedText.length > 200 ? `${selectedText.substring(0, 200)}...` : selectedText}"
                </div>

                {/* Article title as "artist" */}
                <div
                  style={{
                    fontSize: "16px",
                    color: currentTheme.metaColor,
                    marginBottom: "24px",
                  }}
                >
                  {postTitle}
                </div>

                {/* Progress bar */}
                {renderProgressBar()}

                {/* Player controls and time */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ color: currentTheme.metaColor }}>1:14</div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        opacity: 0.7,
                        fontSize: "16px",
                        transform: "rotate(180deg)",
                      }}
                    >
                      ⏭
                    </div>

                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: currentTheme.accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        color: theme === "spotify" ? "black" : "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      ▶
                    </div>

                    <div style={{ opacity: 0.7, fontSize: "16px" }}>⏭</div>
                  </div>

                  <div style={{ color: currentTheme.metaColor }}>{getQuoteDuration()}</div>
                </div>

                {/* Website branding */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "16px",
                    transform: "translateX(-50%)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    background: currentTheme.footerBg,
                    color: currentTheme.color,
                    fontSize: "14px",
                    fontWeight: "500",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    textAlign: "center",
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
