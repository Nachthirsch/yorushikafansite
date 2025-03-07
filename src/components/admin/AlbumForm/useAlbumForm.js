import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { toast } from "react-hot-toast";

export const classificationOptions = ["Full Album", "Mini Album", "EP", "Single", "Compilation", "Soundtrack", "Other"];

export default function useAlbumForm({ album, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    description: "",
    coverImageUrl: "",
    youtubeUrl: "",
    spotifyUrl: "",
    classification: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || "",
        releaseDate: album.release_date || "",
        description: album.description || "",
        coverImageUrl: album.cover_image_url || "",
        youtubeUrl: album.youtube_url || "",
        spotifyUrl: album.spotify_url || "",
        classification: album.classification || "",
      });
    }
  }, [album]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const albumData = {
        title: formData.title,
        release_date: formData.releaseDate,
        description: formData.description,
        cover_image_url: formData.coverImageUrl,
        youtube_url: formData.youtubeUrl,
        spotify_url: formData.spotifyUrl,
        classification: formData.classification,
      };

      if (album?.id) {
        const { error } = await supabase.from("albums").update(albumData).eq("id", album.id);

        if (error) throw error;
        toast.success("Album updated successfully");
      } else {
        const { error } = await supabase.from("albums").insert([albumData]);

        if (error) throw error;
        toast.success("Album created successfully");
      }

      onSave();
    } catch (error) {
      console.error("Error saving album:", error);
      toast.error("Failed to save album");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidImageUrl = (url) => {
    return url.match(/^https?:\/\/.+\/.+$/i);
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    isValidImageUrl,
    classificationOptions,
  };
}
