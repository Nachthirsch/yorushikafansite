/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { PhotoIcon, XMarkIcon, ExclamationCircleIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AlbumForm({ onAlbumAdded }) {
  const [album, setAlbum] = useState({
    title: "",
    release_date: "",
    cover_image_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading cover image...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `album-covers/${fileName}`;

      // Create URL for preview
      setPreviewUrl(URL.createObjectURL(file));

      const { error: uploadError } = await supabase.storage.from("yorushika").upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("yorushika").getPublicUrl(filePath);

      setAlbum((prev) => ({ ...prev, cover_image_url: publicUrl }));
      toast.success("Cover image uploaded", { id: toastId });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating album...");

    try {
      const { error } = await supabase.from("albums").insert([album]);

      if (error) throw error;

      setAlbum({ title: "", release_date: "", cover_image_url: "" });
      setPreviewUrl("");
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
        {/* Cover Image Upload Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Album Cover</label>
          <div className={`group relative flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-xl transition-all bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ${isUploading ? "bg-gray-100 dark:bg-gray-800" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img src={previewUrl} alt="Cover preview" className="w-full h-full object-contain rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl("");
                      setAlbum((prev) => ({ ...prev, cover_image_url: "" }));
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="mt-4 flex flex-col items-center text-sm">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 rounded-lg transition-colors">
                    <CloudArrowUpIcon className="w-4 h-4 mr-2 inline-block" />
                    Select Image
                  </button>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">or drag and drop</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          </div>
        </div>

        {/* Album Details Section */}
        <div className="space-y-6">
          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Album Title</label>
            <input type="text" value={album.title} onChange={(e) => setAlbum({ ...album, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter album title" required />
          </div>

          <div className="relative">
            <label className="absolute left-3 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">Release Date</label>
            <input type="date" value={album.release_date} onChange={(e) => setAlbum({ ...album, release_date: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setAlbum({ title: "", release_date: "", cover_image_url: "" });
              setPreviewUrl("");
            }}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button type="submit" disabled={isUploading} className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative">
            {isUploading && (
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span className={isUploading ? "pl-8" : ""}>Create Album</span>
          </button>
        </div>
      </div>
    </form>
  );
}
