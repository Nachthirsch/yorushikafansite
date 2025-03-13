import { useRef, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Download, Twitter, Facebook, Instagram } from "lucide-react"; // Menggunakan Lucide React untuk icons

export default function ShareTextAsImage({ isOpen, onClose, selectedText, postTitle }) {
  const cardRef = useRef(null);
  // Mengganti default theme dengan neutralLight yang valid
  const [theme, setTheme] = useState("neutralLight");
  const [background, setBackground] = useState("gradient");
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

  // Minimalistic decorative theme styles dengan pallete warna neutral
  const themeStyles = {
    neutralLight: {
      background: "#FFFFFF",
      mainColor: "#2C2C2C",
      accentColor: "#8A8A8A", // abu-abu medium
      secondAccent: "#E2E2E2", // abu-abu terang
      thirdAccent: "#F7F7F7", // hampir putih
      fontMain: "'Inter', system-ui, sans-serif",
      fontAccent: "'Inter', system-ui, sans-serif",
      quoteStyle: "normal",
      decoration: "minimal",
    },
    neutralDark: {
      background: "#1A1A1A",
      mainColor: "#E8E8E8",
      accentColor: "#9E9E9E", // abu-abu medium
      secondAccent: "#555555", // abu-abu gelap
      thirdAccent: "#333333", // abu-abu sangat gelap
      fontMain: "'Inter', system-ui, sans-serif",
      fontAccent: "'Inter', system-ui, sans-serif",
      quoteStyle: "normal",
      decoration: "dot",
    },
    sandstone: {
      background: "#F6F4F0",
      mainColor: "#3A3A3A",
      accentColor: "#A8A295", // taupe medium
      secondAccent: "#D8D4CD", // taupe terang
      thirdAccent: "#EEEAE4", // taupe sangat terang
      fontMain: "'DM Sans', system-ui, sans-serif",
      fontAccent: "'DM Serif Display', Georgia, serif",
      quoteStyle: "italic",
      decoration: "line",
    },
    chalk: {
      background: "#F9F9F7",
      mainColor: "#2F2F2F",
      accentColor: "#ADADAD", // abu-abu chalk
      secondAccent: "#E5E5E3", // abu-abu chalk terang
      thirdAccent: "#F0F0EE", // abu-abu chalk sangat terang
      fontMain: "'Spectral', Georgia, serif",
      fontAccent: "'Spectral', Georgia, serif",
      quoteStyle: "normal",
      decoration: "frame",
    },
    slate: {
      background: "#EAEDF0",
      mainColor: "#2D3339",
      accentColor: "#8B95A0", // slate medium
      secondAccent: "#C4CCD4", // slate terang
      thirdAccent: "#DFE3E8", // slate sangat terang
      fontMain: "'Sora', sans-serif",
      fontAccent: "'Sora', sans-serif",
      quoteStyle: "normal",
      decoration: "corner",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.neutralLight; // Menambahkan fallback untuk menghindari undefined

  // Background styles dengan variasi netral
  const backgroundStyles = {
    gradient: {
      neutralLight: "linear-gradient(135deg, #FFFFFF, #F7F7F7, #F0F0F0, #FAFAFA)",
      neutralDark: "linear-gradient(135deg, #1A1A1A, #222222, #282828, #202020)",
      sandstone: "linear-gradient(135deg, #F6F4F0, #F2EFE9, #EEE9E2, #F4F1EB)",
      chalk: "linear-gradient(135deg, #F9F9F7, #F5F5F3, #F1F1EF, #FBFBF9)",
      slate: "linear-gradient(135deg, #EAEDF0, #E5E8EB, #DEE2E6, #E8EBF0)",
    },
    solid: {
      neutralLight: "#FFFFFF",
      neutralDark: "#1A1A1A",
      sandstone: "#F6F4F0",
      chalk: "#F9F9F7",
      slate: "#EAEDF0",
    },
    blur: {
      backgroundBlur: "8px",
      opacity: 0.9,
    },
    pattern: {
      neutralLight: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DDDDDD' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      neutralDark: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23444444' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      sandstone: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A8A295' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      chalk: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ADADAD' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      slate: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B95A0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
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

  // Get background style based on theme and background type
  const getBackgroundStyle = (forPreview = false) => {
    let backgroundStyle = {};

    if (background === "gradient") {
      backgroundStyle.background = backgroundStyles.gradient[theme];
    } else if (background === "solid") {
      backgroundStyle.background = backgroundStyles.solid[theme];
    } else if (background === "blur") {
      // For blur, we'll use a gradient but add a blur effect
      backgroundStyle.background = backgroundStyles.gradient[theme];
      backgroundStyle.backdropFilter = `blur(${backgroundStyles.blur.backgroundBlur})`;
    } else if (background === "pattern") {
      backgroundStyle.backgroundImage = backgroundStyles.pattern[theme];
      backgroundStyle.backgroundColor = backgroundStyles.solid[theme];
    }

    return backgroundStyle;
  };

  // Render decorative elements based on theme
  const renderDecorations = (forPreview = false) => {
    const scale = forPreview ? 0.5 : 1;

    switch (currentTheme.decoration) {
      case "minimal":
        return (
          <>
            {/* Dekorasi minimal dengan garis tipis di sudut */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "6px" : "12px",
                left: forPreview ? "6px" : "12px",
                width: forPreview ? "12px" : "24px",
                height: forPreview ? "12px" : "24px",
                borderTop: `${forPreview ? "1px" : "1.5px"} solid ${currentTheme.accentColor}`,
                borderLeft: `${forPreview ? "1px" : "1.5px"} solid ${currentTheme.accentColor}`,
                opacity: 0.4,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "6px" : "12px",
                right: forPreview ? "6px" : "12px",
                width: forPreview ? "12px" : "24px",
                height: forPreview ? "12px" : "24px",
                borderBottom: `${forPreview ? "1px" : "1.5px"} solid ${currentTheme.accentColor}`,
                borderRight: `${forPreview ? "1px" : "1.5px"} solid ${currentTheme.accentColor}`,
                opacity: 0.4,
                zIndex: 1,
              }}
            ></div>
          </>
        );

      case "dot":
        return (
          <>
            {/* Pola titik-titik halus di sudut */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "8px" : "16px",
                left: forPreview ? "8px" : "16px",
                width: forPreview ? "16px" : "32px",
                height: forPreview ? "16px" : "32px",
                backgroundImage: `radial-gradient(${currentTheme.accentColor} 1px, transparent 1px)`,
                backgroundSize: forPreview ? "4px 4px" : "6px 6px",
                opacity: 0.35,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "8px" : "16px",
                right: forPreview ? "8px" : "16px",
                width: forPreview ? "16px" : "32px",
                height: forPreview ? "16px" : "32px",
                backgroundImage: `radial-gradient(${currentTheme.accentColor} 1px, transparent 1px)`,
                backgroundSize: forPreview ? "4px 4px" : "6px 6px",
                opacity: 0.35,
                zIndex: 1,
              }}
            ></div>
          </>
        );

      case "line":
        return (
          <>
            {/* Garis tipis horizontal */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "10px" : "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: forPreview ? "60px" : "120px",
                height: forPreview ? "0.5px" : "1px",
                background: currentTheme.accentColor,
                opacity: 0.35,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "10px" : "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: forPreview ? "60px" : "120px",
                height: forPreview ? "0.5px" : "1px",
                background: currentTheme.accentColor,
                opacity: 0.35,
                zIndex: 1,
              }}
            ></div>
          </>
        );

      case "frame":
        return (
          <>
            {/* Frame tipis di sekeliling dengan bayangan halus */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "5px" : "10px",
                left: forPreview ? "5px" : "10px",
                right: forPreview ? "5px" : "10px",
                bottom: forPreview ? "5px" : "10px",
                border: `${forPreview ? "0.5px" : "1px"} solid ${currentTheme.secondAccent}`,
                borderRadius: forPreview ? "2px" : "4px",
                boxShadow: `0 ${forPreview ? "1px" : "2px"} ${forPreview ? "3px" : "6px"} rgba(0,0,0,0.025)`,
                opacity: 0.6,
                zIndex: 1,
                pointerEvents: "none",
              }}
            ></div>
          </>
        );

      case "corner":
        return (
          <>
            {/* Elemen sudut minimalis */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "6px" : "12px",
                left: forPreview ? "6px" : "12px",
                width: forPreview ? "10px" : "20px",
                height: forPreview ? "10px" : "20px",
                borderTop: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                borderLeft: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                opacity: 0.45,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: forPreview ? "6px" : "12px",
                right: forPreview ? "6px" : "12px",
                width: forPreview ? "10px" : "20px",
                height: forPreview ? "10px" : "20px",
                borderTop: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                borderRight: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                opacity: 0.45,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "6px" : "12px",
                left: forPreview ? "6px" : "12px",
                width: forPreview ? "10px" : "20px",
                height: forPreview ? "10px" : "20px",
                borderBottom: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                borderLeft: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                opacity: 0.45,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "6px" : "12px",
                right: forPreview ? "6px" : "12px",
                width: forPreview ? "10px" : "20px",
                height: forPreview ? "10px" : "20px",
                borderBottom: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                borderRight: `${forPreview ? "0.75px" : "1.5px"} solid ${currentTheme.accentColor}`,
                opacity: 0.45,
                zIndex: 1,
              }}
            ></div>
          </>
        );

      default:
        return null;
    }
  };

  // Render tanda kutipan sesuai tema
  const renderQuoteMarks = (forPreview = false) => {
    const size = forPreview ? "32px" : "64px";
    const top = forPreview ? "6px" : "12px";
    const left = forPreview ? "6px" : "12px";

    return (
      <div
        style={{
          position: "absolute",
          top: top,
          left: left,
          fontSize: size,
          fontFamily: currentTheme.fontAccent,
          lineHeight: "1",
          color: `${currentTheme.accentColor}`,
          opacity: 0.12,
          fontWeight: "300",
          zIndex: 1,
          userSelect: "none",
          pointerEvents: "none",
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
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Share Quote Image</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme selector */}
          <div>
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mb-2">Card Style:</p>
            <div className="flex justify-center space-x-3 mb-4">
              {/* Neutral Light theme preview */}
              <button
                onClick={() => setTheme("neutralLight")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "neutralLight" ? "border-neutral-600" : "border-neutral-300"}`}
                aria-label="Neutral Light style"
                style={{
                  background: "#FFFFFF",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-neutral-400 opacity-40"></div>
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-neutral-400 opacity-40"></div>
                <div className="absolute left-2 top-2 text-neutral-300 opacity-20 text-xl">"</div>
              </button>

              {/* Neutral Dark theme preview */}
              <button
                onClick={() => setTheme("neutralDark")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "neutralDark" ? "border-neutral-600" : "border-neutral-300"}`}
                aria-label="Neutral Dark style"
                style={{
                  background: "#1A1A1A",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "4px",
                    left: "4px",
                    width: "16px",
                    height: "16px",
                    backgroundImage: "radial-gradient(#888888 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                    opacity: 0.4,
                  }}
                ></div>
                <div className="absolute left-2 top-2 text-neutral-600 opacity-30 text-xl">"</div>
              </button>

              {/* Sandstone theme preview */}
              <button
                onClick={() => setTheme("sandstone")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "sandstone" ? "border-neutral-600" : "border-neutral-300"}`}
                aria-label="Sandstone style"
                style={{
                  background: "#F6F4F0",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-[0.5px] bg-neutral-400 opacity-40"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-[0.5px] bg-neutral-400 opacity-40"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500 opacity-40 text-[10px] italic">Aa</div>
              </button>

              {/* Chalk theme preview */}
              <button
                onClick={() => setTheme("chalk")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "chalk" ? "border-neutral-600" : "border-neutral-300"}`}
                aria-label="Chalk style"
                style={{
                  background: "#F9F9F7",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="absolute inset-[3px] border border-neutral-300 rounded-sm opacity-60"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500 text-[10px]">Aa</div>
              </button>

              {/* Slate theme preview */}
              <button
                onClick={() => setTheme("slate")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "slate" ? "border-neutral-600" : "border-neutral-300"}`}
                aria-label="Slate style"
                style={{
                  background: "#EAEDF0",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-neutral-400 opacity-50"></div>
                <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-neutral-400 opacity-50"></div>
                <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-neutral-400 opacity-50"></div>
                <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-neutral-400 opacity-50"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500 text-[10px]">Aa</div>
              </button>
            </div>
          </div>

          {/* Background selector */}
          <div>
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mb-2">Background Style:</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setBackground("gradient")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${background === "gradient" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Gradient Background"
                style={{
                  background: backgroundStyles.gradient[theme],
                  overflow: "hidden",
                }}
              ></button>
              <button
                onClick={() => setBackground("solid")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${background === "solid" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Solid Background"
                style={{
                  background: backgroundStyles.solid[theme],
                }}
              ></button>
              <button
                onClick={() => setBackground("blur")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${background === "blur" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Blur Background"
                style={{
                  background: backgroundStyles.gradient[theme],
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    backdropFilter: "blur(3px)",
                  }}
                ></div>
              </button>

              <button
                onClick={() => setBackground("pattern")}
                className={`w-10 h-10 rounded border flex items-center justify-center 
                  ${background === "pattern" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Pattern Background"
                style={{
                  backgroundImage: backgroundStyles.pattern[theme],
                  backgroundColor: backgroundStyles.solid[theme],
                }}
              ></button>
            </div>
          </div>

          {/* Preview card dengan aspek 16:9 dalam container 9:16 */}

          {/* Preview card dengan ukuran dinamis */}
          <div className="flex justify-center">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg"
              style={{
                width: "180px", // Preview scaled down dari 360px
                height: "320px", // Container tetap 9:16
                ...getBackgroundStyle(true),
              }}
            >
              {/* Untuk preview tetap menggunakan dimensi tetap dengan teks terpotong */}
              <div
                ref={cardRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md rounded"
                style={{
                  width: "160px", // Lebar tetap
                  height: "90px", // Tinggi tetap untuk preview
                  background: currentTheme.background,
                  color: currentTheme.mainColor,
                  fontFamily: currentTheme.fontMain,
                  overflow: "hidden",
                }}
              >
                {/* Elemen dekoratif */}
                {renderDecorations(true)}
                {renderQuoteMarks(true)}

                {/* Container konten */}
                <div className="flex flex-col h-full p-2 relative z-2">
                  {/* Teks kutipan dengan indikasi terpotong */}
                  <div
                    style={{
                      marginTop: "5px",
                      marginLeft: "5px",
                      marginRight: "5px",
                      fontSize: "7px",
                      fontWeight: "500",
                      fontStyle: currentTheme.quoteStyle,
                      lineHeight: "1.5",
                      maxHeight: "45px",
                      overflow: "hidden",
                    }}
                  >
                    "{selectedText.length > 80 ? `${selectedText.substring(0, 80)}...` : selectedText}"
                  </div>

                  {/* Atribusi - dipindahkan dari position: absolute ke relative positioning */}
                  <div className="mt-auto">
                    <div
                      style={{
                        fontSize: "5px",
                        marginTop: "5px",
                        textAlign: "right",
                        color: currentTheme.accentColor,
                        paddingRight: "5px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {postTitle.length > 20 ? `${postTitle.substring(0, 20)}...` : postTitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Indikator untuk menunjukkan bahwa teks lengkap akan ditampilkan */}
              {selectedText.length > 80 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "2px 6px",
                    background: "rgba(30,30,30,0.7)",
                    color: "#fff",
                    borderRadius: "4px",
                    fontSize: "5px",
                    fontWeight: "500",
                    textAlign: "center",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  Full text will be shown in the image
                </div>
              )}
            </div>
          </div>

          {/* HIDDEN: Element yang akan di-capture dengan ukuran dinamis */}
          <div className="relative" style={{ height: 0, overflow: "hidden" }}>
            <div
              ref={fullImageRef}
              style={{
                width: "360px",
                height: "640px",
                ...getBackgroundStyle(false),
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Card dengan ukuran dinamis berdasarkan konten */}
              <div
                style={{
                  width: "320px", // Lebar tetap
                  minHeight: "180px", // Tinggi minimum (16:9 ratio)
                  maxHeight: "480px", // Tinggi maksimum agar tidak terlalu panjang
                  background: currentTheme.background,
                  color: currentTheme.mainColor,
                  fontFamily: currentTheme.fontMain,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  borderRadius: "6px",
                  position: "relative",
                  overflow: "visible", // Penting! Memungkinkan konten mengatur tinggi
                  paddingBottom: "40px", // Tambahkan ruang lebih untuk judul post
                }}
              >
                {/* Elemen dekoratif */}
                {renderDecorations()}
                {renderQuoteMarks()}

                {/* Container konten dengan tinggi yang dapat menyesuaikan */}
                <div
                  style={{
                    padding: "20px",
                    paddingBottom: "0", // Kurangi padding bawah
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Konten kutipan tanpa batasan tinggi */}
                  <div
                    style={{
                      fontSize: selectedText.length > 150 ? "14px" : "15px",
                      fontWeight: "400",
                      lineHeight: "1.6",
                      marginTop: "8px",
                      marginLeft: "10px",
                      marginRight: "10px",
                      fontStyle: currentTheme.quoteStyle,
                      letterSpacing: "0.01em",
                      wordWrap: "break-word", // Untuk menangani kata panjang
                      marginBottom: "20px", // Tambahkan margin bawah untuk jarak dengan judul
                    }}
                  >
                    "{selectedText}"
                  </div>

                  {/* Atribusi */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px", // Posisi dari bawah card
                      right: "12px", // Posisi dari kanan card
                      fontSize: "10px",
                      fontWeight: "500",
                      color: currentTheme.accentColor,
                      letterSpacing: "0.02em",
                      opacity: 0.8,
                      zIndex: 20, // Pastikan z-index lebih tinggi
                      fontStyle: "italic",
                      maxWidth: "80%",
                      textAlign: "right",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "0", // Reset padding
                      margin: "0", // Reset margin
                    }}
                  >
                    {postTitle}
                  </div>
                </div>
              </div>

              {/* Watermark dipindahkan ke pojok kanan bawah gambar */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  fontSize: "8px",
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(0,0,0,0.4)",
                  opacity: 0.8,
                  letterSpacing: "0.03em",
                }}
              >
                yorushikafansite.com
              </div>
            </div>
          </div>
          {/* Image preview setelah di-generate */}
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
            {/* Tombol download */}
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                transition-colors font-medium flex items-center justify-center 
                ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <Download className="w-5 h-5 mr-2" /> {/* Menggunakan Lucide icon */}
              {isGenerating ? "Generating..." : "Download Image"}
            </button>

            {/* Tombol share ke media sosial */}
            {showSocialOptions && (
              <div className="flex flex-col space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
                <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">Share to social media:</p>
                <div className="flex justify-center space-x-4">
                  {/* Twitter */}
                  <button onClick={() => shareToSocial("twitter")} className="p-2 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Twitter">
                    <Twitter className="w-5 h-5" /> {/* Menggunakan Lucide icon */}
                  </button>

                  {/* Facebook */}
                  <button onClick={() => shareToSocial("facebook")} className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Facebook">
                    <Facebook className="w-5 h-5" /> {/* Menggunakan Lucide icon */}
                  </button>

                  {/* Instagram */}
                  <button onClick={() => shareToSocial("instagram")} className="p-2 rounded-full bg-[#E1306C] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Instagram">
                    <Instagram className="w-5 h-5" /> {/* Menggunakan Lucide icon */}
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
