import { motion } from "framer-motion";

export default function ReadingProgress({ completion }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="fixed top-0 left-0 z-50 w-full h-1 bg-neutral-200 dark:bg-neutral-800">
      <motion.div
        className="h-full bg-gradient-to-r from-neutral-500 via-neutral-600 to-neutral-800 
          dark:from-neutral-400 dark:via-neutral-500 dark:to-neutral-600"
        style={{ width: `${completion}%` }}
        initial={{ width: "0%" }}
        animate={{ width: `${completion}%` }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
