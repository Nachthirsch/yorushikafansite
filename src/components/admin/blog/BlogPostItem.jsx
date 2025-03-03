import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */

export default function BlogPostItem({ post, index, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(post)} className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <PencilIcon className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(post)} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.content}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <time>{new Date(post.created_at).toLocaleDateString()}</time>
          <span>•</span>
          <span>{post.content.length > 200 ? "Long post" : "Short post"}</span>
        </div>
      </div>
    </motion.div>
  );
}
