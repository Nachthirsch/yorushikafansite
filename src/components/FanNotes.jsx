import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, RefreshCw, ChevronLeft, ChevronRight, MessageSquareOff, Loader2 } from "lucide-react";
import FanNote from "./FanNote";

const FanNotes = forwardRef((props, ref) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const notesPerPage = 5;

  // Function to load fan notes from the API
  const loadNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/get-fan-notes?limit=${notesPerPage}&page=${page}`);

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();

      setNotes(data.notes);
      setTotalCount(data.count);
    } catch (err) {
      setError("Failed to load fan notes. Please try again later.");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Expose the loadNotes method to parent components
  useImperativeHandle(ref, () => ({
    loadNotes,
  }));

  useEffect(() => {
    loadNotes();
  }, [page]);

  // Pagination controls
  const nextPage = () => {
    if ((page + 1) * notesPerPage < totalCount) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage((p) => p - 1);
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  // Error display component
  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 px-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-900/20" role="alert">
        <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
        <motion.button onClick={loadNotes} className="mt-2 text-sm flex items-center justify-center mx-auto px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {/* RefreshCw icon for retry action */}
          <RefreshCw size={14} className="mr-1.5" aria-hidden="true" />
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative">
      {/* Decorative element */}
      <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 opacity-50 z-0"></div>

      {/* Section header */}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <motion.h3 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-light text-neutral-800 dark:text-neutral-200 flex items-center">
          {/* MessageSquareText icon representing fan notes */}
          <MessageSquareText size={20} className="mr-2 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
          <span>Fan Notes</span>
          {totalCount > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-2 px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-sm rounded-full text-neutral-700 dark:text-neutral-300">
              {totalCount}
            </motion.span>
          )}
        </motion.h3>

        {/* Section divider */}
        <div className="flex-grow mx-4 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent opacity-0 sm:opacity-100"></div>

        {/* Loading indicator while refreshing */}
        {loading && notes.length > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-neutral-400 dark:text-neutral-500">
            <Loader2 size={16} className="animate-spin" />
          </motion.div>
        )}
      </div>

      {/* Main content area */}
      <div className="relative z-10">
        {/* Full page loading state */}
        {loading && notes.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
              }}
            >
              <Loader2 size={24} className="text-neutral-400 dark:text-neutral-500" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Loading fan notes...
            </motion.p>
          </div>
        ) : notes.length === 0 ? (
          // Empty state
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg flex flex-col items-center">
            {/* MessageSquareOff icon indicating no notes */}
            <MessageSquareOff size={28} className="text-neutral-400 dark:text-neutral-500 mb-2" aria-hidden="true" />
            <p className="text-neutral-500 dark:text-neutral-400">No fan notes yet. Be the first to leave one!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Notes list */}
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <FanNote key={note.id} note={note} index={index} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalCount > notesPerPage && (
                <div className="flex justify-between items-center pt-6 mt-2">
                  {/* Previous page button */}
                  <motion.button onClick={prevPage} disabled={page === 0} className="px-3 py-1.5 text-sm flex items-center bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors" whileHover={page > 0 ? { x: -2 } : {}} whileTap={page > 0 ? { scale: 0.98 } : {}} aria-label="Previous page">
                    {/* ChevronLeft icon for previous navigation */}
                    <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
                    Previous
                  </motion.button>

                  {/* Page indicator */}
                  <div className="text-sm px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md border border-neutral-200 dark:border-neutral-700">
                    Page {page + 1} of {Math.ceil(totalCount / notesPerPage)}
                  </div>

                  {/* Next page button */}
                  <motion.button onClick={nextPage} disabled={(page + 1) * notesPerPage >= totalCount} className="px-3 py-1.5 text-sm flex items-center bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors" whileHover={(page + 1) * notesPerPage < totalCount ? { x: 2 } : {}} whileTap={(page + 1) * notesPerPage < totalCount ? { scale: 0.98 } : {}} aria-label="Next page">
                    Next
                    {/* ChevronRight icon for next navigation */}
                    <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
});

// Assign display name for DevTools
FanNotes.displayName = "FanNotes";

export default FanNotes;
