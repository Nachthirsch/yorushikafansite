import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { MusicalNoteIcon, ClockIcon, DocumentTextIcon, ListBulletIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SongForm({ song, onSubmit, onChange, albums = [] }) {
  const [touched, setTouched] = useState({});
  const [lyricsStats, setLyricsStats] = useState({ chars: 0, lines: 0, verses: 0 });
  const [validationErrors, setValidationErrors] = useState({});

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

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-xl overflow-hidden shadow-2xl">
      <form onSubmit={onSubmit} className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pb-6 border-b border-indigo-700">
          <div className="h-14 w-14 rounded-full bg-indigo-600 bg-opacity-30 flex items-center justify-center">
            <MusicalNoteIcon className="h-8 w-8 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Add New Song</h2>
            <p className="text-indigo-300">Enter the song details and lyrics below</p>
          </div>
        </div>

        {/* Album Selection */}
        <div className="bg-indigo-800 bg-opacity-30 rounded-xl p-5 backdrop-blur-sm">
          <label className="block text-sm font-medium text-indigo-300 mb-2">Select Album</label>
          <select value={song.albumId || ""} onChange={(e) => onChange({ ...song, albumId: e.target.value })} className="w-full py-3 px-4 bg-indigo-950 bg-opacity-50 border border-indigo-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all">
            <option value="">Choose an album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
        </div>

        {/* Song Details */}
        <div className="bg-indigo-800 bg-opacity-30 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-5">
            <DocumentTextIcon className="h-5 w-5 text-indigo-300" />
            <h3 className="text-lg font-semibold text-white">Song Details</h3>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div className="relative">
              <label className="block text-sm font-medium text-indigo-300 mb-2">Title</label>
              <input type="text" value={song.title || ""} onChange={(e) => onChange({ ...song, title: e.target.value })} className="w-full py-3 px-4 bg-indigo-950 bg-opacity-50 border border-indigo-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all" placeholder="Enter song title" required />
            </div>

            {/* Track Number & Duration */}
            <div className="grid grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-indigo-300 mb-2">Track #</label>
                <div className="relative">
                  <input type="number" min="1" value={song.track_number || ""} onChange={(e) => onChange({ ...song, track_number: e.target.value })} onBlur={() => handleTouch("track_number")} className={`w-full py-3 pl-4 pr-10 bg-indigo-950 bg-opacity-50 border ${validationErrors.track_number ? "border-red-500" : "border-indigo-700"} rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all`} placeholder="Track number" required />
                  <ListBulletIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                </div>
                {validationErrors.track_number && <p className="mt-1 text-sm text-red-400">{validationErrors.track_number}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-indigo-300 mb-2">Duration</label>
                <div className="relative">
                  <input type="number" min="1" value={song.duration || ""} onChange={(e) => onChange({ ...song, duration: e.target.value })} onBlur={() => handleTouch("duration")} className={`w-full py-3 pl-4 pr-10 bg-indigo-950 bg-opacity-50 border ${validationErrors.duration ? "border-red-500" : "border-indigo-700"} rounded-lg text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all`} placeholder="Duration in seconds" required />
                  <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                </div>
                {song.duration && <p className="mt-1 text-sm text-indigo-300">{formatTime(song.duration)}</p>}
                {validationErrors.duration && <p className="mt-1 text-sm text-red-400">{validationErrors.duration}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Lyrics */}
        <div className="bg-indigo-800 bg-opacity-30 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-5 w-5 text-indigo-300" />
              <h3 className="text-lg font-semibold text-white">Lyrics</h3>
            </div>
            {song.lyrics && (
              <div className="flex gap-4 text-sm text-indigo-300">
                <span className="flex items-center gap-1">
                  <ListBulletIcon className="h-4 w-4" />
                  {lyricsStats.lines} lines
                </span>
                <span>{lyricsStats.verses} verses</span>
                <span>{lyricsStats.chars} chars</span>
              </div>
            )}
          </div>

          <TextareaAutosize value={song.lyrics || ""} onChange={(e) => onChange({ ...song, lyrics: e.target.value })} className="w-full px-4 py-4 rounded-lg border border-indigo-700 bg-indigo-950 bg-opacity-50 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 min-h-[250px] font-mono text-sm transition-all resize-none" placeholder="Enter song lyrics..." required />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-700">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => onChange({ title: "", track_number: "", duration: "", lyrics: "", albumId: "" })} className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-300 hover:bg-indigo-800 hover:bg-opacity-50 transition-all flex items-center gap-2">
            <XMarkIcon className="h-5 w-5" />
            Clear
          </motion.button>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={hasErrors} className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Song
          </motion.button>
        </div>
      </form>
    </div>
  );
}
