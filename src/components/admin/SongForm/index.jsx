import useSongForm from "./useSongForm";
import SongFormView from "./SongFormView";

export default function SongForm({ song = {}, isEditing = false, onSubmit, onChange, albums = [] }) {
  const formLogic = useSongForm({
    song: {
      ...song,
      translator: song.translator || "",
    },
    onSubmit: async (event) => {
      try {
        // Handle the form event here
        if (event && event.preventDefault) {
          event.preventDefault();
        }

        // Call parent's onSubmit without passing event
        await onSubmit();
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    onChange,
  });

  return <SongFormView {...formLogic} song={song} albums={albums} isEditing={isEditing} />;
}
