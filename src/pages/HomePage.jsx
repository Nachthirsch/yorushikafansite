import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import yorushikaLogo from "../assets/yorushika.png";
import yorushikaSVG from "../assets/yorushika.svg";
import OrigamiButton from "./OrigamiButton";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Album-inspired decorative motifs */}
      <div className="absolute top-1/4 left-8 w-32 h-32 bg-gradient-to-tr from-sky-100/5 to-transparent dark:from-sky-900/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/4 right-8 w-32 h-32 bg-gradient-to-bl from-amber-100/5 to-transparent dark:from-amber-900/5 rounded-full blur-2xl"></div>

      {/* Floating Musical Notes */}
      <div className="hidden md:block absolute top-40 right-12 opacity-20 dark:opacity-10">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MusicalNoteIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      {/* Additional musical notes with different timing */}
      <div className="hidden md:block absolute top-80 left-14 opacity-10 dark:opacity-5">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <MusicalNoteIcon className="h-12 w-12 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      {/* Welcome Section */}
      <section className="relative pt-44">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Added decorative floating line elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute left-1/4 top-20 w-[1px] h-16 bg-neutral-300/30 dark:bg-neutral-700/30" animate={{ height: [16, 64, 16], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute right-1/4 top-40 w-[1px] h-24 bg-neutral-300/30 dark:bg-neutral-700/30" animate={{ height: [24, 96, 24], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute left-1/3 bottom-20 w-16 h-[1px] bg-neutral-300/20 dark:bg-neutral-700/20" animate={{ width: [16, 64, 16], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute right-1/3 bottom-40 w-12 h-[1px] bg-neutral-300/20 dark:bg-neutral-700/20" animate={{ width: [12, 48, 12], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />

          {/* Eluveitie album-inspired spiral elements */}
          <div className="absolute left-16 top-24 opacity-10 dark:opacity-5">
            <motion.div className="w-24 h-24 border border-neutral-400 dark:border-neutral-600 rounded-full" animate={{ rotate: [0, 360] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
          </div>
          <div className="absolute right-16 bottom-24 opacity-10 dark:opacity-5">
            <motion.div className="w-32 h-32 border border-neutral-400 dark:border-neutral-600 rounded-full" animate={{ rotate: [360, 0] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
          </div>

          {/* Japanese-inspired decorative elements */}
          <div className="absolute top-1/2 left-8 w-px h-32 bg-neutral-300/20 dark:bg-neutral-700/20">
            <motion.div className="absolute -left-1 w-3 h-px bg-neutral-300/30 dark:bg-neutral-700/30" animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
          </div>
          <div className="absolute top-1/2 right-8 w-px h-32 bg-neutral-300/20 dark:bg-neutral-700/20">
            <motion.div className="absolute -right-1 w-3 h-px bg-neutral-300/30 dark:bg-neutral-700/30" animate={{ top: ["100%", "0%", "100%"] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="flex flex-col md:flex-row items-center justify-center text-5xl md:text-6xl font-thin tracking-wide text-neutral-900 dark:text-neutral-100 mb-8">
              <span className="relative pb-2 italic">
                <span className="font-extralight text-neutral-700 dark:text-neutral-300">Welcome to </span>
                <span className="absolute bottom-0 left-1/4 right-1/4 h-px bg-neutral-200 dark:bg-neutral-800"></span>
                <motion.span
                  className="absolute bottom-0 left-1/4 w-1 h-1 bg-neutral-300/40 dark:bg-neutral-700/40 rounded-full"
                  animate={{
                    left: ["25%", "75%", "25%"],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>

              <div className="flex items-center my-3 md:my-0 mx-6 relative">
                {/* Added decorative rotating frame */}
                <motion.div className="absolute -inset-4 border border-neutral-200/20 dark:border-neutral-800/20 rounded-sm" animate={{ rotate: [0, 2, 0, -2, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
                <span className="absolute -inset-2 border-t border-b border-neutral-200 dark:border-neutral-800 opacity-60"></span>
                <img src={yorushikaLogo} alt="Yorushika" className="h-16 md:h-20 w-auto" />

                <motion.div className="absolute -top-6 -right-6 w-4 h-4 rounded-full border border-neutral-400/30 dark:border-neutral-600/30 overflow-hidden" animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0.1)", "0 0 10px rgba(255,255,255,0.2)", "0 0 0px rgba(255,255,255,0.1)"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <motion.div className="absolute inset-0 bg-white dark:bg-white rounded-full" animate={{ x: ["0%", "100%", "0%"] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
                </motion.div>

                {/* Added corner accent lines */}
                <motion.div className="absolute -top-2 -left-2 w-3 h-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                </motion.div>
                <motion.div className="absolute -bottom-2 -right-2 w-3 h-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
                  <div className="absolute bottom-0 right-0 w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                  <div className="absolute bottom-0 right-0 w-[1px] h-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                </motion.div>
              </div>

              <span className="relative italic">
                <span className="font-extralight tracking-wider text-neutral-700 dark:text-neutral-300">Fan Zone</span>
                <div className="absolute top-0 right-0 w-1 h-1 bg-neutral-200 dark:bg-neutral-600"></div>
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-neutral-200 dark:bg-neutral-600"></div>

                {/* Added pulsing corner dot */}
                <motion.div className="absolute -top-2 -right-2 w-1 h-1 rounded-full bg-neutral-400/30 dark:bg-neutral-600/30 shadow-glow" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3], boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 8px rgba(255,255,255,0.5)", "0 0 0px rgba(255,255,255,0)"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
              </span>
            </h1>
          </motion.div>
          <div className="mt-4 mb-6">
            {/* Diganti dengan efek fade in per kata */}
            <div className="text-sm text-neutral-500 dark:text-neutral-500 italic flex flex-wrap justify-center gap-x-1.5">
              {['"The', "unerring,", "faultless", "light", "that", "can", "only", "illuminate", "the", "night.", "Unimaginably", "soft,", "dazzling", "beyond", "my", "wildest", "dreams,", "pale"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + 19 * 0.1, duration: 0.5 }} className="relative inline-block">
                <span className="relative z-10">moonlight</span>
                <span className="absolute inset-0 bg-neutral-100/20 blur-sm rounded-full animate-pulse-slow"></span>
              </motion.span>
            </div>
          </div>
          {/* Added decorative divider with animation and slide-in effect */}
          <motion.div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" initial={{ opacity: 0, x: -100, width: 0 }} animate={{ opacity: 1, x: 0, width: "8rem" }} transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }} />
          <motion.div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "8rem" }} transition={{ duration: 1.5, delay: 0.3 }} />
          {/* Eluveitie album reference - subtle moon symbol */}
          <div className="mt-6 mb-8 flex justify-center">
            <div className="flex items-center space-x-1 opacity-40">
              <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
              <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
              <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row justify-center gap-5 mt-8 relative">
            {/* Latar belakang animasi halus */}
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-200/5 via-transparent to-neutral-200/5 dark:from-neutral-800/5 dark:to-neutral-800/5 rounded-lg opacity-0"
              animate={{
                opacity: [0, 0.5, 0],
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 100%" }}
            />

            {/* Tombol Origami utama untuk halaman musik */}
            <OrigamiButton to="/albums" label="Discover Music" icon="music" />

            {/* Tombol Origami sekunder untuk halaman about */}
            <OrigamiButton to="/about" label="About" icon="star" secondary={true} />
          </motion.div>

          {/* Song lyrics easter egg */}
          <motion.div className="mt-16 text-xs text-neutral-400 dark:text-neutral-600 opacity-0 hover:opacity-70 transition-opacity cursor-default" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 2 }}>
            夜しかもう眠れずに
          </motion.div>
        </div>
      </section>

      {/* Band Information Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Band Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="mt-24">
            <div className="max-w-2xl mx-auto pb-24 px-6 relative">
              {/* Corner accents - enhanced with delicate dotted patterns */}
              <div className="absolute -left-2 -top-2 w-6 h-6 border-l-2 border-t-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-tl-sm"></div>
              <div className="absolute -right-2 -top-2 w-6 h-6 border-r-2 border-t-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-tr-sm"></div>
              <div className="absolute -left-2 -bottom-2 w-6 h-6 border-l-2 border-b-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-bl-sm"></div>
              <div className="absolute -right-2 -bottom-2 w-6 h-6 border-r-2 border-b-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-br-sm"></div>

              {/* Corner dots - new minimalist embellishments */}
              <div className="absolute -left-3 -top-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>
              <div className="absolute -right-3 -top-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>
              <div className="absolute -left-3 -bottom-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>
              <div className="absolute -right-3 -bottom-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>

              {/* New outer corner micro-dots - extra subtle depth */}
              <div className="absolute -left-4 -top-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              <div className="absolute -right-4 -top-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              <div className="absolute -left-4 -bottom-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              <div className="absolute -right-4 -bottom-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>

              {/* Decorative elements - minimalist lines and new accent patterns */}
              <div className="absolute left-0 top-12 w-4 h-px bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="absolute right-0 top-12 w-4 h-px bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="absolute left-4 bottom-24 w-px h-16 bg-neutral-200 dark:bg-neutral-800 opacity-70"></div>
              <div className="absolute right-4 bottom-24 w-px h-16 bg-neutral-200 dark:bg-neutral-800 opacity-70"></div>
              <div className="absolute left-0 top-0 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>
              <div className="absolute right-0 bottom-0 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>

              {/* New middle accent lines */}
              <div className="absolute left-8 top-0 h-px w-12 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
              <div className="absolute right-8 bottom-0 h-px w-12 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>

              {/* New mid-side decorative elements */}
              <div className="absolute -left-1 top-1/3 flex flex-col space-y-1">
                <div className="w-0.5 h-3 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                <div className="w-1.5 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20"></div>
              </div>
              <div className="absolute -right-1 bottom-1/3 flex flex-col items-end space-y-1">
                <div className="w-0.5 h-3 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                <div className="w-1.5 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20"></div>
              </div>

              {/* Diagonal accent lines - refined with proper spacing */}
              <div className="absolute left-0 top-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 rotate-45"></div>
              <div className="absolute right-0 top-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 -rotate-45"></div>
              <div className="absolute left-0 bottom-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 -rotate-45"></div>
              <div className="absolute right-0 bottom-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 rotate-45"></div>

              {/* New diagonal pairs - subtle reinforcement */}
              <div className="absolute left-0 top-1/3 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30 rotate-45"></div>
              <div className="absolute left-0 top-1/3 translate-y-1 w-1 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20 rotate-45"></div>
              <div className="absolute right-0 bottom-1/3 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30 -rotate-45"></div>
              <div className="absolute right-0 bottom-1/3 translate-y-1 w-1 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20 -rotate-45"></div>

              {/* New subtle micropatterns */}
              <div className="absolute left-1/4 top-0 flex space-x-1">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
              </div>
              <div className="absolute right-1/4 bottom-0 flex space-x-1">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              </div>

              {/* New micro-pattern groups on sides */}
              <div className="absolute left-1/2 -translate-x-20 top-0 flex space-x-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-30"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-10"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
              </div>
              <div className="absolute right-1/2 translate-x-20 bottom-0 flex space-x-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-10"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-30"></div>
              </div>

              <div className="mb-10 text-center relative">
                {/* Decorative circles with refined positioning */}
                <div className="absolute -left-1 -top-6 w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 opacity-60"></div>
                <div className="absolute -right-1 -top-6 w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 opacity-60"></div>

                {/* New decorative micro-elements */}
                <div className="absolute left-1/3 -top-3 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>
                <div className="absolute right-1/3 -top-3 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>

                {/* New decorative corners above title */}
                <div className="absolute left-1/4 -top-5 w-3 h-3">
                  <div className="absolute top-0 left-0 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                  <div className="absolute top-0 left-0 h-2 w-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                </div>
                <div className="absolute right-1/4 -top-5 w-3 h-3">
                  <div className="absolute top-0 right-0 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                  <div className="absolute top-0 right-0 h-2 w-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                </div>

                {/* Thin horizontal lines flanking the title - with enhanced lengths */}
                <div className="absolute left-0 top-1/2 w-10 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40"></div>
                <div className="absolute right-0 top-1/2 w-10 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40"></div>
                <div className="absolute right-0 top-1/2 w-10 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40"></div>

                <h2 className="text-2xl font-extralight tracking-wide text-neutral-900 dark:text-neutral-100">
                  About{" "}
                  <span className="font-normal relative">
                    <img src={yorushikaLogo} alt="Yorushika" className="h-6 md:h-8 inline-block" />
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-800 opacity-70"></span>
                  </span>
                </h2>

                {/* Enhanced title underline with subtle animation */}
                <div className="mt-1 h-px w-16 mx-auto bg-neutral-300 dark:bg-neutral-700 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-neutral-400 dark:bg-neutral-600 w-5 opacity-50"
                    style={{
                      animation: "moveLight 4s ease-in-out infinite",
                    }}
                  ></div>
                </div>
              </div>

              {/* Enhanced subtle gradient background with refined border frame */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-100/30 dark:via-neutral-900/30 to-transparent opacity-20 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-0 border border-neutral-200/30 dark:border-neutral-800/30 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-x-4 top-2 bottom-2 border-t border-b border-neutral-200/20 dark:border-neutral-800/20 rounded pointer-events-none"></div>

              {/* New inner border accent */}
              <div className="absolute inset-x-8 top-4 bottom-4 border-t border-b border-neutral-200/10 dark:border-neutral-800/10 rounded pointer-events-none"></div>

              {/* New subtle corner highlights */}
              <div className="absolute top-1 left-1 w-8 h-8 bg-gradient-to-br from-white/5 to-transparent rounded-tl-xl pointer-events-none"></div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-tl from-white/5 to-transparent rounded-br-xl pointer-events-none"></div>

              {/* New opposite corner highlights - even more subtle */}
              <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-bl from-white/3 to-transparent rounded-tr-xl pointer-events-none"></div>
              <div className="absolute bottom-1 left-1 w-6 h-6 bg-gradient-to-tr from-white/3 to-transparent rounded-bl-xl pointer-events-none"></div>

              <div className="space-y-5 text-neutral-700 dark:text-neutral-300 text-sm md:text-lg font-light relative">
                {/* Decorative quote marks - refined with better positioning */}
                <div className="absolute -left-4 top-0 text-3xl opacity-10 dark:opacity-5 font-serif text-neutral-400 dark:text-neutral-600">❝</div>
                <div className="absolute -right-4 bottom-12 text-3xl opacity-10 dark:opacity-5 font-serif text-neutral-400 dark:text-neutral-600">❞</div>

                {/* New mid-content decorative elements */}
                <div className="absolute left-2 top-1/2 -translate-y-4 w-1 h-1 rounded-full border border-neutral-300/20 dark:border-neutral-700/20"></div>
                <div className="absolute right-2 bottom-1/3 w-1 h-1 rounded-full border border-neutral-300/20 dark:border-neutral-700/20"></div>
                <p className="leading-relaxed">
                  <span className="font-normal text-neutral-800 dark:text-neutral-200">Yorushika (ヨルシカ)</span> is a Japanese rock duo founded in 2017 represented by Universal Music Japan. The group consists of composer n-buna and vocalist suis.
                </p>

                <p className="leading-relaxed">They are known for their juxtaposition of "passionate" and "upbeat" production and instrumentation fused with heavier lyrical content, which often explores themes of youth, disillusionment, and the passage of time.</p>

                <p className="leading-relaxed">
                  The name "Yorushika" is taken from a lyric in their song "Kumo to Yūrei" (雲と幽霊): <span className="italic">"Yoru shika mō nemurezu ni"</span> (夜しかもう眠れずに), meaning "I can only sleep at night".
                </p>

                {/* Fixed structure: replaced p with div to avoid invalid nesting */}
                <div className="leading-relaxed flex items-center">
                  <span>The eye-designed logo mark</span>
                  <div className="inline-block mx-4 relative group">
                    <img src={yorushikaSVG} alt="Yorushika logo" className="h-16 w-16 invert group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute inset-0 border-t border-b border-transparent hover:border-neutral-200/30 dark:hover:border-neutral-800/30 transition-colors duration-300"></div>
                    {/* New logo highlight effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-radial-gradient from-white via-transparent to-transparent transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                  <span>
                    is a motif of two moons facing each other and also serves as a clock hand, portraying the time "from 6:00 to night"
                    <span className="h-px w-3 bg-neutral-300 dark:bg-neutral-700 opacity-50 inline-block ml-2"></span>
                  </span>
                </div>

                {/* New text content divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200/20 dark:via-neutral-800/20 to-transparent my-6"></div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            {/* n-buna */}
            <div className="space-y-6">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src="https://ecyslymbkygpfekwlbhr.supabase.co/storage/v1/object/sign/yorushikafansite/nbuna.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ5b3J1c2hpa2FmYW5zaXRlL25idW5hLnBuZyIsImlhdCI6MTc0MjIxNjAxNCwiZXhwIjoxODM2ODI0MDE0fQ.cz9hHkCSkTzOgfT14ADs6j2yrSLRdTJx2slv3ZqML-k" // Replace with actual image path
                  alt="n-buna"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">n-buna</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">Composer / Arranger</p>
              </div>
            </div>

            {/* suis */}
            <div className="space-y-6">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src="https://ecyslymbkygpfekwlbhr.supabase.co/storage/v1/object/sign/yorushikafansite/suis.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ5b3J1c2hpa2FmYW5zaXRlL3N1aXMucG5nIiwiaWF0IjoxNzQyMjE2MDQ3LCJleHAiOjE4MzY4MjQwNDd9.yJztSvbjVr27021tU0q56zQBHznOkn4eyDsPJP1sxxg" // Replace with actual image path
                  alt="suis"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">suis</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">Vocalist</p>
              </div>
            </div>
          </motion.div>{" "}
          {/* Supporting Members */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="mt-16">
            <h3 className="text-2xl font-light text-center text-neutral-900 dark:text-neutral-100 mb-8">Supporting Members</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  name: "Shimozuru Mitsuyasu",
                  role: "Guitar",
                  image: "https://i.kfs.io/album/global/242317934,0v1/fit/500x500.jpg",
                  socialUrl: "https://x.com/simomits",
                  socialType: "Twitter",
                },
                {
                  name: "Tatsuya Kitani",
                  role: "Bass",
                  image: "https://i.scdn.co/image/ab6761610000e5eb8f3b2ac021a12b2bd5f19edd",
                  socialUrl: "https://twitter.com/tatsuyakitani",
                  socialType: "Twitter",
                },
                {
                  name: "Masack",
                  role: "Drums",
                  image: "https://media.vgm.io/artists/61/39816/39816-1614202935.jpg",
                  socialUrl: "https://x.com/kojimasa",
                  socialType: "Instagram",
                },
                {
                  name: "Tetsuya Hirahata",
                  role: "Piano",
                  image: "https://images.genius.com/9919e31807c90305e09f901afd71d3fd.630x630x1.jpg",
                  socialUrl: "https://x.com/8ch_piano",
                  socialType: "Twitter",
                },
              ].map((member, index) => (
                <div key={index} className="text-center space-y-4">
                  {/* Gambar yang bisa diklik dengan indikator sosial media */}
                  <a href={member.socialUrl} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-lg relative group">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90" />

                    {/* Overlay saat hover */}
                    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/30 transition-all duration-300 flex items-center justify-center">
                      {/* Ikon sosial media yang muncul saat hover */}
                      <div className="bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 px-3 py-1.5 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5">
                        {member.socialType === "Twitter" ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        ) : member.socialType === "Instagram" ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        )}
                        <span>{member.socialType}</span>
                      </div>
                    </div>

                    {/* Indikator sudut - menunjukkan bahwa item bisa diklik */}
                    <div className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-0 right-0 w-2 h-[1px] bg-white"></div>
                      <div className="absolute top-0 right-0 h-2 w-[1px] bg-white"></div>
                    </div>
                  </a>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{member.name}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
