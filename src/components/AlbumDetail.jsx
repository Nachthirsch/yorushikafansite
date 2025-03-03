import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayIcon } from "@heroicons/react/24/solid";

const AlbumDetail = ({ album, onClose }) => {
  const navigate = useNavigate();

  if (!album) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Album cover and info - left side */}
        <div className="md:w-1/3 p-6 flex flex-col">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4 shadow-lg">
            <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
          </div>

          <h2 className="text-2xl font-medium text-white mb-2">{album.title}</h2>
          <p className="text-gray-300 mb-4">Released: {new Date(album.release_date).toLocaleDateString()}</p>

          {album.classification && (
            <div className="mb-3">
              <span className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded text-sm">{album.classification}</span>
            </div>
          )}

          <p className="text-gray-300 text-sm mb-4">{album.description}</p>

          {/* External Links */}
          <div className="mt-auto flex flex-col space-y-2">
            {album.spotify_url && (
              <a href={album.spotify_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-white py-2 px-4 rounded-full transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.6-.9C10.5 13.97 14.4 14.4 17.64 16.44c.36.219.48.66.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span>Listen on Spotify</span>
              </a>
            )}

            {album.youtube_url && (
              <a href={album.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#FF0000]/20 hover:bg-[#FF0000]/30 text-white py-2 px-4 rounded-full transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Watch on YouTube</span>
              </a>
            )}
          </div>
        </div>

        {/* Song list - right side */}
        <div className="md:w-2/3 bg-gray-800/50 p-6 overflow-y-auto max-h-[500px] md:max-h-none">
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <span>Tracks</span>
            <span className="ml-2 text-sm bg-gray-700/50 px-2 py-0.5 rounded-full">{album.songs?.length || 0} songs</span>
          </h3>

          <div className="space-y-1">
            {album.songs?.map((song) => (
              <div key={song.id} onClick={() => navigate(`/lyrics/${song.id}`)} className="flex items-center p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                <div className="w-8 text-center text-gray-400 group-hover:text-white">{song.track_number}</div>

                <div className="flex-1 px-3">
                  <p className="text-white group-hover:text-indigo-300 transition-colors">{song.title}</p>
                </div>

                <div className="text-gray-400 text-sm">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                </div>

                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>

          {!album.songs?.length && <div className="py-8 text-center text-gray-400">No tracks available for this album</div>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumDetail;
