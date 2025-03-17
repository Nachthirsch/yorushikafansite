import { motion } from "framer-motion";
import { ClockIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

/**
 * Komponen untuk menampilkan deskripsi lagu dan metadata tambahan
 */
const SongDescription = ({ song }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">About This Song</h2>
        </div>
        {song.albums?.title && <span className="text-sm text-neutral-500 dark:text-neutral-400">From album: {song.albums.title}</span>}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="space-y-4">
          <div className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">{song.description}</div>
          {song.duration && (
            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>
                Duration: {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
              </span>
              {song.track_number && (
                <>
                  <span className="mx-2">•</span>
                  <MusicalNoteIcon className="w-4 h-4 mr-2" />
                  <span>Track {song.track_number}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SongDescription;
