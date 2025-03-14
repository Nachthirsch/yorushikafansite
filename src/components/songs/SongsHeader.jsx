import React from "react";
import { motion } from "framer-motion";
import { Disc3, Music } from "lucide-react";

export default function SongsHeader() {
  return (
    <header className="relative pt-32 pb-24 mb-16 overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block mb-6">
          <div className="h-16 w-16 bg-white dark:bg-neutral-800 mx-auto shadow-sm flex items-center justify-center relative z-10">
            <Music className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
          Song Collection
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
          Discover Yorushika's complete song library
        </motion.p>
      </div>
    </header>
  );
}
