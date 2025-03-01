/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MusicalNoteIcon, PhotoIcon, CalendarIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AlbumForm({ onAlbumAdded }) {
  const [album, setAlbum] = useState({
    title: "",
    release_date: "",
    cover_image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    if (album.cover_image_url && album.cover_image_url.trim() !== "") {
      setImagePreview(album.cover_image_url);
      setImageError(false);
    } else {
      setImagePreview(null);
    }
  }, [album.cover_image_url]);

  // Mark form as touched when any field changes
  useEffect(() => {
    if (album.title || album.release_date || album.cover_image_url) {
      setFormTouched(true);
    }
  }, [album.title, album.release_date, album.cover_image_url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("albums").insert([album]);
      if (error) throw error;

      setAlbum({ title: "", release_date: "", cover_image_url: "" });
      setImagePreview(null);
      setFormTouched(false);
      if (onAlbumAdded) onAlbumAdded();

      toast.success("Album added successfully!");
    } catch (error) {
      console.error("Error adding album:", error);
      toast.error("Failed to add album");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAlbum({ title: "", release_date: "", cover_image_url: "" });
    setImagePreview(null);
    setImageError(false);
    setFormTouched(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImagePreview(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200 h-full">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 border-b border-base-200">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <MusicalNoteIcon className="w-5 h-5" />
            Add New Album
          </h3>
          <p className="text-sm text-base-content/70 mt-1">Create a new album in the discography</p>
        </div>

        <div className="card-body gap-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="form-control">
                <label htmlFor="album-title" className="label">
                  <span className="label-text font-medium">Album Title</span>
                </label>
                <div className="relative">
                  <input id="album-title" type="text" value={album.title} onChange={(e) => setAlbum({ ...album, title: e.target.value })} className="input input-bordered focus:input-primary transition-all w-full pl-10 border-base-300 bg-base-100/50" placeholder="Enter album name" required aria-label="Album title" />
                  <MusicalNoteIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="release-date" className="label">
                  <span className="label-text font-medium">Release Date</span>
                </label>
                <div className="relative">
                  <input id="release-date" type="date" value={album.release_date} onChange={(e) => setAlbum({ ...album, release_date: e.target.value })} className="input input-bordered focus:input-primary transition-all w-full pl-10 border-base-300 bg-base-100/50" required aria-label="Release date" />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="cover-image" className="label">
                  <span className="label-text font-medium">Cover Image URL</span>
                </label>
                <div className="relative">
                  <input id="cover-image" type="url" value={album.cover_image_url} onChange={(e) => setAlbum({ ...album, cover_image_url: e.target.value })} className="input input-bordered focus:input-primary transition-all w-full pl-10 border-base-300 bg-base-100/50" placeholder="https://example.com/image.jpg" required aria-label="Cover image URL" />
                  <PhotoIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
                </div>
                {imageError && (
                  <div className="flex items-center gap-2 mt-2 text-error text-sm">
                    <XMarkIcon className="w-4 h-4" />
                    <p>Invalid image URL. Please provide a valid image link.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-base-200/30 rounded-xl border border-base-300/50">
              {imagePreview ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative group w-48 h-48">
                    <div className="w-full h-full overflow-hidden rounded-lg border-2 border-primary/20 shadow-md transition-all group-hover:border-primary/40">
                      <img src={imagePreview} alt="Album cover preview" className="w-full h-full object-cover" onError={handleImageError} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-base-300/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center transition-all rounded-lg p-3">
                      <p className="text-sm font-medium text-center">Album Cover Preview</p>
                    </div>
                  </div>
                  <p className="text-xs text-base-content/60 mt-3 text-center">This is how your album cover will appear</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-48 h-48 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-base-300 bg-base-200/50">
                    <ArrowUpTrayIcon className="w-12 h-12 text-base-content/30 mb-2" />
                    <p className="text-sm text-base-content/60 text-center px-4">Enter a URL above to preview your album cover</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="card-actions justify-end mt-4">
            <button type="button" onClick={handleReset} className="btn btn-ghost hover:bg-base-200" disabled={loading || !formTouched} aria-label="Reset form">
              Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || imageError} aria-label="Add album">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Adding...
                </>
              ) : (
                "Add Album"
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
