/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import BlogPostForm from "./admin/BlogPostForm";
import SongForm from "./admin/SongForm";
import AlbumForm from "./admin/AlbumForm";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [newSong, setNewSong] = useState({
    title: "",
    track_number: "",
    duration: "",
    lyrics: "",
  });

  useEffect(() => {
    Promise.all([fetchAlbums(), fetchPosts()]).finally(() => setLoading(false));
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

  async function fetchAlbums() {
    try {
      const { data, error } = await supabase
        .from("albums")
        .select(
          `
          *,
          songs (
            id,
            title,
            track_number,
            duration,
            lyrics
          )
        `
        )
        .order("release_date", { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  }

  async function handleAddSong(e) {
    e.preventDefault();
    const toastId = toast.loading("Adding new song...");

    try {
      if (!selectedAlbum) throw new Error("Please select an album");

      const { error } = await supabase.from("songs").insert([
        {
          album_id: selectedAlbum.id,
          ...newSong,
          track_number: parseInt(newSong.track_number),
          duration: parseInt(newSong.duration),
        },
      ]);

      if (error) throw error;

      await fetchAlbums();
      setNewSong({ title: "", track_number: "", duration: "", lyrics: "" });
      toast.success("Song added successfully!", { id: toastId });
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error(error.message || "Failed to add song", { id: toastId });
    }
  }

  async function handleDeleteSong(songId) {
    const toastId = toast.loading("Deleting song...");
    try {
      const { error } = await supabase.from("songs").delete().eq("id", songId);

      if (error) throw error;
      await fetchAlbums();
      toast.success("Song deleted successfully!", { id: toastId });
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Failed to delete song", { id: toastId });
    }
  }

  const tabItems = ["Blog Posts", "Albums", "Songs Management"];

  // Add new function to handle album deletion
  async function handleDeleteAlbum(albumId) {
    const toastId = toast.loading("Deleting album...");
    try {
      const { error } = await supabase.from("albums").delete().eq("id", albumId);
      if (error) throw error;
      await fetchAlbums();
      toast.success("Album deleted successfully!", { id: toastId });
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album", { id: toastId });
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-base-200">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="card bg-base-100 shadow-xl">
          <Tab.Group>
            <Tab.List className="tabs tabs-boxed bg-base-200 p-2">
              {tabItems.map((tab) => (
                <Tab key={tab} className={({ selected }) => `tab tab-lg flex-1 ${selected ? "tab-active" : ""}`}>
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="p-6">
              {/* Blog Posts Panel */}
              <Tab.Panel>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Blog Post Form */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">{isEditing ? "Edit Post" : "Create New Post"}</h3>
                    <BlogPostForm post={currentPost} isEditing={isEditing} onSubmit={handleSubmit} onChange={setCurrentPost} />
                  </div>

                  {/* Posts List */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Published Posts</h3>
                    <AnimatePresence>
                      {posts.map((post, index) => (
                        <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                          <h4 className="font-medium text-gray-900">{post.title}</h4>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.content}</p>
                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={() => {
                                setCurrentPost(post);
                                setIsEditing(true);
                              }}
                              className="text-sm text-amber-600 hover:text-amber-700"
                            >
                              Edit
                            </button>
                            <button onClick={() => handleDelete(post.id)} className="text-sm text-red-600 hover:text-red-700">
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </Tab.Panel>

              {/* Albums Panel */}
              <Tab.Panel>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <AlbumForm onAlbumAdded={fetchAlbums} />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Manage Albums</h3>
                    <div className="grid gap-4">
                      {albums.map((album) => (
                        <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card bg-base-100 shadow-lg">
                          <div className="card-body">
                            <div className="flex items-center gap-4">
                              <img src={album.cover_image_url} alt={album.title} className="w-20 h-20 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h4 className="card-title">{album.title}</h4>
                                <p className="text-sm opacity-70">{new Date(album.release_date).toLocaleDateString()}</p>
                                <p className="text-sm opacity-70">{album.songs?.length || 0} songs</p>
                              </div>
                              <button onClick={() => handleDeleteAlbum(album.id)} className="btn btn-error btn-sm">
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              {/* Songs Management Panel */}
              <Tab.Panel>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Song Management Form */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Add New Song</h3>
                    <SongForm albums={albums} selectedAlbum={selectedAlbum} song={newSong} onSubmit={handleAddSong} onChange={setNewSong} onAlbumChange={setSelectedAlbum} />
                  </div>

                  {/* Songs List */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Manage Songs</h3>
                    <AnimatePresence>
                      {albums.map((album) => (
                        <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 mb-6">
                          <h4 className="font-medium text-gray-900">{album.title}</h4>
                          <div className="space-y-2">
                            {album.songs?.map((song) => (
                              <motion.div key={song.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all" layout>
                                <span className="text-sm text-gray-700">
                                  {song.track_number}. {song.title}
                                </span>
                                <button onClick={() => handleDeleteSong(song.id)} className="text-sm text-red-600 hover:text-red-700">
                                  Delete
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
