/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <motion.div className="h-12 w-12 rounded-full border-4 border-gray-200" style={{ borderTopColor: "#d97706" }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
    </div>
  );
}
