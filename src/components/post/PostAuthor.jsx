import { motion } from "framer-motion";
import { User, ExternalLink } from "lucide-react"; // Menggunakan Lucide React icons

/**
 * Komponen untuk menampilkan informasi penulis/penerjemah artikel
 * Didesain dengan pendekatan minimalis artistik dan elemen dekoratif
 */
export default function PostAuthor({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 
               dark:border-neutral-800 p-6 md:p-8 mb-10 relative"
    >
      {/* Elemen dekoratif di pojok kiri atas */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-300 dark:border-neutral-700"></div>

      {/* Elemen dekoratif di pojok kanan bawah */}
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-300 dark:border-neutral-700"></div>

      <div className="flex items-center mb-6 relative">
        {/* Garis dekoratif vertikal */}
        <div className="w-[3px] h-6 bg-gradient-to-b from-neutral-400 to-neutral-600 mr-3"></div>

        <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
          {/* Icon User dari Lucide React untuk menandakan profil penulis/penerjemah */}
          <User className="w-5 h-5 mr-2" />
          Translator
        </h2>

        {/* Garis dekoratif horizontal di bawah judul */}
        <div className="absolute -bottom-3 left-0 w-16 h-px bg-gradient-to-r from-neutral-400 to-transparent dark:from-neutral-600"></div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {post.author_image ? (
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex-shrink-0 
                        bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 
                        dark:border-neutral-700 relative"
          >
            {/* Elemen dekoratif di pojok kiri atas */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-neutral-400 dark:border-neutral-600 z-10"></div>

            {/* Elemen dekoratif di pojok kanan bawah */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-neutral-400 dark:border-neutral-600 z-10"></div>

            <img src={post.author_image} alt={post.author || post.author_name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br 
                        from-neutral-400 to-neutral-600 flex items-center justify-center 
                        border-2 border-neutral-200 dark:border-neutral-700 relative"
          >
            {/* Elemen dekoratif di pojok kiri atas */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-neutral-400/30 dark:border-neutral-600/30"></div>

            {/* Elemen dekoratif di pojok kanan bawah */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-neutral-400/30 dark:border-neutral-600/30"></div>

            <span className="text-2xl text-white font-medium">{(post.author || post.author_name || "A").charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="text-center sm:text-left">
          <h3 className="font-medium text-xl text-neutral-900 dark:text-neutral-100 mb-2">{post.author || post.author_name}</h3>

          {post.author_bio && <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl border-l border-neutral-300 dark:border-neutral-600 pl-3">{post.author_bio}</p>}

          {post.author_social_link && (
            <a
              href={post.author_social_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-neutral-600 hover:text-neutral-700 
                       dark:text-neutral-400 dark:hover:text-neutral-300 border border-neutral-300 
                       dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 
                       transition-colors duration-200 relative"
            >
              {/* Elemen dekoratif di pojok kiri atas */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-neutral-400 dark:border-neutral-500"></div>

              <span>Follow</span>

              {/* Icon ExternalLink dari Lucide React untuk link eksternal */}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
        </div>
      </div>

      {/* Garis dekoratif horizontal di bawah */}
      <div className="h-[1px] bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-700 w-3/4 mt-6 opacity-70"></div>
    </motion.div>
  );
}
