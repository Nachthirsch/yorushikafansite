import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */
import { DocumentTextIcon, ArchiveBoxIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import StatsCard from "../common/StatsCard";

export default function DashboardPanel({ stats }) {
  return (
    <div className="p-8 lg:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
        {/* Stats Cards */}
        <StatsCard title="Total Posts" value={stats.totalPosts} icon={<DocumentTextIcon />} color="blue" />

        <StatsCard title="Total Albums" value={stats.totalAlbums} icon={<ArchiveBoxIcon />} color="purple" />

        <StatsCard title="Total Songs" value={stats.totalSongs} icon={<MusicalNoteIcon />} color="green" />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-l-4 border-blue-500 dark:border-blue-400 pl-4">Recent Activity</h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
          {/* Activity cards would go here */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-center">Activity dashboard will be implemented in a future update</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
