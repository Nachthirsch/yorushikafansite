import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Tab } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import BlogPostForm from "./admin/BlogPostForm";
import SongForm from "./admin/SongForm";
import AlbumForm from "./admin/AlbumForm";
import { useNavigate } from "react-router-dom";
import { ChartBarIcon, BookOpenIcon, ArchiveBoxIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

// Import our new components
import LoginScreen from "./auth/LoginScreen";
import ConfirmationDialog from "./common/ConfirmationDialog";
import DashboardPanel from "./dashboard/DashboardPanel";
import BlogPostsPanel from "./blog/BlogPostsPanel";
import AlbumsPanel from "./albums/AlbumsPanel";
import SongsPanel from "./songs/SongsPanel";
import SongsManagementPanel from "./songs/SongsManagementPanel";

export default function AdminPanel() {
  const navigate = useNavigate();

  // Group all useState hooks together at the top
  const [session, setSession] = useState(null);
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
  const [songs, setSongs] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalAlbums: 0,
    totalSongs: 0,
  });
  const [postSort, setPostSort] = useState("newest");
  const [albumSort, setAlbumSort] = useState("newest");
  const [postFilter, setPostFilter] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: null,
    id: null,
    title: "",
  });

  // Auth effect
  useEffect(() => {
    checkAuth();
    return () => {};
  }, []);

  // Data fetching effect
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!session) return;

      setLoading(true);
      try {
        await Promise.all([fetchAlbums(), fetchPosts(), fetchSongs()]);
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
  }, [session]);

  const checkAuth = async () => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription?.unsubscribe();
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleGitHubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to login with GitHub");
    }
  };

  // Show login screen if not authenticated
  if (!session) {
    return <LoginScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <LoadingSpinner size="lg" />
        <p className="ml-3 text-base-content/70 animate-pulse">Loading admin dashboard...</p>
      </div>
    );
  }

  function updateStats() {
    setStats({
      totalPosts: posts.length,
      totalAlbums: albums.length,
      totalSongs: albums.reduce((acc, album) => acc + (album.songs?.length || 0), 0),
    });
  }

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
      throw error; // Re-throw for handling in useEffect
    }
  }

  async function handleAddSong(e) {
    e.preventDefault();
    const toastId = toast.loading("Adding new song...");

    try {
      if (!newSong.album_id) {
        toast.error("Please select an album", { id: toastId });
        return;
      }

      const { error } = await supabase.from("songs").insert([
        {
          album_id: newSong.album_id,
          title: newSong.title,
          track_number: parseInt(newSong.track_number) || 1,
          duration: parseInt(newSong.duration) || 0,
          lyrics: newSong.lyrics,
          lyrics_translation: newSong.lyrics_translation,
        },
      ]);

      if (error) throw error;

      await fetchAlbums();
      setNewSong({
        title: "",
        track_number: "",
        duration: "",
        lyrics: "",
        lyrics_translation: "",
        album_id: "",
      });
      toast.success("Song added successfully!", { id: toastId });
      updateStats();
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error(error.message || "Failed to add song", { id: toastId });
    }
  }

  async function fetchSongs() {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select(
          `
          *,
          albums (
            title
          )
        `
        )
        .order("track_number");

      if (error) throw error;
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Failed to load songs");
    }
  }

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDeletePost = (post) => {
    setDeleteConfirmation({
      show: true,
      type: "post",
      id: post.id,
      title: post.title,
    });
  };

  const handleDeleteAlbum = (album) => {
    setDeleteConfirmation({
      show: true,
      type: "album",
      id: album.id,
      title: album.title,
    });
  };

  const handleDeleteSong = (song) => {
    setDeleteConfirmation({
      show: true,
      type: "song",
      id: song.id,
      title: song.title,
    });
  };

  const handleViewLyrics = (song) => {
    navigate(`/lyrics/${song.id}`);
  };

  const handleEditSong = (song) => {
    navigate(`/admin/songs/edit/${song.id}`);
  };

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
    {
      name: "Songs Management",
      icon: <MusicalNoteIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900 dark:to-gray-800/80">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-white border border-gray-200 dark:border-gray-700 shadow-lg",
        }}
      />

      <ConfirmationDialog isOpen={deleteConfirmation.show} onClose={() => setDeleteConfirmation({ ...deleteConfirmation, show: false })} onConfirm={() => handleDelete(deleteConfirmation.type, deleteConfirmation.id)} type={deleteConfirmation.type} title={deleteConfirmation.title} />

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
            <Tab.List className="flex p-1 gap-1 bg-gray-100/50 dark:bg-gray-900/50">
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
            </Tab.List>

            <Tab.Panels>
              {/* Dashboard Panel */}
              <Tab.Panel>
                <DashboardPanel stats={stats} />
              </Tab.Panel>

              {/* Blog Posts Panel */}
              <Tab.Panel>
                <BlogPostsPanel posts={posts} postSort={postSort} setPostSort={setPostSort} postFilter={postFilter} setPostFilter={setPostFilter} onEdit={handleEditPost} onDelete={handleDeletePost} onRefresh={fetchPosts}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    <BookOpenIcon className="w-5 h-5 text-blue-500" />
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
                </BlogPostsPanel>
              </Tab.Panel>

              {/* Albums Panel */}
              <Tab.Panel>
                <AlbumsPanel albums={albums} albumSort={albumSort} setAlbumSort={setAlbumSort} albumFilter={albumFilter} setAlbumFilter={setAlbumFilter} onDelete={handleDeleteAlbum} onRefresh={fetchAlbums}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    <ArchiveBoxIcon className="w-5 h-5 text-blue-500" />
                    Add New Album
                  </h3>
                  <AlbumForm
                    onAlbumAdded={() => {
                      fetchAlbums();
                      updateStats();
                    }}
                  />
                </AlbumsPanel>
              </Tab.Panel>

              {/* Songs Panel */}
              <Tab.Panel>
                <SongsPanel songs={songs} selectedAlbum={selectedAlbum} albums={albums} onAlbumChange={setSelectedAlbum} onDelete={handleDeleteSong} onRefresh={fetchAlbums}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    <MusicalNoteIcon className="w-5 h-5 text-blue-500" />
                    Add New Song
                  </h3>
                  <SongForm song={newSong} onChange={setNewSong} onSubmit={handleAddSong} albums={albums} />
                </SongsPanel>
              </Tab.Panel>

              {/* Songs Management Panel */}
              <Tab.Panel>
                <SongsManagementPanel songs={songs} onRefresh={fetchSongs} onDelete={handleDeleteSong} onEdit={handleEditSong} onViewLyrics={handleViewLyrics} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
