import React from "react";
import { TrashIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */

export default function AlbumItem({ album, index, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {album.cover_image_url ? (
            <img
              src={album.cover_image_url}
              alt={album.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-album.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ArchiveBoxIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">{album.title}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{new Date(album.release_date).getFullYear()}</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{album.songs?.length || 0} songs</span>
          </div>
        </div>
        <button onClick={() => onDelete(album)} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
