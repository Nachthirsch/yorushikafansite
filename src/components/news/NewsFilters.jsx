import { motion } from "framer-motion";
import { Search, ChevronDown, LayoutGrid, List, RotateCcw } from "lucide-react";

export default function NewsFilters({ filters, setters, categories, dateRanges, resetFilters }) {
  const { searchTerm, dateFilter, categoryFilter, viewMode } = filters;
  const { setSearchTerm, setDateFilter, setCategoryFilter, setViewMode } = setters;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
      {/* Search Bar with Improved Accessibility */}
      <div className="relative">
        <label htmlFor="search-news" className="sr-only">
          Search news articles
        </label>
        <input type="text" id="search-news" placeholder="Search news..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-10 border-b border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors" role="searchbox" aria-label="Search news articles" />
        <Search className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400" aria-hidden="true" />
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Date Filter with Custom Select */}
        <div className="relative">
          <label htmlFor="date-filter" className="sr-only">
            Filter by date
          </label>
          <select id="date-filter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer" aria-label="Filter posts by date range">
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value} className="bg-neutral-50 dark:bg-neutral-800">
                {range.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" aria-hidden="true" />
        </div>

        {/* Category Filter with Custom Select */}
        <div className="relative">
          <label htmlFor="category-filter" className="sr-only">
            Filter by category
          </label>
          <select id="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer" aria-label="Filter posts by category">
            <option value="all" className="bg-neutral-50 dark:bg-neutral-800">
              All Categories
            </option>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <option key={category} value={category} className="bg-neutral-50 dark:bg-neutral-800">
                  {category || "Uncategorized"}
                </option>
              ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" aria-hidden="true" />
        </div>

        {/* View Toggle and Reset Filters */}
        <div className="flex gap-2">
          <button onClick={resetFilters} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" title="Reset filters" aria-label="Reset all filters">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
          </button>

          <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}>
            {viewMode === "grid" ? <List className="h-5 w-5" aria-hidden="true" /> : <LayoutGrid className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
