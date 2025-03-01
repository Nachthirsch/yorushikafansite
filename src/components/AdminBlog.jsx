/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = isEditing ? await supabase.from("blog_posts").update({ title: currentPost.title, content: currentPost.content }).eq("id", currentPost.id) : await supabase.from("blog_posts").insert([{ title: currentPost.title, content: currentPost.content }]);

      if (error) throw error;

      await fetchPosts();
      setCurrentPost({ title: "", content: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      await fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Administration</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <input type="text" value={currentPost.title} onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })} placeholder="Post title" className="w-full p-2 border rounded" required />
          <textarea value={currentPost.content} onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })} placeholder="Post content" className="w-full p-2 border rounded h-32" required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => {
                  setCurrentPost(post);
                  setIsEditing(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
