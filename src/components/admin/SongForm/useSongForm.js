import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useSongForm({ song, onSubmit, onChange }) {
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [lyricsStats, setLyricsStats] = useState({ chars: 0, lines: 0, verses: 0 });
  const [validationErrors, setValidationErrors] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [lineHeight, setLineHeight] = useState(24);
  const [activeLyricsTab, setActiveLyricsTab] = useState("original");

  useEffect(() => {
    if (song.lyrics) {
      const lines = song.lyrics.split("\n").filter((line) => line.trim() !== "").length;
      const verses = song.lyrics.split("\n\n").filter((verse) => verse.trim() !== "").length;

      setLyricsStats({
        chars: song.lyrics.length,
        lines,
        verses,
      });
    }
  }, [song.lyrics]);

  useEffect(() => {
    const errors = {};

    if (touched.track_number && song.track_number) {
      const trackNum = parseInt(song.track_number);
      if (isNaN(trackNum) || trackNum < 1) {
        errors.track_number = "Track number must be a positive number";
      }
    }

    if (touched.duration && song.duration) {
      const duration = parseInt(song.duration);
      if (isNaN(duration) || duration < 1) {
        errors.duration = "Invalid duration format. Use MM:SS";
      }
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      if (minutes > 59 || seconds > 59) {
        errors.duration = "Invalid time format. Maximum 59:59";
      }
    }

    if (touched.thumbnail_cover_url && song.thumbnail_cover_url) {
      try {
        new URL(song.thumbnail_cover_url);
      } catch (e) {
        errors.thumbnail_cover_url = "Please enter a valid URL";
      }
    }

    setValidationErrors(errors);
  }, [song.track_number, song.duration, song.thumbnail_cover_url, touched]);

  const formatTime = (seconds) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTouch = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleFormSubmit = async (event) => {
    try {
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      // Validasi data sebelum submit
      if (!song.title || !song.album_id) {
        const errors = {};
        if (!song.title) errors.title = "Title is required";
        if (!song.album_id) errors.album_id = "Album is required";
        setValidationErrors(errors);
        return;
      }

      // Pastikan data yang dikirim sesuai dengan schema database
      const songData = {
        title: song.title,
        album_id: song.album_id,
        track_number: parseInt(song.track_number) || null,
        duration: parseInt(song.duration) || null,
        description: song.description || null, // Add this line
        lyrics: song.lyrics || null,
        lyrics_translation: song.lyrics_translation || null,
        translator: song.translator || null,
        footnotes: song.footnotes || null,
        extras: song.extras || null, // Tambahkan ini ke dalam songData
        thumbnail_cover_url: song.thumbnail_cover_url || null, // Add this line
      };

      // Panggil onSubmit dengan data yang sudah diformat
      await onSubmit(songData);
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error; // Re-throw error untuk ditangkap di level component
    }
  };

  const handleChange = (field, value) => {
    // Clear validation error when field is changed
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
    onChange({ ...song, [field]: value });
  };

  const handleReset = () => {
    const emptyData = {
      title: "",
      album_id: "",
      track_number: "",
      duration: "",
      lyrics: "",
      lyrics_translation: "",
      translator: "",
      footnotes: "",
    };
    onChange(emptyData);
    setValidationErrors({});
    setTouched({});
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return {
    navigate,
    touched,
    lyricsStats,
    validationErrors,
    isPlaying,
    lineHeight,
    activeLyricsTab,
    hasErrors,
    setIsPlaying,
    setActiveLyricsTab,
    handleTouch,
    handleFormSubmit,
    handleChange,
    handleReset,
    formatTime,
  };
}
