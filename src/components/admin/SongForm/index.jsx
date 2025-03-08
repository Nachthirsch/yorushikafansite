import useSongForm from "./useSongForm";
import SongFormView from "./SongFormView";

const defaultSong = {
  title: "",
  album_id: "",
  track_number: "",
  duration: "",
  description: "written by n-buna", // Default value
  lyrics: "",
  lyrics_translation: "",
  translator: "",
  footnotes: "",
  extras: "",
  thumbnail_cover_url: "",
};

// Add error boundary
export default function SongForm({ song, isEditing = false, onSubmit, onChange, albums = [] }) {
  try {
    const initialSong = {
      ...defaultSong,
      ...song,
      // Pastikan description selalu memiliki nilai, gunakan default jika null/undefined/empty
      description: song?.description || defaultSong.description,
    };

    const formLogic = useSongForm({
      song: initialSong,
      onSubmit,
      onChange: (updatedSong) => {
        // Pastikan description tidak hilang saat update
        onChange({
          ...updatedSong,
          description: updatedSong.description || defaultSong.description,
        });
      },
    });

    return <SongFormView {...formLogic} song={initialSong} albums={albums} isEditing={isEditing} />;
  } catch (error) {
    console.error("SongForm render error:", error);
    return <div className="p-4 text-red-500 bg-red-100 rounded-lg">Error loading form. Please try again.</div>;
  }
}
