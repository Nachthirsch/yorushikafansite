import { motion } from "framer-motion";

export default function PostAuthor({ post }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 mb-10">
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
        <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Translator</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {post.author_image ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700">
            <img src={post.author_image} alt={post.author || post.author_name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-full flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
            <span className="text-2xl text-white font-medium">{(post.author || post.author_name || "A").charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="text-center sm:text-left">
          <h3 className="font-medium text-xl text-neutral-900 dark:text-neutral-100 mb-2">{post.author || post.author_name}</h3>
          {post.author_bio && <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">{post.author_bio}</p>}
          {post.author_social_link && (
            <a href={post.author_social_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200">
              <span>Follow</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
