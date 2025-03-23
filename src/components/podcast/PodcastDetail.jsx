import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Share2, ArrowLeftCircle, Music, Headphones, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { usePodcastEpisode } from "../../hooks/usePodcasts";
import TranscriptSection from "./TranscriptSection";

/**
 * Komponen untuk menampilkan detail lengkap episode podcast
 * Termasuk player, metadata, dan transkrip
 *
 * @param {string} episodeId - ID episode podcast dari Spotify
 * @param {function} onBackClick - Handler untuk tombol kembali
 */
export default function PodcastDetail({ episodeId, onBackClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const { data: episode, isLoading, isError } = usePodcastEpisode(episodeId);

  useEffect(() => {
    // Cek apakah episode ada di daftar favorit
    const favorites = JSON.parse(localStorage.getItem("favoritePodcasts") || "[]");
    setIsFavorite(favorites.includes(episodeId));

    // Scroll ke atas saat episode berubah
    window.scrollTo(0, 0);
  }, [episodeId]);

  // Handler untuk toggle favorite
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoritePodcasts") || "[]");
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== episodeId);
    } else {
      newFavorites = [...favorites, episodeId];
    }

    localStorage.setItem("favoritePodcasts", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Handler untuk bagikan episode
  const shareEpisode = () => {
    if (navigator.share) {
      navigator
        .share({
          title: episode?.name,
          text: `Dengarkan episode ${episode?.name} di Yorucast`,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing", err));
    } else {
      // Fallback - salin ke clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Link disalin ke clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  // Format tanggal rilis
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Format durasi
  const formatDuration = (ms) => {
    if (!ms) return "";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} menit ${seconds} detik`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
          <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
        <div className="h-72 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !episode) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 text-center">
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">Error memuat episode</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">Terjadi kesalahan saat memuat detail episode. Silakan coba lagi nanti.</p>
          <button onClick={onBackClick} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-neutral-800 dark:text-neutral-200 transition-colors">
            Kembali ke daftar episode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Navigation and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button onClick={onBackClick} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors group" aria-label="Kembali ke daftar episode">
          {/* ArrowLeftCircle icon indicating navigation back */}
          <ArrowLeftCircle className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>Kembali ke daftar episode</span>
        </button>

        <div className="flex items-center gap-3">
          <button onClick={toggleFavorite} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors" aria-label={isFavorite ? "Hapus dari favorit" : "Tambahkan ke favorit"}>
            {isFavorite ? (
              <>
                {/* BookmarkCheck icon indicating saved/favorited state */}
                <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span className="text-sm text-amber-600 dark:text-amber-400">Favorit</span>
              </>
            ) : (
              <>
                {/* Bookmark icon for saving/favoriting */}
                <Bookmark className="w-4 h-4 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Favorit</span>
              </>
            )}
          </button>

          <button onClick={shareEpisode} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors" aria-label="Bagikan episode ini">
            {/* Share2 icon for share functionality */}
            <Share2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Bagikan</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Episode art and info - Left column on desktop */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-700">
              {/* Episode artwork with decorative corners */}
              <div className="relative aspect-square overflow-hidden">
                <img src={episode.images?.[0]?.url || "/images/podcast-placeholder.jpg"} alt={episode.name} className="w-full h-full object-cover" />

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/30 dark:border-black/30 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/30 dark:border-black/30 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/30 dark:border-black/30 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/30 dark:border-black/30 rounded-br-lg"></div>

                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>
              </div>

              {/* Metadata section */}
              <div className="p-4 sm:p-5 space-y-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-1.5">
                  {/* Calendar icon for release date */}
                  <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatReleaseDate(episode.release_date)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Clock icon for duration */}
                  <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDuration(episode.duration_ms)}</span>
                </div>

                <div className="pt-2">
                  {/* External link to Spotify */}
                  <a href={episode.external_urls?.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {/* ExternalLink icon indicating external link */}
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    <span>Buka di Spotify</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episode content - Right columns on desktop */}
        <div className="lg:col-span-2 space-y-8">
          {/* Episode title and description */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              {/* Headphones icon representing audio content */}
              <Headphones className="w-5 h-5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white">{episode.name}</h2>
            </div>

            <div className="prose dark:prose-invert prose-neutral prose-sm sm:prose-base max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{episode.description}</p>
            </div>
          </div>

          {/* Spotify player */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Music icon for player */}
                <Music className="w-5 h-5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                <h3 className="font-medium text-neutral-900 dark:text-white">Player Spotify</h3>
              </div>

              <button onClick={() => setIsPlayerExpanded(!isPlayerExpanded)} className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200">
                {isPlayerExpanded ? "Kecilkan Player" : "Perbesar Player"}
              </button>
            </div>

            <div className="relative">
              <iframe src={`https://open.spotify.com/embed/episode/${episodeId}`} width="100%" height={isPlayerExpanded ? "352" : "152"} frameBorder="0" allowTransparency="true" allow="encrypted-media" title={`Spotify Player: ${episode.name}`} className="transition-all duration-300"></iframe>

              {/* Decorative gradient overlay at the bottom */}
              <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-neutral-200 dark:from-neutral-700 via-neutral-300 dark:via-neutral-600 to-neutral-200 dark:to-neutral-700"></div>
            </div>
          </div>

          {/* Transkrip section */}
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <TranscriptSection episodeId={episodeId} episodeTitle={episode.name} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
