import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { MusicalNoteIcon, ClockIcon, DocumentTextIcon, ListBulletIcon, PlusIcon, XMarkIcon, PlayIcon, MicrophoneIcon, MusicalNoteIcon as MusicIcon, LanguageIcon, ArrowLeftIcon, PencilIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";

export default function SongForm({ song, onSubmit, onChange, albums = [], isEditing = false }) {
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [lyricsStats, setLyricsStats] = useState({ chars: 0, lines: 0, verses: 0 });
  const [validationErrors, setValidationErrors] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const lyricLines = (song.lyrics || "").split("\n");
  const textareaRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(24); // Default line height
  const [activeLyricsTab, setActiveLyricsTab] = useState("original");
  const translationLines = (song.lyrics_translation || "").split("\n");

  useEffect(() => {
    if (song.lyrics) {
      const lines = song.lyrics.split("\n").filter((line) => line.trim() !== "").length;
      const verses = song.lyrics.split("\n\n").filter((verse) => verse.trim() !== "").length;

      setLyricsStats({
        chars: song.lyrics.length,
        lines,
        verses,
      });
    }
  }, [song.lyrics]);

  useEffect(() => {
    const errors = {};

    if (touched.track_number && song.track_number) {
      const trackNum = parseInt(song.track_number);
      if (isNaN(trackNum) || trackNum < 1) {
        errors.track_number = "Track number must be a positive number";
      }
    }

    if (touched.duration && song.duration) {
      const duration = parseInt(song.duration);
      if (isNaN(duration) || duration < 1) {
        errors.duration = "Duration must be a positive number";
      }
    }

    setValidationErrors(errors);
  }, [song.track_number, song.duration, touched]);

  useEffect(() => {
    if (textareaRef.current) {
      // Get computed line height
      const style = window.getComputedStyle(textareaRef.current);
      const computedLineHeight = parseInt(style.lineHeight);
      if (!isNaN(computedLineHeight)) {
        setLineHeight(computedLineHeight);
      }
    }
  }, []);

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTouch = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  // Generate line numbers for lyrics editor
  const renderLineNumbers = () => {
    return lyricLines.map((_, index) => (
      <div key={index} className="text-indigo-400 text-right pr-2 opacity-70" style={{ height: lineHeight }}>
        {index + 1}
      </div>
    ));
  };

  // Waveform animation bars for the visualizer
  const renderVisualizer = () => {
    return Array(15)
      .fill(0)
      .map((_, i) => {
        const height = Math.floor(Math.random() * 24) + 8; // Random height between 8-32px
        return <motion.div key={i} className="w-1 bg-indigo-500 rounded-t-sm" style={{ height: `${height}px` }} animate={{ height: isPlaying ? [`${height}px`, `${Math.floor(Math.random() * 32) + 4}px`] : `${height}px` }} transition={{ duration: 0.4, repeat: isPlaying ? Infinity : 0, repeatType: "reverse" }} />;
      });
  };

  // Render the album selection inside the Track Details Module
  const renderAlbumSelection = () => (
    <div className="relative">
      <label className="block text-sm font-medium text-indigo-300 mb-2">Select Album</label>
      <div className="relative">
        <select value={song.album_id || ""} onChange={(e) => onChange({ ...song, album_id: e.target.value })} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10" required>
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
      {/* Add navigation header for edit mode */}
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

      <form onSubmit={onSubmit} className="relative">
        {/* Studio Header */}
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

        {/* Main Studio Console */}
        <div className="p-6 space-y-8">
          {/* Track Details Module */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-indigo-700/60 shadow-lg">
            <div className="space-y-6"></div>
            {/* Album Selection - now inside Track Details */}
            {renderAlbumSelection()}

            {/* Title */}
            <div className="relative">
              <label className="block text-sm font-medium text-indigo-300 mb-2">Track Title</label>
              <div className="relative">
                <input type="text" value={song.title || ""} onChange={(e) => onChange({ ...song, title: e.target.value })} className="w-full py-3 px-4 bg-black/30 backdrop-blur-sm border border-indigo-600/70 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all pl-10" placeholder="Enter track title" required />
                <MusicIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              </div>
            </div>

            {/* Track Number & Duration */}
            <div className="grid grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-indigo-300 mb-2">Track #</label>
                <div className="flex items-center">
                  <input type="number" min="1" value={song.track_number || ""} onChange={(e) => onChange({ ...song, track_number: e.target.value })} onBlur={() => handleTouch("track_number")} className={`font-mono text-2xl text-center bg-indigo-950 border ${validationErrors.track_number ? "border-red-500" : "border-indigo-700"} rounded-lg shadow-inner py-2 px-4 w-24 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500`} placeholder="##" required />
                  <div className="ml-3 flex flex-col">
                    <button type="button" onClick={() => onChange({ ...song, track_number: song.track_number ? parseInt(song.track_number) + 1 : 1 })} className="bg-indigo-800 hover:bg-indigo-700 rounded-t px-2 py-1">
                      <svg className="w-4 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button type="button" onClick={() => onChange({ ...song, track_number: song.track_number && parseInt(song.track_number) > 1 ? parseInt(song.track_number) - 1 : 1 })} className="bg-indigo-800 hover:bg-indigo-700 rounded-b px-2 py-1 border-t border-indigo-950">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <ClockIcon className="h-5 w-5 text-indigo-400" />
                    <span className="bg-black/40 px-3 py-1 rounded font-mono text-lg text-indigo-100">{formatTime(song.duration)}</span>
                  </div>

                  {/* Duration Slider */}
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="1"
                      max="900" // 15 minutes
                      value={song.duration || 0}
                      onChange={(e) => onChange({ ...song, duration: e.target.value })}
                      onBlur={() => handleTouch("duration")}
                      className="appearance-none w-full h-3 bg-indigo-900 rounded-lg outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-300 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>

                  {/* Duration Controls */}
                  <div className="flex justify-between text-xs text-indigo-400 px-1">
                    <span>0:00</span>
                    <span>5:00</span>
                    <span>10:00</span>
                    <span>15:00</span>
                  </div>
                </div>
                {validationErrors.duration && <p className="mt-1 text-sm text-red-400">{validationErrors.duration}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Lyrics Editor Console */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-indigo-700/60 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-indigo-800/50">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-5 w-5 text-indigo-300" />
              <h3 className="text-lg font-semibold text-white">Lyrics Editor</h3>
            </div>

            {/* Tabs for Original/Translation */}
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

            {/* Stats display */}
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

          {/* Structure Markers */}
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

          {/* Lyrics Editor with Line Numbers */}
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

            {activeLyricsTab === "original" ? <TextareaAutosize ref={textareaRef} value={song.lyrics || ""} onChange={(e) => onChange({ ...song, lyrics: e.target.value })} className="font-mono leading-relaxed w-full px-6 py-6 rounded-lg border-0 bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 min-h-[350px] shadow-inner resize-none pl-14" placeholder="Write original lyrics here..." required spellCheck="false" /> : <TextareaAutosize value={song.lyrics_translation || ""} onChange={(e) => onChange({ ...song, lyrics_translation: e.target.value })} className="font-mono leading-relaxed w-full px-6 py-6 rounded-lg border-0 bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 min-h-[350px] shadow-inner resize-none pl-14" placeholder="Write translation here..." spellCheck="false" />}
          </div>
        </div>

        {/* Mixing Console Control Panel */}
        <div className="flex justify-between items-center gap-4 pt-6 mt-8 px-6 py-4 bg-black/30 backdrop-blur-sm border-t border-indigo-700/50">
          {/* Audio Visualizer */}
          <div className="h-8 flex items-end gap-0.5">{renderVisualizer()}</div>

          {/* Transport Controls */}
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

          {/* Form Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                if (isEditing) {
                  navigate(-1);
                } else {
                  onChange({
                    title: "",
                    track_number: "",
                    duration: "",
                    lyrics: "",
                    lyrics_translation: "",
                    albumId: "",
                  });
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
