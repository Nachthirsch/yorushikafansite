import useSongForm from "./useSongForm";
import SongFormView from "./SongFormView";

const defaultSong = {
  title: "",
  album_id: "",
  track_number: "",
  duration: "",
  description: "",
  lyrics: "",
  lyrics_translation: "",
  translator: "",
  footnotes: "",
  extras: "", // Tambahkan ini ke defaultSong
};

export default function SongForm({ song, isEditing = false, onSubmit, onChange, albums = [] }) {
  const formLogic = useSongForm({
    song: { ...defaultSong, ...song },
    onSubmit: async (songData) => {
      try {
        await onSubmit(songData);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    onChange,
  });

  return <SongFormView {...formLogic} song={{ ...defaultSong, ...song }} albums={albums} isEditing={isEditing} />;
}
