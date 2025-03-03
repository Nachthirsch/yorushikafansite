import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Music, X } from "lucide-react";
import { Link } from "react-router-dom"; // Add this import

export default function AlbumDetailView({ album, onClose }) {
  const [activeTab, setActiveTab] = useState("songs");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/60">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Album Header */}
        <div className="relative h-64 overflow-hidden">
          <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20">
            <span className="sr-only">Close</span>
            <X className="w-6 h-6" /> {/* Replace × with Lucide X icon */}
          </button>
          <div className="absolute bottom-4 left-6">
            <h2 className="text-3xl font-light text-white mb-2">{album.title}</h2>
            <p className="text-gray-300">
              {album.classification} • {new Date(album.release_date).getFullYear()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button onClick={() => setActiveTab("songs")} className={`py-4 border-b-2 ${activeTab === "songs" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              Songs
            </button>
            <button onClick={() => setActiveTab("links")} className={`py-4 border-b-2 ${activeTab === "links" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              External Links
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-theme(space.64)-theme(space.14))]">
          {activeTab === "songs" && (
            <div className="space-y-2">
              {album.songs?.map((song) => (
                <Link key={song.id} to={`/lyrics/${song.id}`} className="block">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <Music className="w-5 h-5 text-gray-400 mr-4" />
                    <span className="text-gray-600 dark:text-gray-300 w-8">{song.track_number}.</span>
                    <span className="flex-1 text-gray-900 dark:text-white">{song.title}</span>
                    <span className="text-gray-500">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-4">
              {album.spotify_url && (
                <a href={album.spotify_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30">
                  <ExternalLink className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" /> {/* Replace ExternalLinkIcon */}
                  <span className="text-green-700 dark:text-green-300">Listen on Spotify</span>
                </a>
              )}
              {album.youtube_url && (
                <a href={album.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30">
                  <ExternalLink className="w-5 h-5 mr-3 text-red-600 dark:text-red-400" /> {/* Replace ExternalLinkIcon */}
                  <span className="text-red-700 dark:text-red-300">Watch on YouTube</span>
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
