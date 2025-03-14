import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAlbums } from "../hooks/useAlbums";
import AlbumHeader from "../components/album/AlbumHeader";
import AlbumControls from "../components/album/AlbumControls";
import AlbumGrid from "../components/album/AlbumGrid";
import AlbumDetail from "../components/AlbumDetail";
import LoadingSpinner from "../components/LoadingSpinner";
import { AnimatePresence } from "framer-motion";

export default function AlbumPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isGridView, setIsGridView] = useState(true);
  const [yearFilter, setYearFilter] = useState("all");
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: albums = [],
    isLoading,
    isError,
    error,
  } = useAlbums({
    search: searchTerm,
    year: yearFilter,
    sortBy,
  });

  // Pre-fetch album details on hover
  const handleAlbumHover = (albumId) => {
    setHoveredAlbum(albumId);
    queryClient.prefetchQuery({
      queryKey: ["album", albumId],
      queryFn: () => fetchAlbum(albumId),
    });
  };

  // Get unique years from albums array
  const years = Array.isArray(albums) ? [...new Set(albums.map((album) => new Date(album.release_date).getFullYear()))].sort((a, b) => b - a) : [];

  // Filter and sort albums
  const filteredAlbums = Array.isArray(albums)
    ? albums
        .filter((album) => {
          const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesYear = yearFilter === "all" || new Date(album.release_date).getFullYear().toString() === yearFilter;
          return matchesSearch && matchesYear;
        })
        .sort((a, b) => {
          if (sortBy === "newest") return new Date(b.release_date) - new Date(a.release_date);
          if (sortBy === "oldest") return new Date(a.release_date) - new Date(b.release_date);
          if (sortBy === "tracks") return (b.songs?.length || 0) - (a.songs?.length || 0);
          if (sortBy === "title") return a.title.localeCompare(b.title);
          return 0;
        })
    : [];

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
          <h2 className="text-xl font-medium text-red-600 dark:text-red-400 mb-4">Error loading albums</h2>
          <p className="text-neutral-600 dark:text-neutral-400">{error?.message || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <AlbumHeader />

      <AlbumControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortBy={setSortBy} yearFilter={yearFilter} setYearFilter={setYearFilter} isGridView={isGridView} setIsGridView={setIsGridView} years={years} />

      <AlbumGrid filteredAlbums={filteredAlbums} isGridView={isGridView} onAlbumSelect={setSelectedAlbum} onAlbumHover={handleAlbumHover} />

      <AnimatePresence>{selectedAlbum && <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}</AnimatePresence>
    </div>
  );
}
