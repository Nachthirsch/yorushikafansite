import { motion } from "framer-motion";
import { Play, Music, ChevronRight, Disc } from "lucide-react";

export default function AlbumCard({ album, isGridView, onClick, onHover }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onHoverStart={() => onHover(album.id)} onHoverEnd={() => onHover(null)}>
      {/* Wrapper utama kartu album dengan dua mode tampilan: grid dan list */}
      <div className={`group cursor-pointer ${isGridView ? "block bg-white/80 dark:bg-neutral-900/90 rounded-lg overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_-4px_rgba(255,255,255,0.03)] transition-all duration-500" : "flex items-center gap-5 bg-white/90 dark:bg-neutral-900/90 p-4 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all duration-300"}`} onClick={onClick}>
        {/* Container untuk gambar album dengan efek hover */}
        <div className={`relative ${isGridView ? "aspect-square overflow-hidden" : "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden rounded-lg"}`}>
          {/* Overlay gradient di bagian atas gambar untuk memberikan kedalaman */}
          {isGridView && <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/30 to-transparent z-10 opacity-50"></div>}

          {/* Gambar album dengan animasi hover */}
          <motion.img src={album.cover_image_url} alt={album.title} className={`w-full h-full object-cover ${isGridView ? "" : "rounded-lg"}`} loading="lazy" whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} />

          {/* Overlay play button dengan gradient yang memperkaya kedalaman visual */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-400 ease-out`}>
            <motion.div className="bg-white/90 dark:bg-neutral-800/90 p-2 rounded-full backdrop-blur-sm border border-white/30 dark:border-neutral-700/50 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
              <Play className="w-5 h-5 text-neutral-800 dark:text-white" />
            </motion.div>
          </div>
        </div>

        {/* Konten informasi album */}
        <div className={`${isGridView ? "p-4 pb-5" : "ml-3 flex-1"}`}>
          <div className="flex flex-col">
            {/* Judul album dengan animasi hover */}
            <h2 className="text-base font-medium tracking-tight text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{album.title}</h2>

            {/* Detail album: tahun rilis dan jumlah lagu */}
            <div className="flex items-center mt-1.5 space-x-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-light">{new Date(album.release_date).getFullYear()}</span>
              <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-light flex items-center">
                <Disc className="h-3 w-3 mr-0.5 opacity-80" />
                {album.songs?.length || 0}
              </span>
            </div>
          </div>

          {/* Footer untuk tampilan grid dengan border halus untuk memisahkan konten */}
          {isGridView && (
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/70 flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500 font-light">Detail</span>
              <motion.div className="h-5 w-5 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors" whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.02)" }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <ChevronRight className="h-3 w-3 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" />
              </motion.div>
            </div>
          )}

          {/* Label "View" untuk tampilan list */}
          {!isGridView && (
            <div className="mt-1 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-light bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700/80">View</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
