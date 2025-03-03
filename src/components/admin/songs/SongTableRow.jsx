import React from "react";
import { PencilIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function SongTableRow({ song, onEdit, onViewLyrics, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{song.track_number}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{song.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{song.lyrics ? `${song.lyrics.slice(0, 30)}...` : "No lyrics"}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 dark:text-white">{song.albums?.title}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button onClick={onViewLyrics} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
            <DocumentTextIcon className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
