import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, MusicalNoteIcon, InformationCircleIcon, LanguageIcon, PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import FocusTrap from "focus-trap-react";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="w-1 h-6 bg-neutral-500/80 rounded mr-3" />
      <div>
        <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2 text-neutral-600 dark:text-neutral-400" />}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

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

  if (loading) return <LoadingSpinner />;

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
      {/* Enhanced Header */}
      <header className="relative pt-32 pb-24 mb-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-200/20 via-transparent to-transparent dark:from-neutral-800/20 dark:via-transparent dark:to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-neutral-500 hover:text-neutral-600 
                     dark:text-neutral-400 dark:hover:text-neutral-300 mb-6 text-base 
                     font-medium py-2 transition-colors duration-200 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Songs
          </Link>

          <motion.div {...fadeIn} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 group relative">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative">
              {song.albums?.cover_image_url ? (
                <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-lg shadow-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200/50 dark:ring-neutral-700/50">
                  <img src={song.albums.cover_image_url} alt={song.albums.title} className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110" />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-600" />
                </div>
              )}
              <div className="absolute -inset-2 bg-white/10 dark:bg-black/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <div className="text-center sm:text-left flex-1">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 [text-wrap:balance] mb-4">
                {song.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-neutral-500 dark:text-neutral-400">
                {song.albums?.title}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Quick Navigation */}
        <motion.nav {...fadeIn} className="mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
          {song.description && (
            <a href="#about" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap">
              About
            </a>
          )}
          <a href="#lyrics" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap">
            Lyrics
          </a>
          {song.extras && (
            <a href="#extras" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap">
              Extras
            </a>
          )}
          {song.footnotes && (
            <a href="#notes" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap">
              Notes
            </a>
          )}
        </motion.nav>

        {/* About Section */}
        {song.description && (
          <motion.div {...fadeIn} id="about" className="bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-12 hover:shadow-md transition-shadow duration-300 scroll-mt-24">
            <SectionHeader title="About This Song" />
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-neutral-900 dark:text-neutral-100 text-lg">{song.description}</div>
            </div>
          </motion.div>
        )}

        {/* Extras Section */}
        {song.extras && (
          <motion.div {...fadeIn} id="extras" transition={{ duration: 0.5, delay: 0.3 }} className="relative mb-12 scroll-mt-24">
            <motion.div
              ref={extrasButtonRef}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="group bg-gradient-to-r from-neutral-50/80 to-neutral-100/80 
                        dark:from-neutral-900/80 dark:to-neutral-800/80 backdrop-blur-sm 
                        rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 
                        p-6 cursor-pointer transition-all duration-300"
              onClick={() => setShowExtrasModal(!showExtrasModal)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-1.5 h-8 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded-full"
                    animate={{
                      background: showExtrasModal ? "linear-gradient(to bottom, rgb(115 115 115), rgb(64 64 64))" : "linear-gradient(to bottom, rgb(163 163 163), rgb(115 115 115))",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                    <motion.div animate={{ rotate: showExtrasModal ? 45 : 0 }} transition={{ duration: 0.3 }}>
                      <PlusCircleIcon className="w-5 h-5 mr-2" />
                    </motion.div>
                    Additional Content
                  </h2>
                </div>
                <motion.div animate={{ x: showExtrasModal ? 0 : 5 }} transition={{ duration: 0.3 }} className="flex items-center space-x-2">
                  <ChevronDownIcon className={`w-5 h-5 text-neutral-400 transform transition-transform duration-300 ${showExtrasModal ? "rotate-180" : ""}`} />
                </motion.div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showExtrasModal && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setShowExtrasModal(false)}>
                  <motion.div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
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
                      <div
                        className="flex items-center justify-between p-6 border-b 
                                    border-neutral-200 dark:border-neutral-700 sticky top-0 
                                    bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm z-10"
                      >
                        <h3 id="extras-modal-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                          Additional Content
                        </h3>
                        <button
                          onClick={() => setShowExtrasModal(false)}
                          className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 
                                    dark:hover:bg-neutral-700 hover:text-neutral-700 
                                    dark:hover:text-neutral-300 transition-all duration-200"
                          aria-label="Close dialog"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                          <div className="whitespace-pre-line text-neutral-900 dark:text-neutral-100 text-lg leading-relaxed">{song.extras}</div>
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
                                    transition-colors duration-200 font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  </FocusTrap>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lyrics Content */}
        <motion.div {...fadeIn} id="lyrics" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 scroll-mt-24">
          {/* Original Lyrics */}
          <motion.div whileHover={{ y: -2 }} className="bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-all duration-300">
            <SectionHeader title="Original" />
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-900 dark:text-neutral-100 
                           border-l-2 border-neutral-200 dark:border-neutral-800/40 pl-4 text-lg"
            >
              {song.lyrics}
            </div>
          </motion.div>

          {/* Translation */}
          <motion.div whileHover={{ y: -2 }} className="bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-all duration-300">
            <SectionHeader title="Translation" icon={LanguageIcon} subtitle={song.translator ? `Translated by: ${song.translator}` : null} />
            <div
              className="whitespace-pre-line leading-relaxed text-neutral-900 dark:text-neutral-100
                           border-l-2 border-neutral-200 dark:border-neutral-800/40 pl-4 text-lg"
            >
              {song.lyrics_translation || <p className="text-neutral-400 dark:text-neutral-500 italic">Translation not available</p>}
            </div>
          </motion.div>
        </motion.div>

        {/* Footnotes Section */}
        {song.footnotes && (
          <motion.div {...fadeIn} id="notes" transition={{ duration: 0.5, delay: 0.2 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 scroll-mt-24">
            <SectionHeader title="Notes & References" icon={InformationCircleIcon} />
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-neutral-900 dark:text-neutral-100 space-y-4 text-lg">{song.footnotes}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
