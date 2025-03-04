/* eslint-disable no-undef */
import React, { useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext"; // Add this import
import { Tab } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import BlogPostForm from "./BlogPostForm";
import SongForm from "./SongForm";
import AlbumForm from "./AlbumForm";
import { ChartBarIcon, BookOpenIcon, ArchiveBoxIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import { AdminProvider, useAdmin } from "../../contexts/AdminContext";

// Import our new components
import LoginScreen from "./auth/LoginScreen";
import ConfirmationDialog from "./common/ConfirmationDialog";
import DashboardPanel from "./dashboard/DashboardPanel";
import BlogPostsPanel from "./blog/BlogPostsPanel";
import AlbumsPanel from "./albums/AlbumsPanel";
import SongsPanel from "./songs/SongsPanel";
import SongsManagementPanel from "./songs/SongsManagementPanel";
import { usePageVisibility } from "../../hooks/usePageVisibility";

// Wrap the main content in a memo to prevent unnecessary re-renders
const AdminContent = React.memo(function AdminContent() {
  const [state, dispatch] = useAdmin();
  const isPageVisible = usePageVisibility();
  const navigate = useNavigate();
  const { session } = useAuth(); // Move auth check here

  // Define all hooks and callbacks first
  const fetchPosts = useCallback(async () => {
    if (!isPageVisible) return;
    try {
      const { data, error } = await supabase.from("blog_posts").select("*, author_name, author_social_link").order("created_at", { ascending: false });
      if (error) throw error;
      console.log("Fetched posts:", data); // Debug log
      return data || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
      return [];
    }
  }, [isPageVisible]);

  const fetchAlbums = useCallback(async () => {
    if (!isPageVisible) return;
    try {
      const { data, error } = await supabase.from("albums").select(`*, songs(*)`).order("release_date", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Failed to load albums");
      return [];
    }
  }, [isPageVisible]);

  const fetchSongs = useCallback(async () => {
    if (!isPageVisible) return;
    try {
      const { data, error } = await supabase.from("songs").select(`*, albums(title)`).order("track_number");
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Failed to load songs");
      return [];
    }
  }, [isPageVisible]);

  const fetchData = useCallback(async () => {
    if (!isPageVisible) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [albumsData, postsData, songsData] = await Promise.all([fetchAlbums(), fetchPosts(), fetchSongs()]);

      dispatch({ type: "SET_ALBUMS", payload: albumsData });
      dispatch({ type: "SET_POSTS", payload: postsData });
      dispatch({ type: "SET_SONGS", payload: songsData });

      // Update stats after data is loaded
      const stats = {
        totalPosts: postsData.length,
        totalAlbums: albumsData.length,
        totalSongs: albumsData.reduce((acc, album) => acc + (album.songs?.length || 0), 0),
      };
      dispatch({ type: "UPDATE_STATS", payload: stats });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isPageVisible, dispatch, fetchAlbums, fetchPosts, fetchSongs]);

  // All other callback definitions
  const handleSubmit = useCallback(
    async (formData) => {
      // Changed to accept formData directly instead of event
      const toastId = toast.loading(state.isEditing ? "Updating post..." : "Creating post...");
      try {
        // Process the content
        let processedContent = formData.content;
        if (!processedContent || (Array.isArray(processedContent) && processedContent.length === 0)) {
          processedContent = [{ type: "text", value: "" }];
        }

        // Prepare post data
        const postData = {
          title: formData.title || "",
          content: processedContent,
          author_name: formData.author_name || null,
          author_social_link: formData.author_social_link || null,
          published: formData.published || false,
          publish_date: formData.publish_date || new Date().toISOString(),
        };

        console.log("Saving post with data:", postData); // Debug log

        const { error } = state.isEditing
          ? await supabase
              .from("blog_posts")
              .update({
                ...postData,
                updated_at: new Date().toISOString(),
              })
              .eq("id", state.currentPost.id)
          : await supabase.from("blog_posts").insert([postData]);

        if (error) throw error;

        await fetchData();
        dispatch({ type: "RESET_CURRENT_POST" });
        dispatch({ type: "SET_IS_EDITING", payload: false });
        toast.success(state.isEditing ? "Post updated!" : "Post created!", { id: toastId });
      } catch (error) {
        console.error("Error saving post:", error);
        toast.error(`Failed to save post: ${error.message || "Unknown error"}`, { id: toastId });
      }
    },
    [state.isEditing, state.currentPost, dispatch, fetchData]
  );

  const handleDelete = useCallback(
    async (type, id) => {
      dispatch({ type: "HIDE_DELETE_CONFIRMATION" });
      const toastId = toast.loading(`Deleting ${type}...`);
      try {
        const { error } = await supabase
          .from(type === "post" ? "blog_posts" : type === "album" ? "albums" : "songs")
          .delete()
          .eq("id", id);

        if (error) throw error;
        await fetchData();
        toast.success(`${type} deleted successfully!`, { id: toastId });
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        toast.error(`Failed to delete ${type}`, { id: toastId });
      }
    },
    [dispatch, fetchData]
  );

  const handleAddSong = useCallback(
    async (e) => {
      e.preventDefault();
      const toastId = toast.loading("Adding new song...");

      try {
        if (!state.newSong.album_id) {
          toast.error("Please select an album", { id: toastId });
          return;
        }

        const { error } = await supabase.from("songs").insert([
          {
            album_id: state.newSong.album_id,
            title: state.newSong.title,
            track_number: parseInt(state.newSong.track_number) || 1,
            duration: parseInt(state.newSong.duration) || 0,
            lyrics: state.newSong.lyrics,
            lyrics_translation: state.newSong.lyrics_translation,
          },
        ]);

        if (error) throw error;

        await fetchData();
        dispatch({
          type: "SET_NEW_SONG",
          payload: {
            title: "",
            track_number: "",
            duration: "",
            lyrics: "",
            lyrics_translation: "",
            album_id: "",
          },
        });
        toast.success("Song added successfully!", { id: toastId });
      } catch (error) {
        console.error("Error adding song:", error);
        toast.error(error.message || "Failed to add song", { id: toastId });
      }
    },
    [state.newSong, dispatch, fetchData]
  );

  const handleEditPost = useCallback(
    (post) => {
      dispatch({ type: "SET_CURRENT_POST", payload: post });
      dispatch({ type: "SET_IS_EDITING", payload: true });
    },
    [dispatch]
  );

  const handleEditSong = useCallback(
    (song) => {
      navigate(`/admin/songs/edit/${song.id}`);
    },
    [navigate]
  );

  const handleViewLyrics = useCallback(
    (song) => {
      navigate(`/lyrics/${song.id}`);
    },
    [navigate]
  );

  const handleDeletePost = useCallback(
    (post) => {
      dispatch({
        type: "SET_DELETE_CONFIRMATION",
        payload: {
          show: true,
          type: "post",
          id: post.id,
          title: post.title,
        },
      });
    },
    [dispatch]
  );

  const handleDeleteAlbum = useCallback(
    (album) => {
      dispatch({
        type: "SET_DELETE_CONFIRMATION",
        payload: {
          show: true,
          type: "album",
          id: album.id,
          title: album.title,
        },
      });
    },
    [dispatch]
  );

  const handleDeleteSong = useCallback(
    (song) => {
      dispatch({
        type: "SET_DELETE_CONFIRMATION",
        payload: {
          show: true,
          type: "song",
          id: song.id,
          title: song.title,
        },
      });
    },
    [dispatch]
  );

  // Add onAlbumAdded callback
  const handleAlbumAdded = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Effect hook
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [fetchData, session]);

  // Memoized values
  const tabItems = useMemo(
    () => [
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
    ],
    []
  );

  // Early returns after all hooks are defined
  if (!session) {
    return <LoginScreen />;
  }
  // Rest of the component render logic
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900 dark:to-gray-800/80">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-white border border-gray-200 dark:border-gray-700 shadow-lg",
        }}
      />

      {/* Add null check for deleteConfirmation */}
      <ConfirmationDialog isOpen={state.deleteConfirmation?.show || false} onClose={() => dispatch({ type: "HIDE_DELETE_CONFIRMATION" })} onConfirm={() => handleDelete(state.deleteConfirmation?.type, state.deleteConfirmation?.id)} type={state.deleteConfirmation?.type || ""} title={state.deleteConfirmation?.title || ""} />

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
                <DashboardPanel stats={state.stats} />
              </Tab.Panel>

              {/* Blog Posts Panel */}
              <Tab.Panel>
                <BlogPostsPanel posts={state.posts} postSort={state.postSort} setPostSort={(sort) => dispatch({ type: "SET_POST_SORT", payload: sort })} postFilter={state.postFilter} setPostFilter={(filter) => dispatch({ type: "SET_POST_FILTER", payload: filter })} onEdit={handleEditPost} onDelete={handleDeletePost} onRefresh={fetchPosts}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    <BookOpenIcon className="w-5 h-5 text-blue-500" />
                    {state.isEditing ? "Edit Post" : "Create New Post"}
                  </h3>
                  <BlogPostForm
                    post={state.currentPost}
                    isEditing={state.isEditing}
                    onSubmit={handleSubmit} // This will now receive the formData object
                    onChange={(post) => dispatch({ type: "SET_CURRENT_POST", payload: post })}
                    onCancel={() => {
                      dispatch({ type: "RESET_CURRENT_POST" });
                      dispatch({ type: "SET_IS_EDITING", payload: false });
                    }}
                  />
                </BlogPostsPanel>
              </Tab.Panel>

              {/* Albums Panel */}
              <Tab.Panel>
                <AlbumsPanel albums={state.albums} albumSort={state.albumSort} setAlbumSort={(sort) => dispatch({ type: "SET_ALBUM_SORT", payload: sort })} albumFilter={state.albumFilter} setAlbumFilter={(filter) => dispatch({ type: "SET_ALBUM_FILTER", payload: filter })} onDelete={handleDeleteAlbum} onRefresh={fetchAlbums}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    <ArchiveBoxIcon className="w-5 h-5 text-blue-500" />
                    Add New Album
                  </h3>
                  <AlbumForm onAlbumAdded={handleAlbumAdded} />
                </AlbumsPanel>
              </Tab.Panel>

              {/* Songs Panel */}
              <Tab.Panel>
                <SongsPanel songs={state.songs} selectedAlbum={state.selectedAlbum} albums={state.albums} onAlbumChange={(album) => dispatch({ type: "SET_SELECTED_ALBUM", payload: album })} onDelete={handleDeleteSong} onRefresh={fetchAlbums}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    <MusicalNoteIcon className="w-5 h-5 text-blue-500" />
                    Add New Song
                  </h3>
                  <SongForm song={state.newSong} onChange={(song) => dispatch({ type: "SET_NEW_SONG", payload: song })} onSubmit={handleAddSong} albums={state.albums} />
                </SongsPanel>
              </Tab.Panel>

              {/* Songs Management Panel */}
              <Tab.Panel>
                <SongsManagementPanel songs={state.songs} onRefresh={fetchSongs} onDelete={handleDeleteSong} onEdit={handleEditSong} onViewLyrics={handleViewLyrics} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
});

// Simplify the main component since auth is handled in AdminContent
export default function AdminPanel() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
