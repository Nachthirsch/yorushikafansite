/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from "react";
import { supabase } from "../lib/supabase";
import { Tab, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import BlogPostForm from "./admin/BlogPostForm";
import SongForm from "./admin/SongForm";
import AlbumForm from "./admin/AlbumForm";
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon, TrashIcon, MusicalNoteIcon, BookOpenIcon, PlusIcon, DocumentTextIcon, ArchiveBoxIcon, ArrowPathIcon, ExclamationTriangleIcon, ChartBarIcon, AdjustmentsHorizontalIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";

export default function AdminPanel() {
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

  // Stats for dashboard
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalAlbums: 0,
    totalSongs: 0,
  });

  // Sorting states
  const [postSort, setPostSort] = useState("newest");
  const [albumSort, setAlbumSort] = useState("newest");

  // Filter states
  const [postFilter, setPostFilter] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");

  // Confirmation dialog state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: null, // 'post', 'album', or 'song'
    id: null,
    title: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        await Promise.all([fetchAlbums(), fetchPosts()]);
        if (isMounted) {
          updateStats();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateStats() {
    setStats({
      totalPosts: posts.length,
      totalAlbums: albums.length,
      totalSongs: albums.reduce((acc, album) => acc + (album.songs?.length || 0), 0),
    });
  }

  // Sorting functions
  const sortedPosts = [...posts]
    .sort((a, b) => {
      if (postSort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (postSort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (postSort === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    })
    .filter((post) => (postFilter ? post.title.toLowerCase().includes(postFilter.toLowerCase()) : true));

  const sortedAlbums = [...albums]
    .sort((a, b) => {
      if (albumSort === "newest") return new Date(b.release_date) - new Date(a.release_date);
      if (albumSort === "oldest") return new Date(a.release_date) - new Date(b.release_date);
      if (albumSort === "alphabetical") return a.title.localeCompare(b.title);
      if (albumSort === "songs") return (b.songs?.length || 0) - (a.songs?.length || 0);
      return 0;
    })
    .filter((album) => (albumFilter ? album.title.toLowerCase().includes(albumFilter.toLowerCase()) : true));

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
      updateStats();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post", { id: toastId });
    }
  }

  async function handleDelete(type, id) {
    setDeleteConfirmation({
      show: false,
      type: null,
      id: null,
      title: "",
    });

    const toastId = toast.loading(`Deleting ${type}...`);
    try {
      let error;

      if (type === "post") {
        const { error: err } = await supabase.from("blog_posts").delete().eq("id", id);
        error = err;
        if (!error) await fetchPosts();
      } else if (type === "album") {
        const { error: err } = await supabase.from("albums").delete().eq("id", id);
        error = err;
        if (!error) await fetchAlbums();
      } else if (type === "song") {
        const { error: err } = await supabase.from("songs").delete().eq("id", id);
        error = err;
        if (!error) await fetchAlbums();
      }

      if (error) throw error;

      toast.success(`${type} deleted successfully!`, { id: toastId });
      updateStats();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`, { id: toastId });
    }
  }

  async function fetchAlbums() {
    const toastId = toast.loading("Loading albums...");
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
      toast.success("Albums loaded", { id: toastId });
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Failed to load albums", { id: toastId });
      throw error; // Re-throw untuk handling di useEffect
    }
  }

  async function handleAddSong(e) {
    e.preventDefault();
    const toastId = toast.loading("Adding new song...");

    try {
      if (!selectedAlbum) {
        toast.error("Please select an album", { id: toastId });
        return;
      }

      const { error } = await supabase.from("songs").insert([
        {
          album_id: selectedAlbum.id,
          ...newSong,
          track_number: parseInt(newSong.track_number) || 1,
          duration: parseInt(newSong.duration) || 0,
        },
      ]);

      if (error) throw error;

      await fetchAlbums();
      setNewSong({ title: "", track_number: "", duration: "", lyrics: "" });
      toast.success("Song added successfully!", { id: toastId });
      updateStats();
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error(error.message || "Failed to add song", { id: toastId });
    }
  }

  // Confirmation dialog component
  const ConfirmationDialog = () => (
    <Transition appear show={deleteConfirmation.show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setDeleteConfirmation({ ...deleteConfirmation, show: false })}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all border border-base-300">
                <div className="flex items-center gap-3 text-warning mb-4">
                  <ExclamationTriangleIcon className="h-10 w-10" />
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                    Confirm deletion
                  </Dialog.Title>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-base-content/70">
                    Are you sure you want to delete this {deleteConfirmation.type}?{deleteConfirmation.title && <span className="font-semibold block mt-2">"{deleteConfirmation.title}"</span>}
                    This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmation({ ...deleteConfirmation, show: false })}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-error btn-sm" onClick={() => handleDelete(deleteConfirmation.type, deleteConfirmation.id)}>
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  const tabItems = [
    {
      name: "Dashboard",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
    {
      name: "Blog Posts",
      icon: <BookOpenIcon className="w-5 h-5" />,
    },
    {
      name: "Albums",
      icon: <ArchiveBoxIcon className="w-5 h-5" />,
    },
    {
      name: "Songs",
      icon: <MusicalNoteIcon className="w-5 h-5" />,
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <LoadingSpinner size="lg" />
        <p className="ml-3 text-base-content/70 animate-pulse">Loading admin dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900 dark:to-gray-800/80">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-white border border-gray-200 dark:border-gray-700 shadow-lg",
        }}
      />

      <ConfirmationDialog />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
        <div className="max-w-[95%] xl:max-w-[1800px] mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl">Admin Dashboard</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Manage your content with ease</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[95%] xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tab.Group>
            <TabList className="flex p-1 gap-1 bg-gray-100/50 dark:bg-gray-900/50">
              {tabItems.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `flex-1 flex items-center justify-center gap-2 py-4 px-6 md:py-5 md:px-8 text-sm font-medium rounded-t-lg transition-all duration-200
                    ${selected ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"}`
                  }
                >
                  {React.cloneElement(tab.icon, { className: "w-5 h-5 md:w-6 md:h-6" })}
                  {tab.name}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {/* Dashboard Panel */}
              <TabPanel className="p-8 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
                  {/* Stats Cards */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800/90 p-6 rounded-xl border-l-4 border-blue-500 dark:border-blue-400 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">Total Posts</p>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalPosts}</h3>
                      </div>
                      <DocumentTextIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                    </div>
                  </motion.div>
                  {/* ...other stat cards... */}
                </div>

                {/* Recent Activity Section */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-l-4 border-blue-500 dark:border-blue-400 pl-4">Recent Activity</h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">{/* ...existing activity cards... */}</div>
                </div>
              </TabPanel>

              {/* Blog Posts Panel */}
              <TabPanel className="p-8 lg:p-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
                  {/* Form Section */}
                  <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                          <DocumentTextIcon className="w-5 h-5 text-blue-500" />
                          {isEditing ? "Edit Post" : "Create New Post"}
                        </h3>
                        <BlogPostForm
                          post={currentPost}
                          isEditing={isEditing}
                          onSubmit={handleSubmit}
                          onChange={setCurrentPost}
                          onCancel={() => {
                            setCurrentPost({ title: "", content: "" });
                            setIsEditing(false);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Posts List Section */}
                  <div className="xl:col-span-1 2xl:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpenIcon className="w-5 h-5 text-blue-500" />
                        Published Posts
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex rounded-lg shadow-sm">
                          <button onClick={() => setPostSort("newest")} className={`px-3 py-2 text-sm font-medium rounded-l-lg border ${postSort === "newest" ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"}`}>
                            Newest
                          </button>
                          <button onClick={() => setPostSort("oldest")} className={`px-3 py-2 text-sm font-medium border-t border-b ${postSort === "oldest" ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"}`}>
                            Oldest
                          </button>
                          <button onClick={() => setPostSort("alphabetical")} className={`px-3 py-2 text-sm font-medium rounded-r-lg border ${postSort === "alphabetical" ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"}`}>
                            A-Z
                          </button>
                        </div>
                        <button onClick={fetchPosts} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ArrowPathIcon className="w-5 h-5" />
                        </button>
                        <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">{posts.length}</div>
                      </div>
                    </div>

                    <div className="relative">
                      <input type="text" placeholder="Search posts..." value={postFilter} onChange={(e) => setPostFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" />
                      <AdjustmentsHorizontalIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      <AnimatePresence>
                        {sortedPosts.map((post, index) => (
                          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setCurrentPost(post);
                                      setIsEditing(true);
                                    }}
                                    className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        show: true,
                                        type: "post",
                                        id: post.id,
                                        title: post.title,
                                      })
                                    }
                                    className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.content}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <time>{new Date(post.created_at).toLocaleDateString()}</time>
                                <span>•</span>
                                <span>{post.content.length > 200 ? "Long post" : "Short post"}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {sortedPosts.length === 0 && (
                          <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{postFilter ? "Try a different search term" : "Create your first post"}</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Albums Panel */}
              <TabPanel className="p-8 lg:p-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
                  <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                          <PlusIcon className="w-5 h-5 text-blue-500" />
                          Add New Album
                        </h3>
                        <AlbumForm
                          onAlbumAdded={() => {
                            fetchAlbums();
                            updateStats();
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1 2xl:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <ArchiveBoxIcon className="w-5 h-5 text-blue-500" />
                        Album Collection
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">{/* Album sort buttons similar to post sort buttons */}</div>
                    </div>

                    <div className="relative">
                      <input type="text" placeholder="Search albums..." value={albumFilter} onChange={(e) => setAlbumFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" />
                      <AdjustmentsHorizontalIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      <AnimatePresence>
                        {sortedAlbums.map((album, index) => (
                          <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden">
                            <div className="flex items-center gap-4 p-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                {album.cover_image_url ? (
                                  <img
                                    src={album.cover_image_url}
                                    alt={album.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder-album.png";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ArchiveBoxIcon className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">{album.title}</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{new Date(album.release_date).getFullYear()}</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{album.songs?.length || 0} songs</span>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  setDeleteConfirmation({
                                    show: true,
                                    type: "album",
                                    id: album.id,
                                    title: album.title,
                                  })
                                }
                                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        {sortedAlbums.length === 0 && (
                          <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">No albums found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{albumFilter ? "Try a different search term" : "Create your first album"}</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Songs Panel */}
              <TabPanel className="p-8 lg:p-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
                  <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                          <MusicalNoteIcon className="w-5 h-5 text-blue-500" />
                          Add New Song
                        </h3>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Album</label>
                          <select value={selectedAlbum?.id || ""} onChange={(e) => setSelectedAlbum(albums.find((a) => a.id === e.target.value))} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent">
                            <option value="">Choose an album</option>
                            {albums.map((album) => (
                              <option key={album.id} value={album.id}>
                                {album.title} ({new Date(album.release_date).getFullYear()})
                              </option>
                            ))}
                          </select>
                        </div>

                        <SongForm song={newSong} onChange={setNewSong} onSubmit={handleAddSong} />
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1 2xl:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MusicalNoteIcon className="w-5 h-5 text-blue-500" />
                        Song Collection
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <select value={selectedAlbum?.id || ""} onChange={(e) => setSelectedAlbum(albums.find((a) => a.id === e.target.value))} className="select select-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                          <option value="">All Albums</option>
                          {albums.map((album) => (
                            <option key={album.id} value={album.id}>
                              {album.title}
                            </option>
                          ))}
                        </select>
                        <button onClick={fetchAlbums} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ArrowPathIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      <AnimatePresence>
                        {albums.map((album) => (
                          <div key={album.id} className="space-y-2">
                            {album.songs?.length > 0 && !selectedAlbum?.id && <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2">{album.title}</h4>}
                            {(selectedAlbum?.id === album.id || !selectedAlbum?.id) &&
                              album.songs?.map((song, index) => (
                                <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-4">
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">{song.track_number}</div>
                                      <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{song.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirmation({
                                          show: true,
                                          type: "song",
                                          id: song.id,
                                          title: song.title,
                                        })
                                      }
                                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                  {song.lyrics && (
                                    <div className="mt-2 pl-12">
                                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{song.lyrics}</p>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                          </div>
                        ))}
                        {!albums.some((album) => album.songs?.length > 0) && (
                          <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">No songs found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Add your first song to an album</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Other panels remain functionally the same but with updated styling... */}
            </TabPanels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
