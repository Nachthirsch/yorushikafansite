import { motion } from "framer-motion";
import { Search, GridIcon, LayoutList, ChevronDown } from "lucide-react";

export default function SongsControl({ searchTerm, setSearchTerm, sortBy, setSortBy, albumFilter, setAlbumFilter, isGridView, setIsGridView, albums }) {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8 items-start md:items-center relative bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-4 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
        {/* Search Input with improved feedback */}
        <div className="relative w-full md:w-96">
          <input type="text" placeholder="Search songs..." value={searchTerm} onChange={handleSearchChange} className="w-full py-2 pl-4 pr-10 border-b border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors" />
          <Search className="absolute right-3 top-3 w-5 h-5 text-neutral-400" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort Selection */}
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
              <option value="title" className="bg-neutral-50 dark:bg-neutral-800">
                Alphabetical
              </option>
              <option value="duration" className="bg-neutral-50 dark:bg-neutral-800">
                Duration
              </option>
              <option value="album" className="bg-neutral-50 dark:bg-neutral-800">
                Album
              </option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
          </div>

          {/* Album Filter */}
          <div className="relative">
            <select value={albumFilter} onChange={(e) => setAlbumFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors cursor-pointer">
              <option value="all" className="bg-neutral-50 dark:bg-neutral-800">
                All Albums
              </option>
              {albums?.map((album) => (
                <option key={album.id} value={album.id} className="bg-neutral-50 dark:bg-neutral-800">
                  {album.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-neutral-400" />
          </div>

          {/* View Toggle */}
          <button onClick={() => setIsGridView(!isGridView)} className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none transition-colors hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30" aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}>
            {isGridView ? <LayoutList className="h-5 w-5" /> : <GridIcon className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
