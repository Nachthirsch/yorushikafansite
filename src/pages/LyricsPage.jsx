import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useSong } from "../hooks/useSong";
import SongHeader from "../components/lyrics/SongHeader";
import SongDescription from "../components/lyrics/SongDescription";
import SongExtrasSection from "../components/lyrics/SongExtrasSection";
import LyricsViewToggle from "../components/lyrics/LyricsViewToggle";
import LyricsContent from "../components/lyrics/LyricsContent";
import SongFootnotes from "../components/lyrics/SongFootnotes";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

export default function LyricsPage() {
  const { songId } = useParams();
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("sideBySide");
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Menentukan halaman asal dari state navigasi
  const from = location.state?.from || "songs";

  // Replace fetchSong with useSong hook
  const { data: song, isLoading: loading } = useSong(songId);

  useEffect(() => {
    // Check if the song is in favorites
    const checkFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
      setFavorite(favorites.includes(songId));
    };

    checkFavorite();
  }, [songId]);

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

  // Fungsi untuk mengarahkan kembali berdasarkan halaman asal
  const handleBackNavigation = () => {
    if (from === "album") {
      navigate("/albums");
    } else {
      navigate("/songs");
    }
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
      {/* Song Header Component - Kirim handler dan informasi halaman asal */}
      <SongHeader song={song} favorite={favorite} toggleFavorite={toggleFavorite} shareSong={shareSong} onBackClick={handleBackNavigation} fromPage={from} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Description Section */}
        {song.description && <SongDescription song={song} />}

        {/* Extras Section */}
        {song.extras && <SongExtrasSection song={song} favorite={favorite} toggleFavorite={toggleFavorite} shareSong={shareSong} />}

        {/* Lyrics View Toggle */}
        <LyricsViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Lyrics Content - Three Views */}
        <LyricsContent activeTab={activeTab} song={song} />

        {/* Footnotes Section */}
        {song.footnotes && <SongFootnotes footnotes={song.footnotes} />}
      </div>
    </div>
  );
}
