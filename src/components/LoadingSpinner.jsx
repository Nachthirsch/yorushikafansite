import { motion } from "framer-motion";
import yorushikaLogo from "../assets/yorushika.svg";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <div className="relative">
        {/* Outer circle with gradient */}
        <motion.div className="h-16 w-16 rounded-full border-4 border-neutral-200 dark:border-neutral-800" style={{ borderTopColor: "#818cf8", borderRightColor: "#c4b5fd" }} animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />

        {/* Inner spinner with Yorushika logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.img
            src={yorushikaLogo}
            alt="Yorushika"
            className="h-8 w-8 dark:invert"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
      <motion.div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
        Loading...
      </motion.div>
    </div>
  );
}
