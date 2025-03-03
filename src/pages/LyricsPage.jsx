import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeftIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner className="w-10 h-10 text-indigo-500" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-300">Song not found</p>
        <Link to="/" className="mt-4 text-indigo-500 hover:text-indigo-600 font-medium">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-500 hover:text-indigo-600 
            dark:text-indigo-400 dark:hover:text-indigo-300 mb-6 text-base font-medium py-2 
            transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Songs
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-2">
            {song.albums?.cover_image_url ? (
              <img src={song.albums.cover_image_url} alt={song.albums.title} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg shadow-md" />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <MusicalNoteIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{song.title}</h1>
              <p className="text-indigo-500 dark:text-indigo-400 text-lg mt-1">{song.albums?.title}</p>
            </div>
          </div>
        </div>

        {/* Lyrics Content - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Original Lyrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-indigo-500 rounded mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Original</h2>
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300 font-medium 
                          border-l-2 border-indigo-100 dark:border-gray-700 pl-4"
            >
              {song.lyrics}
            </div>
          </div>

          {/* Translation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-pink-500 rounded mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Translation</h2>
            </div>
            <div
              className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300 font-medium
                          border-l-2 border-pink-100 dark:border-gray-700 pl-4"
            >
              {song.lyrics_translation || <p className="text-gray-400 dark:text-gray-500 italic">Translation not available</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
