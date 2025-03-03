import React from "react";
import { PencilIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */
import { useNavigate } from "react-router-dom";

export default function SongItem({ song, index, onDelete }) {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">{song.track_number}</div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{song.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit Button */}
          <button onClick={() => navigate(`/admin/songs/edit/${song.id}`)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <PencilIcon className="w-5 h-5" />
          </button>

          {/* View Lyrics Button */}
          <button onClick={() => navigate(`/lyrics/${song.id}`)} className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
            <DocumentTextIcon className="w-5 h-5" />
          </button>

          {/* Delete Button */}
          <button onClick={() => onDelete(song)} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {song.lyrics && (
        <div className="mt-2 pl-12">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{song.lyrics}</p>
        </div>
      )}
    </motion.div>
  );
}
