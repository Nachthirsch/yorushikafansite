import { useEffect, useState } from "react";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange, onCancel }) {
  const [localPost, setLocalPost] = useState(
    post || {
      title: "",
      content: [],
      published: false,
      publish_date: "",
      author_name: "",
      author_social_link: "",
    }
  );
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    if (post) {
      let formattedContent;

      if (Array.isArray(post.content)) {
        formattedContent = post.content;
      } else if (typeof post.content === "object" && post.content !== null) {
        formattedContent = [{ type: "text", value: JSON.stringify(post.content) }];
      } else if (post.content) {
        formattedContent = [{ type: "text", value: String(post.content) }];
      } else {
        formattedContent = [];
      }

      setLocalPost({
        ...post,
        content: formattedContent,
      });
    }
  }, [post]);

  const handleChange = (field, value) => {
    const updatedPost = { ...localPost, [field]: value };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddImage = () => {
    if (!currentImageUrl.trim()) return;

    const contentBlocks = [
      ...(Array.isArray(localPost.content) ? localPost.content : []),
      { type: "image", url: currentImageUrl },
    ];

    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
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
    const contentBlocks = [
      ...(Array.isArray(localPost.content) ? localPost.content : []),
      { type: "text", value: "" },
    ];

    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        ...localPost,
        author_name: localPost.author_name?.trim() || '',
        author_social_link: localPost.author_social_link?.trim() || ''
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderContentBlocks = () => {
    const contentArray = Array.isArray(localPost.content) ? localPost.content : [];

    return (
      <div className="space-y-4">
        {contentArray.map((block, index) => (
          <div key={index} className="group relative">
            {block.type === "text" ? (
              <textarea
                value={block.value}
                onChange={(e) => handleUpdateBlock(index, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={4}
                placeholder="Write your content here..."
              />
            ) : block.type === "image" ? (
              <div>
                <input
                  type="text"
                  value={block.url}
                  onChange={(e) => handleUpdateBlock(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Image URL"
                />
                {block.url && (
                  <img
                    src={block.url}
                    alt="Preview"
                    className="mt-2 rounded-lg max-h-60 w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />
                )}
              </div>
            ) : (
              <div>Unknown block type: {typeof block === "object" ? JSON.stringify(block) : String(block)}</div>
            )}

            <button
              type="button"
              onClick={() => handleRemoveBlock(index)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
              title="Remove block"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label className="block mb-2">Post Title</label>
        <input
          type="text"
          value={localPost.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter post title"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Author Information</label>
        <input
          type="text"
          value={localPost.author_name}
          onChange={(e) => handleChange("author_name", e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter author name"
        />
        <input
          type="url"
          value={localPost.author_social_link}
          onChange={(e) => handleChange("author_social_link", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="https://twitter.com/username"
        />
      </div>

      <div>
        <label className="block mb-2">Content</label>
        {renderContentBlocks()}

        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={handleAddTextBlock}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-300 transition-all duration-200 flex-1"
          >
            Add Text Block
          </button>

          {showImageInput ? (
            <div className="flex space-x-2 flex-1">
              <input
                type="text"
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-300 transition-all duration-200"
              >
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
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-700 dark:text-purple-300 transition-all duration-200 flex-1"
            >
              Add Image
            </button>
          )}
        </div>
      </div>

      {!isEditing && (
        <div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block mb-2">Publish Date</label>
              <input
                type="datetime-local"
                value={localPost.publish_date}
                onChange={(e) => handleChange("publish_date", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localPost.published}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Publish immediately</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
        >
          {isEditing ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}