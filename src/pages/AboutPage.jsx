/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineExternalLink } from "react-icons/hi";
import yorushikaLogo from "../assets/yorushika.png";
import { IoLeafOutline } from "react-icons/io5";
import { BsMusicNoteBeamed, BsMoonStarsFill } from "react-icons/bs";
import yorushikaLogo2 from "../assets/yorushika.svg";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [currentPage, setCurrentPage] = useState(1);
  const contributorsPerPage = 8;
  const tableRef = useRef(null);
  const isInView = useInView(tableRef, { once: true, amount: 0.2 });

  // Add contributors data
  const contributors = [
    { name: "anko", contribution: "Translations", contact: "-" },
    { name: "ansair", contribution: "Translations", contact: "https://twitter.com/ansair_" },
    { name: "Arnar", contribution: "Yorushika Song lists arranged by album/track number, with title translations.", contact: "Discord: @arnar_" },
    { name: "atsu", contribution: "Translations", contact: "-" },
    { name: "blong", contribution: "List of Keys for Yorushika Songs", contact: "-" },
    { name: "CapC0", contribution: "Translations, Tousaku Novel Translation/Source", contact: "https://twitter.com/CapC0" },
    { name: "Delphinus", contribution: "Translations", contact: "-" },
    { name: "EJ/bluepenguin", contribution: "Translations", contact: "https://ejtranslations.wordpress.com/" },
    { name: "Glens / Night Deer Translations", contribution: "Translations", contact: "https://twitter.com/NightDeerTL" },
    { name: "Kumagai Nono", contribution: "Tousaku Songs Banners", contact: "https://twitter.com/_kmginn" },
    { name: "Loafer", contribution: "Translations, Letters to Elma Translation/Source", contact: "-" },
    { name: "MRF Mashups", contribution: "YRSK FUSER Customs", contact: "MRF Mashups - YouTube\nDiscord: @metaman9272" },
    { name: "rachie(splendiferachie)", contribution: "Translations", contact: "https://twitter.com/splendiferachie\nrachie 🎀💌 - YouTube" },
    {
      name: "SakuraWindsS",
      contribution: "Translations",
      contact: "https://twitter.com/SakuraWindsS",
    },
    {
      name: "sgtfuzzy92",
      contribution: "TsukiNeko 2023 Live Insight",
      contact: "",
    },
    {
      name: "shan-dawg",
      contribution: "TsukiNeko 2023 Live Insight",
      contact: "",
    },
    {
      name: "taru",
      contribution: "Translations",
      contact: "",
    },
    {
      name: "tindicatrix",
      contribution: "Elma's Journey Map (helped build the theorized Elmy map before official release)",
      contact: "",
    },
    {
      name: "we/theyleaveshadows / Iquix Subs",
      contribution: "Translations, Elma's Diary Translation/Source, Tousaku Novel Translation/Source",
      contact: "https://www.reddit.com/user/theyleaveshadows/\nhttps://iquixsubs.wordpress.com/",
    },
    {
      name: "wobb",
      contribution: "Translations, references to new and old songs, general insights, and song banners for NatsuKusa, Makeinu, DaBoYame(DakaBoku), Tousaku Live 2021 Stories Sourcer, Moonlight Revival/Replay Live 2022 Poetry Sourcer, Zense Live 2023 Reading Sourcer, TsukiNeko Live 2023 Plays Sourcer, Music Box Renditions, Gentou Full Album Sourcer",
      contact: "https://twitter.com/Wobbuu",
    },
    {
      name: "Yorushika Fan Zone Discord (YoruCord)",
      contribution: "Translations, One of the Collaboration and Communication Channels",
      contact: "https://discord.gg/wdam3HB",
    },
    {
      name: "zednet",
      contribution: "Translations, Tousaku Novel Translation/Source, Location List",
      contact: "https://twitter.com/hindzeit",
    },
  ];

  // Calculate pagination
  const indexOfLastContributor = currentPage * contributorsPerPage;
  const indexOfFirstContributor = indexOfLastContributor - contributorsPerPage;
  const currentContributors = contributors.slice(indexOfFirstContributor, indexOfLastContributor);
  const totalPages = Math.ceil(contributors.length / contributorsPerPage);

  // Handle page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Enhanced decorative elements with more subtle layers */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Added new decorative elements */}
      <div className="absolute top-1/4 left-0 w-40 h-40 bg-gradient-to-tr from-blue-100/10 to-transparent dark:from-blue-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-0 w-56 h-56 bg-gradient-to-bl from-purple-100/10 to-transparent dark:from-purple-900/5 rounded-full blur-3xl"></div>

      {/* Subtle music note decoration */}
      <div className="absolute top-[15%] right-[10%] opacity-5 dark:opacity-10">
        <BsMusicNoteBeamed className="text-7xl text-neutral-800 dark:text-neutral-200" />
      </div>
      <div className="absolute bottom-[20%] left-[8%] opacity-5 dark:opacity-10">
        <BsMusicNoteBeamed className="text-5xl text-neutral-800 dark:text-neutral-200" />
      </div>

      {/* Subtle dot pattern decoration */}
      <div className="absolute top-[30%] left-[5%] flex flex-col gap-10 opacity-10">
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
        </div>
        <div className="flex gap-2 ml-6">
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
        </div>
        <div className="flex gap-2 ml-3">
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
          <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
        </div>
      </div>

      {/* Hero Section with enhanced decorations */}
      <section className="relative pt-52 pb-40">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Added subtle line decoration */}
        <div className="absolute top-24 left-0 right-0 flex justify-center opacity-20">
          <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative">
            {/* Added subtle decorative elements around the title */}
            <div className="absolute w-full h-full flex items-center justify-center -z-10">
              <div className="w-40 h-40 border border-neutral-200 dark:border-neutral-800 rounded-full opacity-20"></div>
              <div className="absolute w-60 h-60 border border-neutral-200 dark:border-neutral-800 rounded-full opacity-10"></div>
            </div>

            <h1 className="flex flex-col items-center justify-center text-5xl md:text-6xl font-thin tracking-wide text-neutral-900 dark:text-neutral-100 mb-8">
              <span className="font-extralight text-neutral-700 dark:text-neutral-300">About</span>
              <div className="my-4 relative">
                {/* Added subtle hover animation */}
                <motion.img src={yorushikaLogo} alt="Yorushika" className="h-16 md:h-20 w-auto relative z-10" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} />

                {/* Decorative glow behind logo */}
                <div className="absolute inset-0 bg-white dark:bg-neutral-800 blur-xl opacity-20 rounded-full z-0"></div>
              </div>
              <span className="font-extralight text-neutral-700 dark:text-neutral-300">Fan Zone</span>
            </h1>

            {/* Added decorative Japanese characters */}
            <div className="mt-4 opacity-30 text-sm tracking-widest font-thin">
              <span className="text-neutral-500 dark:text-neutral-400">夜しかもう眠れずに</span>
            </div>
          </motion.div>
        </div>

        {/* Moon icon decoration */}
        <motion.div
          className="absolute top-28 right-[15%] text-neutral-300 dark:text-neutral-700 opacity-30"
          animate={{
            rotateZ: [0, 10, 0, -10, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <BsMoonStarsFill className="text-2xl" />
        </motion.div>
      </section>

      {/* About Content with enhanced styling */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="max-w-2xl mx-auto mb-32">
              {/* Decorative leaf icon */}
              <div className="flex justify-center mb-10">
                <div className="text-neutral-300 dark:text-neutral-700">
                  <img src={yorushikaLogo2} alt="Yorushika" className="h-16 w-auto invert" />
                </div>
              </div>

              <div className="space-y-6 text-neutral-700 dark:text-neutral-300 text-sm md:text-lg font-light">
                <p className="leading-relaxed relative">
                  {/* Added decorative quote design */}
                  <span className="absolute -left-4 top-0 text-3xl text-neutral-200 dark:text-neutral-800 font-serif">"</span>
                  This website is a simple tribute to the Yorushika fandom, made with care and attention. I, as the developer{" "}
                  <a href="https://handraputratama.xyz" className="font-extrabold text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-300 italic">
                    yuunagi
                  </a>
                  , I created this website to celebrate my passion for Yorushika and their works. <span className="underline font-bold">This is a purely fan-made project with no intention of profit—just a heartfelt tribute to Yorushika.</span> I deeply appreciate the genuine community and honest expression this site represents. Every element is thoughtfully designed to capture the essence of Yorushika's style and maintain a relaxed, immersive atmosphere.
                  <span className="absolute -right-1 bottom-0 text-3xl text-neutral-200 dark:text-neutral-800 font-serif">"</span>
                </p>

                {/* Added decorative separator */}
                <div className="flex justify-center py-4">
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
                </div>

                <p className="leading-relaxed">
                  All content here comes directly from the{" "}
                  <a href="https://docs.google.com/document/d/1RV0pVn1bMPBrA6Bm-IfU7y-ZcksnsHjus7nnJ0gJ06g/edit?tab=t.0#heading=h.965hlximbplr" className="font-extrabold italic text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-300">
                    {" "}
                    Yorushika Master Document{" "}
                  </a>{" "}
                  by{" "}
                  <a href="https://lit.link/en/relapse" className="font-extrabold text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-300 italic">
                    Relapse
                  </a>
                  . I made sure every translation, explanation, and analysis stays true to the original document. Full credits are given to acknowledge the contributions that make this project possible. Each section is intended to offer useful info, a bit of inspiration, and a chance to connect with other fans. I'm happy to share this space with fellow Yorushika enthusiasts and hope you enjoy exploring it.
                </p>
              </div>
            </div>

            {/* Contributors Cards with enhanced styling */}
            <div className="mb-16">
              <div className="relative">
                {/* Decorative music notes */}
                <div className="absolute left-4 -top-14 opacity-10 dark:opacity-15">
                  <BsMusicNoteBeamed className="text-2xl text-neutral-700 dark:text-neutral-300" />
                </div>
                <div className="absolute right-4 -top-8 opacity-10 dark:opacity-15">
                  <BsMusicNoteBeamed className="text-2xl text-neutral-700 dark:text-neutral-300" />
                </div>

                {/* Section title with decorative elements */}
                <div className="text-center mb-12">
                  <h2 className="text-2xl font-extralight tracking-wide text-neutral-900 dark:text-neutral-100 inline-block relative">
                    <span className="relative z-10">Contributors</span>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent"></div>
                  </h2>
                  <div className="mt-3">
                    <IoLeafOutline className="inline-block text-neutral-400 dark:text-neutral-600" />
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-4 max-w-md mx-auto">Special thanks to everyone who contributed to the Yorushika fan community</p>
                </div>

                {/* Contributors table container */}
                <motion.div ref={tableRef} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative z-10">
                  {/* Table backdrop decorative elements */}
                  <div className="absolute -inset-3 bg-white/30 dark:bg-neutral-900/30 rounded-2xl -z-10 backdrop-blur-sm"></div>
                  <div className="absolute -inset-6 bg-gradient-to-br from-neutral-100/50 to-transparent dark:from-neutral-800/50 dark:to-transparent rounded-2xl -z-20 backdrop-blur-sm"></div>

                  {/* Enhanced Contributors Card Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentContributors.map((contributor, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.4, delay: 0.1 + idx * 0.07 }} className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100/80 dark:border-neutral-800/80 group">
                        <div className="p-5">
                          {/* Contributor Header */}
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{contributor.name}</h3>

                            {/* Decorative tag */}
                            <div className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-xs text-neutral-500 dark:text-neutral-400">contributor</div>
                          </div>

                          {/* Contribution details with decorative line */}
                          <div className="relative pl-3 mb-4">
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{contributor.contribution}</p>
                          </div>

                          {/* Contact info with icon */}
                          <div className="mt-auto pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                            <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Contact:</div>
                            {contributor.contact !== "" && contributor.contact !== "-" ? (
                              <div className="space-y-1">
                                {contributor.contact.split("\n").map((line, i) => (
                                  <div key={i}>
                                    {line.startsWith("http") ? (
                                      <a href={line} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">
                                        <span className="truncate">{line}</span>
                                        <HiOutlineExternalLink className="flex-shrink-0 text-neutral-400" />
                                      </a>
                                    ) : (
                                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{line}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm italic text-neutral-400 dark:text-neutral-600">Not provided</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Enhanced pagination controls */}
              <div className="mt-12 flex flex-col items-center">
                <div className="flex justify-center items-center space-x-2">
                  <motion.button onClick={prevPage} disabled={currentPage === 1} className="relative px-4 py-2 rounded-md overflow-hidden group disabled:cursor-not-allowed" whileHover={currentPage === 1 ? {} : { scale: 1.03 }} whileTap={currentPage === 1 ? {} : { scale: 0.97 }}>
                    <span className={`absolute inset-0 ${currentPage === 1 ? "bg-neutral-100 dark:bg-neutral-800/30" : "bg-neutral-200 dark:bg-neutral-800"} opacity-40 rounded-md`}></span>
                    <span className="relative flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </span>
                  </motion.button>

                  <div className="hidden sm:flex px-2 space-x-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <motion.button key={idx} onClick={() => paginate(idx + 1)} className={`relative w-8 h-8 rounded-md overflow-hidden ${currentPage === idx + 1 ? "cursor-default" : "cursor-pointer"}`} whileHover={currentPage === idx + 1 ? {} : { scale: 1.1 }} whileTap={currentPage === idx + 1 ? {} : { scale: 0.9 }}>
                        <span className={`absolute inset-0 ${currentPage === idx + 1 ? "bg-neutral-800 dark:bg-neutral-200" : "bg-neutral-200 dark:bg-neutral-800/50"} rounded-md`}></span>
                        <span className={`relative flex items-center justify-center text-sm ${currentPage === idx + 1 ? "font-medium text-white dark:text-neutral-900" : "text-neutral-700 dark:text-neutral-400"}`}>{idx + 1}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Mobile pagination indicator */}
                  <span className="block sm:hidden text-sm text-neutral-500 dark:text-neutral-400">
                    {currentPage} / {totalPages}
                  </span>

                  <motion.button onClick={nextPage} disabled={currentPage === totalPages} className="relative px-4 py-2 rounded-md overflow-hidden group disabled:cursor-not-allowed" whileHover={currentPage === totalPages ? {} : { scale: 1.03 }} whileTap={currentPage === totalPages ? {} : { scale: 0.97 }}>
                    <span className={`absolute inset-0 ${currentPage === totalPages ? "bg-neutral-100 dark:bg-neutral-800/30" : "bg-neutral-200 dark:bg-neutral-800"} opacity-40 rounded-md`}></span>
                    <span className="relative flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </motion.button>
                </div>

                <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 flex justify-center items-center">
                  <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-2"></div>
                  <span>
                    Showing {indexOfFirstContributor + 1}-{Math.min(indexOfLastContributor, contributors.length)} of {contributors.length}
                  </span>
                  <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-2"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
