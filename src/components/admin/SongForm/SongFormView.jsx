import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MusicalNoteIcon, ClockIcon, DocumentTextIcon, ListBulletIcon, PlusIcon, XMarkIcon, PlayIcon, LanguageIcon, ArrowLeftIcon, PencilIcon, ArchiveBoxIcon, InformationCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function SongFormView({ song, albums, isEditing, navigate, touched, lyricsStats, validationErrors, isPlaying, lineHeight, activeLyricsTab, hasErrors, setIsPlaying, setActiveLyricsTab, handleTouch, handleFormSubmit, handleChange, handleReset, formatTime }) {
  const textareaRef = useRef(null);
  const lyricLines = (song.lyrics || "").split("\n");
  const translationLines = (song.lyrics_translation || "").split("\n");

  const renderLineNumbers = () => {
    return lyricLines.map((_, index) => (
      <div key={index} className="text-gray-400 text-right pr-2 text-xs" style={{ height: lineHeight }}>
        {index + 1}
      </div>
    ));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header with navigation */}
      {isEditing && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <Link to={`/lyrics/${song.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View Lyrics
          </Link>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        {/* Form Title */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{isEditing ? "Edit Song" : "New Song"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEditing ? "Update song details" : "Add a new song to your collection"}</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Album Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Album</label>
              <div className="relative">
                <select value={song.album_id || ""} onChange={(e) => handleChange("album_id", e.target.value)} className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-9" required>
                  <option value="">Select album</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title} ({new Date(album.release_date).getFullYear()})
                    </option>
                  ))}
                </select>
                <ArchiveBoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
              <div className="relative">
                <input type="url" value={song.thumbnail_cover_url || ""} onChange={(e) => handleChange("thumbnail_cover_url", e.target.value)} onBlur={() => handleTouch("thumbnail_cover_url")} className={`w-full py-2 px-3 bg-white dark:bg-gray-800 border ${validationErrors.thumbnail_cover_url ? "border-red-500" : "border-gray-300 dark:border-gray-700"} rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-9`} placeholder="https://example.com/cover.jpg" />
                <PhotoIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              {validationErrors.thumbnail_cover_url ? <p className="mt-1 text-sm text-red-500">{validationErrors.thumbnail_cover_url}</p> : <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional: Leave empty to use album cover</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <div className="relative">
                <input type="text" value={song.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-9" placeholder="Song title" required />
                <MusicalNoteIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <div className="relative">
                <TextareaAutosize value={song.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-9 resize-none" placeholder="Song description (optional)" minRows={2} />
                <DocumentTextIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Track Info: Number & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Track #</label>
                <input type="number" min="1" value={song.track_number || ""} onChange={(e) => handleChange("track_number", e.target.value)} onBlur={() => handleTouch("track_number")} className={`w-full py-2 px-3 bg-white dark:bg-gray-800 border ${validationErrors.track_number ? "border-red-500" : "border-gray-300 dark:border-gray-700"} rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500`} placeholder="#" required />
                {validationErrors.track_number && <p className="mt-1 text-sm text-red-500">{validationErrors.track_number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
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
                    className={`w-full py-2 px-3 bg-white dark:bg-gray-800 border ${validationErrors.duration ? "border-red-500" : "border-gray-300 dark:border-gray-700"} rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-9`}
                    placeholder="MM:SS"
                    pattern="[0-9]{1,2}:[0-9]{2}"
                  />
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                {validationErrors.duration && <p className="mt-1 text-sm text-red-500">{validationErrors.duration}</p>}
              </div>
            </div>

            {/* Translator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Translator</label>
              <div className="relative">
                <input type="text" value={song.translator || ""} onChange={(e) => handleChange("translator", e.target.value)} className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-9" placeholder="Translator name (optional)" />
                <LanguageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Lyrics</h3>

              <div className="flex gap-2">
                <button type="button" onClick={() => setActiveLyricsTab("original")} className={`px-3 py-1 rounded text-sm ${activeLyricsTab === "original" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                  Original
                </button>
                <button type="button" onClick={() => setActiveLyricsTab("translation")} className={`px-3 py-1 rounded text-sm ${activeLyricsTab === "translation" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                  Translation
                </button>
              </div>

              {song.lyrics && (
                <div className="hidden sm:flex text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <ListBulletIcon className="h-3 w-3 mr-1" />
                    {activeLyricsTab === "original" ? lyricsStats.lines : translationLines.length} lines
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col pt-2 overflow-hidden">
                {activeLyricsTab === "original"
                  ? renderLineNumbers()
                  : translationLines.map((_, index) => (
                      <div key={index} className="text-gray-400 text-right pr-2 text-xs" style={{ height: lineHeight }}>
                        {index + 1}
                      </div>
                    ))}
              </div>

              {activeLyricsTab === "original" ? <TextareaAutosize ref={textareaRef} value={song.lyrics || ""} onChange={(e) => handleChange("lyrics", e.target.value)} className="font-mono w-full px-4 py-2 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[250px] pl-12 resize-none focus:ring-0" placeholder="Write original lyrics here..." required spellCheck="false" /> : <TextareaAutosize value={song.lyrics_translation || ""} onChange={(e) => handleChange("lyrics_translation", e.target.value)} className="font-mono w-full px-4 py-2 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[250px] pl-12 resize-none focus:ring-0" placeholder="Write translation here..." spellCheck="false" />}
            </div>
          </div>

          {/* Footnotes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InformationCircleIcon className="h-4 w-4 inline mr-1" />
              Footnotes
            </label>
            <TextareaAutosize value={song.footnotes || ""} onChange={(e) => handleChange("footnotes", e.target.value)} className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Add notes or explanations here..." minRows={2} />
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extras (Optional)</label>
            <TextareaAutosize value={song.extras || ""} onChange={(e) => handleChange("extras", e.target.value)} className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Additional information or trivia..." minRows={2} />
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                navigate(-1);
              } else {
                handleReset();
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? "Cancel" : "Reset"}
          </button>

          <button type="submit" disabled={hasErrors} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isEditing ? "Save Changes" : "Create Song"}
          </button>
        </div>
      </form>
    </div>
  );
}
