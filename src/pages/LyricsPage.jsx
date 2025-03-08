import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, MusicalNoteIcon, InformationCircleIcon, LanguageIcon, PlusCircleIcon, ChevronDoubleUpIcon, HeartIcon, ClockIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import FocusTrap from "focus-trap-react";

export default function LyricsPage() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("sideBySide");
  const extrasButtonRef = useRef(null);
  const extrasModalRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    fetchSong();

    // Check if the song is in favorites
    const checkFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
      setFavorite(favorites.includes(songId));
    };

    checkFavorite();
  }, [songId]);

  // Add event listener to handle clicks outside the modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (showExtrasModal && extrasModalRef.current && !extrasModalRef.current.contains(event.target) && extrasButtonRef.current && !extrasButtonRef.current.contains(event.target)) {
        setShowExtrasModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExtrasModal]);

  async function fetchSong() {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select(
          `
          *,
          albums (
            title, 
            cover_image_url
          )
        `
        )
        .eq("id", songId)
        .single();

      if (error) throw error;
      setSong(data);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
    let newFavorites;

    if (favorite) {
      newFavorites = favorites.filter((id) => id !== songId);
    } else {
      newFavorites = [...favorites, songId];
    }

    localStorage.setItem("favoriteSongs", JSON.stringify(newFavorites));
    setFavorite(!favorite);
  };

  const shareSong = () => {
    if (navigator.share) {
      navigator
        .share({
          title: song.title,
          text: `Check out this Yorushika song: ${song.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
        <LoadingSpinner />
        <p className="mt-4 text-neutral-600 dark:text-neutral-400 animate-pulse">Loading song details...</p>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl shadow-lg p-8 max-w-md w-full border border-neutral-200 dark:border-neutral-800">
          <MusicalNoteIcon className="w-16 h-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4" />
          <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 text-center mb-2">Song Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">The song you're looking for couldn't be found or may have been removed.</p>
          <Link to="/" className="block w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white rounded-lg text-center transition-colors duration-200">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" ref={pageRef}>
      {/* Enhanced Header with Parallax Effect */}
      <header className="relative pt-28 pb-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 z-0" />

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pattern-dots pattern-neutral-900 dark:pattern-neutral-100 pattern-size-2 pattern-bg-transparent z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-neutral-600 hover:text-neutral-800 
              dark:text-neutral-400 dark:hover:text-neutral-200 text-base font-medium py-2 
              px-3 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
              shadow-sm border border-neutral-200 dark:border-neutral-700
              transition-all duration-200 hover:shadow"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Songs
            </Link>

            <div className="flex space-x-2">
              <button
                onClick={toggleFavorite}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                        shadow-sm border border-neutral-200 dark:border-neutral-700
                        text-neutral-600 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400
                        transition-all duration-200 hover:shadow"
              >
                {favorite ? <HeartIconSolid className="w-5 h-5 text-rose-500 dark:text-rose-400" /> : <HeartIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={shareSong}
                aria-label="Share this song"
                className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm
                        shadow-sm border border-neutral-200 dark:border-neutral-700
                        text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200
                        transition-all duration-200 hover:shadow"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Use thumbnail_cover_url if available, otherwise use album cover */}
            {song.thumbnail_cover_url || song.albums?.cover_image_url ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.02 }} className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 rounded-xl shadow-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent z-10" />
                <img src={song.thumbnail_cover_url || song.albums.cover_image_url} alt={song.thumbnail_cover_url ? `${song.title} cover` : `${song.albums.title} album cover`} className="w-full h-full object-cover" />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 rounded-xl flex items-center justify-center shadow-lg">
                <MusicalNoteIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
              </motion.div>
            )}

            <div className="text-center sm:text-left flex-1">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                {song.title}
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 space-y-1">
                <p className="text-xl text-neutral-600 dark:text-neutral-300">{song.albums?.title}</p>
              </motion.div>

              {/* Song tags/categories */}
              {song.tags && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-2 mt-4">
                  {song.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 
                              text-neutral-700 dark:text-neutral-300 backdrop-blur-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Description Section */}
        {song.description && (
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
        )}

        {/* Extras Section - Hover Trigger */}
        {song.extras && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative mb-8">
            {/* Enhanced Hover Trigger Button with Dynamic Glowing Effect */}
            <div
              ref={extrasButtonRef}
              className="group bg-gradient-to-r from-white to-neutral-100 dark:from-neutral-900 
                        dark:to-neutral-800 rounded-xl shadow-md border border-neutral-200 
                        dark:border-neutral-700 p-6 cursor-pointer hover:shadow-lg transform 
                        hover:-translate-y-0.5 transition-all duration-300 
                        hover:border-neutral-300 dark:hover:border-neutral-600"
              onClick={() => setShowExtrasModal(!showExtrasModal)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-1.5 h-8 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded-full 
                                group-hover:from-neutral-500 group-hover:to-neutral-600
                                group-hover:shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]
                                transition-all duration-300"
                  ></div>
                  <h2
                    className="text-xl font-medium text-neutral-900 dark:text-neutral-100 
                               flex items-center group-hover:text-neutral-700 
                               dark:group-hover:text-neutral-200 transition-colors duration-300"
                  >
                    <PlusCircleIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Additional Content
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full">Extra</span>
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className="text-sm text-neutral-500 dark:text-neutral-400 
                                group-hover:text-neutral-600 dark:group-hover:text-neutral-300
                                transition-colors duration-200"
                  >
                    Click to explore
                  </span>
                  <motion.div className="bg-neutral-200 dark:bg-neutral-700 rounded-full p-1" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 dark:text-neutral-300" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  </motion.div>
                </div>
              </div>

              {/* Interactive preview hint */}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <InformationCircleIcon className="w-4 h-4 mr-2" />
                  <p className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {song.extras.substring(0, 100).trim()}
                    {song.extras.length > 100 ? "..." : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Extras Modal with Improved Visual Design */}
            <AnimatePresence>
              {showExtrasModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 flex items-center justify-center p-4 z-50">
                  {/* Backdrop with enhanced blur and interaction */}
                  <motion.div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExtrasModal(false)} />

                  <FocusTrap active={showExtrasModal}>
                    <motion.div
                      ref={extrasModalRef}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-xl 
                                border border-neutral-200 dark:border-neutral-700 
                                w-full max-w-2xl max-h-[85vh] overflow-hidden"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="extras-modal-title"
                    >
                      {/* Decorative accent at top of modal */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-600 dark:via-neutral-500 dark:to-neutral-600"></div>

                      <div
                        className="flex items-center justify-between p-6 border-b 
                                    border-neutral-200 dark:border-neutral-700 sticky top-0 
                                    bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md z-10"
                      >
                        <h3 id="extras-modal-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                          <span className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3 hidden sm:block"></span>
                          Additional Content for "{song.title}"
                        </h3>
                        <button
                          onClick={() => setShowExtrasModal(false)}
                          className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 
                                    dark:hover:bg-neutral-700 hover:text-neutral-700 
                                    dark:hover:text-neutral-300 transition-all duration-200 
                                    focus:outline-none focus:ring-2 focus:ring-neutral-400 
                                    dark:focus:ring-neutral-500"
                          aria-label="Close dialog"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Scroll indicator */}
                      <div className="absolute top-[72px] left-0 right-0 h-4 bg-gradient-to-b from-white/50 to-transparent dark:from-neutral-800/50 pointer-events-none z-10"></div>

                      <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(85vh - 140px)" }}>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                          {song.extras ? (
                            <div
                              className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 
                                          leading-relaxed font-lyrics"
                            >
                              {/* Content with better typographic treatment */}
                              <div className="space-y-6">
                                {song.extras.split("\n\n").map((paragraph, i) => (
                                  <p key={i} className="first-letter:text-lg first-letter:font-medium">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <InformationCircleIcon className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                              <p className="text-neutral-500 dark:text-neutral-400 italic">No additional content available for this song.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom scroll indicator */}
                      <div className="absolute bottom-[72px] left-0 right-0 h-4 bg-gradient-to-t from-white/50 to-transparent dark:from-neutral-800/50 pointer-events-none z-10"></div>

                      <div
                        className="p-6 border-t border-neutral-200 dark:border-neutral-700 
                                   bg-neutral-50 dark:bg-neutral-900 flex justify-between items-center"
                      >
                        {/* Share button option */}
                        <button
                          onClick={() => {
                            setShowExtrasModal(false);
                            shareSong();
                          }}
                          className="flex items-center px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400
                                   hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200"
                        >
                          <ShareIcon className="w-4 h-4 mr-2" />
                          Share
                        </button>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowExtrasModal(false)}
                            className="px-5 py-2.5 bg-neutral-200 hover:bg-neutral-300 
                                      dark:bg-neutral-700 dark:hover:bg-neutral-600
                                      text-neutral-900 dark:text-neutral-100 rounded-lg 
                                      transition-colors duration-200 font-medium focus:outline-none 
                                      focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500
                                      shadow-sm hover:shadow"
                          >
                            Close
                          </button>

                          {/* Optional: Add additional action button */}
                          {song.extras && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={toggleFavorite}
                              className="px-5 py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-800 
                                        dark:from-neutral-600 dark:to-neutral-700
                                        text-white rounded-lg shadow-sm hover:shadow
                                        transition-all duration-200 font-medium focus:outline-none 
                                        focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500
                                        flex items-center"
                            >
                              {favorite ? (
                                <>
                                  <HeartIconSolid className="w-5 h-5 mr-2 text-rose-400" />
                                  Favorited
                                </>
                              ) : (
                                <>
                                  <HeartIcon className="w-5 h-5 mr-2" />
                                  Add to Favorites
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </FocusTrap>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lyrics View Toggle */}
        <div className="mb-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="flex border-b border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setActiveTab("sideBySide")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                           ${activeTab === "sideBySide" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setActiveTab("original")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                           ${activeTab === "original" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
              >
                Original Only
              </button>
              <button
                onClick={() => setActiveTab("translation")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                           ${activeTab === "translation" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
              >
                Translation Only
              </button>
            </div>
          </div>
        </div>

        {/* Lyrics Content - Three Views */}
        <AnimatePresence mode="wait">
          {activeTab === "sideBySide" && (
            <motion.div key="sideBySide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
              {/* Original Lyrics */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                  <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Original</h2>
                </div>
                <div
                  className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 
                            border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics"
                >
                  {song.lyrics}
                </div>
              </div>

              {/* Translation */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                    <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Translation</h2>
                  </div>
                  {song.translator && (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                      <LanguageIcon className="w-4 h-4 mr-1" />
                      Translated by: {song.translator}
                    </div>
                  )}
                </div>
                <div
                  className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200
                            border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics"
                >
                  {song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "original" && (
            <motion.div key="original" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mb-12">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                    <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Original</h2>
                  </div>
                </div>
                <div
                  className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 
                            border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics
                            max-w-2xl mx-auto"
                >
                  {song.lyrics}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "translation" && (
            <motion.div key="translation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mb-12">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
                    <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Translation</h2>
                  </div>
                  {song.translator && (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                      <LanguageIcon className="w-4 h-4 mr-1" />
                      Translated by: {song.translator}
                    </div>
                  )}
                </div>
                <div
                  className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 
                             border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 font-lyrics
                             max-w-2xl mx-auto"
                >
                  {song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footnotes Section */}
        {song.footnotes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                Notes & References
              </h2>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-neutral-800 dark:text-neutral-200">{song.footnotes}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll to top button */}
    </div>
  );
}
