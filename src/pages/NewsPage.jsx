import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { formatDate } from "../utils/dateFormat";
import LoadingSpinner from "../components/LoadingSpinner";

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("publish_date", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <section className="section">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-semibold text-amber-600 mb-12 text-center">News & Updates</h1>

        {posts.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)]">No posts available.</p>
        ) : (
          <div className="space-y-16">
            {posts.map((post) => (
              <article key={post.id} className="border-b border-[var(--color-border)] pb-16 last:border-0">
                <h2 className="text-2xl font-medium mb-2">{post.title}</h2>
                <time className="text-sm text-[var(--color-text-secondary)] mb-6 block">{formatDate(post.publish_date)}</time>
                <div className="prose">{post.content}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
