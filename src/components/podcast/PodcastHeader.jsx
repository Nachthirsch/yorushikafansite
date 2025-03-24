import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, Mic, Radio, Volume2, Share2 } from "lucide-react";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { useLatestEpisode } from "../../hooks/usePodcasts";
import yorucastLogo from "../../assets/YORUCAST.png";

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
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-28">
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
            {/* Enhanced social media links container with improved depth and subtle decorative elements */}
            <div
              className="px-6 py-3 bg-white/90 dark:bg-neutral-800/80 rounded-xl border border-neutral-200/80
              dark:border-neutral-700/60 shadow-md hover:shadow-lg transition-all duration-500
              backdrop-blur-sm relative overflow-hidden group"
            >
              {/* Decorative background elements with improved visual depth */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-neutral-50/40 to-neutral-100/20 
                  dark:from-neutral-800/40 dark:to-neutral-900/20 opacity-80"
              ></div>

              {/* Enhanced top light effect */}
              <div
                className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r 
                  from-transparent via-white/70 dark:via-neutral-400/30 to-transparent"
              ></div>

              {/* Enhanced bottom shadow effect */}
              <div
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r 
                  from-transparent via-neutral-300/70 dark:via-neutral-600/30 to-transparent"
              ></div>

              {/* Subtle decorative corner accents */}
              <div
                className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neutral-200 dark:border-neutral-700/50 
                  rounded-tl-lg opacity-50"
              ></div>
              <div
                className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neutral-200 dark:border-neutral-700/50 
                  rounded-tr-lg opacity-50"
              ></div>
              <div
                className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-neutral-200 dark:border-neutral-700/50 
                  rounded-bl-lg opacity-50"
              ></div>
              <div
                className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-neutral-200 dark:border-neutral-700/50 
                  rounded-br-lg opacity-50"
              ></div>

              {/* Content wrapper with improved spacing */}
              <div className="flex flex-wrap items-center gap-5 relative z-10 sm:flex-nowrap">
                {/* Label with enhanced typography */}
                <span
                  className="text-xs font-medium text-neutral-600 dark:text-neutral-400 tracking-wide 
                    relative after:content-[''] after:absolute after:-bottom-1 after:left-0 
                    after:w-full after:h-px after:bg-neutral-300/50 dark:after:bg-neutral-600/30"
                >
                  Follow us:
                </span>

                {/* Social media links with enhanced hover effects */}
                <div className="flex items-center gap-4">
                  {/* Twitter link with improved hover animation */}
                  <a
                    href="https://x.com/yorucast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                  dark:hover:text-white transition-all duration-300 px-2.5 py-1.5 rounded-lg
                  hover:bg-neutral-100/90 dark:hover:bg-neutral-700/70 group/link relative
                  hover:shadow-sm"
                    aria-label="Twitter profile"
                  >
                    {/* Twitter icon with enhanced hover animation */}
                    <span className="relative overflow-hidden inline-block w-4 h-4">
                      <FaTwitter
                        className="w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              group-hover/link:scale-0 transition-all duration-300"
                        aria-hidden="true"
                      />
                      <FaTwitter
                        className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0
                              text-blue-400 dark:text-blue-300 group-hover/link:scale-100 
                              transition-all duration-300 group-hover/link:rotate-12"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs font-medium relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">Twitter</span>
                      <span className="block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover/link:-translate-y-0">Twitter</span>
                    </span>
                  </a>

                  {/* Enhanced divider with subtle gradient */}
                  <div className="h-4 w-[1px] bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-600 to-transparent opacity-60"></div>

                  {/* Instagram link with consistent enhanced hover animation */}
                  <a
                    href="https://www.instagram.com/yorucast/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                  dark:hover:text-white transition-all duration-300 px-2.5 py-1.5 rounded-lg
                  hover:bg-neutral-100/90 dark:hover:bg-neutral-700/70 group/link relative
                  hover:shadow-sm"
                    aria-label="Instagram profile"
                  >
                    {/* Instagram icon with enhanced hover animation */}
                    <span className="relative overflow-hidden inline-block w-4 h-4">
                      <FaInstagram
                        className="w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                group-hover/link:scale-0 transition-all duration-300"
                        aria-hidden="true"
                      />
                      <FaInstagram
                        className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0
                                text-pink-500 dark:text-pink-400 group-hover/link:scale-100 
                                transition-all duration-300 group-hover/link:rotate-12"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs font-medium relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">Instagram</span>
                      <span className="block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover/link:-translate-y-0">Instagram</span>
                    </span>
                  </a>

                  {/* Enhanced divider with subtle gradient */}
                  <div className="h-4 w-[1px] bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-600 to-transparent opacity-60"></div>

                  {/* Discord link with consistent enhanced hover animation */}
                  <a
                    href="https://discord.gg/va7A8vBAKF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                  dark:hover:text-white transition-all duration-300 px-2.5 py-1.5 rounded-lg
                  hover:bg-neutral-100/90 dark:hover:bg-neutral-700/70 group/link relative
                  hover:shadow-sm"
                    aria-label="Discord server"
                  >
                    {/* Discord icon with enhanced hover animation */}
                    <span className="relative overflow-hidden inline-block w-4 h-4">
                      <FaDiscord
                        className="w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              group-hover/link:scale-0 transition-all duration-300"
                        aria-hidden="true"
                      />
                      <FaDiscord
                        className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0
                              text-indigo-400 dark:text-indigo-300 group-hover/link:scale-100 
                              transition-all duration-300 group-hover/link:rotate-12"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs font-medium relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">Discord</span>
                      <span className="block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover/link:-translate-y-0">Discord</span>
                    </span>
                  </a>
                </div>
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
