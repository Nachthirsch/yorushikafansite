import { motion } from "framer-motion";
import { Info } from "lucide-react"; // Menggunakan Lucide React icons

/**
 * Komponen untuk menampilkan catatan kaki (footnotes) dari lagu
 * Didesain dengan pendekatan minimalis artistik dan elemen dekoratif
 * Biasanya berisi referensi, penjelasan tambahan, atau konteks historis
 * @param {Object} props
 * @param {string} props.footnotes - Teks catatan kaki yang akan ditampilkan
 */
const SongFootnotes = ({ footnotes }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 relative">
      {/* Elemen dekoratif di pojok kiri atas */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-400 dark:border-neutral-500"></div>

      {/* Elemen dekoratif di pojok kanan bawah */}
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500"></div>

      {/* Header section dengan elemen dekoratif dan icon informasi */}
      <div className="flex items-center mb-6 relative">
        {/* Garis dekoratif horizontal di bawah judul */}
        <div className="absolute -bottom-3 left-0 w-16 h-px bg-gradient-to-r from-neutral-400 to-transparent"></div>

        <div className="flex items-center">
          <div className="w-[3px] h-6 bg-gradient-to-b from-neutral-400 to-neutral-600 mr-3"></div>
          <h2 className="text-xl font-medium tracking-wide text-neutral-900 dark:text-neutral-100 flex items-center">
            {/* Icon Info dari Lucide React untuk judul catatan kaki */}
            <Info className="w-5 h-5 mr-2" />
            Notes & References
          </h2>
        </div>
      </div>

      {/* Konten footnotes dengan styling yang ditingkatkan */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-5">
        {footnotes ? (
          <div className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">
            {/* Pembagian paragraf untuk tampilan yang lebih baik */}
            <div className="space-y-4">
              {footnotes.split("\n\n").map((paragraph, i) => (
                <p key={i} className={i === 0 ? "text-sm border-l-2 border-neutral-300 dark:border-neutral-600 pl-4" : "text-sm"}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 italic text-neutral-500 dark:text-neutral-400 border-t border-b border-dashed border-neutral-200 dark:border-neutral-700">No additional notes available for this song.</div>
        )}
      </div>
    </motion.div>
  );
};

export default SongFootnotes;
