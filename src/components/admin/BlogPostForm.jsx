import { useEffect, useState } from "react";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange, onCancel }) {
  const [localPost, setLocalPost] = useState(
    post || {
      title: "",
      content: [],
      published: false,
      publish_date: "",
    }
  );
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  // Initialize content properly when post changes
  useEffect(() => {
    if (post) {
      // Handle different content types
      let formattedContent;

      if (Array.isArray(post.content)) {
        formattedContent = post.content;
      } else if (typeof post.content === "object" && post.content !== null) {
        // Handle if content is a non-array object
        formattedContent = [{ type: "text", value: JSON.stringify(post.content) }];
      } else if (post.content) {
        // Handle string or other primitive values
        formattedContent = [{ type: "text", value: String(post.content) }];
      } else {
        // Handle null, undefined
        formattedContent = [];
      }

      setLocalPost({
        ...post,
        content: formattedContent,
      });
    } else {
      setLocalPost({
        title: "",
        content: [],
        published: false,
        publish_date: "",
      });
    }
  }, [post]);

  const handleChange = (field, value) => {
    if (field === "content" && !Array.isArray(value)) {
      // If directly setting content, make sure it's an array
      value = typeof value === "string" ? [{ type: "text", value }] : [];
    }

    const updatedPost = { ...localPost, [field]: value };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddImage = () => {
    if (!currentImageUrl.trim()) return;

    // Add image block
    const contentBlocks = [...(Array.isArray(localPost.content) ? localPost.content : []), { type: "image", url: currentImageUrl }];

    // Update post
    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);

    // Reset image URL and hide input
    setCurrentImageUrl("");
    setShowImageInput(false);
  };

  const handleRemoveBlock = (index) => {
    if (!Array.isArray(localPost.content)) return;

    const updatedBlocks = [...localPost.content];
    updatedBlocks.splice(index, 1);

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleUpdateBlock = (index, value) => {
    if (!Array.isArray(localPost.content)) return;

    const updatedBlocks = [...localPost.content];
    if (updatedBlocks[index].type === "text") {
      updatedBlocks[index] = { ...updatedBlocks[index], value };
    } else if (updatedBlocks[index].type === "image") {
      updatedBlocks[index] = { ...updatedBlocks[index], url: value };
    }

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddTextBlock = () => {
    // Add empty text block
    const contentBlocks = [...(Array.isArray(localPost.content) ? localPost.content : []), { type: "text", value: "" }];

    // Update post
    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  // Render content blocks
  const renderContentBlocks = () => {
    // Make sure content is always an array before mapping
    const contentArray = Array.isArray(localPost.content) ? localPost.content : [];

    return (
      <div className="space-y-4">
        {contentArray.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">Add text blocks or images to create your post content</div>}

        {contentArray.map((block, index) => (
          <div key={index} className="relative group">
            {block.type === "text" ? (
              <textarea value={typeof block.value === "string" ? block.value : block.value ? JSON.stringify(block.value) : ""} onChange={(e) => handleUpdateBlock(index, e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" rows={4} placeholder="Write your content here..." />
            ) : block.type === "image" ? (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="mb-2">
                  <input type="text" value={typeof block.url === "string" ? block.url : ""} onChange={(e) => handleUpdateBlock(index, e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Image URL" />
                </div>
                {block.url && (
                  <div className="mt-2 relative overflow-hidden rounded-lg">
                    <img
                      src={block.url}
                      alt="Preview"
                      className="w-full max-h-64 object-contain bg-gray-100 dark:bg-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-600 dark:text-yellow-400">Unknown block type: {typeof block === "object" ? JSON.stringify(block) : String(block)}</p>
              </div>
            )}

            <button type="button" onClick={() => handleRemoveBlock(index)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200" title="Remove block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        <div className="space-y-6">
          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Post Title</label>
            <input type="text" value={localPost.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter post title" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            {renderContentBlocks()}

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={handleAddTextBlock} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200">
                Add Text Block
              </button>

              {showImageInput ? (
                <div className="flex-1 flex gap-2">
                  <input type="text" value={currentImageUrl} onChange={(e) => setCurrentImageUrl(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter image URL" />
                  <button type="button" onClick={handleAddImage} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 transition-all duration-200">
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageInput(false);
                      setCurrentImageUrl("");
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowImageInput(true)} className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-700 dark:text-purple-300 transition-all duration-200">
                  Add Image
                </button>
              )}
            </div>
          </div>

          {!isEditing && (
            <>
              <div className="relative">
                <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Publish Date</label>
                <input type="datetime-local" value={localPost.publish_date || ""} onChange={(e) => handleChange("publish_date", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
              </div>

              <div className="flex items-center space-x-3">
                <input type="checkbox" id="published" checked={localPost.published || false} onChange={(e) => handleChange("published", e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Publish immediately
                </label>
              </div>
            </>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
