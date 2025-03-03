import React from "react";

export default function SortButtons({ options, currentSort, onSortChange }) {
  return (
    <div className="inline-flex rounded-lg shadow-sm">
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isActive = currentSort === option.value;

        let roundedClasses = "";
        if (isFirst) roundedClasses = "rounded-l-lg";
        if (isLast) roundedClasses = "rounded-r-lg";

        return (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`
              px-3 py-2 text-sm font-medium border
              ${roundedClasses}
              ${isActive ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
