import { motion, AnimatePresence } from "framer-motion";
import { ShareIcon } from "@heroicons/react/24/outline";

export default function FloatingShareButton({ isVisible, position, onClick }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y - window.scrollY}px`,
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
          className="pointer-events-auto"
        >
          <button
            onClick={onClick}
            className="group relative flex items-center justify-center p-3 rounded-full 
              bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 
              shadow-lg transition-all duration-200 backdrop-blur-sm 
              ring-2 ring-white/80 dark:ring-black/20"
          >
            <ShareIcon className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform" />
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
              text-xs font-medium text-white bg-neutral-800 dark:bg-neutral-900 
              rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200
              whitespace-nowrap shadow-lg pointer-events-none"
            >
              Share this text
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
