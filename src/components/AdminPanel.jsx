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
import { PencilIcon, TrashIcon, MusicalNoteIcon, BookOpenIcon, PlusIcon } from "@heroicons/react/24/outline";

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

  const tabItems = [
    { 
      name: "Blog Posts", 
      icon: <BookOpenIcon className="w-5 h-5" /> 
    },
    { 
      name: "Albums", 
      icon: <PlusIcon className="w-5 h-5" /> 
    },
    { 
      name: "Songs", 
      icon: <MusicalNoteIcon className="w-5 h-5" /> 
    }
  ];

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

  if (loading) return (
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
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
          <p className="text-base-content/70">Manage your content, albums, and songs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card bg-base-100 shadow-xl">
          <Tab.Group>
            <Tab.List className="tabs tabs-lifted px-4 pt-2 bg-base-200/50">
              {tabItems.map((tab) => (
                <Tab key={tab.name} className={({ selected }) => 
                  `tab tab-lg gap-2 transition-all ${
                    selected ? "tab-active font-medium" : "hover:text-primary"
                  }`
                }>
                  {tab.icon}
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* Blog Posts Panel */}
              <Tab.Panel className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <BlogPostForm 
                      post={currentPost} 
                      isEditing={isEditing} 
                      onSubmit={handleSubmit} 
                      onChange={setCurrentPost} 
                    />
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
                            <motion.div 
                              key={post.id} 
                              initial={{ opacity: 0, y: 20 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0, y: -20 }} 
                              transition={{ delay: index * 0.05 }}
                              className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200"
                            >
                              <div className="card-body p-4">
                                <h4 className="card-title text-lg">{post.title}</h4>
                                <p className="text-sm text-base-content/70 line-clamp-2">{post.content}</p>
                                <p className="text-xs text-base-content/50">
                                  {new Date(post.created_at).toLocaleDateString()} • 
                                  {post.content.length > 200 ? 'Long post' : 'Short post'}
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
                                  <button 
                                    onClick={() => handleDelete(post.id)} 
                                    className="btn btn-sm btn-ghost btn-square text-error tooltip tooltip-left"
                                    data-tip="Delete post"
                                  >
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
              </Tab.Panel>

              {/* Albums Panel */}
              <Tab.Panel className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <AlbumForm onAlbumAdded={fetchAlbums} />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Album Collection</h3>
                      <div className="badge badge-primary">{albums.length} albums</div>
                    </div>
                    
                    <div className="divider my-2"></div>
                    
                    <div className="grid gap-4 max-h-[700px] overflow-y-auto pr-2">
                      <AnimatePresence>
                        {albums.length > 0 ? (
                          albums.map((album) => (
                            <motion.div
                              key={album.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="card card-side bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200"
                            >
                              <figure className="w-24 h-24">
                                <img
                                  src={album.cover_image_url}
                                  alt={album.title}
                                  className="w-full h-full object-cover"
                                />
                              </figure>
                              <div className="card-body p-4">
                                <h4 className="card-title text-base">{album.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                  <div className="badge badge-outline">
                                    {new Date(album.release_date).getFullYear()}
                                  </div>
                                  <div className="badge badge-outline">
                                    {album.songs?.length || 0} songs
                                  </div>
                                </div>
                                <div className="card-actions justify-end">
                                  <button
                                    onClick={() => handleDeleteAlbum(album.id)}
                                    className="btn btn-sm btn-error btn-outline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-base-content/50">No albums yet</p>
                            <p className="text-sm">Add your first album</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              {/* Songs Management Panel */}
              <Tab.Panel className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <SongForm 
                      albums={albums} 
                      selectedAlbum={selectedAlbum} 
                      song={newSong} 
                      onSubmit={handleAddSong} 
                      onChange={setNewSong} 
                      onAlbumChange={setSelectedAlbum} 
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Song Catalog</h3>
                      <div className="badge badge-primary">
                        {albums.reduce((acc, album) => acc + (album.songs?.length || 0), 0)} songs
                      </div>
                    </div>
                    
                    <div className="divider my-2"></div>
                    
                    <div className="max-h-[700px] overflow-y-auto pr-2 space-y-6">
                      <AnimatePresence>
                        {albums.length > 0 ? (
                          albums.map((album) => (
                            <motion.div
                              key={album.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-2"
                            >
                              <div className="flex items-center gap-3">
                                <img 
                                  src={album.cover_image_url} 
                                  alt={album.title} 
                                  className="w-10 h-10 rounded-md object-cover" 
                                />
                                <h4 className="font-medium">{album.title}</h4>
                              </div>
                              
                              <div className="pl-2 border-l-2 border-primary/20">
                                {album.songs?.length > 0 ? (
                                  album.songs.map((song) => (
                                    <motion.div 
                                      key={song.id} 
                                      layout
                                      className="flex items-center justify-between p-3 bg-base-100 rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="bg-base-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                          {song.track_number}
                                        </div>
                                        <div>
                                          <p className="font-medium">{song.title}</p>
                                          <p className="text-xs text-base-content/50">
                                            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                                          </p>
                                        </div>
                                      </div>
                                      <button 
                                        onClick={() => handleDeleteSong(song.id)} 
                                        className="btn btn-ghost btn-xs text-error btn-square"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  ))
                                ) : (
                                  <p className="text-sm text-base-content/50 py-2">No songs in this album</p>
                                )}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-base-content/50">No albums or songs yet</p>
                            <p className="text-sm">Add an album first, then add songs</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
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
