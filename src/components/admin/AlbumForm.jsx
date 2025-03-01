/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AlbumForm({ onAlbumAdded }) {
  const [album, setAlbum] = useState({
    title: "",
    release_date: "",
    cover_image_url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("albums").insert([album]);
      if (error) throw error;

      setAlbum({ title: "", release_date: "", cover_image_url: "" });
      if (onAlbumAdded) onAlbumAdded();

      // Show success toast
      toast.success("Album added successfully!");
    } catch (error) {
      console.error("Error adding album:", error);
      toast.error("Failed to add album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Album</h3>
      <div className="form-control gap-4">
        <div>
          <label className="label">
            <span className="label-text">Album Title</span>
          </label>
          <input type="text" value={album.title} onChange={(e) => setAlbum({ ...album, title: e.target.value })} className="input input-bordered w-full" required />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Release Date</span>
          </label>
          <input type="date" value={album.release_date} onChange={(e) => setAlbum({ ...album, release_date: e.target.value })} className="input input-bordered w-full" required />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Cover Image URL</span>
          </label>
          <input type="url" value={album.cover_image_url} onChange={(e) => setAlbum({ ...album, cover_image_url: e.target.value })} className="input input-bordered w-full" required />
        </div>

        <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
          Add Album
        </button>
      </div>
    </form>
  );
}
