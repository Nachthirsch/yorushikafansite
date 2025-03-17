import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Komponen untuk menampilkan indikator progres membaca artikel
 * Didesain dengan pendekatan minimalis artistik dan efek spark yang lebih dinamis
 * Termasuk efek trail dan pola dekoratif untuk meningkatkan daya tarik visual
 */
export default function ReadingProgress({ completion }) {
  // State untuk mengontrol animasi spark dan efek tambahan
  const [sparkVisible, setSparkVisible] = useState(false);
  const [sparkIntensity, setSparkIntensity] = useState(1);
  const [trailEffect, setTrailEffect] = useState(false);
  const [completionCelebration, setCompletionCelebration] = useState(false);
  const [prevCompletion, setPrevCompletion] = useState(0);

  // Efek untuk mendeteksi perubahan progres dan mengaktifkan animasi yang sesuai
  useEffect(() => {
    // Deteksi arah pergerakan progres (maju atau mundur)
    const isProgressing = completion > prevCompletion;
    setPrevCompletion(completion);

    // Aktifkan efek trail ketika progres maju lebih dari 5%
    if (isProgressing && completion - prevCompletion > 5) {
      setTrailEffect(true);
      setTimeout(() => setTrailEffect(false), 1200);
    }

    // Aktifkan spark ketika progress bergerak
    if (completion > 0) {
      setSparkVisible(true);

      // Atur intensitas spark berdasarkan progress dan buat lebih dinamis
      if (completion < 30) {
        setSparkIntensity(1);
      } else if (completion < 70) {
        setSparkIntensity(2);
      } else if (completion < 95) {
        setSparkIntensity(3);
      } else {
        setSparkIntensity(4); // Intensitas tertinggi mendekati selesai
      }
    }

    // Jika mencapai 100%, aktifkan efek perayaan
    if (completion >= 100 && prevCompletion < 100) {
      setCompletionCelebration(true);
      setTimeout(() => setCompletionCelebration(false), 3000);
    }

    // Matikan spark jika tidak ada pergerakan dalam beberapa waktu, kecuali di 100%
    const timer = setTimeout(() => {
      if (completion < 100) {
        setSparkVisible(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [completion, prevCompletion]);

  // Tambahan class untuk ukuran spark berdasarkan intensitas
  const sparkSizeClass = sparkIntensity === 1 ? "w-2 h-2" : sparkIntensity === 2 ? "w-2.5 h-2.5" : sparkIntensity === 3 ? "w-3 h-3" : "w-3.5 h-3.5";

  // Warna spark yang berubah berdasarkan progress
  const sparkColorClass = sparkIntensity === 1 ? "bg-neutral-300 dark:bg-neutral-300" : sparkIntensity === 2 ? "bg-neutral-200 dark:bg-neutral-200" : sparkIntensity === 3 ? "bg-white dark:bg-white" : "bg-white dark:bg-white";

  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="fixed top-0 left-0 z-50 w-full">
      {/* Pola dekoratif di atas progress bar */}
      <div className="h-[1px] w-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-between px-4">
          {Array(30)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className={`h-[1px] bg-neutral-300 dark:bg-neutral-600 
                        ${i % 3 === 0 ? "w-6" : "w-2"} opacity-50`}
              ></div>
            ))}
        </div>
      </div>

      {/* Container progress bar dengan latar belakang */}
      <div className="h-1 bg-neutral-200 dark:bg-neutral-800 w-full relative overflow-hidden">
        {/* Pola latar belakang untuk progress bar */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array(50)
            .fill()
            .map((_, i) => (
              <div key={i} className="absolute h-4 w-[1px] bg-neutral-400 dark:bg-neutral-500 opacity-30 transform -rotate-45" style={{ left: `${i * 10}px`, top: "-4px" }}></div>
            ))}
        </div>

        {/* Actual progress bar dengan desain gradient yang ditingkatkan */}
        <div className="relative w-full h-full">
          {/* Trail effect ketika scrolling cepat */}
          {trailEffect && <motion.div initial={{ opacity: 0.7, width: `${completion - 5}%` }} animate={{ opacity: 0, width: `${completion}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute top-0 bottom-0 left-0 bg-neutral-400 dark:bg-neutral-500" style={{ zIndex: 1 }} />}

          {/* Progress bar dengan gradient yang lebih menarik */}
          <motion.div
            className={`h-full bg-gradient-to-r from-neutral-500 via-neutral-600 to-neutral-800 
                      dark:from-neutral-400 dark:via-neutral-500 dark:to-neutral-600
                      ${completion >= 100 ? "relative overflow-hidden" : ""}`}
            style={{ width: `${completion}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.3 }}
          >
            {/* Achievement effect saat mencapai 100% */}
            {completion >= 100 && (
              <>
                {/* Pola bergerak pada progress bar 100% */}
                <motion.div className="absolute inset-0 overflow-hidden" animate={{ x: ["-100%", "0%"] }} transition={{ duration: 0.8, ease: "easeOut" }}>
                  {Array(10)
                    .fill()
                    .map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-4 w-[2px] bg-white/20 dark:bg-white/10"
                        style={{
                          left: `${i * 20}%`,
                          top: "-2px",
                          transform: "rotate(45deg)",
                        }}
                      ></motion.div>
                    ))}
                </motion.div>

                {/* Pulsa perayaan */}
                {completionCelebration && <motion.div className="absolute inset-0 bg-white dark:bg-white" initial={{ opacity: 0.7 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }} />}
              </>
            )}
          </motion.div>

          {/* Spark effect yang ditingkatkan di ujung progress bar */}
          {sparkVisible && (
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2"
              style={{ left: `${completion}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: completion >= 100 ? [1, 1] : [0.7, 1, 0.7],
                scale: completion >= 100 ? [1, 1] : [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {/* Inner spark dengan animasi pulse */}
              <div className={`relative ${sparkSizeClass}`}>
                {/* Lingkaran tengah spark */}
                <div className={`absolute inset-0 ${sparkColorClass} rounded-full`}></div>

                {/* Outer glow effect untuk spark */}
                <motion.div
                  className={`absolute -inset-1 ${sparkColorClass} rounded-full opacity-30`}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                ></motion.div>

                {/* Particles effect dengan variasi berdasarkan intensitas */}
                {sparkIntensity >= 2 &&
                  Array(sparkIntensity + 1)
                    .fill()
                    .map((_, index) => (
                      <motion.div
                        key={index}
                        className={`absolute w-1 h-1 ${index % 2 === 0 ? "w-1 h-1" : "w-0.5 h-0.5"} ${sparkColorClass} rounded-full`}
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 0.7,
                        }}
                        animate={{
                          x: [0, (index % 3 === 0 ? 1 : -1) * (3 + index * 2)],
                          y: index % 4 === 0 ? -4 : index % 4 === 1 ? 4 : index % 4 === 2 ? -2 : 2,
                          opacity: [0.7, 0],
                        }}
                        transition={{
                          duration: 0.8 + index * 0.1,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: index * 0.1,
                        }}
                      ></motion.div>
                    ))}

                {/* Efek trail untuk spark yang lebih dinamis */}
                {sparkIntensity >= 3 && (
                  <motion.div
                    className="absolute top-1/2 right-1/2 h-[1px] bg-white dark:bg-white"
                    initial={{ width: 0, opacity: 0.6 }}
                    animate={{
                      width: [0, 8, 0],
                      opacity: [0.6, 0, 0.6],
                      x: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Garis tipis dekoratif di bawah progress bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent opacity-30"></div>

      {/* Indikator pencapaian di pojok kanan saat 100% */}
      {completion >= 100 && (
        <div className="absolute top-2 right-3 pointer-events-none">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-0.5 border border-neutral-300 dark:border-neutral-600">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-neutral-400 dark:border-neutral-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neutral-400 dark:border-neutral-500"></div>
            <span>Completed</span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
