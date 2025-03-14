import { useRef, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Download, Twitter, Facebook, Instagram, Type } from "lucide-react"; // Menambahkan ikon Type untuk bagian pemilihan font

export default function ShareTextAsImage({ isOpen, onClose, selectedText, postTitle }) {
  const cardRef = useRef(null);
  const fullImageRef = useRef(null);

  // State untuk konfigurasi gambar
  const [theme, setTheme] = useState("neutralLight");
  const [background, setBackground] = useState("gradient");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // State untuk pemilihan font
  const [selectedFont, setSelectedFont] = useState("inter");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // State untuk judul konten
  const [contentTitle, setContentTitle] = useState("");

  /// Daftar font estetik yang tersedia
  const fontOptions = [
    { id: "inter", name: "Inter", style: "'Inter', system-ui, sans-serif", preview: "Modern", weights: [400, 500, 600] },
    { id: "playfair", name: "Playfair", style: "'Playfair Display', serif", preview: "Elegant", weights: [400, 500, 700] },
    { id: "montserrat", name: "Montserrat", style: "'Montserrat', sans-serif", preview: "Clean", weights: [400, 500, 600] },
    { id: "cormorant", name: "Cormorant", style: "'Cormorant Garamond', serif", preview: "Classic", weights: [400, 500] },
    { id: "karla", name: "Karla", style: "'Karla', sans-serif", preview: "Friendly", weights: [400, 500, 600] },
  ];

  /// Deteksi apakah perangkat adalah mobile untuk mengoptimalkan UI
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

  /// Effect untuk memuat Google Fonts
  useEffect(() => {
    if (!isOpen) return;

    // Hapus link sebelumnya jika ada
    const existingLink = document.getElementById("quote-google-fonts");
    if (existingLink) {
      existingLink.remove();
    }

    // Menyusun string untuk memuat font
    const fontFamiliesParam = fontOptions
      .map((font) => {
        const weights = font.weights.join(",");
        return `${font.name.replace(/\s+/g, "+")}:wght@${weights}`;
      })
      .join("&family=");

    // Membuat link element untuk Google Fonts
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = `https://fonts.googleapis.com/css2?family=${fontFamiliesParam}&display=swap`;
    linkElement.id = "quote-google-fonts";

    // Menambahkan link ke document head
    document.head.appendChild(linkElement);

    // Menunggu font selesai dimuat
    document.fonts.ready.then(() => {
      console.log("Fonts loaded successfully");
      setFontsLoaded(true);
    });

    return () => {
      // Clean up - hapus link elemen saat komponen unmount
      const fontLink = document.getElementById("quote-google-fonts");
      if (fontLink) {
        document.head.removeChild(fontLink);
      }
    };
  }, [isOpen]);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setGeneratedImage(null);
      setIsGenerating(false);
      setShowSocialOptions(false);
      setError(null);
      // Tidak mereset contentTitle untuk menyimpan judul terakhir yang dimasukkan
    }
  }, [isOpen]);

  /// Mendapatkan font style yang aktif
  const getActiveFont = () => {
    const font = fontOptions.find((font) => font.id === selectedFont);
    return font ? font.style : fontOptions[0].style;
  };

  // Minimalistic decorative theme styles dengan font yang dipilih
  const themeStyles = {
    neutralLight: {
      background: "#FFFFFF",
      mainColor: "#2C2C2C",
      accentColor: "#8A8A8A",
      secondAccent: "#E2E2E2",
      thirdAccent: "#F7F7F7",
      fontMain: getActiveFont(),
      fontAccent: getActiveFont(),
      quoteStyle: "normal",
      decoration: "minimal",
    },
    neutralDark: {
      background: "#1A1A1A",
      mainColor: "#E8E8E8",
      accentColor: "#9E9E9E",
      secondAccent: "#555555",
      thirdAccent: "#333333",
      fontMain: getActiveFont(),
      fontAccent: getActiveFont(),
      quoteStyle: "normal",
      decoration: "dot",
    },
    sandstone: {
      background: "#F6F4F0",
      mainColor: "#3A3A3A",
      accentColor: "#A8A295",
      secondAccent: "#D8D4CD",
      thirdAccent: "#EEEAE4",
      fontMain: getActiveFont(),
      fontAccent: getActiveFont(),
      quoteStyle: "italic",
      decoration: "line",
    },
    chalk: {
      background: "#F9F9F7",
      mainColor: "#2F2F2F",
      accentColor: "#ADADAD",
      secondAccent: "#E5E5E3",
      thirdAccent: "#F0F0EE",
      fontMain: getActiveFont(),
      fontAccent: getActiveFont(),
      quoteStyle: "normal",
      decoration: "frame",
    },
    slate: {
      background: "#EAEDF0",
      mainColor: "#2D3339",
      accentColor: "#8B95A0",
      secondAccent: "#C4CCD4",
      thirdAccent: "#DFE3E8",
      fontMain: getActiveFont(),
      fontAccent: getActiveFont(),
      quoteStyle: "normal",
      decoration: "corner",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.neutralLight;

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

  /// Generator gambar dengan dukungan font
  const generateImage = async () => {
    if (!fullImageRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Memastikan font sudah dimuat
      if (!fontsLoaded) {
        await document.fonts.ready;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 2. Menerapkan font secara eksplisit ke elemen
      const currentFont = getActiveFont();
      const textElements = fullImageRef.current.querySelectorAll(".font-apply");
      textElements.forEach((el) => {
        el.style.fontFamily = currentFont;
      });

      // 3. Menunggu sebentar untuk memastikan rendering sempurna
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 4. Generate image dengan pengaturan terbaik untuk font
      const dataUrl = await toPng(fullImageRef.current, {
        quality: 0.95,
        pixelRatio: 3,
        cacheBust: true,
        includeQueryParams: true,
        fontEmbedCSS: document.styleSheets,
        skipAutoScale: true,
        style: {
          opacity: "1",
          visibility: "visible",
        },
      });

      // 5. Set generated image and show preview
      setGeneratedImage(dataUrl);

      // 6. Download the image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `quote-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 7. Show social sharing options
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 select-none">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-neutral-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden" style={{ maxHeight: isMobileDevice ? "90vh" : "85vh" }}>
        {/* Header Modal */}
        <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center sticky top-0 bg-white dark:bg-neutral-800 z-10">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Share Quote Image</h3>
          <button onClick={onClose} className="p-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" aria-label="Close modal">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Konten dengan scroll jika terlalu panjang di mobile */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6" style={{ maxHeight: "calc(90vh - 60px)" }}>
          {/* Input untuk judul konten */}
          <div>
            <label htmlFor="content-title" className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1 text-center">
              Judul Konten (opsional):
            </label>
            <input type="text" id="content-title" value={contentTitle} onChange={(e) => setContentTitle(e.target.value)} placeholder="Ex: Memory 11 - Elma's Diary" className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center">Judul ini akan ditampilkan di samping judul post</p>
          </div>

          {/* Font selector - ditambahkan di awal sebelum theme selector */}
          <div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Type size={16} className="text-neutral-500 dark:text-neutral-400" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Font Style:</p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 mb-1">
              {fontOptions.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={`px-3 py-2 rounded text-sm border transition-all ${selectedFont === font.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm" : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
                  style={{
                    fontFamily: font.style,
                    minHeight: "42px",
                    minWidth: isMobileDevice ? "100%" : "auto",
                  }}
                  aria-label={`Select ${font.name} font`}
                >
                  <span className="block text-center">
                    {font.name}
                    <span className="block text-[10px] opacity-60">{font.preview}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="text-center text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
              Selected Font:{" "}
              <span className="font-medium" style={{ fontFamily: getActiveFont() }}>
                {fontOptions.find((f) => f.id === selectedFont)?.name || "Inter"}
              </span>
            </div>
          </div>

          {/* Theme selector dengan grid layout untuk layar kecil */}
          <div>
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mb-2">Card Style:</p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {/* Tombol-tombol tema dengan ukuran yang lebih besar untuk mobile */}
              <button
                onClick={() => setTheme("neutralLight")}
                className={`w-14 h-14 sm:w-12 sm:h-12 rounded flex items-center justify-center border-2 ${theme === "neutralLight" ? "border-neutral-600" : "border-neutral-300"}`}
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
                className={`w-14 h-14 sm:w-12 sm:h-12 rounded flex items-center justify-center border-2 ${theme === "neutralDark" ? "border-neutral-600" : "border-neutral-300"}`}
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
                className={`w-14 h-14 sm:w-12 sm:h-12 rounded flex items-center justify-center border-2 ${theme === "sandstone" ? "border-neutral-600" : "border-neutral-300"}`}
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
                className={`w-14 h-14 sm:w-12 sm:h-12 rounded flex items-center justify-center border-2 ${theme === "chalk" ? "border-neutral-600" : "border-neutral-300"}`}
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
                className={`w-14 h-14 sm:w-12 sm:h-12 rounded flex items-center justify-center border-2 ${theme === "slate" ? "border-neutral-600" : "border-neutral-300"}`}
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

          {/* Background selector dengan ukuran yang lebih besar untuk mobile */}
          <div>
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mb-2">Background Style:</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setBackground("gradient")}
                className={`w-12 h-12 sm:w-10 sm:h-10 rounded border flex items-center justify-center 
                  ${background === "gradient" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Gradient Background"
                style={{
                  background: backgroundStyles.gradient[theme],
                  overflow: "hidden",
                }}
              ></button>
              <button
                onClick={() => setBackground("solid")}
                className={`w-12 h-12 sm:w-10 sm:h-10 rounded border flex items-center justify-center 
                  ${background === "solid" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Solid Background"
                style={{
                  background: backgroundStyles.solid[theme],
                }}
              ></button>
              <button
                onClick={() => setBackground("blur")}
                className={`w-12 h-12 sm:w-10 sm:h-10 rounded border flex items-center justify-center 
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
                className={`w-12 h-12 sm:w-10 sm:h-10 rounded border flex items-center justify-center 
                  ${background === "pattern" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}`}
                aria-label="Pattern Background"
                style={{
                  backgroundImage: backgroundStyles.pattern[theme],
                  backgroundColor: backgroundStyles.solid[theme],
                }}
              ></button>
            </div>
          </div>

          {/* Preview card dengan ukuran yang responsif */}
          <div className="flex justify-center">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg"
              style={{
                width: isMobileDevice ? "200px" : "180px", // Sedikit lebih besar pada mobile
                height: isMobileDevice ? "356px" : "320px", // Tetap proporsi 9:16
                ...getBackgroundStyle(true),
              }}
            >
              {/* Untuk preview tetap menggunakan dimensi tetap dengan teks terpotong */}
              <div
                ref={cardRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md rounded"
                style={{
                  width: isMobileDevice ? "180px" : "160px", // Sedikit lebih besar pada mobile
                  height: isMobileDevice ? "101px" : "90px", // Tetap proporsi 16:9
                  background: currentTheme.background,
                  color: currentTheme.mainColor,
                  fontFamily: currentTheme.fontMain,
                  overflow: "hidden",
                  position: "relative", // Pastikan position relative agar absolute positioning bekerja dengan benar
                }}
              >
                {/* Elemen dekoratif */}
                {renderDecorations(true)}
                {renderQuoteMarks(true)}

                {/* Container konten */}
                <div className="h-full w-full" style={{ padding: "5px" }}>
                  {/* Teks kutipan dengan indikasi terpotong dan font yang dipilih */}
                  <div
                    style={{
                      fontSize: isMobileDevice ? "8px" : "7px", // Sedikit lebih besar pada mobile
                      fontWeight: "500",
                      fontStyle: currentTheme.quoteStyle,
                      lineHeight: "1.5",
                      maxHeight: isMobileDevice ? "55px" : "50px",
                      overflow: "hidden",
                      fontFamily: getActiveFont(), // Menggunakan font yang dipilih
                    }}
                    className="font-apply"
                  >
                    "{selectedText.length > 80 ? `${selectedText.substring(0, 80)}...` : selectedText}"
                  </div>

                  {/* Atribusi sebagai elemen absolut dengan judul konten */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "6px", // Posisi dari bawah card
                      right: "8px", // Posisi dari kanan card
                      fontSize: isMobileDevice ? "6px" : "5px", // Sedikit lebih besar pada mobile
                      fontStyle: "italic",
                      textAlign: "right",
                      color: currentTheme.accentColor,
                      letterSpacing: "0.02em",
                      maxWidth: "80%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: getActiveFont(), // Menggunakan font yang dipilih
                    }}
                    className="font-apply"
                  >
                    {contentTitle && <span className="font-medium">{contentTitle} - </span>}
                    {postTitle.length > 20 ? `${postTitle.substring(0, 20)}...` : postTitle}
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
                    fontSize: isMobileDevice ? "6px" : "5px", // Sedikit lebih besar pada mobile
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
              {/* Card dengan struktur yang sama persis dengan preview dan font konsisten */}
              <div
                style={{
                  width: "320px", // Lebar tetap
                  position: "relative",
                  background: currentTheme.background,
                  color: currentTheme.mainColor,
                  fontFamily: getActiveFont(),
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  borderRadius: "6px",
                  overflow: "visible", // Penting! Memungkinkan konten mengatur tinggi
                }}
              >
                {/* Elemen dekoratif */}
                {renderDecorations()}
                {renderQuoteMarks()}

                {/* Container konten tanpa height yang dapat menyesuaikan, gunakan padding yang sama */}
                <div className="w-full" style={{ padding: "20px" }}>
                  {/* Konten kutipan dengan font yang dipilih */}
                  <div
                    style={{
                      fontSize: selectedText.length > 150 ? "14px" : "15px",
                      fontWeight: "400",
                      lineHeight: "1.6",
                      fontStyle: currentTheme.quoteStyle,
                      letterSpacing: "0.01em",
                      wordWrap: "break-word", // Untuk menangani kata panjang
                      paddingBottom: "30px", // Padding untuk memberikan ruang di bawah teks
                      fontFamily: getActiveFont(), // Menggunakan font yang dipilih
                    }}
                    className="font-apply"
                  >
                    "{selectedText}"
                  </div>

                  {/* Atribusi dengan font yang dipilih dan judul konten */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px", // Posisi dari bawah card
                      right: "12px", // Posisi dari kanan card
                      fontSize: "10px",
                      fontWeight: "500",
                      fontStyle: "italic",
                      color: currentTheme.accentColor,
                      letterSpacing: "0.02em",
                      opacity: 0.8,
                      maxWidth: "80%",
                      textAlign: "right",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      zIndex: 20, // Pastikan z-index lebih tinggi
                      fontFamily: getActiveFont(), // Menggunakan font yang dipilih
                    }}
                    className="font-apply"
                  >
                    {contentTitle && <span className="font-medium">{contentTitle} - </span>}
                    {postTitle}
                  </div>
                </div>
              </div>

              {/* Watermark di pojok kanan bawah */}
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
              <img src={generatedImage} alt="Generated quote" className="max-h-[180px] sm:max-h-[200px] w-auto max-w-full rounded-md shadow-md border border-neutral-200 dark:border-neutral-700" style={{ touchAction: "manipulation" }} onContextMenu={(e) => e.preventDefault()} />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
              {error}
              <button className="ml-2 underline text-red-600 dark:text-red-400 py-2 px-3 mt-1" onClick={() => setError(null)} style={{ minHeight: "40px", display: "inline-block" }}>
                Dismiss
              </button>
            </div>
          )}

          {/* Actions - tombol-tombol */}
          <div className="flex flex-col space-y-4 pt-1">
            {/* Tombol download */}
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className={`px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                transition-colors font-medium flex items-center justify-center 
                min-h-[52px] text-base
                ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
              style={{ touchAction: "manipulation" }}
            >
              <Download className="w-5 h-5 mr-2" />
              {isGenerating ? "Generating..." : "Download Image"}
            </button>

            {/* Tombol share ke media sosial */}
            {showSocialOptions && (
              <div className="flex flex-col space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 mt-1">
                <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mb-1">Share to social media:</p>
                <div className="flex justify-center space-x-6">
                  {/* Twitter */}
                  <button onClick={() => shareToSocial("twitter")} className="p-3.5 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Twitter" style={{ minWidth: "52px", minHeight: "52px", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "manipulation" }}>
                    <Twitter className="w-5 h-5" />
                  </button>

                  {/* Facebook */}
                  <button onClick={() => shareToSocial("facebook")} className="p-3.5 rounded-full bg-[#1877F2] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Facebook" style={{ minWidth: "52px", minHeight: "52px", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "manipulation" }}>
                    <Facebook className="w-5 h-5" />
                  </button>

                  {/* Instagram */}
                  <button onClick={() => shareToSocial("instagram")} className="p-3.5 rounded-full bg-[#E1306C] text-white hover:bg-opacity-90 transition-colors" aria-label="Share to Instagram" style={{ minWidth: "52px", minHeight: "52px", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "manipulation" }}>
                    <Instagram className="w-5 h-5" />
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
