import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AlbumForm({ onAlbumAdded }) {
  const [album, setAlbum] = useState({
    title: "",
    release_date: "",
    cover_image_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating album...");

    try {
      const { error } = await supabase.from("albums").insert([album]);

      if (error) throw error;

      setAlbum({ title: "", release_date: "", cover_image_url: "" });
      onAlbumAdded();
      toast.success("Album created successfully!", { id: toastId });
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error("Failed to create album", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        {/* Cover Image Preview Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Album Cover Preview</label>
          <div className="group relative flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            {album.cover_image_url ? (
              <div className="relative w-full h-full">
                <img src={album.cover_image_url} alt="Cover preview" className="w-full h-full object-contain rounded-lg" />
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-500 dark:text-gray-400">Image preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Album Details Section */}
        <div className="space-y-6">
          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Album Title</label>
            <input type="text" value={album.title} onChange={(e) => setAlbum({ ...album, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter album title" required />
          </div>

          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Cover Image URL</label>
            <input type="url" value={album.cover_image_url} onChange={(e) => setAlbum({ ...album, cover_image_url: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter image URL" required />
          </div>

          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Release Date</label>
            <input type="date" value={album.release_date} onChange={(e) => setAlbum({ ...album, release_date: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={() => setAlbum({ title: "", release_date: "", cover_image_url: "" })} className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
            Create Album
          </button>
        </div>
      </div>
    </form>
  );
}
