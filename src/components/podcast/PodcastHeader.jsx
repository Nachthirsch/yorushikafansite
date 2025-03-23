import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, Mic, Radio, Volume2, Twitter, Instagram, Share2, ExternalLink } from "lucide-react";
import { useLatestEpisode } from "../../hooks/usePodcasts";
import yorucastLogo from "../../assets/YORUCAST.png"; // Import logo Yorucast

/**
 * Komponen header untuk halaman podcast (Yorucast)
 * Menampilkan judul, ilustrasi, dan informasi terbaru podcast
 * Dengan desain minimalis bergaya jepang
 * Termasuk social media links untuk koneksi dengan audiens
 */
export default function PodcastHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: latestEpisode, isLoading } = useLatestEpisode();

  useEffect(() => {
    // Animasi fade-in saat komponen dimuat
    setIsVisible(true);
  }, []);

  return (
    <header className="relative overflow-hidden">
      {/* Gradient overlay untuk visual depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/30 via-transparent to-neutral-900/40 z-10" />

      {/* Background layer dengan pola minimal */}
      <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 opacity-80 dark:opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#f5f5f5_20%,_#f5f5f5_80%,_transparent_80%)] dark:bg-[radial-gradient(circle,_transparent_20%,_#171717_20%,_#171717_80%,_transparent_80%)] bg-opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))] bg-[length:24px_24px]" />
      </div>

      {/* Content container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }} transition={{ duration: 0.7, ease: "easeOut" }} className="flex flex-col items-center text-center">
          {/* Title with decorative element */}
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {/* Radio icon representing podcast - decorative element */}
            <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />

            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 font-medium">Yorucast</h2>
          </div>

          {/* Logo Yorucast menggantikan judul teks */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6, type: "spring" }} className="mb-6 sm:mb-8 relative">
            {/* Decorative subtle glow effect behind logo */}
            <div className="absolute -inset-2 bg-neutral-200 dark:bg-neutral-700/30 blur-xl opacity-50 dark:opacity-70 rounded-full"></div>

            {/* Container untuk logo dengan efek hover yang halus */}
            <div className="relative group">
              <img
                src={yorucastLogo}
                alt="Yorucast"
                className="h-20 sm:h-28 md:h-36 lg:h-40 w-auto object-contain relative z-10 
                          transition-all duration-500 group-hover:scale-[1.02]
                          drop-shadow-md group-hover:drop-shadow-lg invert"
              />

              {/* Subtle decorative elements */}
              <div className="absolute -bottom-2 -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-500 to-transparent opacity-50"></div>
              <div className="absolute -bottom-4 left-10 right-10 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent opacity-30"></div>
            </div>
          </motion.div>

          {/* Tagline with subtle line decoration */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="h-px w-6 sm:w-10 bg-neutral-300 dark:bg-neutral-700" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Discussions, Insights & Stories About Yorushika</p>
            <div className="h-px w-6 sm:w-10 bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* Social Media Bar - more prominent under tagline */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex items-center justify-center gap-3 mb-8">
            <div
              className="px-4 py-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 
                          dark:border-neutral-700 shadow-sm flex items-center gap-4"
            >
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Follow us:</span>

              {/* Social media links with descriptive text */}
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/yorucast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                            dark:hover:text-white transition-colors"
                  aria-label="Twitter profile"
                >
                  {/* Twitter icon with text label */}
                  <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="text-xs font-medium">Twitter</span>
                </a>

                <span className="h-3 w-px bg-neutral-200 dark:bg-neutral-700"></span>

                <a
                  href="https://www.instagram.com/yorucast/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                            dark:hover:text-white transition-colors"
                  aria-label="Instagram profile"
                >
                  {/* Instagram icon with text label */}
                  <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="text-xs font-medium">Instagram</span>
                </a>

                <span className="h-3 w-px bg-neutral-200 dark:bg-neutral-700"></span>

                <a
                  href="https://discord.gg/va7A8vBAKF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                            dark:hover:text-white transition-colors group"
                  aria-label="Discord server"
                >
                  {/* External link icon with text label for Discord */}
                  <ExternalLink className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-medium">Discord</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Loading state */}
          {isLoading && (
            <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-5 flex items-center justify-center">
              <div className="animate-pulse flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">Loading latest episode...</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Decorative wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-800" />
    </header>
  );
}
