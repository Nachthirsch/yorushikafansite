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
  extras: "",
  thumbnail_cover_url: "", // Add this line
};

// Add error boundary
export default function SongForm({ song, isEditing = false, onSubmit, onChange, albums = [] }) {
  try {
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
  } catch (error) {
    console.error("SongForm render error:", error);
    return <div className="p-4 text-red-500 bg-red-100 rounded-lg">Error loading form. Please try again.</div>;
  }
}
