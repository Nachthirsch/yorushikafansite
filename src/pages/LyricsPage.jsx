import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { ArrowLeftIcon, MusicalNoteIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function LyricsPage() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSong();
  }, [songId]);

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
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Translation</h2>
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
