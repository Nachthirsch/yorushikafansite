import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function AlbumControls({ searchTerm, setSearchTerm, sortBy, setSortBy, yearFilter, setYearFilter, isGridView, setIsGridView, years }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8 items-start md:items-center relative bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-4 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
        <div className="relative w-full md:w-96">
          <input type="text" placeholder="Search albums..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-10 border-b border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors" />
          <svg className="absolute right-3 top-3 w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
              <option value="newest" className="bg-neutral-50 dark:bg-neutral-800">
                Newest First
              </option>
              <option value="oldest" className="bg-neutral-50 dark:bg-neutral-800">
                Oldest First
              </option>
              <option value="tracks" className="bg-neutral-50 dark:bg-neutral-800">
                Most Tracks
              </option>
              <option value="title" className="bg-neutral-50 dark:bg-neutral-800">
                Alphabetical
              </option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
          </div>

          <div className="relative">
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
              <option value="all" className="bg-neutral-50 dark:bg-neutral-800">
                All Years
              </option>
              {years.map((year) => (
                <option key={year} value={year} className="bg-neutral-50 dark:bg-neutral-800">
                  {year}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
          </div>

          <button onClick={() => setIsGridView(!isGridView)} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}>
            {isGridView ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
