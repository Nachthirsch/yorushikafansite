import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AlbumHeader from "../components/album/AlbumHeader";
import AlbumControls from "../components/album/AlbumControls";
import AlbumGrid from "../components/album/AlbumGrid";
import AlbumDetail from "../components/AlbumDetail";
import { AnimatePresence } from "framer-motion";

export default function AlbumPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isGridView, setIsGridView] = useState(true);
  const [yearFilter, setYearFilter] = useState("all");
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  const queryClient = useQueryClient();

  // Pre-fetch album details on hover
  const handleAlbumHover = (albumId) => {
    setHoveredAlbum(albumId);
    queryClient.prefetchQuery({
      queryKey: ["album", albumId],
      queryFn: () => fetchAlbum(albumId),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <AlbumHeader />

      <AlbumControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        years={[]} // Years akan diisi dari AlbumGrid
      />

      <AlbumGrid
        searchTerm={searchTerm}
        sortBy={sortBy}
        yearFilter={yearFilter}
        isGridView={isGridView}
        onAlbumSelect={setSelectedAlbum}
        onAlbumHover={handleAlbumHover}
        setAvailableYears={(years) => {
          // Update control years dari data yang tersedia di AlbumGrid
          if (AlbumControls.years !== years) {
            AlbumControls.years = years;
          }
        }}
      />

      <AnimatePresence>{selectedAlbum && <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}</AnimatePresence>
    </div>
  );
}
