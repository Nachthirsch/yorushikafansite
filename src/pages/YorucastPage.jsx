import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Radio, List, Grid, Info } from "lucide-react";
import { YORUSHIKA_PODCAST_ID } from "../lib/spotify";
import { usePodcastShow } from "../hooks/usePodcasts";
import PodcastHeader from "../components/podcast/PodcastHeader";
import PodcastGrid from "../components/podcast/PodcastGrid";

/**
 * Halaman utama untuk fitur Yorucast podcast
 * Menampilkan header dan daftar episode podcast
 */
export default function YorucastPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const navigate = useNavigate();
  const { data: podcast } = usePodcastShow();

  // Handler untuk pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler untuk toggle view mode
  const toggleViewMode = () => {
    setIsGridView((prev) => !prev);
  };

  // Handler untuk item terpilih
  const handleEpisodeSelect = (episodeId) => {
    navigate(`/yorucast/${episodeId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Section */}
      <PodcastHeader />

      {/* Controls Section */}
      <section className="relative z-10 -mt-6 sm:-mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 
                      dark:border-neutral-700 p-4 sm:p-6 flex flex-col sm:flex-row 
                      items-stretch sm:items-center gap-4 sm:gap-6"
          >
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Search icon indicating search functionality */}
                <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search podcast episodes..."
                className="block w-full pl-10 pr-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 
                          border border-neutral-200 dark:border-neutral-700 rounded-lg
                          focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600
                          focus:border-neutral-300 dark:focus:border-neutral-600 
                          text-neutral-900 dark:text-neutral-100 transition-colors"
              />
            </div>

            {/* View Toggle and Podcast Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* View toggle button */}
              <button
                onClick={toggleViewMode}
                className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg 
                        border border-neutral-200 dark:border-neutral-700
                        text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 
                        dark:hover:bg-neutral-800 transition-colors"
                aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}
              >
                {isGridView ? (
                  // List icon for switching to list view
                  <List className="w-5 h-5" aria-hidden="true" />
                ) : (
                  // Grid icon for switching to grid view
                  <Grid className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Podcast info with episode count */}
              {podcast && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 
                            rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  {/* Radio icon representing podcast */}
                  <Radio className="w-4 h-4 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 hidden sm:inline">{podcast.total_episodes} Episodes</span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 sm:hidden">{podcast.total_episodes}</span>
                </div>
              )}

              {/* About button - could link to podcast info page */}
              <button
                onClick={() => navigate("/about")}
                className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg 
                        border border-neutral-200 dark:border-neutral-700
                        text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 
                        dark:hover:bg-neutral-800 transition-colors 
                        hidden sm:block"
                aria-label="About the podcast"
              >
                {/* Info icon for more information */}
                <Info className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Information banner - optional - can be shown based on conditions */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 
                    rounded-lg p-4 flex items-start gap-3"
        >
          <div className="bg-amber-200 dark:bg-amber-700 rounded-full p-1 mt-0.5">
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-200" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">About Yorucast</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300">Yorucast is a fan-made podcast about Yorushika, their music and influence. This podcast is not officially affiliated with Yorushika or n-buna.</p>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Podcast Episodes</h2>
          {searchTerm && <p className="text-neutral-600 dark:text-neutral-400 mt-1">Search results for "{searchTerm}"</p>}
        </div>

        {/* Grid of podcast episodes */}
        <PodcastGrid showId={YORUSHIKA_PODCAST_ID} searchTerm={searchTerm} />
      </section>

      {/* Decorative footer element */}
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent mx-auto max-w-3xl"></div>
    </div>
  );
}
