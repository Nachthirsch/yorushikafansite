import { motion } from "framer-motion";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

/**
 * Komponen untuk menampilkan catatan kaki (footnotes) dari lagu
 * Biasanya berisi referensi, penjelasan tambahan, atau konteks historis
 * @param {Object} props
 * @param {string} props.footnotes - Teks catatan kaki yang akan ditampilkan
 */
const SongFootnotes = ({ footnotes }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
      {/* Header section dengan icon informasi */}
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-500 rounded mr-3"></div>
        <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
          <InformationCircleIcon className="w-5 h-5 mr-2" />
          Notes & References
        </h2>
      </div>

      {/* Konten footnotes dengan styling yang cocok */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="whitespace-pre-line text-neutral-800 dark:text-neutral-200">{footnotes}</div>
      </div>
    </motion.div>
  );
};

export default SongFootnotes;
