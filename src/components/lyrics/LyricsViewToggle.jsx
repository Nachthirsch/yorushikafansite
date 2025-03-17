/**
 * Komponen untuk menampilkan tombol-tombol pemilihan tampilan lirik
 * Didesain ulang dengan gaya minimalis artistik dan elemen dekoratif
 */
const LyricsViewToggle = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6 relative">
      {/* Elemen dekoratif tipis di bagian atas */}
      <div className="absolute -top-1 left-4 right-4 h-[1px] bg-neutral-300 dark:bg-neutral-600"></div>

      <div className="bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-700 relative">
        {/* Elemen dekoratif di sudut kiri atas */}
        <div className="absolute top-0 left-0 w-4 h-4">
          <div className="absolute top-0 left-0 w-2 h-[1px] bg-neutral-400 dark:bg-neutral-500"></div>
          <div className="absolute top-0 left-0 h-2 w-[1px] bg-neutral-400 dark:bg-neutral-500"></div>
        </div>

        {/* Elemen dekoratif di sudut kanan atas */}
        <div className="absolute top-0 right-0 w-4 h-4">
          <div className="absolute top-0 right-0 w-2 h-[1px] bg-neutral-400 dark:bg-neutral-500"></div>
          <div className="absolute top-0 right-0 h-2 w-[1px] bg-neutral-400 dark:bg-neutral-500"></div>
        </div>

        <div className="flex">
          <button
            onClick={() => setActiveTab("sideBySide")}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-all duration-200 relative
                      ${activeTab === "sideBySide" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            aria-pressed={activeTab === "sideBySide"}
            aria-label="Show lyrics side by side"
          >
            {activeTab === "sideBySide" && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-neutral-500 dark:bg-neutral-400"></div>}
            Side by Side
          </button>

          <div className="w-[1px] bg-neutral-200 dark:bg-neutral-700"></div>

          <button
            onClick={() => setActiveTab("original")}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-all duration-200 relative
                      ${activeTab === "original" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            aria-pressed={activeTab === "original"}
            aria-label="Show original lyrics only"
          >
            {activeTab === "original" && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-neutral-500 dark:bg-neutral-400"></div>}
            Original Only
          </button>

          <div className="w-[1px] bg-neutral-200 dark:bg-neutral-700"></div>

          <button
            onClick={() => setActiveTab("translation")}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-all duration-200 relative
                      ${activeTab === "translation" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            aria-pressed={activeTab === "translation"}
            aria-label="Show translation only"
          >
            {activeTab === "translation" && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-neutral-500 dark:bg-neutral-400"></div>}
            Translation Only
          </button>
        </div>
      </div>

      {/* Elemen dekoratif tipis di bagian bawah */}
      <div className="absolute -bottom-1 left-8 right-8 h-[1px] bg-neutral-300 dark:bg-neutral-600"></div>
    </div>
  );
};

export default LyricsViewToggle;
