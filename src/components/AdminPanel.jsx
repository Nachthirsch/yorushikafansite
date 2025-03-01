/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, Fragment } from "react";
import { supabase } from "../lib/supabase";
import { Tab } from "@headlessui/react";
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

  const sortedAlbums = [...albums].sort((a, b) => {
    if (albumSort === "newest") return new Date(b.release_date) - new Date(a.release_date);
    if (albumSort === "oldest") return new Date(a.release_date) - new Date(b.release_date);
    if (albumSort === "alphabetical") return a.title.localeCompare(b.title);
    if (albumSort === "songs") return (b.songs?.length || 0) - (a.songs?.length || 0);
    return 0;
  });

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
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 pb-20">
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

      <ConfirmationDialog />

      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 py-12 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-base-content tracking-tight">Admin Dashboard</h1>
          <p className="text-base-content/70 mt-2 text-lg">Manage your content, albums, and songs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
          <Tab.Group>
            <Tab.List className="flex p-1 gap-1 bg-base-200/50 rounded-t-box overflow-x-auto scrollbar-thin scrollbar-thumb-base-300">
              {tabItems.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-t-lg transition-all min-w-[120px]
                    ${selected ? "bg-base-100 text-primary shadow-sm" : "text-base-content/70 hover:bg-base-100/50 hover:text-primary"}`
                  }
                >
                  {tab.icon}
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* Dashboard Overview Panel */}
              <Tab.Panel className="p-8">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat bg-base-200/30 rounded-box p-6 border border-base-300/50">
                      <div className="stat-figure text-primary">
                        <DocumentTextIcon className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Posts</div>
                      <div className="stat-value text-primary">{stats.totalPosts}</div>
                      <div className="stat-desc">Blog posts</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat bg-base-200/30 rounded-box p-6 border border-base-300/50">
                      <div className="stat-figure text-secondary">
                        <ArchiveBoxIcon className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Albums</div>
                      <div className="stat-value text-secondary">{stats.totalAlbums}</div>
                      <div className="stat-desc">Album collection</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat bg-base-200/30 rounded-box p-6 border border-base-300/50">
                      <div className="stat-figure text-accent">
                        <MusicalNoteIcon className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Songs</div>
                      <div className="stat-value text-accent">{stats.totalSongs}</div>
                      <div className="stat-desc">Song catalog</div>
                    </motion.div>
                  </div>

                  <div className="divider">Recent Activity</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card bg-base-200/30 border border-base-300/50">
                      <div className="card-body">
                        <h3 className="card-title flex items-center gap-2">
                          <BookOpenIcon className="w-5 h-5 text-primary" />
                          Recent Posts
                        </h3>
                        <div className="divider my-2"></div>

                        <div className="space-y-3">
                          {posts.slice(0, 3).map((post) => (
                            <div key={post.id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg">
                              <div className="flex-1 truncate">
                                <p className="font-medium">{post.title}</p>
                                <p className="text-xs text-base-content/60">{new Date(post.created_at).toLocaleDateString()}</p>
                              </div>
                              <button className="btn btn-sm btn-ghost btn-circle">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {posts.length === 0 && <div className="text-center py-4 text-base-content/50">No posts yet</div>}
                        </div>

                        <div className="card-actions justify-end">
                          <button onClick={() => document.querySelectorAll('[role="tab"]')[1].click()} className="btn btn-sm btn-outline btn-primary">
                            View All Posts
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200/30 border border-base-300/50">
                      <div className="card-body">
                        <h3 className="card-title flex items-center gap-2">
                          <MusicalNoteIcon className="w-5 h-5 text-accent" />
                          Recent Albums
                        </h3>
                        <div className="divider my-2"></div>

                        <div className="space-y-3">
                          {albums.slice(0, 3).map((album) => (
                            <div key={album.id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg">
                              <img src={album.cover_image_url} alt={album.title} className="w-10 h-10 rounded-md object-cover" />
                              <div className="flex-1">
                                <p className="font-medium">{album.title}</p>
                                <p className="text-xs text-base-content/60">
                                  {new Date(album.release_date).getFullYear()} • {album.songs?.length || 0} songs
                                </p>
                              </div>
                            </div>
                          ))}
                          {albums.length === 0 && <div className="text-center py-4 text-base-content/50">No albums yet</div>}
                        </div>

                        <div className="card-actions justify-end">
                          <button onClick={() => document.querySelectorAll('[role="tab"]')[2].click()} className="btn btn-sm btn-outline btn-secondary">
                            View All Albums
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              {/* Blog Posts Panel */}
              <Tab.Panel className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <div className="card bg-base-200/20 shadow-sm border border-base-300/30 mb-8">
                      <div className="card-body">
                        <h3 className="card-title flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-primary" />
                          {isEditing ? "Edit Post" : "Create New Post"}
                        </h3>
                        <div className="divider mt-1 mb-3"></div>
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

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold">Published Posts</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="join">
                          <button onClick={() => setPostSort("newest")} className={`btn btn-sm join-item ${postSort === "newest" ? "btn-primary" : "btn-ghost"}`}>
                            Newest
                          </button>
                          <button onClick={() => setPostSort("oldest")} className={`btn btn-sm join-item ${postSort === "oldest" ? "btn-primary" : "btn-ghost"}`}>
                            Oldest
                          </button>
                          <button onClick={() => setPostSort("alphabetical")} className={`btn btn-sm join-item ${postSort === "alphabetical" ? "btn-primary" : "btn-ghost"}`}>
                            A-Z
                          </button>
                        </div>
                        <button onClick={fetchPosts} className="btn btn-sm btn-ghost btn-circle" aria-label="Refresh posts">
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                        <div className="badge badge-primary badge-lg">{posts.length}</div>
                      </div>
                    </div>

                    <div className="relative">
                      <input type="text" placeholder="Search posts..." className="input input-sm input-bordered w-full pr-10" value={postFilter} onChange={(e) => setPostFilter(e.target.value)} />
                      <AdjustmentsHorizontalIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    </div>

                    <div className="divider my-3"></div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                      <AnimatePresence>
                        {sortedPosts.length > 0 ? (
                          sortedPosts.map((post, index) => (
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
                                    className="btn btn-sm btn-outline tooltip tooltip-left"
                                    data-tip="Edit post"
                                  >
                                    <PencilIcon className="w-4 h-4 mr-1" /> Edit
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
                                    className="btn btn-sm btn-outline btn-error tooltip tooltip-left"
                                    data-tip="Delete post"
                                  >
                                    <TrashIcon className="w-4 h-4 mr-1" /> Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-base-content/50">No posts found</p>
                            <p className="text-sm">{postFilter ? "Try a different search term" : "Create your first post"}</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              {/* Albums Panel */}
              <Tab.Panel className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <div className="card bg-base-200/20 shadow-sm border border-base-300/30 mb-8">
                      <div className="card-body">
                        <h3 className="card-title flex items-center gap-2">
                          <PlusIcon className="w-5 h-5 text-secondary" />
                          Add New Album
                        </h3>
                        <div className="divider mt-1 mb-3"></div>
                        <AlbumForm
                          onAlbumAdded={() => {
                            fetchAlbums();
                            updateStats();
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <ArchiveBoxIcon className="w-5 h-5 text-secondary" />
                        <h3 className="text-xl font-bold">Album Collection</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="join">
                          <button onClick={() => setAlbumSort("newest")} className={`btn btn-sm join-item ${albumSort === "newest" ? "btn-secondary" : "btn-ghost"}`}>
                            Newest
                          </button>
                          <button onClick={() => setAlbumSort("oldest")} className={`btn btn-sm join-item ${albumSort === "oldest" ? "btn-secondary" : "btn-ghost"}`}>
                            Oldest
                          </button>
                          <button onClick={() => setAlbumSort("alphabetical")} className={`btn btn-sm join-item ${albumSort === "alphabetical" ? "btn-secondary" : "btn-ghost"}`}>
                            A-Z
                          </button>
                          <button onClick={() => setAlbumSort("songs")} className={`btn btn-sm join-item ${albumSort === "songs" ? "btn-secondary" : "btn-ghost"}`}>
                            Most Songs
                          </button>
                        </div>
                        <button onClick={fetchAlbums} className="btn btn-sm btn-ghost btn-circle" aria-label="Refresh albums">
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                        <div className="badge badge-secondary badge-lg">{albums.length}</div>
                      </div>
                    </div>

                    <div className="divider my-3"></div>

                    <div className="grid gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                      <AnimatePresence>
                        {sortedAlbums.length > 0 ? (
                          sortedAlbums.map((album, index) => (
                            <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="card card-side bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200">
                              <figure className="w-24 h-24">
                                {album.cover_image_url ? (
                                  <img
                                    src={album.cover_image_url}
                                    alt={album.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder-album.png"; // Tambahkan placeholder image
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-base-200 flex items-center justify-center">
                                    <ArchiveBoxIcon className="w-8 h-8 text-base-content/30" />
                                  </div>
                                )}
                              </figure>
                              <div className="card-body p-4">
                                <h4 className="card-title text-base">{album.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                  <div className="badge badge-outline">{new Date(album.release_date).getFullYear()}</div>
                                  <div className="badge badge-outline">{album.songs?.length || 0} songs</div>
                                </div>
                                <div className="card-actions justify-end">
                                  <button
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        show: true,
                                        type: "album",
                                        id: album.id,
                                        title: album.title,
                                      })
                                    }
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
                            <p className="text-base-content/50">No albums found</p>
                            <p className="text-sm">{albumFilter ? "Try a different search term" : "Create your first album"}</p>
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
