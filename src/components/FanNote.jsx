import { motion } from "framer-motion";
import { useState } from "react";
import { MessageSquareQuote, ChevronDown, ChevronUp } from "lucide-react";

const FanNote = ({ note, index }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongContent = note.content.length > 120;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Animasi untuk kartu catatan penggemar
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-neutral-800 rounded-lg p-5 border border-neutral-200 dark:border-neutral-700 relative 
      shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] 
      hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.08)] dark:hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.3)] 
      transition-all duration-300 overflow-hidden"
    >
      {/* Elemen dekoratif di latar belakang */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-neutral-300 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800"></div>

      {/* Ikon kutipan sebagai elemen dekoratif */}
      <div className="absolute -bottom-4 -right-4 opacity-5 dark:opacity-10">
        <MessageSquareQuote size={60} />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center">{note.name || "Anonymous"}</h4>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">{formatDate(note.created_at)}</span>
      </div>

      <div className="mt-3 text-neutral-600 dark:text-neutral-300 relative z-10">
        {isLongContent && !expanded ? (
          <>
            <p className="leading-relaxed">{note.content.substring(0, 120)}...</p>
            <motion.button onClick={() => setExpanded(true)} className="flex items-center text-xs text-blue-500 dark:text-blue-400 mt-2 hover:text-blue-600 dark:hover:text-blue-300 transition-colors group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <span>Read more</span>
              <ChevronDown size={14} className="ml-1 group-hover:translate-y-0.5 transition-transform" />
            </motion.button>
          </>
        ) : (
          <p className="leading-relaxed">{note.content}</p>
        )}

        {expanded && isLongContent && (
          <motion.button onClick={() => setExpanded(false)} className="flex items-center text-xs text-blue-500 dark:text-blue-400 mt-2 hover:text-blue-600 dark:hover:text-blue-300 transition-colors group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <span>Show less</span>
            <ChevronUp size={14} className="ml-1 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default FanNote;
