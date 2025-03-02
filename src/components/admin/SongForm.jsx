/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { MusicalNoteIcon, ClockIcon, DocumentTextIcon, ListBulletIcon, ArchiveBoxIcon, CheckCircleIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function SongForm({ albums, selectedAlbum, song, onSubmit, onChange, onAlbumChange }) {
  const [touched, setTouched] = useState({});
  const [lyricsStats, setLyricsStats] = useState({ chars: 0, lines: 0, verses: 0 });
  const [formTouched, setFormTouched] = useState(false);
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
    } else {
      setLyricsStats({ chars: 0, lines: 0, verses: 0 });
    }
  }, [song.lyrics]);

  // Mark form as touched when any field changes
  useEffect(() => {
    if (song.title || song.track_number || song.duration || song.lyrics) {
      setFormTouched(true);
    }
  }, [song.title, song.track_number, song.duration, song.lyrics]);

  // Validate form fields
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

  const handleClear = () => {
    onChange({ title: "", track_number: "", duration: "", lyrics: "" });
    setTouched({});
    setFormTouched(false);
    setValidationErrors({});
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto p-4">
      <form onSubmit={onSubmit} className="space-y-6 bg-base-200 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 pb-4">
          <div>
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <MusicalNoteIcon className="w-5 h-5" />
              Add New Song
            </h3>
            <p className="text-sm text-base-content/60 mt-1">Add a song to your collection</p>
          </div>
        </div>

        {/* Album Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Album</label>
            <select value={selectedAlbum?.id || ""} onChange={(e) => onAlbumChange(albums.find((a) => a.id === e.target.value))} className="select select-bordered w-full bg-base-100" required>
              <option value="" disabled>
                Select album
              </option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} ({new Date(album.release_date).getFullYear()})
                </option>
              ))}
            </select>
          </div>

          {selectedAlbum && (
            <div className="flex items-center gap-4 bg-base-100 p-4 rounded-lg">
              <img src={selectedAlbum.cover_image_url} alt={selectedAlbum.title} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{selectedAlbum.title}</h4>
                <p className="text-sm text-base-content/60">
                  {selectedAlbum.songs?.length || 0} songs · {new Date(selectedAlbum.release_date).getFullYear()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Song Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input type="text" value={song.title} onChange={(e) => onChange({ ...song, title: e.target.value })} className="input input-bordered w-full bg-base-100" placeholder="Song title" required disabled={!selectedAlbum} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Track #</label>
              <input type="number" min="1" value={song.track_number} onChange={(e) => onChange({ ...song, track_number: e.target.value })} className={`input input-bordered w-full bg-base-100 ${validationErrors.track_number ? "input-error" : ""}`} placeholder="#" required disabled={!selectedAlbum} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (s)</label>
              <input type="number" min="1" value={song.duration} onChange={(e) => onChange({ ...song, duration: e.target.value })} className={`input input-bordered w-full bg-base-100 ${validationErrors.duration ? "input-error" : ""}`} placeholder="Seconds" required disabled={!selectedAlbum} />
              {song.duration && <span className="text-sm text-primary mt-1 block">{formatTime(song.duration)}</span>}
            </div>
          </div>
        </div>

        {/* Lyrics */}
        <div>
          <label className="block text-sm font-medium mb-2">Lyrics</label>
          <div className="relative">
            <TextareaAutosize value={song.lyrics} onChange={(e) => onChange({ ...song, lyrics: e.target.value })} className="textarea textarea-bordered w-full min-h-[200px] bg-base-100 font-mono text-sm" placeholder="Enter lyrics..." required disabled={!selectedAlbum} />
          </div>
          {song.lyrics && (
            <div className="flex gap-4 mt-2 text-sm text-base-content/60">
              <span>{lyricsStats.lines} lines</span>
              <span>{lyricsStats.verses} verses</span>
              <span>{lyricsStats.chars} characters</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
          <button type="button" onClick={handleClear} className="btn btn-ghost" disabled={!selectedAlbum || !formTouched}>
            Clear
          </button>
          <button type="submit" className="btn btn-primary" disabled={!selectedAlbum || hasErrors}>
            Add Song
          </button>
        </div>
      </form>
    </motion.div>
  );
}
