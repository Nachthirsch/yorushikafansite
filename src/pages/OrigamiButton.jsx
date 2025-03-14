import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Moon, Star, Music, MoveLeft, Sparkles, FileMusic, BookOpen, Moon as MoonIcon } from "lucide-react";

const OrigamiButton = ({ to = "#", label = "Button Label", icon = "moon", secondary = false, size = "default", disabled = false, external = false, onClick, ariaLabel }) => {
  /// Referensi untuk animasi hover yang lebih canggih
  const buttonRef = useRef(null);

  /// Helper function untuk memilih icon yang tepat dari Lucide React
  const renderIcon = () => {
    switch (icon) {
      case "moon":
        /// Icon bulan untuk fitur tema gelap atau konsep malam
        return <MoonIcon className="w-3.5 h-3.5" aria-hidden="true" />;
      case "star":
        /// Icon bintang untuk menandai fitur favorit atau highlights
        return <Star className="w-3.5 h-3.5" aria-hidden="true" />;
      case "music":
        /// Icon musik untuk navigasi ke halaman audio atau playlist
        return <Music className="w-3.5 h-3.5" aria-hidden="true" />;
      case "arrow":
        /// Icon panah untuk navigasi atau kembali ke halaman sebelumnya
        return <MoveLeft className="w-3.5 h-3.5" aria-hidden="true" />;
      case "sparkles":
        /// Icon kilau untuk konten spesial atau fitur baru
        return <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />;
      case "album":
        /// Icon file musik untuk koleksi album
        return <FileMusic className="w-3.5 h-3.5" aria-hidden="true" />;
      case "book":
        /// Icon buku untuk konten artikel atau lirik
        return <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />;
      default:
        return <MoonIcon className="w-3.5 h-3.5" aria-hidden="true" />;
    }
  };

  /// Styling untuk size variants - lebih fleksibel untuk responsivitas
  const sizeClasses = {
    tiny: "px-3 py-1.5 text-xs",
    small: "px-3.5 py-2 text-xs",
    default: "px-5 py-2.5 text-sm",
    large: "px-7 py-3.5 text-base",
  };

  /// Membangun class untuk status disabled
  const disabledClasses = disabled ? "opacity-60 pointer-events-none cursor-not-allowed" : "cursor-pointer hover:shadow-sm";

  /// Komponen wrapper berdasarkan jenis link (internal, external, atau button)
  const ButtonWrapper = ({ children }) => {
    if (disabled || onClick) {
      return (
        <motion.button
          ref={buttonRef}
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          className={`
            group relative inline-flex items-center justify-center 
            ${sizeClasses[size]}
            ${secondary ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-800 dark:text-neutral-200"}
            ${disabledClasses}
            font-light tracking-wider overflow-hidden z-0
            focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:focus-visible:ring-neutral-600/40
          `}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-label={ariaLabel || label}
        >
          {children}
        </motion.button>
      );
    } else if (external) {
      return (
        <motion.a
          ref={buttonRef}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group relative inline-flex items-center justify-center 
            ${sizeClasses[size]}
            ${secondary ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-800 dark:text-neutral-200"}
            ${disabledClasses}
            font-light tracking-wider overflow-hidden z-0
            focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:focus-visible:ring-neutral-600/40
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-label={ariaLabel || `${label} (opens in new tab)`}
        >
          {children}
        </motion.a>
      );
    } else {
      return (
        <motion.div
          ref={buttonRef}
          className={`
            group relative inline-flex items-center justify-center 
            ${sizeClasses[size]}
            ${secondary ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-800 dark:text-neutral-200"}
            ${disabledClasses}
            font-light tracking-wider overflow-hidden z-0
            focus-within:outline-none
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link to={to} className="absolute inset-0 z-10" aria-label={ariaLabel || label} tabIndex={0} role="button" onKeyDown={(e) => e.key === "Enter" && e.target.click()}>
            <span className="sr-only">{label}</span>
          </Link>
          {children}
        </motion.div>
      );
    }
  };

  return (
    <ButtonWrapper>
      {/* Latar belakang dasar dengan efek origami */}
      <div
        className={`
          absolute inset-0 
          ${secondary ? "bg-neutral-100/30 dark:bg-neutral-900/30" : "bg-neutral-100/70 dark:bg-neutral-900/70"} 
          z-[-1]
          ${disabled ? "bg-opacity-50 dark:bg-opacity-50" : ""}
        `}
      >
        {/* Lipatan sudut kiri atas - meniru origami dengan tekstur halus */}
        <div className="absolute top-0 left-0 w-3 h-3">
          <div
            className={`
              absolute top-0 left-0 w-0 h-0 border-t-[6px] border-l-[6px] 
              border-t-transparent border-l-transparent group-hover:border-t-neutral-200/30 
              dark:group-hover:border-t-neutral-800/30 group-hover:border-l-neutral-200/30 
              dark:group-hover:border-l-neutral-800/30 transition-colors duration-300
              ${disabled ? "opacity-40" : ""}
            `}
          />
          <motion.div className="absolute top-0 left-0 w-3 h-3 origin-top-left" animate={{ rotate: 0 }} whileHover={!disabled ? { rotate: -5 } : {}} transition={{ duration: 0.4 }}>
            <div className="absolute top-0 left-0 w-[1px] h-3 bg-neutral-300/40 dark:bg-neutral-700/40" />
            <div className="absolute top-0 left-0 h-[1px] w-3 bg-neutral-300/40 dark:bg-neutral-700/40" />

            {/* Tambahan titik mikro untuk menambah kedalaman visual */}
            <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-gradient-to-br from-neutral-300/5 dark:from-neutral-700/5 to-transparent" />
          </motion.div>
        </div>

        {/* Lipatan sudut kanan bawah - meniru origami dengan bayangan halus */}
        <div className="absolute bottom-0 right-0 w-4 h-4">
          <div
            className={`
              absolute bottom-0 right-0 w-0 h-0 border-b-[8px] border-r-[8px] 
              border-b-transparent border-r-transparent group-hover:border-b-neutral-200/30 
              dark:group-hover:border-b-neutral-800/30 group-hover:border-r-neutral-200/30 
              dark:group-hover:border-r-neutral-800/30 transition-colors duration-300
              ${disabled ? "opacity-40" : ""}
            `}
          />
          <motion.div className="absolute bottom-0 right-0 w-4 h-4 origin-bottom-right" animate={{ rotate: 0 }} whileHover={!disabled ? { rotate: 5 } : {}} transition={{ duration: 0.4 }}>
            <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-neutral-300/40 dark:bg-neutral-700/40" />
            <div className="absolute bottom-0 right-0 h-[1px] w-4 bg-neutral-300/40 dark:bg-neutral-700/40" />

            {/* Tambahan titik mikro untuk menambah kedalaman visual */}
            <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-gradient-to-tl from-neutral-300/5 dark:from-neutral-700/5 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Efek bayangan lipatan - memberikan kedalaman dengan lapisan bertingkat */}
      <motion.div
        className={`
          absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${disabled ? "opacity-0 !important" : ""}
        `}
        initial={{ opacity: 0 }}
        whileHover={
          !disabled
            ? {
                opacity: 1,
                transition: { duration: 0.3 },
              }
            : {}
        }
      >
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-neutral-200/10 dark:from-neutral-800/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-neutral-200/10 dark:from-neutral-800/10 to-transparent" />

        {/* Tekstur tambahan dengan gradasi subtle */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.01),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.005),transparent)]" />
      </motion.div>

      {/* Efek garis lipatan halus - memberikan tekstur dengan animasi transisi */}
      <div
        className={`
        absolute inset-x-0 top-[3px] h-px bg-gradient-to-r from-transparent via-neutral-300/20 
        dark:via-neutral-700/20 to-transparent scale-x-0 group-hover:scale-x-100 
        transition-transform duration-500
        ${disabled ? "opacity-30" : ""}
      `}
      />
      <div
        className={`
        absolute inset-x-0 bottom-[3px] h-px bg-gradient-to-r from-transparent via-neutral-300/20 
        dark:via-neutral-700/20 to-transparent scale-x-0 group-hover:scale-x-100 
        transition-transform duration-500
        ${disabled ? "opacity-30" : ""}
      `}
      />

      {/* Border utama dengan efek highlight saat hover */}
      <div
        className={`
        absolute inset-0 border border-neutral-200/50 dark:border-neutral-800/50 
        group-hover:border-neutral-300/60 dark:group-hover:border-neutral-700/60 
        transition-colors duration-300
        ${disabled ? "opacity-40" : ""}
      `}
      />

      {/* Border tambahan untuk efek kedalaman yang lebih baik */}
      <div className="absolute inset-[3px] border border-neutral-200/10 dark:border-neutral-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Konten tombol dengan spacing yang seimbang */}
      <div className="relative flex items-center space-x-2 z-0">
        {/* Titik aksen minimalis dengan animasi */}
        <motion.div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-neutral-400/60 dark:bg-neutral-600/60" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />

        {/* Label tombol dengan garis bawah saat hover */}
        <span className="relative">
          <span className="tracking-wide font-light">{label}</span>
          <motion.div className="absolute -bottom-0.5 left-0 right-0 h-px bg-neutral-400/20 dark:bg-neutral-600/20" initial={{ scaleX: 0 }} whileHover={!disabled ? { scaleX: 1 } : {}} transition={{ duration: 0.3 }} />
        </span>

        {/* Pembungkus icon dengan animasi rotasi halus */}
        <motion.span className="flex items-center justify-center w-5 h-5 text-neutral-500 dark:text-neutral-400" whileHover={!disabled ? { rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
          {renderIcon()}
        </motion.span>

        {/* Titik aksen minimalis kedua dengan animasi */}
        <motion.div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-neutral-400/60 dark:bg-neutral-600/60" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* Efek cahaya subtil saat hover - seperti kilau pada kertas */}
      <motion.div
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-neutral-200/5 dark:via-neutral-400/5 to-transparent
          ${disabled ? "opacity-0 !important" : ""}
        `}
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={!disabled ? { opacity: 1, x: "100%" } : {}}
        transition={{ duration: 0.8 }}
      />

      {/* Titik-titik mikro yang muncul saat hover - meniru tekstur kertas halus */}
      <div
        className={`
        absolute top-1 right-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 delay-150
        ${disabled ? "opacity-0 !important" : ""}
      `}
      >
        <span className="block w-[0.5px] h-[0.5px] bg-neutral-400/30 dark:bg-neutral-600/30 rounded-full"></span>
        <span className="block w-[0.5px] h-[0.5px] bg-neutral-400/20 dark:bg-neutral-600/20 rounded-full"></span>
      </div>
      <div
        className={`
        absolute bottom-1 left-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 delay-150
        ${disabled ? "opacity-0 !important" : ""}
      `}
      >
        <span className="block w-[0.5px] h-[0.5px] bg-neutral-400/20 dark:bg-neutral-600/20 rounded-full"></span>
        <span className="block w-[0.5px] h-[0.5px] bg-neutral-400/30 dark:bg-neutral-600/30 rounded-full"></span>
      </div>

      {/* Efek bayangan tipis untuk kedalaman saat hover */}
      <div
        className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        shadow-[0_0_0_1px_rgba(0,0,0,0.01)]
        dark:shadow-[0_0_0_1px_rgba(255,255,255,0.01)]
        ${disabled ? "opacity-0 !important" : ""}
      `}
      ></div>
    </ButtonWrapper>
  );
};

export default OrigamiButton;
