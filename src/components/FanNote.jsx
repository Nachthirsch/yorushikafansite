import { motion } from "framer-motion";
import { useState } from "react";

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 border border-neutral-200 dark:border-neutral-700">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">{note.name || "Anonymous"}</h4>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(note.created_at)}</span>
      </div>

      <div className="mt-2 text-neutral-600 dark:text-neutral-300">
        {isLongContent && !expanded ? (
          <>
            <p>{note.content.substring(0, 120)}...</p>
            <button onClick={() => setExpanded(true)} className="text-xs text-blue-500 dark:text-blue-400 mt-1 hover:underline">
              Read more
            </button>
          </>
        ) : (
          <p>{note.content}</p>
        )}

        {expanded && isLongContent && (
          <button onClick={() => setExpanded(false)} className="text-xs text-blue-500 dark:text-blue-400 mt-1 hover:underline">
            Show less
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FanNote;
