import { motion, AnimatePresence } from "framer-motion";
import { ShareIcon } from "@heroicons/react/24/outline";

export default function FloatingShareButton({ isVisible, position, onClick, isQuoteMode = false }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed z-40"
          style={{
            left: `${position.x}px`,
            top: `${position.y - 60}px`,
            transform: "translateX(-50%)",
          }}
        >
          <button
            onClick={onClick}
            className={`${isQuoteMode ? "bg-purple-600 hover:bg-purple-700 border-purple-700" : "bg-blue-600 hover:bg-blue-700 border-blue-700"} 
              text-white rounded-full p-2.5 shadow-lg border flex items-center space-x-2`}
            aria-label="Share selected text"
          >
            <ShareIcon className="w-5 h-5" />
            <span className="pr-1">Share Quote</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
