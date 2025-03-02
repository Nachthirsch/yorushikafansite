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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Album Cover</label>
        <div className={`relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl transition-all ${isUploading ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900"} hover:bg-gray-50 dark:hover:bg-gray-800`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          {previewUrl ? (
            <div className="relative w-full h-full">
              <img src={previewUrl} alt="Cover preview" className="w-full h-full object-contain rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl("");
                  setAlbum((prev) => ({ ...prev, cover_image_url: "" }));
                }}
                className="absolute top-2 right-2 px-2 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center p-6">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <div className="mt-4 flex flex-col items-center text-sm">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 rounded-lg transition-colors">
                  <CloudArrowUpIcon className="w-4 h-4" />
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

      {/* Album Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Album Title</label>
        <input type="text" value={album.title} onChange={(e) => setAlbum({ ...album, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter album title" required />
      </div>

      {/* Release Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Release Date</label>
        <input type="date" value={album.release_date} onChange={(e) => setAlbum({ ...album, release_date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setAlbum({ title: "", release_date: "", cover_image_url: "" });
            setPreviewUrl("");
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={isUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
          Create Album
        </button>
      </div>
    </form>
  );
}
