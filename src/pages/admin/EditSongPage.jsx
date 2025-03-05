import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import SongForm from "../../components/admin/SongForm/index";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function EditSongPage() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongAndAlbums();
  }, [songId]);

  async function fetchSongAndAlbums() {
    try {
      // Fetch song data
      const { data: songData, error: songError } = await supabase.from("songs").select("*").eq("id", songId).single();

      if (songError) throw songError;

      // Fetch albums
      const { data: albumsData, error: albumsError } = await supabase.from("albums").select("*").order("title");

      if (albumsError) throw albumsError;

      setSong(songData);
      setAlbums(albumsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load song data");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    const toastId = toast.loading("Updating song...");

    try {
      const { error } = await supabase
        .from("songs")
        .update({
          title: song.title,
          lyrics: song.lyrics,
          lyrics_translation: song.lyrics_translation,
          translator: song.translator || null,
          track_number: parseInt(song.track_number),
          duration: parseInt(song.duration),
          album_id: song.album_id,
          footnotes: song.footnotes || "",
        })
        .eq("id", songId);

      if (error) throw error;

      toast.success("Song updated successfully!", { id: toastId });
      navigate(`/lyrics/${songId}`);
    } catch (error) {
      console.error("Error updating song:", error);
      toast.error("Failed to update song", { id: toastId });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!song) return <div className="container text-center py-16">Song not found</div>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Song: {song.title}</h1>

      <SongForm song={song} albums={albums} onSubmit={handleSubmit} onChange={setSong} isEditing={true} />
    </div>
  );
}
