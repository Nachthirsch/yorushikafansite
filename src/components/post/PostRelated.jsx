import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, CalendarIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/dateFormat";
import SecureImage from "../SecureImage";

export default function PostRelated({ relatedPosts, currentPage, totalPages, handlePrevPage, handleNextPage, isLoading, relatedPostsRef }) {
  return (
    <motion.div ref={relatedPostsRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-neutral-500 rounded mr-3"></div>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Read More</h2>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Previous page" className={`p-2 rounded-full ${currentPage === 1 ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-neutral-600 dark:text-neutral-400">
              {currentPage} / {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Next page" className={`p-2 rounded-full ${currentPage === totalPages ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="small" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost, index) => (
            <motion.div key={relatedPost.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}>
              <Link
                to={`/news/${relatedPost.id}`}
                className="group block h-full rounded-xl bg-white dark:bg-neutral-800 shadow-sm 
                  border border-neutral-200 dark:border-neutral-700 hover:shadow-md 
                  transition-all duration-300 overflow-hidden"
              >
                <div
                  className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-neutral-100 
                  dark:bg-neutral-700 overflow-hidden"
                >
                  {relatedPost.cover_image ? (
                    <img src={relatedPost.cover_image} alt={relatedPost.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-neutral-200 dark:bg-neutral-700">
                      <BookOpenIcon className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3
                    className="font-medium text-lg text-neutral-900 dark:text-neutral-100 
                    group-hover:text-neutral-600 dark:group-hover:text-neutral-400 
                    transition-colors line-clamp-2"
                  >
                    {relatedPost.title}
                  </h3>
                  <div className="flex items-center mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <CalendarIcon className="w-4 h-4 mr-1.5" />
                    {formatDate(relatedPost.publish_date)}
                  </div>
                  {relatedPost.category && (
                    <div className="mt-3">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">{relatedPost.category}</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Hidden preload component for related post images */}
      <div className="hidden">{relatedPosts.map((relatedPost, index) => relatedPost.cover_image && <SecureImage key={`preload-related-${index}`} src={relatedPost.cover_image} preload={true} />)}</div>
    </motion.div>
  );
}
