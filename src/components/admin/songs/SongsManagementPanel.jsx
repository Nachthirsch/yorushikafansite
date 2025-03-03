import React from "react";
import { MusicalNoteIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import SongTableRow from "./SongTableRow";
import FilterInput from "../common/FilterInput";

export default function SongsManagementPanel({ songs, onRefresh, onDelete, onEdit, onViewLyrics }) {
  const [songFilter, setSongFilter] = React.useState("");

  const filteredSongs = songs.filter((song) => (songFilter ? song.title.toLowerCase().includes(songFilter.toLowerCase()) : true));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MusicalNoteIcon className="w-6 h-6 text-blue-500" />
          Song Management
        </h2>
        <div className="flex items-center gap-2">
          <FilterInput value={songFilter} onChange={setSongFilter} placeholder="Search songs..." />
          <button onClick={onRefresh} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Song Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Album
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <p>No songs found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{songFilter ? "Try a different search term" : "Add your first song"}</p>
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
