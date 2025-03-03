import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeftIcon, LanguageIcon } from "@heroicons/react/24/outline";

export default function LyricsPage() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("original");

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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-lg text-gray-600 dark:text-gray-300">Song not found</p>
        <Link to="/" className="mt-4 text-blue-500 hover:text-blue-600">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-200 mb-6 text-lg py-2"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </Link>

          <div className="flex items-center gap-4 mb-4">
            {song.albums?.cover_image_url && <img src={song.albums.cover_image_url} alt={song.albums.title} className="w-16 h-16 object-cover rounded" />}
            <div>
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white">{song.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{song.albums?.title}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === "original" ? "translation" : "original")}
            className="inline-flex items-center px-5 py-2.5 text-base
            border border-gray-200 dark:border-gray-700 rounded-lg
            text-gray-700 dark:text-gray-200 hover:bg-gray-100
            dark:hover:bg-gray-800 transition-colors shadow-sm
            font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <LanguageIcon className="w-5 h-5 mr-2" />
            {activeTab === "original" ? "Show Translation" : "Show Original"}
          </button>
        </div>

        {/* Lyrics Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div
            className="whitespace-pre-line leading-relaxed text-gray-600 
            dark:text-gray-300 font-light"
          >
            {activeTab === "original" ? song.lyrics : song.lyrics_translation || <p className="text-gray-400 dark:text-gray-500 italic">Translation not available</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
