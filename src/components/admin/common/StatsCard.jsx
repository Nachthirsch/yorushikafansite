import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */

export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: {
      border: "border-blue-500 dark:border-blue-400",
      text: "text-blue-600 dark:text-blue-400",
      icon: "text-blue-500 dark:text-blue-400",
    },
    green: {
      border: "border-green-500 dark:border-green-400",
      text: "text-green-600 dark:text-green-400",
      icon: "text-green-500 dark:text-green-400",
    },
    purple: {
      border: "border-purple-500 dark:border-purple-400",
      text: "text-purple-600 dark:text-purple-400",
      icon: "text-purple-500 dark:text-purple-400",
    },
    amber: {
      border: "border-amber-500 dark:border-amber-400",
      text: "text-amber-600 dark:text-amber-400",
      icon: "text-amber-500 dark:text-amber-400",
    },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`bg-white dark:bg-gray-800/90 p-6 rounded-xl border-l-4 ${classes.border} shadow-md hover:shadow-lg transition-all duration-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`${classes.text} font-medium`}>{title}</p>
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
        </div>
        {React.cloneElement(icon, { className: `w-8 h-8 ${classes.icon}` })}
      </div>
    </motion.div>
  );
}
