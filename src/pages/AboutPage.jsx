/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import yorushikaLogo from "../assets/yorushika.png";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [currentPage, setCurrentPage] = useState(1);
  const contributorsPerPage = 8;

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
      contribution: "Elma’s Journey Map (helped build the theorized Elmy map before official release)",
      contact: "",
    },
    {
      name: "we/theyleaveshadows / Iquix Subs",
      contribution: "Translations, Elma’s Diary Translation/Source, Tousaku Novel Translation/Source",
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
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Hero Section */}
      <section className="relative pt-52 pb-40">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="flex flex-col items-center justify-center text-5xl md:text-6xl font-thin tracking-wide text-neutral-900 dark:text-neutral-100 mb-8">
              <span className="font-extralight text-neutral-700 dark:text-neutral-300">About</span>
              <div className="my-4">
                <img src={yorushikaLogo} alt="Yorushika" className="h-16 md:h-20 w-auto" />
              </div>
              <span className="font-extralight text-neutral-700 dark:text-neutral-300">Fan Zone</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="max-w-2xl mx-auto mb-32">
              <h2 className="text-2xl font-extralight tracking-wide text-neutral-900 dark:text-neutral-100 text-center mb-8">About this site</h2>

              <div className="space-y-6 text-neutral-700 dark:text-neutral-300 text-sm md:text-lg font-light">
                <p className="leading-relaxed">
                  This website is a simple tribute to the Yorushika fandom, made with care and attention. I, as the developer{" "}
                  <a href="https://handraputratama.xyz" className="font-extrabold text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-300 italic">
                    yuunagi
                  </a>
                  , I created this website to celebrate my passion for Yorushika and their works. <span className="underline font-bold">This is a purely fan-made project with no intention of profit—just a heartfelt tribute to Yorushika.</span> I deeply appreciate the genuine community and honest expression this site represents. Every element is thoughtfully designed to capture the essence of Yorushika’s style and maintain a relaxed, immersive atmosphere.
                </p>
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
                  . I made sure every translation, explanation, and analysis stays true to the original document. Full credits are given to acknowledge the contributions that make this project possible. Each section is intended to offer useful info, a bit of inspiration, and a chance to connect with other fans. I’m happy to share this space with fellow Yorushika enthusiasts and hope you enjoy exploring it.
                </p>
              </div>
            </div>

            {/* Contributors Cards */}
            <div className="mb-6">
              <h2 className="text-2xl font-extralight tracking-wide text-neutral-900 dark:text-neutral-100 text-center mb-8">Contributors</h2>
              <div className="overflow-x-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800">
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contributor</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contribution</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contact Handle/Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {currentContributors.map((contributor, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">{contributor.name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{contributor.contribution}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {contributor.contact.split("\n").map((line, i) =>
                            line.startsWith("http") ? (
                              <a key={i} href={line} target="_blank" rel="noopener noreferrer" className="block text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                                {line}
                              </a>
                            ) : (
                              <span key={i} className="block">
                                {line}
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button key={idx} onClick={() => paginate(idx + 1)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === idx + 1 ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>

              <div className="text-center mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                Page {currentPage} of {totalPages} • Showing {indexOfFirstContributor + 1}-{Math.min(indexOfLastContributor, contributors.length)} of {contributors.length} contributors
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
