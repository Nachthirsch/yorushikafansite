/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import BlogPostForm from "./admin/BlogPostForm";
import { PencilIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const toastId = toast.loading("Loading posts...");
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      toast.success("Posts loaded", { id: toastId });
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const toastId = toast.loading(isEditing ? "Updating post..." : "Creating post...");

    try {
      const { error } = isEditing
        ? await supabase
            .from("blog_posts")
            .update({
              title: currentPost.title,
              content: currentPost.content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentPost.id)
        : await supabase.from("blog_posts").insert([
            {
              title: currentPost.title,
              content: currentPost.content,
              published: true,
              publish_date: new Date().toISOString(),
            },
          ]);

      if (error) throw error;

      await fetchPosts();
      setCurrentPost({ title: "", content: "" });
      setIsEditing(false);
      toast.success(isEditing ? "Post updated!" : "Post created!", { id: toastId });
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post", { id: toastId });
    }
  }

  async function handleDelete(id) {
    const toastId = toast.loading("Deleting post...");
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      await fetchPosts();
      toast.success("Post deleted!", { id: toastId });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", { id: toastId });
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-base-content">Blog Administration</h1>
          <p className="text-base-content/70">Manage your blog posts and content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BlogPostForm post={currentPost} isEditing={isEditing} onSubmit={handleSubmit} onChange={setCurrentPost} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Published Posts</h3>
              <div className="badge badge-primary">{posts.length} posts</div>
            </div>

            <div className="divider my-2"></div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              <AnimatePresence>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200">
                      <div className="card-body p-4">
                        <h4 className="card-title text-lg">{post.title}</h4>
                        <p className="text-sm text-base-content/70 line-clamp-2">{post.content}</p>
                        <p className="text-xs text-base-content/50">
                          {new Date(post.created_at).toLocaleDateString()} •{post.content.length > 200 ? "Long post" : "Short post"}
                        </p>
                        <div className="card-actions justify-end mt-2">
                          <button
                            onClick={() => {
                              setCurrentPost(post);
                              setIsEditing(true);
                            }}
                            className="btn btn-sm btn-ghost btn-square tooltip tooltip-left"
                            data-tip="Edit post"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-ghost btn-square text-error tooltip tooltip-left" data-tip="Delete post">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-base-content/50">No posts yet</p>
                    <p className="text-sm">Create your first post</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
