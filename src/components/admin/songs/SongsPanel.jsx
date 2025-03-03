import React from "react";
import { MusicalNoteIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import SongItem from "./SongItem";
import FilterInput from "../common/FilterInput";

export default function SongsPanel({
  // eslint-disable-next-line no-unused-vars
  songs,
  selectedAlbum,
  albums,
  onAlbumChange,
  onDelete,
  onRefresh,
  children,
}) {
  const [songFilter, setSongFilter] = React.useState("");

  // We don't need filteredSongs since we filter directly in the render
  // eslint-disable-next-line no-unused-vars
  const _unused = null;

  return (
    <div className="p-8 lg:p-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
        {/* Form Section */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
            <div className="p-6">{children}</div>
          </div>
        </div>

        {/* Songs List Section */}
        <div className="xl:col-span-1 2xl:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MusicalNoteIcon className="w-5 h-5 text-blue-500" />
              Song Collection
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <select value={selectedAlbum?.id || ""} onChange={(e) => onAlbumChange(albums.find((a) => a.id === e.target.value))} className="select select-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                <option value="">All Albums</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
              <button onClick={onRefresh} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <FilterInput value={songFilter} onChange={setSongFilter} placeholder="Search songs..." />

          <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <AnimatePresence>
              {albums.map((album) => (
                <div key={album.id} className="space-y-2">
                  {album.songs?.length > 0 && !selectedAlbum?.id && <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2">{album.title}</h4>}
                  {(selectedAlbum?.id === album.id || !selectedAlbum?.id) && album.songs?.filter((song) => (songFilter ? song.title.toLowerCase().includes(songFilter.toLowerCase()) : true)).map((song, index) => <SongItem key={song.id} song={song} index={index} onDelete={onDelete} />)}
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
    </div>
  );
}
