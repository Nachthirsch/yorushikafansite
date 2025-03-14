import { motion } from "framer-motion";
import { Play, Music, Clock3 } from "lucide-react";

export default function SongCard({ song, isGridView, onClick }) {
  // Get thumbnail function
  const getThumbnail = (song) => {
    if (song.thumbnail_cover_url) {
      return song.thumbnail_cover_url;
    }
    return song.albums?.cover_image_url || null;
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className={`group cursor-pointer ${isGridView ? "bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" : "flex items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-lg hover:shadow-sm transition-all duration-300"}`} onClick={onClick}>
      {/* Thumbnail container */}
      <div className={`relative ${isGridView ? "aspect-square" : "w-16 h-16"} bg-neutral-100 dark:bg-neutral-800 overflow-hidden rounded-lg`}>
        {getThumbnail(song) ? (
          <img src={getThumbnail(song)} alt={song.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-1/3 h-1/3 text-neutral-300 dark:text-neutral-700" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Song info */}
      <div className={`${isGridView ? "p-4" : "flex-1"}`}>
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{song.title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{song.albums?.title || "Unknown Album"}</p>
        <div className="flex items-center gap-2 mt-2 text-neutral-400 dark:text-neutral-500">
          <Clock3 className="w-4 h-4" />
          <span className="text-sm font-mono">{formatDuration(song.duration)}</span>
        </div>
      </div>
    </motion.div>
  );
}
