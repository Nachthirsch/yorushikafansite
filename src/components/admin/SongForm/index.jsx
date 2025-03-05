import useSongForm from "./useSongForm";
import SongFormView from "./SongFormView";

export default function SongForm({ song = {}, isEditing = false, onSubmit, onChange, albums = [] }) {
  const formLogic = useSongForm({
    song: {
      ...song,
      translator: song.translator || "",
    },
    onSubmit: async (formEvent) => {
      try {
        // Handle the form event here instead of in useSongForm
        if (formEvent?.preventDefault) {
          formEvent.preventDefault();
        }

        // Call parent's onSubmit with just the song data
        await onSubmit(song);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    onChange,
  });

  return <SongFormView {...formLogic} song={song} albums={albums} isEditing={isEditing} />;
}
