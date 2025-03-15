import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import FanNote from "./FanNote";

const FanNotes = forwardRef((props, ref) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const notesPerPage = 5;

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

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        <p>{error}</p>
        <button onClick={loadNotes} className="mt-2 text-sm underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h3 className="text-xl font-light mb-4 text-neutral-800 dark:text-neutral-200 flex items-center">
        <span>Fan Notes</span>
        <span className="ml-2 px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-sm rounded-full">{totalCount}</span>
      </h3>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
            <div className="h-2 w-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
            <div className="h-2 w-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
          </div>
        </div>
      ) : notes.length === 0 ? (
        <div className="py-8 text-center text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">No fan notes yet. Be the first to leave one!</div>
      ) : (
        <>
          <div className="space-y-4">
            {notes.map((note, index) => (
              <FanNote key={note.id} note={note} index={index} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalCount > notesPerPage && (
            <div className="flex justify-between items-center pt-4">
              <button onClick={prevPage} disabled={page === 0} className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>

              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Page {page + 1} of {Math.ceil(totalCount / notesPerPage)}
              </span>

              <button onClick={nextPage} disabled={(page + 1) * notesPerPage >= totalCount} className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
});

FanNotes.displayName = "FanNotes";

export default FanNotes;
