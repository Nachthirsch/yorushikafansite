/**
 * Komponen untuk menampilkan tombol-tombol pemilihan tampilan lirik
 * Memungkinkan pengguna untuk beralih antara tampilan side-by-side, original saja, atau terjemahan saja
 */
const LyricsViewToggle = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700">
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab("sideBySide")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                       ${activeTab === "sideBySide" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            aria-pressed={activeTab === "sideBySide"}
            aria-label="Show lyrics side by side"
          >
            Side by Side
          </button>
          <button
            onClick={() => setActiveTab("original")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                       ${activeTab === "original" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            aria-pressed={activeTab === "original"}
            aria-label="Show original lyrics only"
          >
            Original Only
          </button>
          <button
            onClick={() => setActiveTab("translation")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                       ${activeTab === "translation" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            aria-pressed={activeTab === "translation"}
            aria-label="Show translation only"
          >
            Translation Only
          </button>
        </div>
      </div>
    </div>
  );
};

export default LyricsViewToggle;
