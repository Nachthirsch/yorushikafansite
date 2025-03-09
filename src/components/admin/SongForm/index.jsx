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
    // Fix: Explicitly handle null description from database
    const initialSong = {
      ...defaultSong,
      ...song,
      // Handle all possible nullish values
      description: song?.description !== undefined && song?.description !== null && song?.description.trim() !== "" ? song.description : defaultSong.description,
    };

    const formLogic = useSongForm({
      song: initialSong,
      onSubmit,
      // Fix: Pass the original onSubmit directly
      onChange: (updatedSong) => {
        // Always ensure description has a non-empty value
        const updatedWithDescription = {
          ...updatedSong,
          description: !updatedSong.description || updatedSong.description.trim() === "" ? defaultSong.description : updatedSong.description,
        };
        onChange(updatedWithDescription);
      },
    });

    return <SongFormView {...formLogic} song={initialSong} albums={albums} isEditing={isEditing} />;
  } catch (error) {
    console.error("SongForm render error:", error);
    return <div className="p-4 text-red-500 bg-red-100 rounded-lg">Error loading form. Please try again.</div>;
  }
}
