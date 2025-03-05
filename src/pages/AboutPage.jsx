/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("history");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Band members data
  const bandMembers = [
    {
      name: "n-buna",
      role: "Composer, Songwriter",
      image: "https://i.imgur.com/2Z7TzY1.jpg",
      description: "Known for his intricate melodies and thoughtful lyrics, n-buna (Kazuki Nagasawa) began his career creating music on NicoNico Douga. His compositions blend elements of folk, rock, and classical music, creating Yorushika's distinctive sound.",
      socialLink: "https://twitter.com/nbuna_staff",
    },
    {
      name: "suis",
      role: "Vocalist",
      image: "https://i.imgur.com/9GjyJmm.jpg",
      description: "suis (Mizuki Suidobashi) brings Yorushika's music to life with her clear, expressive vocals. Her voice perfectly complements n-buna's compositions, conveying the complex emotions and narratives present in Yorushika's work.",
      socialLink: "https://twitter.com/suis_from_yorsh",
    },
  ];

  // Major albums
  const albums = [
    {
      title: "Plagiarism",
      year: 2020,
      cover: "https://i.imgur.com/3gkKVhb.jpg",
      description: "A concept album exploring themes of art, creation, and originality.",
      link: "/",
    },
    {
      title: "Elma",
      year: 2019,
      cover: "https://i.imgur.com/gtzJQFg.jpg",
      description: "A narrative-driven album featuring interconnected stories about youth and self-discovery.",
      link: "/",
    },
    {
      title: "Dakara Boku wa Ongaku wo Yameta",
      year: 2019,
      cover: "https://i.imgur.com/JS4lyzx.jpg",
      description: "Translating to 'That's Why I Gave Up on Music', this album explores themes of disillusionment and artistic struggle.",
      link: "/",
    },
    {
      title: "Makeinu ni Encore wa Iranai",
      year: 2018,
      cover: "https://i.imgur.com/weQlcry.jpg",
      description: "The debut mini-album introducing Yorushika's unique sound and storytelling approach.",
      link: "/",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neutral-100/30 dark:bg-neutral-900/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
              About <span className="text-neutral-600 dark:text-neutral-400">Yorushika</span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">A Japanese rock duo formed in 2017, blending poetic lyrics with melodic compositions that tell stories of youth, literature, and everyday life.</p>
          </motion.div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide py-4">
            {["history", "members", "discography"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-neutral-600 text-neutral-600 dark:border-neutral-400 dark:text-neutral-400" : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* History Section */}
        <motion.section variants={containerVariants} initial="hidden" animate={activeTab === "history" ? "visible" : "hidden"} className={`space-y-12 ${activeTab !== "history" ? "hidden" : ""}`}>
          <motion.div variants={itemVariants} className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-6">The Story of Yorushika</h2>

            <div className="mb-10">
              <div className="relative h-80 w-full mb-8 rounded-2xl overflow-hidden">
                <img src="https://i.imgur.com/QXVYcXm.jpg" alt="Yorushika Band" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <p>Yorushika (ヨルシカ), which translates to "Night Deer" in Japanese, is a duo formed in 2017 by composer n-buna and vocalist suis. The band emerged from n-buna's earlier work as a Vocaloid producer, transitioning to collaborating with a human vocalist while maintaining the storytelling elements and distinctive sound that characterized his earlier compositions.</p>
              <p>The duo chose to remain relatively anonymous, rarely showing their faces in promotional materials and focusing attention on their music rather than their personalities. This approach allowed their work to speak for itself, with listeners forming connections to the stories and emotions conveyed in their songs.</p>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-light text-neutral-900 dark:text-neutral-100 mb-4">Musical Style</h3>
              <p>Yorushika's music spans multiple genres, incorporating elements of rock, folk, and classical influences. Their sound is characterized by complex instrumental arrangements, poetic lyrics that often reference literature and philosophy, and suis's clear, emotive vocals.</p>
              <p>Many of their albums follow conceptual narratives, with songs interconnected to tell larger stories. These narratives often explore themes of youth, growing up, disillusionment, creativity, and the bittersweet nature of life.</p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-neutral-900 dark:text-neutral-100 mb-4">Impact and Reception</h3>
              <p>Despite maintaining a low profile and minimal promotion, Yorushika has gained significant popularity in Japan and internationally. Their music videos on YouTube have garnered millions of views, and they've developed a dedicated fanbase drawn to their unique sound and thoughtful lyrics.</p>
              <p>Their work has resonated particularly with younger listeners who connect with the themes of navigating the complexities of life, identity, and creativity that permeate their music. The combination of accessible melodies with deeper lyrical meaning has given their work lasting appeal beyond typical pop music.</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Members Section */}
        <motion.section variants={containerVariants} initial="hidden" animate={activeTab === "members" ? "visible" : "hidden"} className={`grid md:grid-cols-2 gap-12 ${activeTab !== "members" ? "hidden" : ""}`}>
          {bandMembers.map((member) => (
            <motion.div key={member.name} variants={itemVariants} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <div className="aspect-square relative overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{member.name}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-4">{member.role}</p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">{member.description}</p>
                <a href={member.socialLink} target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center">
                  <span>Follow on Twitter</span>
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Discography Section */}
        <motion.section variants={containerVariants} initial="hidden" animate={activeTab === "discography" ? "visible" : "hidden"} className={`space-y-12 ${activeTab !== "discography" ? "hidden" : ""}`}>
          <motion.h2 variants={itemVariants} className="text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-6">
            Major Albums
          </motion.h2>

          <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Link key={album.title} to={album.link} className="group bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-square relative overflow-hidden">
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">{album.title}</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">{album.year}</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">{album.description}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pt-8">
            <Link to="/" className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium">
              <span>View Complete Discography</span>
              <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </motion.section>
      </div>

      {/* Call to Action */}
      <section className="bg-neutral-100 dark:bg-neutral-900/20 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-6">Explore Yorushika's World</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto">Dive deeper into Yorushika's music through their album collections, lyrics analysis, and latest news updates.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="px-8 py-3 bg-neutral-600 hover:bg-neutral-700 text-neutral-50 rounded-lg transition-colors">
              Browse Albums
            </Link>
            <Link to="/news" className="px-8 py-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors">
              Read Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
