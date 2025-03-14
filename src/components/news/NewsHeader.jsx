import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";

export default function NewsHeader() {
  return (
    <header className="relative pt-32 pb-24 mb-16 overflow-hidden" role="banner" aria-label="News section header">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

      {/* Minimalist line patterns - top left */}
      <div className="absolute top-20 left-10 z-0 opacity-20 dark:opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`line-tl-${i}`}
            className="h-px bg-neutral-400 dark:bg-neutral-600 mb-8"
            style={{ width: `${80 + i * 40}px` }}
            animate={{
              width: [`${80 + i * 40}px`, `${120 + i * 20}px`, `${80 + i * 40}px`],
              opacity: [0.2, 0.5, 0.2],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Minimalist line patterns - bottom right */}
      <div className="absolute bottom-10 right-10 z-0 opacity-20 dark:opacity-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`line-br-${i}`}
            className="h-px bg-neutral-400 dark:bg-neutral-600 mb-8 ml-auto"
            style={{ width: `${100 + i * 30}px` }}
            animate={{
              width: [`${100 + i * 30}px`, `${160 + i * 20}px`, `${100 + i * 30}px`],
              opacity: [0.3, 0.6, 0.3],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 7 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated geometric elements */}
      <motion.div
        className="absolute left-1/4 top-40 w-40 h-40 border border-neutral-300/20 dark:border-neutral-600/20 rounded-full z-0 opacity-20 dark:opacity-10"
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.div
        className="absolute right-1/4 bottom-10 w-24 h-24 border-t border-r border-neutral-300/20 dark:border-neutral-600/20 z-0 opacity-20 dark:opacity-10"
        animate={{
          rotate: [-10, 10, -10],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated diagonal lines */}
      <div className="absolute -left-10 top-1/4 w-40 h-40 z-0 opacity-15 dark:opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-neutral-400 dark:text-neutral-600">
          <motion.line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.line x1="0" y1="70" x2="70" y2="0" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        </svg>
      </div>

      <div className="absolute right-0 bottom-20 w-40 h-40 z-0 opacity-15 dark:opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-neutral-400 dark:text-neutral-600">
          <motion.line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
          <motion.line x1="30" y1="0" x2="100" y2="70" stroke="currentColor" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
        </svg>
      </div>

      {/* Minimalist wave element */}
      <div className="absolute left-0 right-0 top-44 flex justify-center z-0 opacity-20 dark:opacity-10 overflow-hidden">
        <div className="w-3/4 h-20 flex items-end">
          <svg width="100%" height="40" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <motion.path
              d="M0,50 Q250,20 500,50 Q750,80 1000,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-neutral-400 dark:text-neutral-600"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, 0.8],
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.path
              d="M0,50 Q250,80 500,50 Q750,20 1000,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-neutral-400 dark:text-neutral-600"
              animate={{
                y: [0, 10, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>

      {/* Animated dots - subtle visualization */}
      <div className="absolute left-0 right-0 top-60 flex justify-center z-0 opacity-20 dark:opacity-10">
        <div className="flex items-end space-x-2">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600"
              animate={{
                y: [0, -8 * Math.sin((i / 12) * Math.PI), 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Minimalist icon with animated outline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block mb-6 mx-auto relative">
          <div className="h-16 w-16 bg-white dark:bg-neutral-800 mx-auto shadow-sm flex items-center justify-center relative z-10 overflow-hidden">
            <motion.div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-700 origin-left" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} />
            <BookOpen className="h-8 w-8 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
          </div>

          {/* Animated outline */}
          <motion.div className="absolute -inset-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <svg className="w-[calc(100%+8px)] h-[calc(100%+8px)] -ml-1 -mt-1 absolute" viewBox="0 0 72 72">
              <motion.rect x="0" y="0" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-300 dark:text-neutral-600" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} />
            </svg>
          </motion.div>
        </motion.div>

        {/* Title with line drawing animation */}
        <div className="relative inline-block mb-1">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
            Lore
          </motion.h1>
          <div className="absolute -bottom-2 left-0 right-0 overflow-hidden">
            <motion.div className="h-px bg-neutral-400 dark:bg-neutral-600" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }} />
            <motion.div className="h-px bg-neutral-400/50 dark:bg-neutral-600/50 mt-1" initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1, delay: 1, ease: "easeInOut" }} />
          </div>
        </div>

        {/* Description with subtle reveal */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-10 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Stay updated with the latest stories and announcements from Yorushika
        </motion.p>

        {/* Minimalist animated separator */}
        <div className="mt-12 flex justify-center items-center space-x-4">
          <motion.div className="h-px w-12 bg-neutral-300 dark:bg-neutral-700" animate={{ width: ["48px", "20px", "48px"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 0.8, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full"
          />
          <motion.div className="h-px w-12 bg-neutral-300 dark:bg-neutral-700" animate={{ width: ["20px", "48px", "20px"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
    </header>
  );
}
