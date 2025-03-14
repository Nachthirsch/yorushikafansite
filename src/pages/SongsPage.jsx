import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import SongsHeader from "../components/songs/SongsHeader";
import SongsControl from "../components/songs/SongsControl";
import SongsGrid from "../components/songs/SongsGrid";

export default function SongsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [albumFilter, setAlbumFilter] = useState("all");
  const [isGridView, setIsGridView] = useState(true);

  // Hanya fetch data albums untuk filter
  const { data: albums } = useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data, error } = await supabase.from("albums").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <SongsHeader />
      <SongsControl searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortBy={setSortBy} albumFilter={albumFilter} setAlbumFilter={setAlbumFilter} isGridView={isGridView} setIsGridView={setIsGridView} albums={albums || []} />
      <SongsGrid searchTerm={searchTerm} sortBy={sortBy} albumFilter={albumFilter} isGridView={isGridView} />
    </div>
  );
}
