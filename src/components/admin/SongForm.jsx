/* eslint-disable no-unused-vars */
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";

export default function SongForm({ albums, selectedAlbum, song, onSubmit, onChange, onAlbumChange }) {
  const [touched, setTouched] = useState({});

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTouch = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={onSubmit} className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="bg-primary/10 p-4">
          <h3 className="text-xl font-bold text-primary">Add New Song</h3>
          <p className="text-sm text-base-content/70">Add a song to an existing album</p>
        </div>

        <div className="card-body gap-6">
          <div className="form-control">
            <label htmlFor="album" className="label">
              <span className="label-text font-medium">Select Album</span>
            </label>
            <select id="album" className="select select-bordered w-full focus:select-primary" value={selectedAlbum?.id || ""} onChange={(e) => onAlbumChange(albums.find((a) => a.id === e.target.value))} required>
              <option value="" disabled>
                Choose an album
              </option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} ({new Date(album.release_date).getFullYear()})
                </option>
              ))}
            </select>
          </div>

          {selectedAlbum && (
            <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
              <img src={selectedAlbum.cover_image_url} alt={selectedAlbum.title} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h4 className="font-medium">{selectedAlbum.title}</h4>
                <p className="text-sm opacity-70">
                  {selectedAlbum.songs?.length || 0} songs • {new Date(selectedAlbum.release_date).getFullYear()}
                </p>
              </div>
            </div>
          )}

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text font-medium">Song Title</span>
              </label>
              <input id="title" type="text" value={song.title} onChange={(e) => onChange({ ...song, title: e.target.value })} onBlur={() => handleTouch("title")} placeholder="Enter song title" className="input input-bordered focus:input-primary" required />
            </div>

            <div className="form-control">
              <label htmlFor="track_number" className="label">
                <span className="label-text font-medium">Track Number</span>
              </label>
              <input id="track_number" type="number" min="1" value={song.track_number} onChange={(e) => onChange({ ...song, track_number: e.target.value })} onBlur={() => handleTouch("track_number")} placeholder="#" className="input input-bordered focus:input-primary" required />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="duration" className="label">
              <span className="label-text font-medium">Duration (seconds)</span>
              {song.duration && <span className="label-text-alt bg-base-200 px-2 py-1 rounded">{formatTime(song.duration)}</span>}
            </label>
            <input id="duration" type="number" min="1" value={song.duration} onChange={(e) => onChange({ ...song, duration: e.target.value })} onBlur={() => handleTouch("duration")} placeholder="Enter duration in seconds" className="input input-bordered focus:input-primary" required />
          </div>

          <div className="form-control">
            <label htmlFor="lyrics" className="label">
              <span className="label-text font-medium">Lyrics</span>
              <span className="label-text-alt">{song.lyrics ? `${song.lyrics.length} characters` : ""}</span>
            </label>
            <TextareaAutosize id="lyrics" value={song.lyrics} onChange={(e) => onChange({ ...song, lyrics: e.target.value })} onBlur={() => handleTouch("lyrics")} placeholder="Enter song lyrics..." className="textarea textarea-bordered focus:textarea-primary min-h-[200px] leading-relaxed" required />
          </div>

          <div className="card-actions justify-end mt-2">
            <button type="button" onClick={() => onChange({ title: "", track_number: "", duration: "", lyrics: "" })} className="btn btn-ghost">
              Clear
            </button>
            <button type="submit" disabled={!selectedAlbum} className="btn btn-primary">
              Add Song
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
