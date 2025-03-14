import { motion, AnimatePresence } from "framer-motion";
import AlbumCard from "./AlbumCard";

export default function AlbumGrid({ filteredAlbums, isGridView, onAlbumSelect, onAlbumHover }) {
  if (filteredAlbums.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">No albums found matching your criteria.</p>
        <p className="text-sm mt-2 text-neutral-400 dark:text-neutral-500">Try adjusting your search or filters</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div layout className={`grid ${isGridView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" : "grid-cols-1 gap-4"}`}>
        <AnimatePresence mode="popLayout">
          {filteredAlbums.map((album, index) => (
            <AlbumCard key={album.id} album={album} isGridView={isGridView} onClick={() => onAlbumSelect(album)} onHover={onAlbumHover} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer decoration */}
      {filteredAlbums.length > 0 && (
        <div className="mt-20 flex justify-center">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
          <div className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
          <div className="h-[1px] w-20 bg-gradient-to-r from-neutral-300 dark:from-neutral-700 via-neutral-300 dark:via-neutral-700 to-transparent"></div>
        </div>
      )}
    </div>
  );
}
