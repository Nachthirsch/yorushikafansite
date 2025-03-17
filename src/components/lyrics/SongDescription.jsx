import { motion } from "framer-motion";
import { Clock, Music } from "lucide-react"; // Menggunakan Lucide React icons sesuai instruksi

/**
 * Komponen untuk menampilkan deskripsi lagu dan metadata tambahan
 * Desain dibuat lebih artistik dengan border tipis, elemen dekoratif, dan sudut kotak
 */
const SongDescription = ({ song }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-8 relative">
      {/* Elemen dekoratif di pojok kiri atas */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-400 dark:border-neutral-500"></div>

      {/* Elemen dekoratif di pojok kanan bawah */}
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500"></div>

      <div className="flex items-center justify-between mb-6 relative">
        {/* Garis dekoratif horizontal di bawah judul */}
        <div className="absolute -bottom-3 left-0 w-16 h-px bg-gradient-to-r from-neutral-400 to-transparent"></div>

        <div className="flex items-center">
          <div className="w-[3px] h-6 bg-gradient-to-b from-neutral-400 to-neutral-600 mr-3"></div>
          <h2 className="text-xl font-medium tracking-wide text-neutral-900 dark:text-neutral-100">About This Song</h2>
        </div>

        {song.albums?.title && <span className="text-sm text-neutral-500 dark:text-neutral-400 italic">From album: {song.albums.title}</span>}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-5">
        <div className="space-y-4">
          <div className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">{song.description}</div>

          {song.duration && (
            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mt-6 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700">
              <Clock className="w-4 h-4 mr-2" /> {/* Icon dari Lucide React */}
              <span>
                Duration: {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
              </span>
              {song.track_number && (
                <>
                  <span className="mx-2 text-neutral-400">|</span>
                  <Music className="w-4 h-4 mr-2" /> {/* Icon dari Lucide React */}
                  <span>Track {song.track_number}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SongDescription;
