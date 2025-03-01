/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AlbumForm({ onAlbumAdded }) {
  const [album, setAlbum] = useState({
    title: "",
    release_date: "",
    cover_image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (album.cover_image_url && album.cover_image_url.trim() !== "") {
      setImagePreview(album.cover_image_url);
    } else {
      setImagePreview(null);
    }
  }, [album.cover_image_url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("albums").insert([album]);
      if (error) throw error;

      setAlbum({ title: "", release_date: "", cover_image_url: "" });
      setImagePreview(null);
      if (onAlbumAdded) onAlbumAdded();

      toast.success("Album added successfully!", {
        style: {
          background: "#4ade80",
          color: "#fff",
          fontWeight: "bold",
        },
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding album:", error);
      toast.error("Failed to add album", {
        style: {
          background: "#f87171",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="bg-primary/10 p-4">
          <h3 className="text-xl font-bold text-primary">Add New Album</h3>
          <p className="text-sm text-base-content/70">Create a new album in the discography</p>
        </div>

        <div className="card-body gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Album Title</span>
            </label>
            <input type="text" value={album.title} onChange={(e) => setAlbum({ ...album, title: e.target.value })} className="input input-bordered focus:input-primary transition-all" placeholder="Enter album name" required />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Release Date</span>
            </label>
            <input type="date" value={album.release_date} onChange={(e) => setAlbum({ ...album, release_date: e.target.value })} className="input input-bordered focus:input-primary transition-all" required />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Cover Image URL</span>
            </label>
            <input type="url" value={album.cover_image_url} onChange={(e) => setAlbum({ ...album, cover_image_url: e.target.value })} className="input input-bordered focus:input-primary transition-all" placeholder="https://example.com/image.jpg" required />
          </div>

          {imagePreview && (
            <div className="mt-2">
              <label className="label">
                <span className="label-text font-medium">Cover Preview</span>
              </label>
              <div className="relative w-32 h-32 overflow-hidden rounded-lg border-2 border-base-300">
                <img src={imagePreview} alt="Album cover preview" className="w-full h-full object-cover" onError={() => setImagePreview(null)} />
              </div>
            </div>
          )}

          <div className="card-actions justify-end mt-2">
            <button type="button" onClick={() => setAlbum({ title: "", release_date: "", cover_image_url: "" })} className="btn btn-ghost">
              Reset
            </button>
            <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Adding..." : "Add Album"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
