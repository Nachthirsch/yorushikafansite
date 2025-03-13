import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, ListIcon } from "lucide-react";

export default function ContentOutline({ post, contentPage, sectionsPerPage, navigateToContentPage }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionIDs, setSectionIDs] = useState({});

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
    console.log("Peta ID bagian:", idMap);
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800 mb-8">
      {/* Header daftar konten dengan tombol toggle */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={toggleExpand} aria-expanded={isExpanded}>
        <div className="flex items-center space-x-2">
          {/* Icon Daftar Isi menandakan bahwa ini adalah menu navigasi konten */}
          <ListIcon size={18} className="text-neutral-700 dark:text-neutral-300" />
          <h3 className="font-medium text-neutral-800 dark:text-neutral-200">Daftar Isi</h3>
        </div>
        <button className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" aria-label={isExpanded ? "Tutup daftar isi" : "Buka daftar isi"}>
          {/* Icon chevron untuk menandakan kondisi expand/collapse */}
          {isExpanded ? <ChevronUpIcon size={18} className="text-neutral-600 dark:text-neutral-400" /> : <ChevronDownIcon size={18} className="text-neutral-600 dark:text-neutral-400" />}
        </button>
      </div>

      {/* Daftar konten - hanya ditampilkan saat expanded */}
      {isExpanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-4">
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2">
            <ul className="space-y-1 mt-2">
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
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between
                        ${isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
                      aria-current={isActive ? "location" : undefined}
                      data-section-index={originalIndex}
                      data-section-title={section.title}
                      data-section-page={sectionPage}
                    >
                      <span className="line-clamp-1">{section.title}</span>
                      {contentPage !== sectionPage && <span className="text-xs bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">Hal {sectionPage}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
