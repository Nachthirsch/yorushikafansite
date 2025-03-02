import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeftIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

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

  if (loading) return <LoadingSpinner />;
  if (!song) return <div className="container text-center py-16">Song not found</div>;

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl px-4 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to albums</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <header className="flex flex-col md:flex-row gap-6 mb-8">
            {song.albums?.cover_image_url && (
              <div className="w-40 h-40 flex-shrink-0">
                <img src={song.albums.cover_image_url} alt={song.albums.title} className="w-full h-full object-cover rounded-lg shadow-md" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{song.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MusicalNoteIcon className="w-5 h-5" />
                <span>From album: </span>
                <span className="font-medium">{song.albums?.title}</span>
              </p>
            </div>
          </header>

          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setActiveTab("original")} className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "original" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}>
                Original Lyrics
              </button>
              <button onClick={() => setActiveTab("translation")} className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "translation" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}>
                Translation
              </button>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">{activeTab === "original" ? <div className="whitespace-pre-line leading-relaxed">{song.lyrics}</div> : <div className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">{song.lyrics_translation || "Translation not available yet."}</div>}</div>
        </div>
      </div>
    </section>
  );
}
