import React from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function FilterInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input type="text" placeholder={placeholder || "Search..."} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" />
      <AdjustmentsHorizontalIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}
