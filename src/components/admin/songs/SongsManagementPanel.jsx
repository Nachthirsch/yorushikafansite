import React from "react";
import { MusicalNoteIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import SongTableRow from "./SongTableRow";
import FilterInput from "../common/FilterInput";

export default function SongsManagementPanel({ songs, onRefresh, onDelete, onEdit, onViewLyrics }) {
  const [songFilter, setSongFilter] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const filteredSongs = songs.filter((song) => (songFilter ? song.title.toLowerCase().includes(songFilter.toLowerCase()) : true));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <MusicalNoteIcon className="w-8 h-8 text-blue-500" />
          Song Management
        </h2>
        <div className="flex items-center gap-4">
          <FilterInput value={songFilter} onChange={setSongFilter} placeholder="Search songs..." className="min-w-[250px]" />
          <button
            onClick={handleRefresh}
            className={`p-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 
              dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
              transition-all duration-200 ease-in-out ${isRefreshing ? "animate-spin" : ""}`}
            disabled={isRefreshing}
          >
            <ArrowPathIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border 
        border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out
        hover:shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-semibold text-gray-600 
                  dark:text-gray-300 uppercase tracking-wider"
                >
                  Song Details
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-semibold text-gray-600 
                  dark:text-gray-300 uppercase tracking-wider"
                >
                  Album
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-semibold text-gray-600 
                  dark:text-gray-300 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-right text-xs font-semibold text-gray-600 
                  dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSongs.map((song) => (
                <SongTableRow key={song.id} song={song} onEdit={() => onEdit(song)} onViewLyrics={() => onViewLyrics(song)} onDelete={() => onDelete(song)} />
              ))}
              {filteredSongs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center">
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No songs found</p>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{songFilter ? "Try a different search term" : "Add your first song"}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
