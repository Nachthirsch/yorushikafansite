import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LyricsPage() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSong();
  }, [songId]);

  async function fetchSong() {
    try {
      const { data, error } = await supabase.from("songs").select(`*, albums(title)`).eq("id", songId).single();

      if (error) throw error;
      setSong(data);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!song) return <div className="container text-center py-16">Song not found</div>;

  return (
    <section className="section">
      <div className="container max-w-2xl">
        <Link to="/" className="inline-block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-8">
          ← Back to albums
        </Link>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-medium mb-2">{song.title}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              From album: <span className="font-medium">{song.albums?.title}</span>
            </p>
          </header>

          <div className="prose whitespace-pre-line leading-loose">{song.lyrics}</div>
        </article>
      </div>
    </section>
  );
}
