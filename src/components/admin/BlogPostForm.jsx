import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange, onCancel }) {
  const [localPost, setLocalPost] = useState(
    post || {
      title: "",
      content: "",
      published: false,
      publish_date: "",
    }
  );

  useEffect(() => {
    setLocalPost(
      post || {
        title: "",
        content: "",
        published: false,
        publish_date: "",
      }
    );
  }, [post]);

  const handleChange = (field, value) => {
    const updatedPost = { ...localPost, [field]: value };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  return (
    <form onSubmit={onSubmit} className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        <div className="space-y-6">
          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Post Title</label>
            <input type="text" value={localPost.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter post title" required />
          </div>

          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Content</label>
            <textarea value={localPost.content} onChange={(e) => handleChange("content", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" rows={10} placeholder="Write your blog post content here..." required />
          </div>

          {!isEditing && (
            <>
              <div className="relative">
                <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Publish Date</label>
                <input type="datetime-local" value={localPost.publish_date} onChange={(e) => handleChange("publish_date", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
              </div>

              <div className="flex items-center space-x-3">
                <input type="checkbox" id="published" checked={localPost.published} onChange={(e) => handleChange("published", e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
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
