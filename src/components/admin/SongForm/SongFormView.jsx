import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MusicalNoteIcon,
  ClockIcon,
  DocumentTextIcon,
  ListBulletIcon,
  PlusIcon,
  XMarkIcon,
  PlayIcon,
  MusicalNoteIcon as MusicIcon,
  LanguageIcon,
  ArrowLeftIcon,
  PencilIcon,
  ArchiveBoxIcon,
  InformationCircleIcon,
  PhotoIcon, // Add this import
} from "@heroicons/react/24/outline";

export default function SongFormView({ song, albums, isEditing, navigate, touched, lyricsStats, validationErrors, isPlaying, lineHeight, activeLyricsTab, hasErrors, setIsPlaying, setActiveLyricsTab, handleTouch, handleFormSubmit, handleChange, handleReset, formatTime }) {
  const textareaRef = useRef(null);
  const lyricLines = (song.lyrics || "").split("\n");
  const translationLines = (song.lyrics_translation || "").split("\n");

  const renderLineNumbers = () => {
    return lyricLines.map((_, index) => (
      <div key={index} className="text-indigo-400 text-right pr-2 opacity-70" style={{ height: lineHeight }}>
        {index + 1}
      </div>
    ));
  };

  const renderVisualizer = () => {
    return Array(15)
      .fill(0)
      .map((_, i) => {
        const height = Math.floor(Math.random() * 24) + 8;
        return <motion.div key={i} className="w-1 bg-indigo-500 rounded-t-sm" style={{ height: `${height}px` }} animate={{ height: isPlaying ? [`${height}px`, `${Math.floor(Math.random() * 32) + 4}px`] : `${height}px` }} transition={{ duration: 0.4, repeat: isPlaying ? Infinity : 0, repeatType: "reverse" }} />;
      });
  };

  const renderAlbumSelection = () => (
    <div className="relative">
      <label className="block text-sm font-medium text-indigo-300 mb-2">Select Album</label>
      <div className="relative">
        <select value={song.album_id || ""} onChange={(e) => handleChange("album_id", e.target.value)} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10" required>
          <option value="">Select master album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title} ({new Date(album.release_date).getFullYear()})
            </option>
          ))}
        </select>
        <ArchiveBoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-xl overflow-hidden shadow-2xl border border-indigo-700/50">
      {isEditing && (
        <div className="bg-black/40 px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Link to={`/lyrics/${song.id}`} className="px-4 py-2 rounded-lg text-indigo-300 hover:text-white transition-colors">
              View Lyrics
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="relative">
        <div className="flex items-center justify-between space-x-4 p-6 bg-black/30 backdrop-blur-sm border-b border-indigo-700/50">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 bg-opacity-70 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Studio Session</h2>
              <p className="text-indigo-300">Record a new track for your collection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 shadow-glow-red animate-pulse"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-indigo-700/60 shadow-lg">
            <div className="space-y-6">
              {renderAlbumSelection()}

              <div className="relative">
                <label className="block text-sm font-medium text-indigo-300 mb-2">Thumbnail Cover URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={song.thumbnail_cover_url || ""}
                    onChange={(e) => handleChange("thumbnail_cover_url", e.target.value)}
                    onBlur={() => handleTouch("thumbnail_cover_url")}
                    className={`w-full py-3 px-4 bg-black/30 backdrop-blur-sm border 
                      ${validationErrors.thumbnail_cover_url ? "border-red-500" : "border-indigo-600/70"}
                      rounded-lg text-white focus:ring-2 focus:ring-indigo-400 
                      focus:border-indigo-500 transition-all pl-10`}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  <PhotoIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                </div>
                {validationErrors.thumbnail_cover_url ? <p className="mt-1 text-sm text-red-400">{validationErrors.thumbnail_cover_url}</p> : <p className="mt-1 text-sm text-indigo-400">Optional: Leave empty to use album cover</p>}
              </div>

              {/* Track Title & Description fields */}
              <div className="relative">
                <label className="block text-sm font-medium text-indigo-300 mb-2">Track Title</label>
                <div className="relative">
                  <input type="text" value={song.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10" placeholder="Enter track title" required />
                  <MusicIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                </div>
              </div>

              {/* Add description field */}
              <div className="relative">
                <label className="block text-sm font-medium text-indigo-300 mb-2">Description</label>
                <div className="relative">
                  <TextareaAutosize value={song.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10 resize-none" placeholder="Enter song description (optional)" minRows={3} />
                  <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-indigo-300 mb-2">Track #</label>
                  <div className="flex items-center">
                    <input type="number" min="1" value={song.track_number || ""} onChange={(e) => handleChange("track_number", e.target.value)} onBlur={() => handleTouch("track_number")} className={`font-mono text-2xl text-center bg-indigo-950 border ${validationErrors.track_number ? "border-red-500" : "border-indigo-700"} rounded-lg shadow-inner py-2 px-4 w-24 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500`} placeholder="##" required />
                    <div className="ml-3 flex flex-col">
                      <button type="button" onClick={() => handleChange("track_number", song.track_number ? parseInt(song.track_number) + 1 : 1)} className="bg-indigo-800 hover:bg-indigo-700 rounded-t px-2 py-1">
                        <svg className="w-4 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button type="button" onClick={() => handleChange("track_number", song.track_number && parseInt(song.track_number) > 1 ? parseInt(song.track_number) - 1 : 1)} className="bg-indigo-800 hover:bg-indigo-700 rounded-b px-2 py-1 border-t border-indigo-950">
                        <svg className="w-4 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {validationErrors.track_number && <p className="mt-1 text-sm text-red-400">{validationErrors.track_number}</p>}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-indigo-300 mb-2">Duration</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={song.duration ? formatTime(song.duration) : ""}
                      onChange={(e) => {
                        const [mins, secs] = e.target.value.split(":").map(Number);
                        const totalSeconds = (mins || 0) * 60 + (secs || 0);
                        handleChange("duration", totalSeconds);
                      }}
                      onBlur={() => handleTouch("duration")}
                      className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10"
                      placeholder="MM:SS"
                      pattern="[0-9]{1,2}:[0-9]{2}"
                    />
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  </div>
                  {validationErrors.duration && <p className="mt-1 text-sm text-red-400">{validationErrors.duration}</p>}
                </div>

                <div className="relative col-span-2">
                  <label className="block text-sm font-medium text-indigo-300 mb-2">Translator</label>
                  <div className="relative">
                    <input type="text" value={song.translator || ""} onChange={(e) => handleChange("translator", e.target.value)} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10" placeholder="Enter translator's name (optional)" />
                    <LanguageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-indigo-700/60 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-indigo-800/50">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-5 w-5 text-indigo-300" />
              <h3 className="text-lg font-semibold text-white">Lyrics Editor</h3>
            </div>

            <div className="flex space-x-2">
              <button type="button" onClick={() => setActiveLyricsTab("original")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLyricsTab === "original" ? "bg-indigo-600 text-white" : "text-indigo-300 hover:bg-indigo-800/50"}`}>
                <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                Original
              </button>
              <button type="button" onClick={() => setActiveLyricsTab("translation")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLyricsTab === "translation" ? "bg-indigo-600 text-white" : "text-indigo-300 hover:bg-indigo-800/50"}`}>
                <LanguageIcon className="h-4 w-4 inline mr-2" />
                Translation
              </button>
            </div>

            {song.lyrics && (
              <div className="flex gap-4 text-xs text-indigo-300 bg-black/20 rounded-full px-4 py-2">
                <span className="flex items-center gap-1">
                  <ListBulletIcon className="h-3 w-3" />
                  {activeLyricsTab === "original" ? lyricsStats.lines : translationLines.length}
                </span>
                <span>{activeLyricsTab === "original" ? lyricsStats.verses : Math.ceil(translationLines.length / 4)} verses</span>
                <span>{activeLyricsTab === "original" ? lyricsStats.chars : (song.lyrics_translation || "").length} chars</span>
              </div>
            )}
          </div>

          {activeLyricsTab === "original" && (
            <div className="flex gap-2 px-5 py-3 bg-black/40 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-800/50 px-3 py-1.5 rounded-full mb-2">
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                VERSE
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-800/50 px-3 py-1.5 rounded-full mb-2">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                CHORUS
              </div>
              <div className="flex items-center gap-2 text-xs text-green-300 bg-green-800/50 px-3 py-1.5 rounded-full mb-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                BRIDGE
              </div>
              <div className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-800/50 px-3 py-1.5 rounded-full mb-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                OUTRO
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-indigo-900/50 border-r border-indigo-700 flex flex-col items-center pt-6 text-xs text-indigo-300 overflow-hidden">
              {activeLyricsTab === "original"
                ? renderLineNumbers()
                : translationLines.map((_, index) => (
                    <div key={index} className="text-indigo-400 text-right pr-2 opacity-70" style={{ height: lineHeight }}>
                      {index + 1}
                    </div>
                  ))}
            </div>

            {activeLyricsTab === "original" ? <TextareaAutosize ref={textareaRef} value={song.lyrics || ""} onChange={(e) => handleChange("lyrics", e.target.value)} className="font-mono leading-relaxed w-full px-6 py-6 rounded-lg border-0 bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 min-h-[350px] shadow-inner resize-none pl-14" placeholder="Write original lyrics here..." required spellCheck="false" /> : <TextareaAutosize value={song.lyrics_translation || ""} onChange={(e) => handleChange("lyrics_translation", e.target.value)} className="font-mono leading-relaxed w-full px-6 py-6 rounded-lg border-0 bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 min-h-[350px] shadow-inner resize-none pl-14" placeholder="Write translation here..." spellCheck="false" />}
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-indigo-700/60 shadow-lg overflow-hidden mt-6">
          <div className="flex items-center justify-between p-5 border-b border-indigo-800/50">
            <div className="flex items-center space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-indigo-300" />
              <h3 className="text-lg font-semibold text-white">Footnotes</h3>
            </div>
          </div>

          <TextareaAutosize value={song.footnotes || ""} onChange={(e) => handleChange("footnotes", e.target.value)} className="w-full px-6 py-4 rounded-lg border-0 bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 min-h-[100px] shadow-inner resize-none" placeholder="Add notes, references, or explanations here..." />
        </div>

        {/* Add Extras field before the form end */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 bg-black/30 backdrop-blur-sm rounded-xl border border-indigo-700/60 shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
            <h2 className="text-xl font-medium text-white">Extras (Optional)</h2>
          </div>
          <TextareaAutosize value={song.extras || ""} onChange={(e) => handleChange("extras", e.target.value)} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all resize-none" placeholder="Add any additional information, trivia, or extra content here..." minRows={3} />
        </motion.div>

        <div className="flex justify-between items-center gap-4 pt-6 mt-8 px-6 py-4 bg-black/30 backdrop-blur-sm border-t border-indigo-700/50">
          <div className="h-8 flex items-end gap-0.5">{renderVisualizer()}</div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsPlaying(!isPlaying)} className="h-10 w-10 rounded-full bg-indigo-800 hover:bg-indigo-700 flex items-center justify-center">
              {isPlaying ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                  <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <PlayIcon className="h-5 w-5 ml-0.5" />
              )}
            </button>

            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <div className="h-2 w-2 rounded-full bg-indigo-300"></div>
              <div className="h-2 w-2 rounded-full bg-indigo-300"></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                if (isEditing) {
                  navigate(-1);
                } else {
                  handleReset();
                }
              }}
              className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 transition-all duration-200 flex items-center gap-2 text-sm font-medium uppercase tracking-wide"
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </>
              ) : (
                <>
                  <XMarkIcon className="h-5 w-5" />
                  Reset
                </>
              )}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={hasErrors} className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
              {isEditing ? (
                <>
                  <PencilIcon className="h-5 w-5" />
                  Save Changes
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  Create Song
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
