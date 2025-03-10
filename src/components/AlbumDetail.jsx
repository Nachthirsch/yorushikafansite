import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayIcon } from "@heroicons/react/24/solid";

const AlbumDetail = ({ album, onClose }) => {
  const navigate = useNavigate();

  if (!album) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-neutral-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 sm:top-4 right-2 sm:right-4 text-neutral-400 hover:text-neutral-100 z-10 p-2" aria-label="Close album details">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Album cover and info - left side on desktop, top on mobile */}
        <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-3 sm:mb-4 shadow-lg max-w-[200px] md:max-w-none mx-auto md:mx-0">
            <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
          </div>

          <h2 className="text-xl sm:text-2xl font-medium text-neutral-100 mb-1 sm:mb-2 line-clamp-2">{album.title}</h2>
          <p className="text-sm sm:text-base text-neutral-300 mb-3 sm:mb-4">Released: {new Date(album.release_date).toLocaleDateString()}</p>

          {album.classification && (
            <div className="mb-2 sm:mb-3">
              <span className="px-2 py-1 bg-neutral-700 text-neutral-200 rounded text-xs sm:text-sm">{album.classification}</span>
            </div>
          )}

          {/* Description with toggle for mobile */}
          <div className="mb-3 sm:mb-4">
            <p className="text-neutral-300 text-xs sm:text-sm line-clamp-4 md:line-clamp-none">{album.description}</p>
          </div>

          {/* External Links */}
          <div className="mt-auto flex flex-col sm:flex-row md:flex-col gap-2">
            {album.spotify_url && (
              <a href={album.spotify_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-2 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-neutral-100 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-colors text-sm sm:text-base flex-1 md:flex-auto">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.599-.92C9.52 14.08 13.5 14.5 16.8 16.5c.36.181.48.659.24 1.02l-.279.18-.24-.36zm.24-3.3c-.301.42-.841.54-1.261.24-3.24-1.98-8.159-2.58-11.939-1.38-.479.12-.959-.12-1.08-.6-.12-.48.12-.96.6-1.08C9.6 9.73 15 10.38 18.72 12.66c.361.18.48.78.24 1.2l-.3.18zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span>Listen on Spotify</span>
              </a>
            )}

            {album.youtube_url && (
              <a href={album.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-2 bg-[#FF0000]/20 hover:bg-[#FF0000]/30 text-neutral-100 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-colors text-sm sm:text-base flex-1 md:flex-auto">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Watch on YouTube</span>
              </a>
            )}
          </div>
        </div>

        {/* Song list - right side on desktop, bottom on mobile */}
        <div className="w-full md:w-2/3 bg-neutral-800/50 p-4 sm:p-6 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[90vh]">
          <h3 className="text-lg sm:text-xl font-medium text-neutral-100 mb-3 sm:mb-4 flex items-center">
            <span>Tracks</span>
            <span className="ml-2 text-xs sm:text-sm bg-neutral-700 px-2 py-0.5 rounded-full">{album.songs?.length || 0} songs</span>
          </h3>

          <div className="space-y-0.5 sm:space-y-1">
            {[...(album.songs || [])]
              .sort((a, b) => (a.track_number || 0) - (b.track_number || 0))
              .map((song) => (
                <div key={song.id} onClick={() => navigate(`/lyrics/${song.id}`)} className="flex items-center p-2 sm:p-3 hover:bg-neutral-700 rounded-lg cursor-pointer group transition-colors">
                  {/* Track number */}
                  <div className="w-6 sm:w-8 text-center text-neutral-400 group-hover:text-neutral-100 text-sm sm:text-base flex-shrink-0">{song.track_number}</div>

                  {/* Track title - fixed width with proper truncation */}
                  <div className="flex-1 min-w-0 px-2 sm:px-3">
                    <p className="text-neutral-100 group-hover:text-neutral-300 transition-colors text-sm sm:text-base truncate">{song.title}</p>
                  </div>

                  {/* Duration - ensuring it stays right-aligned */}
                  <div className="text-neutral-400 text-xs sm:text-sm whitespace-nowrap ml-2 sm:ml-3 flex-shrink-0">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                  </div>

                  {/* Play icon - ensuring it stays next to duration */}
                  <div className="ml-2 sm:ml-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <PlayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300" />
                  </div>
                </div>
              ))}
          </div>

          {!album.songs?.length && <div className="py-6 sm:py-8 text-center text-neutral-400 text-sm sm:text-base">No tracks available for this album</div>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumDetail;
