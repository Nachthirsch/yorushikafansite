export default function BlogPostFormView({
  localPost,
  currentImageUrl,
  showImageInput,
  isEditing,
  onCancel,
  setCurrentImageUrl,
  handleChange,
  handleAddImage,
  handleRemoveBlock,
  handleUpdateBlock,
  handleAddTextBlock,
  handleFormSubmit,
  toggleImageInput
}) {
  const renderContentBlocks = () => {
    const contentArray = Array.isArray(localPost.content) ? localPost.content : [];

    return (
      <div className="space-y-6">
        {contentArray.map((block, index) => (
          <div 
            key={index} 
            className="group relative transition-all duration-300 hover:shadow-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            {block.type === "text" ? (
              <div className="relative">
                <textarea
                  value={block.value}
                  onChange={(e) => handleUpdateBlock(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-y"
                  placeholder="Write your content here..."
                  aria-label={`Content block ${index + 1}`}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                  {block.value.length} characters
                </div>
              </div>
            ) : block.type === "image" ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={block.url}
                    onChange={(e) => handleUpdateBlock(index, e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Paste image URL here..."
                    aria-label={`Image URL for block ${index + 1}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {block.url && (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={block.url}
                      alt="Preview"
                      className="w-full h-60 object-cover transition-opacity duration-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200" />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                Unknown block type: {typeof block === "object" ? JSON.stringify(block) : String(block)}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleRemoveBlock(index)}
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
              title="Remove block"
              aria-label="Remove block"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing ? "Update your existing blog post" : "Share your thoughts with the world"}
        </p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Post Title</label>
          <input
            type="text"
            value={localPost.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500"
            placeholder="Enter an engaging title..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Author Name</label>
            <input
              type="text"
              value={localPost.author_name}
              onChange={(e) => handleChange("author_name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500"
              placeholder="Your name"
            />
          </div>
          <div className="group">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Social Link</label>
            <input
              type="url"
              value={localPost.author_social_link}
              onChange={(e) => handleChange("author_social_link", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500"
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        <div>
          <label className="block mb-4 font-medium text-gray-700 dark:text-gray-300">Content Blocks</label>
          {renderContentBlocks()}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="button"
              onClick={handleAddTextBlock}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add Text Block
              </span>
            </button>

            {showImageInput ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Paste image URL..."
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 transition-all duration-200"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => toggleImageInput(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => toggleImageInput(true)}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Image
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
} 