import { useRef, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function ShareTextAsImage({ isOpen, onClose, selectedText, postTitle }) {
  const cardRef = useRef(null);
  const [theme, setTheme] = useState("bauhaus"); // bauhaus, neomemphis, nordic, brutalist
  const [background, setBackground] = useState("gradient"); // gradient, solid, blur, pattern
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

  // Minimalistic decorative theme styles
  const themeStyles = {
    bauhaus: {
      background: "#FFFFFF",
      mainColor: "#121212",
      accentColor: "#E53935", // red
      secondAccent: "#1E88E5", // blue
      thirdAccent: "#FFD600", // yellow
      fontMain: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontAccent: "'Futura PT', 'Century Gothic', sans-serif",
      quoteStyle: "normal",
      decoration: "geometric",
    },
    neomemphis: {
      background: "#F8F9FA",
      mainColor: "#202124",
      accentColor: "#FF89DE", // pink
      secondAccent: "#00C1B5", // teal
      thirdAccent: "#FFBE0B", // gold
      fontMain: "'Poppins', sans-serif",
      fontAccent: "'Poppins', sans-serif",
      quoteStyle: "italic",
      decoration: "pattern",
    },
    nordic: {
      background: "#F5F5F5",
      mainColor: "#2E3440",
      accentColor: "#5E81AC", // blue grey
      secondAccent: "#A3BE8C", // sage green
      thirdAccent: "#EBCB8B", // sand
      fontMain: "'Inter', system-ui, sans-serif",
      fontAccent: "'Inter', system-ui, sans-serif",
      quoteStyle: "normal",
      decoration: "minimal",
    },
    brutalist: {
      background: "#FFFFFF",
      mainColor: "#000000",
      accentColor: "#000000", // just black
      secondAccent: "#D3D3D3", // light grey
      thirdAccent: "#707070", // dark grey
      fontMain: "'JetBrains Mono', 'Courier New', monospace",
      fontAccent: "'JetBrains Mono', 'Courier New', monospace",
      quoteStyle: "normal",
      decoration: "raw",
    },
  };

  // Background styles
  const backgroundStyles = {
    gradient: {
      bauhaus: "linear-gradient(135deg, #FF9AA2, #FFB7B2, #FFDAC1, #E2F0CB, #B5EAD7, #C7CEEA)",
      neomemphis: "linear-gradient(135deg, #F72585, #7209B7, #3A0CA3, #4361EE, #4CC9F0)",
      nordic: "linear-gradient(135deg, #5E81AC, #81A1C1, #88C0D0, #8FBCBB)",
      brutalist: "linear-gradient(135deg, #000000, #1A1A1A, #333333, #4D4D4D)",
    },
    solid: {
      bauhaus: "#F5F5F5",
      neomemphis: "#F8EDFF",
      nordic: "#ECEFF4",
      brutalist: "#F0F0F0",
    },
    blur: {
      backgroundBlur: "8px",
      opacity: 0.9,
    },
    pattern: {
      bauhaus: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E53935' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      neomemphis: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF89DE' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      nordic: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235E81AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      brutalist: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
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
      case "geometric":
        return (
          <>
            {/* Bauhaus inspired geometric shapes */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "16px" : "32px",
                right: forPreview ? "16px" : "32px",
                width: forPreview ? "15px" : "30px",
                height: forPreview ? "15px" : "30px",
                borderRadius: "50%",
                background: currentTheme.accentColor,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "16px" : "32px",
                left: forPreview ? "16px" : "32px",
                width: forPreview ? "20px" : "40px",
                height: forPreview ? "20px" : "40px",
                background: currentTheme.secondAccent,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: forPreview ? "40px" : "80px",
                left: forPreview ? "25px" : "50px",
                width: forPreview ? "10px" : "20px",
                height: forPreview ? "40px" : "80px",
                background: currentTheme.thirdAccent,
                zIndex: 1,
              }}
            ></div>
          </>
        );

      case "pattern":
        return (
          <>
            {/* Neo-Memphis style patterns */}
            <div
              style={{
                position: "absolute",
                top: forPreview ? "16px" : "32px",
                left: forPreview ? "16px" : "32px",
                width: forPreview ? "40px" : "80px",
                height: forPreview ? "40px" : "80px",
                backgroundImage: `radial-gradient(${currentTheme.accentColor} 2px, transparent 2px)`,
                backgroundSize: forPreview ? "8px 8px" : "16px 16px",
                zIndex: 1,
                opacity: 0.6,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "16px" : "32px",
                right: forPreview ? "16px" : "32px",
                width: forPreview ? "60px" : "120px",
                height: forPreview ? "30px" : "60px",
                background: currentTheme.secondAccent,
                borderRadius: forPreview ? "10px" : "20px",
                zIndex: 1,
                opacity: 0.3,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: forPreview ? "30px" : "60px",
                right: forPreview ? "25px" : "50px",
                width: forPreview ? "15px" : "30px",
                height: forPreview ? "15px" : "30px",
                background: currentTheme.thirdAccent,
                transform: "rotate(45deg)",
                zIndex: 1,
                opacity: 0.6,
              }}
            ></div>
          </>
        );

      case "minimal":
        return (
          <>
            {/* Nordic minimal design */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: forPreview ? "4px" : "8px",
                background: currentTheme.accentColor,
                opacity: 0.7,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "30px" : "60px",
                left: forPreview ? "20px" : "40px",
                width: forPreview ? "30px" : "60px",
                height: forPreview ? "1px" : "2px",
                background: currentTheme.secondAccent,
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "30px" : "60px",
                right: forPreview ? "20px" : "40px",
                width: forPreview ? "30px" : "60px",
                height: forPreview ? "1px" : "2px",
                background: currentTheme.secondAccent,
                zIndex: 1,
              }}
            ></div>
          </>
        );

      case "raw":
        return (
          <>
            {/* Brutalist raw design */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: forPreview ? "3px solid #000" : "6px solid #000",
                boxSizing: "border-box",
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: forPreview ? "25px" : "50px",
                right: forPreview ? "-5px" : "-10px",
                width: forPreview ? "30px" : "60px",
                height: forPreview ? "2px" : "4px",
                background: currentTheme.mainColor,
                zIndex: 2,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                bottom: forPreview ? "25px" : "50px",
                left: forPreview ? "-5px" : "-10px",
                width: forPreview ? "30px" : "60px",
                height: forPreview ? "2px" : "4px",
                background: currentTheme.mainColor,
                zIndex: 2,
              }}
            ></div>
          </>
        );

      default:
        return null;
    }
  };

  // Render quote marks based on theme
  const renderQuoteMarks = (forPreview = false) => {
    if (theme === "brutalist") {
      // Brutalist doesn't use fancy quote marks
      return null;
    }

    const size = forPreview ? "60px" : "120px";
    const top = forPreview ? "5px" : "10px";
    const left = forPreview ? "10px" : "20px";

    return (
      <div
        style={{
          position: "absolute",
          top: top,
          left: left,
          fontSize: size,
          fontFamily: currentTheme.fontAccent,
          lineHeight: "1",
          color: theme === "neomemphis" ? currentTheme.accentColor : `${currentTheme.accentColor}20`, // Very transparent
          opacity: theme === "neomemphis" ? 0.2 : 0.1,
          fontWeight: "bold",
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
              <button
                onClick={() => setTheme("bauhaus")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "bauhaus" ? "border-blue-500" : "border-gray-300"}`}
                aria-label="Bauhaus style"
                style={{
                  background: "#FFFFFF",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full"></div>
                <div className="absolute bottom-1 left-1 w-5 h-5 bg-blue-500"></div>
                <div className="absolute left-3 top-2 w-2 h-8 bg-yellow-400"></div>
              </button>

              <button
                onClick={() => setTheme("neomemphis")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "neomemphis" ? "border-blue-500" : "border-gray-300"}`}
                aria-label="Neo-Memphis style"
                style={{
                  background: "#F8F9FA",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "4px",
                    left: "4px",
                    width: "20px",
                    height: "20px",
                    backgroundImage: "radial-gradient(#FF89DE 1px, transparent 1px)",
                    backgroundSize: "5px 5px",
                    opacity: 0.6,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    right: "4px",
                    width: "24px",
                    height: "12px",
                    background: "#00C1B5",
                    borderRadius: "6px",
                    opacity: 0.5,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "6px",
                    width: "6px",
                    height: "6px",
                    background: "#FFBE0B",
                    transform: "rotate(45deg)",
                    opacity: 0.7,
                  }}
                ></div>
              </button>

              <button
                onClick={() => setTheme("nordic")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "nordic" ? "border-blue-500" : "border-gray-300"}`}
                aria-label="Nordic style"
                style={{
                  background: "#F5F5F5",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "3px",
                    background: "#5E81AC",
                    opacity: 0.7,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "6px",
                    width: "16px",
                    height: "1px",
                    background: "#A3BE8C",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "6px",
                    width: "16px",
                    height: "1px",
                    background: "#A3BE8C",
                  }}
                ></div>
              </button>

              <button
                onClick={() => setTheme("brutalist")}
                className={`w-12 h-12 rounded flex items-center justify-center border-2 ${theme === "brutalist" ? "border-blue-500" : "border-gray-300"}`}
                aria-label="Brutalist style"
                style={{
                  background: "#FFFFFF",
                  position: "relative",
                  overflow: "hidden",
                  border: theme === "brutalist" ? "2px solid blue" : "2px solid black",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "-2px",
                    width: "14px",
                    height: "2px",
                    background: "black",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "-2px",
                    width: "14px",
                    height: "2px",
                    background: "black",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                >
                  Aa
                </div>
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

          {/* Preview card with 16:9 in 9:16 container */}
          <div className="flex justify-center">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg"
              style={{
                width: "180px", // Preview scaled down from 360px
                height: "320px", // 9:16 aspect ratio
                ...getBackgroundStyle(true),
              }}
            >
              {/* 16:9 card centered in 9:16 container */}
              <div
                ref={cardRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md rounded"
                style={{
                  width: "160px", // 16:9 ratio, scaled down from original
                  height: "90px",
                  background: currentTheme.background,
                  color: currentTheme.mainColor,
                  fontFamily: currentTheme.fontMain,
                  overflow: "hidden",
                }}
              >
                {/* Decorative elements */}
                {renderDecorations(true)}
                {renderQuoteMarks(true)}

                {/* Content container */}
                <div className="flex flex-col h-full p-2 relative z-2">
                  {/* Quote text */}
                  <div
                    style={{
                      marginTop: theme === "bauhaus" ? "10px" : "5px",
                      marginLeft: theme === "brutalist" ? "0" : "5px",
                      marginRight: theme === "brutalist" ? "0" : "5px",
                      fontSize: "7px",
                      fontWeight: theme === "brutalist" ? "normal" : "500",
                      fontStyle: currentTheme.quoteStyle,
                      lineHeight: "1.5",
                      maxHeight: "45px",
                      overflow: "hidden",
                    }}
                  >
                    "{selectedText.length > 80 ? `${selectedText.substring(0, 80)}...` : selectedText}"
                  </div>

                  {/* Attribution */}
                  <div className="mt-auto">
                    <div
                      style={{
                        fontSize: "5px",
                        marginTop: "5px",
                        textAlign: theme === "brutalist" ? "left" : "right",
                        fontWeight: theme === "brutalist" ? "bold" : "normal",
                        color: theme === "brutalist" ? "black" : currentTheme.accentColor,
                        paddingRight: theme === "brutalist" ? "5px" : "0",
                      }}
                    >
                      {postTitle.length > 20 ? `${postTitle.substring(0, 20)}...` : postTitle}
                    </div>

                    {/* Watermark */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        right: theme === "brutalist" ? "auto" : "3px",
                        left: theme === "brutalist" ? "3px" : "auto",
                        fontSize: "4px",
                        opacity: 0.5,
                      }}
                    >
                      yorushikafansite.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom text on background */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "8px",
                  color: theme === "brutalist" ? "#000" : "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  textAlign: "center",
                  width: "80%",
                }}
              >
                yorushikafansite.com
              </div>
            </div>
          </div>

          {/* HIDDEN: Element that will be captured */}
          <div className="relative" style={{ height: 0, overflow: "hidden" }}>
            <div
              ref={fullImageRef}
              style={{
                width: "360px",
                height: "640px",
                ...getBackgroundStyle(false),
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 16:9 card centered in 9:16 container */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "320px", // 16:9 ratio
                  height: "180px",
                  background: currentTheme.background,
                  color: currentTheme.mainColor,
                  fontFamily: currentTheme.fontMain,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Decorative elements */}
                {renderDecorations()}
                {renderQuoteMarks()}

                {/* Content container */}
                <div
                  style={{
                    padding: "20px",
                    height: "100%",
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Quote content */}
                  <div
                    style={{
                      fontSize: selectedText.length > 150 ? "14px" : "16px",
                      fontWeight: theme === "brutalist" ? "normal" : "500",
                      lineHeight: "1.5",
                      marginTop: theme === "bauhaus" ? "20px" : "10px",
                      marginLeft: theme === "brutalist" ? "0" : "10px",
                      marginRight: theme === "brutalist" ? "0" : "10px",
                      fontStyle: currentTheme.quoteStyle,
                      padding: theme === "brutalist" ? "0 10px" : "0",
                      maxHeight: "110px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    "{selectedText.length > 300 ? `${selectedText.substring(0, 300)}...` : selectedText}"
                  </div>

                  {/* Attribution */}
                  <div
                    style={{
                      marginTop: "auto",
                      fontSize: "12px",
                      textAlign: theme === "brutalist" ? "left" : "right",
                      fontWeight: theme === "brutalist" ? "bold" : "normal",
                      color: theme === "brutalist" ? "black" : currentTheme.accentColor,
                      paddingRight: theme === "brutalist" ? "10px" : "0",
                      marginBottom: "10px",
                      marginRight: theme === "brutalist" ? "0" : "10px",
                      marginLeft: theme === "brutalist" ? "10px" : "0",
                    }}
                  >
                    {postTitle}
                  </div>

                  {/* Website watermark */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: theme === "brutalist" ? "auto" : "10px",
                      left: theme === "brutalist" ? "10px" : "auto",
                      fontSize: "8px",
                      opacity: 0.7,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    yorushikafansite.com
                  </div>
                </div>
              </div>

              {/* Bottom branding on background */}
              <div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "8px 20px",
                  background: "rgba(0,0,0,0.2)",
                  color: "#fff",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "center",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                yorushikafansite.com
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
