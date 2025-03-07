import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { ArrowLeftIcon, MusicalNoteIcon, InformationCircleIcon, LanguageIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import FocusTrap from "focus-trap-react";

export default function LyricsPage() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const extrasButtonRef = useRef(null);
  const extrasModalRef = useRef(null);

  useEffect(() => {
    fetchSong();
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
      const { data, error } = await supabase.from("songs").select(`*, albums(title, cover_image_url)`).eq("id", songId).single();

      if (error) throw error;
      setSong(data);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
        <p className="text-lg text-neutral-600 dark:text-neutral-300">Song not found</p>
        <Link to="/" className="mt-4 text-neutral-500 hover:text-neutral-600 font-medium">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Minimalist Header */}
      <header className="relative pt-32 pb-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-neutral-500 hover:text-neutral-600 
            dark:text-neutral-400 dark:hover:text-neutral-300 mb-6 text-base font-medium py-2 
            transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Songs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {song.albums?.cover_image_url ? (
              <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg shadow-md overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img src={song.albums.cover_image_url} alt={song.albums.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <MusicalNoteIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
              </div>
            )}

            <div className="text-center sm:text-left">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                {song.title}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-neutral-500 dark:text-neutral-400 mt-4">
                {song.albums?.title}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Description Section */}
        {song.description && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-12">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">About This Song</h2>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-neutral-900 dark:text-neutral-100">{song.description}</div>
            </div>
          </motion.div>
        )}
        {/* Extras Section - Hover Trigger */}
        {song.extras && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative">
            {/* Enhanced Hover Trigger Button */}
            <div
              ref={extrasButtonRef}
              className="group bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 
                        dark:to-neutral-800 rounded-xl shadow-md border border-neutral-200 
                        dark:border-neutral-700 p-6 cursor-pointer hover:shadow-lg transform 
                        hover:-translate-y-0.5 transition-all duration-300 mb-10"
              onClick={() => setShowExtrasModal(!showExtrasModal)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-1.5 h-8 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded-full 
                                group-hover:from-neutral-500 group-hover:to-neutral-600 
                                transition-colors duration-300"
                  ></div>
                  <h2
                    className="text-xl font-medium text-neutral-900 dark:text-neutral-100 
                               flex items-center group-hover:text-neutral-700 
                               dark:group-hover:text-neutral-200 transition-colors duration-300"
                  >
                    <PlusCircleIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Extras
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className="text-sm text-neutral-500 dark:text-neutral-400 
                                group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                  >
                    Click to explore
                  </span>
                  <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </motion.svg>
                </div>
              </div>
            </div>

            {/* Enhanced Extras Modal */}
            {showExtrasModal && (
              <motion.div ref={extrasModalRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" onClick={(e) => e.target === e.currentTarget && setShowExtrasModal(false)}>
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
                <FocusTrap active={showExtrasModal}>
                  <motion.div
                    className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-xl 
                              border border-neutral-200 dark:border-neutral-700 
                              w-full max-w-2xl max-h-[85vh] overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="extras-modal-title"
                  >
                    <div
                      className="flex items-center justify-between p-6 border-b 
                                  border-neutral-200 dark:border-neutral-700 sticky top-0 
                                  bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm z-10"
                    >
                      <h3
                        id="extras-modal-title"
                        className="text-xl font-semibold 
                                                          text-neutral-900 dark:text-neutral-100"
                      >
                        Additional Content
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

                    <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        {song.extras ? (
                          <div
                            className="whitespace-pre-line text-neutral-900 dark:text-neutral-100 
                                        leading-relaxed"
                          >
                            {song.extras}
                          </div>
                        ) : (
                          <p className="text-neutral-500 dark:text-neutral-400 italic text-center">No additional content available for this song.</p>
                        )}
                      </div>
                    </div>

                    <div
                      className="p-6 border-t border-neutral-200 dark:border-neutral-700 
                                  bg-neutral-50 dark:bg-neutral-900 text-right"
                    >
                      <button
                        onClick={() => setShowExtrasModal(false)}
                        className="px-5 py-2.5 bg-neutral-200 hover:bg-neutral-300 
                                  dark:bg-neutral-700 dark:hover:bg-neutral-600
                                  text-neutral-900 dark:text-neutral-100 rounded-lg 
                                  transition-colors duration-200 font-medium focus:outline-none 
                                  focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </FocusTrap>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Lyrics Content - Side by Side */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
          {/* Original Lyrics */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Original</h2>
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-900 dark:text-neutral-100 
                         border-l-2 border-neutral-200 dark:border-neutral-800/40 pl-4"
            >
              {song.lyrics}
            </div>
          </div>

          {/* Translation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
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
              className="whitespace-pre-line leading-relaxed text-neutral-900 dark:text-neutral-100
                         border-l-2 border-neutral-200 dark:border-neutral-800/40 pl-4"
            >
              {song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}
            </div>
          </motion.div>
        </motion.div>

        {/* Footnotes Section */}
        {song.footnotes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                Notes & References
              </h2>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-neutral-900 dark:text-neutral-100">{song.footnotes}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
