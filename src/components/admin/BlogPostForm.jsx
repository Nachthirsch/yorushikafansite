import { useState } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function BlogPostForm({ onPostAdded }) {
  const [post, setPost] = useState({
    title: "",
    content: "",
    published: false,
    publish_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating blog post...");

    try {
      const { error } = await supabase.from("blog_posts").insert([post]);

      if (error) throw error;

      setPost({ title: "", content: "", published: false, publish_date: "" });
      onPostAdded();
      toast.success("Blog post created successfully!", { id: toastId });
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        <div className="space-y-6">
          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Post Title</label>
            <input type="text" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter post title" required />
          </div>

          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Content</label>
            <textarea value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" rows={10} placeholder="Write your blog post content here..." required />
          </div>

          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Publish Date</label>
            <input type="datetime-local" value={post.publish_date} onChange={(e) => setPost({ ...post, publish_date: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
          </div>

          <div className="flex items-center space-x-3">
            <input type="checkbox" id="published" checked={post.published} onChange={(e) => setPost({ ...post, published: e.target.checked })} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish immediately
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={() => setPost({ title: "", content: "", published: false, publish_date: "" })} className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
            Create Post
          </button>
        </div>
      </div>
    </form>
  );
}
