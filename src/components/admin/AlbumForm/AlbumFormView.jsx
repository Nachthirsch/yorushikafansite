import { motion } from "framer-motion";
import { CalendarIcon, LinkIcon, MusicalNoteIcon, DocumentTextIcon, PhotoIcon, TagIcon } from "@heroicons/react/24/outline";

export default function AlbumFormView({
  album,
  formData,
  isSubmitting,
  classificationOptions,
  handleChange,
  handleSubmit,
  isValidImageUrl,
  onCancel
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-gray-900/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl border border-white/5 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-light text-white">
          {album?.id ? "Edit Album" : "Add New Album"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Album Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <MusicalNoteIcon className="w-5 h-5 mr-2" />
                Album Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                className="form-input"
                placeholder="Enter album title"
              />
            </div>

            {/* Release Date */}
            <div className="form-group">
              <label htmlFor="releaseDate" className="form-label">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                value={formData.releaseDate}
                onChange={(e) => handleChange("releaseDate", e.target.value)}
                required
                className="form-input"
              />
            </div>

            {/* Classification */}
            <div className="form-group">
              <label htmlFor="classification" className="form-label">
                <TagIcon className="w-5 h-5 mr-2" />
                Album Classification
              </label>
              <select
                id="classification"
                value={formData.classification}
                onChange={(e) => handleChange("classification", e.target.value)}
                className="form-input"
              >
                <option value="">Select classification</option>
                {classificationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Album Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                className="form-input"
                placeholder="Enter a description of the album"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Cover Image URL */}
            <div className="form-group">
              <label htmlFor="coverImageUrl" className="form-label">
                <PhotoIcon className="w-5 h-5 mr-2" />
                Album Cover Image URL
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="url"
                  id="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={(e) => handleChange("coverImageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="form-input pl-10"
                />
              </div>

              {formData.coverImageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative aspect-square max-w-xs mx-auto border-4 border-gray-800 rounded-lg overflow-hidden shadow-inner">
                    <img
                      src={formData.coverImageUrl}
                      alt="Album cover preview"
                      className="w-full h-full object-cover transition-all duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-album.png";
                        e.target.classList.add("opacity-50");
                      }}
                      onLoad={(e) => {
                        e.target.classList.remove("opacity-50");
                      }}
                    />

                    {!isValidImageUrl(formData.coverImageUrl) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-900/70 backdrop-blur-sm">
                        <p className="text-red-100 font-medium text-center px-4">
                          Please enter a valid image URL
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* External Links Section */}
            <div className="mt-8">
              <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                External Links
              </h3>
              <div className="space-y-4">
                {/* YouTube Link */}
                <div className="form-group">
                  <label htmlFor="youtubeUrl" className="form-label">
                    <svg className="w-4 h-4 mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube Link
                  </label>
                  <input
                    type="url"
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="form-input"
                  />
                </div>

                {/* Spotify Link */}
                <div className="form-group">
                  <label htmlFor="spotifyUrl" className="form-label">
                    <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.8-.179-.92-.6-.12-.421.18-.8.6-.9C10.5 13.97 14.4 14.4 17.64 16.44c.36.219.48.66.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify Link
                  </label>
                  <input
                    type="url"
                    id="spotifyUrl"
                    value={formData.spotifyUrl}
                    onChange={(e) => handleChange("spotifyUrl", e.target.value)}
                    placeholder="https://open.spotify.com/album/..."
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-md shadow-md transition-all duration-200 flex items-center"
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {album?.id ? "Update Album" : "Create Album"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
} 