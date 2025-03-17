import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react"; // Menggunakan Lucide React icons

/**
 * Komponen untuk menampilkan daftar isi artikel blog
 * Didesain dengan pendekatan minimalis artistik dan elemen dekoratif
 */
export default function ContentOutline({ post, contentPage, sectionsPerPage, navigateToContentPage }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionIDs, setSectionIDs] = useState({});
  const [hasOverflow, setHasOverflow] = useState(false);
  const listRef = useRef(null);

  /// Efek untuk membangun peta ID dari judul bagian
  useEffect(() => {
    if (!post?.content || !Array.isArray(post.content)) return;

    // Membuat peta ID untuk setiap judul bagian
    const idMap = {};
    post.content.forEach((section, idx) => {
      if (section.title) {
        // Membuat ID sederhana berdasarkan indeks untuk menghindari masalah karakter khusus
        idMap[section.title] = `section-${idx}`;
      }
    });

    setSectionIDs(idMap);
  }, [post]);

  /// Efek untuk melacak bagian konten yang sedang aktif berdasarkan posisi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!post?.content || !Array.isArray(post.content)) return;

      // Temukan semua elemen judul bagian
      const sectionTitles = document.querySelectorAll("[data-section-index]");
      if (sectionTitles.length === 0) return;

      // Hitung posisi setiap bagian dan temukan yang paling dekat dengan posisi scroll
      let closestSection = 0;
      let closestDistance = Infinity;

      sectionTitles.forEach((title, index) => {
        const distance = Math.abs(title.getBoundingClientRect().top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = index;
        }
      });

      setActiveSection(closestSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post, sectionIDs]);

  /// Efek untuk mendeteksi apakah daftar konten memiliki overflow
  useEffect(() => {
    if (isExpanded && listRef.current) {
      const hasVerticalOverflow = listRef.current.scrollHeight > listRef.current.clientHeight;
      setHasOverflow(hasVerticalOverflow);
    }
  }, [isExpanded, post]);

  /// Toggle tampilan daftar konten
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  /// Fungsi untuk menangani navigasi ke bagian tertentu berdasarkan indeks
  const scrollToSection = (sectionIndex) => {
    console.log("Mencoba melompat ke bagian dengan indeks:", sectionIndex);

    // Tutup daftar isi setelah mengklik item
    setIsExpanded(false);

    // Hitung halaman konten yang berisi bagian ini
    const targetPage = Math.floor(sectionIndex / sectionsPerPage) + 1;
    console.log("Halaman target:", targetPage, "Halaman saat ini:", contentPage);

    // Jika kita sudah berada di halaman konten yang benar
    if (targetPage === contentPage) {
      // Cari elemen berdasarkan atribut data-section-index
      const selector = `[data-section-index="${sectionIndex}"]`;
      const element = document.querySelector(selector);

      console.log("Mencari elemen dengan selector:", selector);
      console.log("Elemen ditemukan:", element);

      if (element) {
        // Gunakan setTimeout untuk memastikan DOM sudah selesai diperbarui
        setTimeout(() => {
          console.log("Scroll langsung ke elemen");
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        console.error("Elemen tidak ditemukan untuk indeks:", sectionIndex);
      }
    } else {
      // Jika tidak, navigasi ke halaman yang benar terlebih dahulu
      console.log("Navigasi ke halaman baru terlebih dahulu:", targetPage);
      navigateToContentPage(targetPage);

      // Setelah navigasi, tunggu sebentar kemudian scroll ke bagian
      setTimeout(() => {
        const selector = `[data-section-index="${sectionIndex}"]`;
        const element = document.querySelector(selector);

        if (element) {
          console.log("Scroll ke elemen setelah ganti halaman");
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          console.error("Elemen tidak ditemukan setelah ganti halaman untuk indeks:", sectionIndex);

          // Fallback: coba scroll ke elemen pertama di halaman baru
          const firstHeading = document.querySelector(".post-content h3");
          if (firstHeading) firstHeading.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 800);
    }
  };

  // Jika tidak ada konten atau konten bukan array, jangan tampilkan komponen
  if (!post?.content || !Array.isArray(post.content) || post.content.length === 0) {
    return null;
  }

  // Filter konten untuk mendapatkan hanya bagian dengan judul
  const sectionsWithTitles = post.content.filter((block) => block.title);

  // Jika tidak ada bagian dengan judul, jangan tampilkan komponen
  if (sectionsWithTitles.length === 0) {
    return null;
  }

  /// Menghitung tinggi maksimum untuk daftar konten berdasarkan jumlah item
  const getMaxHeight = () => {
    // Asumsi tinggi per item sekitar 44px (py-2 + text + padding)
    const itemCount = sectionsWithTitles.length;
    // Gunakan tinggi otomatis untuk 5 item pertama, lalu batasi jika lebih banyak
    const baseHeight = Math.min(itemCount, 5) * 44;
    // Jika banyaknya item lebih dari 5, tambahkan ruang untuk scrollbar
    return itemCount > 5 ? `${baseHeight}px` : "auto";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 
               dark:border-neutral-800 mb-8 relative"
    >
      {/* Elemen dekoratif di pojok kiri atas */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neutral-300 dark:border-neutral-700"></div>

      {/* Elemen dekoratif di pojok kanan bawah */}
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neutral-300 dark:border-neutral-700"></div>

      {/* Header daftar konten dengan tombol toggle */}
      <div className="flex items-center justify-between p-4 cursor-pointer relative" onClick={toggleExpand} aria-expanded={isExpanded}>
        <div className="flex items-center space-x-2">
          {/* Icon List dari Lucide React untuk menandakan daftar isi */}
          <List size={18} className="text-neutral-700 dark:text-neutral-300" />
          <h3 className="font-medium text-neutral-800 dark:text-neutral-200">Table of Content</h3>
        </div>
        <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700" aria-label={isExpanded ? "Tutup daftar isi" : "Buka daftar isi"}>
          {/* Icon Chevron dari Lucide React untuk menandakan expand/collapse */}
          {isExpanded ? <ChevronUp size={18} className="text-neutral-600 dark:text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-600 dark:text-neutral-400" />}
        </button>
      </div>

      {/* Daftar konten - hanya ditampilkan saat expanded */}
      {isExpanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-4 relative">
          {/* Elemen dekoratif garis di atas konten */}
          <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-2">
            {/* Container dengan scroll untuk daftar konten */}
            <div ref={listRef} className="space-y-1 mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent pr-1" style={{ maxHeight: getMaxHeight() }}>
              <ul className="space-y-1">
                {sectionsWithTitles.map((section, index) => {
                  const originalIndex = post.content.indexOf(section);

                  // Menentukan apakah bagian ini aktif
                  const isActive = index === activeSection;

                  // Menentukan halaman tempat bagian ini berada
                  const sectionPage = Math.floor(originalIndex / sectionsPerPage) + 1;

                  return (
                    <li key={originalIndex}>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Mencegah perilaku default
                          e.stopPropagation(); // Mencegah bubbling event
                          scrollToSection(originalIndex);
                        }}
                        className={`w-full text-left px-3 py-2 transition-colors flex items-center 
                                  justify-between relative
                                  ${isActive ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium border-l-2 border-neutral-400 dark:border-neutral-500" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 border-l border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"}`}
                        aria-current={isActive ? "location" : undefined}
                        data-section-index={originalIndex}
                        data-section-title={section.title}
                        data-section-page={sectionPage}
                      >
                        <span className="line-clamp-1">{section.title}</span>
                        {contentPage !== sectionPage && <span className="text-xs bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 ml-2 flex-shrink-0 border-l border-neutral-300 dark:border-neutral-600">Page {sectionPage}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Indikator scroll jika daftar memiliki overflow */}
            {hasOverflow && (
              <div className="flex justify-center mt-2">
                <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent"></div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
