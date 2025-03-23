import { useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Komponen untuk menampilkan kartu episode podcast
 * Mendukung tampilan standar dan fitur (featured)
 *
 * @param {Object} episode - Data episode podcast
 * @param {boolean} featured - Flag untuk penampilan yang lebih menonjol
 */
export default function PodcastCard({ episode, featured = false }) {
  const [isHovered, setIsHovered] = useState(false);

  // Format tanggal untuk tampilan yang lebih mudah dibaca
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format durasi dari milidetik ke format menit:detik
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "--:--";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Link
      to={`/yorucast/${episode.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`block rounded-xl overflow-hidden transition-all duration-300 h-full
                touch-manipulation
                ${featured ? "bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" : "bg-white dark:bg-neutral-800"}
                border border-neutral-200 dark:border-neutral-700
                hover:shadow-md dark:hover:shadow-neutral-900/30
                ${isHovered ? "transform-gpu scale-[1.02]" : "scale-100"}`}
      aria-label={`Listen to ${episode.name}`}
    >
      {/* Card content container */}
      <div className="h-full flex flex-col">
        {/* Image section */}
        <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-square sm:aspect-[16/10]"} overflow-hidden bg-neutral-200 dark:bg-neutral-700`}>
          {/* Episode image */}
          {episode.images && episode.images.length > 0 ? (
            <img src={featured ? episode.images[0].url : episode.images[1]?.url || episode.images[0].url} alt={episode.name} className="w-full h-full object-cover transition-transform duration-700" />
          ) : (
            // Placeholder if no image is available
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
              <Radio className="w-12 h-12 text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
            </div>
          )}

          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Play button overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center opacity-0 
                        bg-black/10 dark:bg-black/30 backdrop-blur-sm transition-opacity duration-300
                        ${isHovered ? "opacity-100" : ""}`}
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: isHovered ? 1 : 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" aria-hidden="true" />
            </motion.div>
          </div>

          {/* Episode date - bottom left */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 flex items-center gap-1.5 text-[10px] sm:text-xs text-white/90 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
            <span>{formatDate(episode.release_date)}</span>
          </div>

          {/* Episode duration - bottom right */}
          <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 flex items-center gap-1.5 text-[10px] sm:text-xs text-white/90 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
            <span>{formatDuration(episode.duration_ms)}</span>
          </div>
        </div>

        {/* Text content */}
        <div className={`p-3 sm:p-4 flex-grow flex flex-col ${featured ? "gap-2 sm:gap-3" : "gap-1.5 sm:gap-2"}`}>
          {/* Title */}
          <h3
            className={`font-medium text-neutral-900 dark:text-white line-clamp-2
                        ${featured ? "text-base sm:text-xl leading-tight" : "text-sm sm:text-base"}`}
          >
            {episode.name}
          </h3>

          {/* Description */}
          <p
            className={`text-neutral-600 dark:text-neutral-400 line-clamp-2
                      ${featured ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"}`}
          >
            {episode.description}
          </p>

          {/* Listen now button for featured episodes */}
          {featured && (
            <div className="mt-auto pt-3">
              <div
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300
                            group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              >
                <span>Listen now</span>
                <div className="h-px w-8 bg-neutral-400 dark:bg-neutral-600 group-hover:w-12 transition-all"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
