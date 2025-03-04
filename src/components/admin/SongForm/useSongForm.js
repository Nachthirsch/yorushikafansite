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
        errors.duration = "Duration must be a positive number";
      }
    }

    setValidationErrors(errors);
  }, [song.track_number, song.duration, touched]);

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTouch = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(song);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (field, value) => {
    onChange({ ...song, [field]: value });
  };

  const handleReset = () => {
    onChange({
      title: "",
      track_number: "",
      duration: "",
      lyrics: "",
      lyrics_translation: "",
      albumId: "",
    });
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
    formatTime
  };
} 