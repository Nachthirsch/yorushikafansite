import TextareaAutosize from "react-textarea-autosize";

export default function SongForm({ albums, selectedAlbum, song, onSubmit, onChange, onAlbumChange }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-1">
          Album
        </label>
        <select id="album" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={selectedAlbum?.id || ""} onChange={(e) => onAlbumChange(albums.find((a) => a.id === e.target.value))} required>
          <option value="">Select Album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Song Title
          </label>
          <input id="title" type="text" value={song.title} onChange={(e) => onChange({ ...song, title: e.target.value })} placeholder="Song Title" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" required />
        </div>

        <div>
          <label htmlFor="track_number" className="block text-sm font-medium text-gray-700 mb-1">
            Track Number
          </label>
          <input id="track_number" type="number" min="1" value={song.track_number} onChange={(e) => onChange({ ...song, track_number: e.target.value })} placeholder="Track Number" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" required />
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
          Duration (in seconds)
        </label>
        <input id="duration" type="number" min="1" value={song.duration} onChange={(e) => onChange({ ...song, duration: e.target.value })} placeholder="Duration in seconds" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" required />
      </div>

      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-1">
          Lyrics
        </label>
        <TextareaAutosize id="lyrics" value={song.lyrics} onChange={(e) => onChange({ ...song, lyrics: e.target.value })} placeholder="Enter song lyrics" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all min-h-[200px]" required />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={!selectedAlbum} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50">
          Add Song
        </button>
      </div>
    </form>
  );
}
