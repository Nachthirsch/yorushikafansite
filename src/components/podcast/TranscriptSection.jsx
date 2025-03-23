import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useEpisodeTranscript } from "../../hooks/usePodcasts";
import { FileText, Loader, Search, Copy, CheckCheck, AlertCircle, BookOpen } from "lucide-react";

/**
 * Komponen untuk menampilkan transkrip podcast
 * Menyediakan tampilan yang elegan untuk transkrip dengan fitur pencarian dan salin
 *
 * @param {string} episodeId - ID episode podcast
 * @param {string} episodeTitle - Judul episode untuk aksesbilitas
 */
export default function TranscriptSection({ episodeId, episodeTitle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);
  const transcriptRef = useRef(null);

  // Mengambil data transkrip menggunakan custom hook
  const { data: transcript, isLoading, isError } = useEpisodeTranscript(episodeId);

  // Handler untuk menyalin transkrip
  const handleCopyTranscript = () => {
    if (!transcript?.content) return;

    navigator.clipboard
      .writeText(transcript.content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin transkrip:", err);
      });
  };

  // Format transkrip dengan highlight untuk hasil pencarian
  const formatTranscriptWithHighlight = () => {
    if (!transcript?.content) return [];

    // Pisahkan transkrip menjadi baris-baris
    return transcript.content.split("\n").map((line, index) => {
      // Jika tidak ada query pencarian, tampilkan normal
      if (!searchQuery) return { line, isHighlighted: false };

      // Periksa apakah baris ini cocok dengan query pencarian (case insensitive)
      const isHighlighted = line.toLowerCase().includes(searchQuery.toLowerCase());
      return { line, isHighlighted };
    });
  };

  // Transkrip dengan highlight
  const formattedTranscript = formatTranscriptWithHighlight();

  // Deteksi baris dengan timestamp dan ekstrak formatnya
  const parseTimestamp = (line) => {
    // Format timestamp umum: [00:00] atau [00:00:00]
    const timestampMatch = line.match(/\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/);

    if (timestampMatch) {
      const minutes = parseInt(timestampMatch[1]);
      const seconds = parseInt(timestampMatch[2]);
      const totalSeconds = minutes * 60 + seconds;

      return {
        hasTimestamp: true,
        timestamp: timestampMatch[0],
        seconds: totalSeconds,
      };
    }

    return { hasTimestamp: false };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          {/* FileText icon representing transcript document */}
          <FileText className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Transkrip Episode</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          {/* Loader icon showing loading state */}
          <Loader className="w-8 h-8 text-neutral-400 dark:text-neutral-500 animate-spin mb-4" aria-hidden="true" />
          <p className="text-neutral-600 dark:text-neutral-400">Memuat transkrip...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          {/* FileText icon representing transcript document */}
          <FileText className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Transkrip Episode</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          {/* AlertCircle icon indicating error state */}
          <AlertCircle className="w-10 h-10 text-neutral-400 dark:text-neutral-500 mb-3" aria-hidden="true" />
          <p className="text-neutral-800 dark:text-neutral-200 font-medium mb-1">Gagal memuat transkrip</p>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md">Terjadi kesalahan saat mengambil data transkrip. Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!transcript?.content || transcript.content.trim() === "") {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          {/* FileText icon representing transcript document */}
          <FileText className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Transkrip Episode</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          {/* BookOpen icon indicating reading/text content */}
          <BookOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mb-3" aria-hidden="true" />
          <p className="text-neutral-800 dark:text-neutral-200 font-medium mb-1">Transkrip belum tersedia</p>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md">Transkrip untuk episode ini sedang dalam proses. Silakan kembali lagi nanti.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Header section with title and tools */}
      <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* FileText icon representing transcript document */}
            <FileText className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Transkrip Episode</h2>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopyTranscript}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 
                      hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            aria-label="Salin transkrip"
          >
            {isCopied ? (
              <>
                {/* CheckCheck icon indicating successful copy */}
                <CheckCheck className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                <span className="text-green-600 dark:text-green-400">Tersalin</span>
              </>
            ) : (
              <>
                {/* Copy icon for copy to clipboard action */}
                <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                <span className="text-neutral-700 dark:text-neutral-300">Salin Transkrip</span>
              </>
            )}
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Search icon indicating search functionality */}
            <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 
                      rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-neutral-300
                      dark:focus:ring-neutral-600 focus:border-neutral-300 dark:focus:border-neutral-600
                      text-neutral-900 dark:text-neutral-100 text-sm transition-colors"
            placeholder="Cari dalam transkrip..."
            aria-label="Cari dalam transkrip"
          />
        </div>
      </div>

      {/* Transcript content */}
      <div
        ref={transcriptRef}
        className="p-4 sm:p-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 
                  dark:scrollbar-thumb-neutral-700 scrollbar-track-neutral-100 dark:scrollbar-track-neutral-800"
        aria-label={`Transkrip untuk episode ${episodeTitle}`}
      >
        <div className="space-y-2">
          {formattedTranscript.map((item, index) => {
            const { hasTimestamp, timestamp, seconds } = parseTimestamp(item.line);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: 1,
                  backgroundColor: item.isHighlighted ? "rgba(250, 204, 21, 0.1)" : "transparent",
                }}
                transition={{ duration: 0.3 }}
                className={`py-1 px-2 -mx-2 rounded ${selectedTimestamp === index ? "bg-blue-50 dark:bg-blue-900/20" : ""} ${item.isHighlighted ? "rounded-md" : ""}`}
              >
                <p className="text-neutral-800 dark:text-neutral-300 text-sm leading-relaxed">
                  {hasTimestamp && (
                    <button className={`inline-block mr-2 px-1.5 py-0.5 text-xs font-mono rounded ${selectedTimestamp === index ? "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`} onClick={() => setSelectedTimestamp(selectedTimestamp === index ? null : index)}>
                      {timestamp}
                    </button>
                  )}
                  <span>{item.line.replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]\s*/, "")}</span>
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="h-1 bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 
                    dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 opacity-70"
      ></div>
    </div>
  );
}
