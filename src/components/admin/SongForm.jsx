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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
      <form onSubmit={onSubmit} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200 h-full">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 border-b border-base-200">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <MusicalNoteIcon className="w-5 h-5" />
            Add New Song
          </h3>
          <p className="text-sm text-base-content/70 mt-1">Add a song to an existing album</p>
        </div>

        <div className="card-body gap-6 p-6">
          <div className="form-control">
            <label htmlFor="album" className="label">
              <span className="label-text font-medium">Select Album</span>
            </label>
            <div className="relative">
              <select id="album" className="select select-bordered w-full focus:select-primary pl-10 border-base-300 bg-base-100/50" value={selectedAlbum?.id || ""} onChange={(e) => onAlbumChange(albums.find((a) => a.id === e.target.value))} required aria-label="Select album">
                <option value="" disabled>
                  Choose an album
                </option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title} ({new Date(album.release_date).getFullYear()})
                  </option>
                ))}
              </select>
              <ArchiveBoxIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
            </div>
          </div>

          {selectedAlbum && (
            <div className="flex items-center gap-4 p-4 bg-base-200/30 rounded-lg border border-base-300/50 transition-all hover:shadow-sm">
              <div className="relative w-20 h-20 overflow-hidden rounded-md shadow-md">
                <img src={selectedAlbum.cover_image_url} alt={selectedAlbum.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div>
                <h4 className="font-medium text-lg">{selectedAlbum.title}</h4>
                <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                  <span className="badge badge-sm badge-primary badge-outline">{selectedAlbum.songs?.length || 0} songs</span>
                  <span>•</span>
                  <span>{new Date(selectedAlbum.release_date).getFullYear()}</span>
                </div>
                <p className="text-xs text-base-content/60 mt-1">Adding a new song to this album</p>
              </div>
            </div>
          )}

          <div className="divider my-2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text font-medium">Song Title</span>
              </label>
              <div className="relative">
                <input id="title" type="text" value={song.title} onChange={(e) => onChange({ ...song, title: e.target.value })} onBlur={() => handleTouch("title")} placeholder="Enter song title" className="input input-bordered focus:input-primary w-full pl-10 border-base-300 bg-base-100/50" required aria-label="Song title" disabled={!selectedAlbum} />
                <MusicalNoteIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="track_number" className="label">
                <span className="label-text font-medium">Track Number</span>
              </label>
              <div className="relative">
                <input id="track_number" type="number" min="1" value={song.track_number} onChange={(e) => onChange({ ...song, track_number: e.target.value })} onBlur={() => handleTouch("track_number")} placeholder="#" className={`input input-bordered focus:input-primary w-full pl-10 border-base-300 bg-base-100/50 ${validationErrors.track_number ? "input-error" : ""}`} required aria-label="Track number" disabled={!selectedAlbum} />
                <ListBulletIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
              </div>
              {validationErrors.track_number && (
                <div className="flex items-center gap-2 mt-1 text-error text-xs">
                  <XMarkIcon className="w-3 h-3" />
                  <p>{validationErrors.track_number}</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="duration" className="label">
              <span className="label-text font-medium">Duration (seconds)</span>
              {song.duration && (
                <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full text-xs font-medium">
                  <ClockIcon className="w-3 h-3 text-primary/70" />
                  <span>{formatTime(song.duration)}</span>
                </div>
              )}
            </label>
            <div className="relative">
              <input id="duration" type="number" min="1" value={song.duration} onChange={(e) => onChange({ ...song, duration: e.target.value })} onBlur={() => handleTouch("duration")} placeholder="Enter duration in seconds" className={`input input-bordered focus:input-primary w-full pl-10 border-base-300 bg-base-100/50 ${validationErrors.duration ? "input-error" : ""}`} required aria-label="Song duration in seconds" disabled={!selectedAlbum} />
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
            </div>
            {validationErrors.duration ? (
              <div className="flex items-center gap-2 mt-1 text-error text-xs">
                <XMarkIcon className="w-3 h-3" />
                <p>{validationErrors.duration}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                <InformationCircleIcon className="w-3 h-3" />
                <p>Example: 180 seconds = 3:00 minutes</p>
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="lyrics" className="label">
              <span className="label-text font-medium">Lyrics</span>
              {song.lyrics && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full text-xs font-medium">
                    <DocumentTextIcon className="w-3 h-3 text-primary/70" />
                    <span>{lyricsStats.lines} lines</span>
                  </div>
                  <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full text-xs font-medium">
                    <MusicalNoteIcon className="w-3 h-3 text-primary/70" />
                    <span>{lyricsStats.verses} verses</span>
                  </div>
                </div>
              )}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 opacity-70">
                <DocumentTextIcon className="w-5 h-5 text-primary/60" />
              </div>
              <TextareaAutosize id="lyrics" value={song.lyrics} onChange={(e) => onChange({ ...song, lyrics: e.target.value })} onBlur={() => handleTouch("lyrics")} placeholder="Enter song lyrics..." className="textarea textarea-bordered focus:textarea-primary min-h-[200px] leading-relaxed w-full pl-10 border-base-300 bg-base-100/50 font-mono text-sm" required aria-label="Song lyrics" disabled={!selectedAlbum} />
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-base-content/60">
              <InformationCircleIcon className="w-4 h-4" />
              <p>Enter lyrics with line breaks for verses and choruses. Use double line breaks to separate verses.</p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="card-actions justify-end mt-4">
            <button type="button" onClick={handleClear} className="btn btn-ghost hover:bg-base-200" disabled={!selectedAlbum || !formTouched} aria-label="Clear form">
              Clear
            </button>
            <button type="submit" disabled={!selectedAlbum || hasErrors} className="btn btn-primary" aria-label="Add song">
              Add Song
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
