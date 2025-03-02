/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

export default function AlbumPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      const { data, error } = await supabase
        .from("albums")
        .select(
          `
          *,
          songs (
            id,
            title,
            track_number,
            duration
          )
        `
        )
        .order("release_date", { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black h-[50vh] mb-20">
        {/* Dynamic background with animated gradient and particles */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 opacity-60 animate-gradient" />
        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 backdrop-blur-2xl" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-wider mb-4">Discography</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light opacity-90">Explore Yorushika's musical journey through their captivating albums and songs</p>
          </motion.div>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {albums.map((album, index) => (
              <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex flex-col items-center">
                {/* Fixed Size Album Card */}
                <div className="relative w-[280px] h-[280px] rounded-lg bg-gray-900 overflow-hidden group">
                  <img src={album.cover_image_url} alt={album.title} className="w-[280px] h-[280px] object-cover transform-gpu transition-transform duration-500 group-hover:scale-110" loading="lazy" />

                  {/* Overlay with fixed dimensions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 p-5 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h2 className="text-lg font-light text-white mb-1 truncate max-w-[240px]">{album.title}</h2>
                      <p className="text-sm text-gray-300 mb-3">
                        {new Date(album.release_date).getFullYear()} • {album.songs?.length} tracks
                      </p>

                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 transition-colors duration-300" onClick={() => handleAlbumClick(album)}>
                        <PlayIcon className="w-4 h-4" />
                        <span className="text-sm">Preview Album</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Album Details Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAlbum(null)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="modal-content">
              <button onClick={() => setSelectedAlbum(null)} className="modal-close-button">
                <svg xmlns="http://www.w3.org/2000/svg" className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="modal-body">
                <img src={selectedAlbum.cover_image_url} alt={selectedAlbum.title} className="album-cover" />
                <div className="album-info">
                  <h3 className="album-title">{selectedAlbum.title}</h3>
                  <p className="album-date">Released in {new Date(selectedAlbum.release_date).getFullYear()}</p>
                  <div className="song-list">
                    {selectedAlbum.songs?.map((song) => (
                      <div key={song.id} onClick={() => navigate(`/lyrics/${song.id}`)} className="song-item">
                        <span className="track-number">{song.track_number}</span>
                        <span className="song-title">{song.title}</span>
                        <span className="song-duration">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
