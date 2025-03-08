import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { IoArrowUpOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import yorushikaLogo from "../assets/yorushika.png";

const socialLinks = [
  { name: "Twitter", url: "https://twitter.com/yorushika_", icon: <FaTwitter /> },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCRIgIJQWuBJ0Cv_VlU3USNA", icon: <FaYoutube /> },
  { name: "Instagram", url: "https://www.instagram.com/yorushika_official/", icon: <FaInstagram /> },
];

const navigationLinks = [
  { name: "Home", path: "/" },
  { name: "Albums", path: "/albums" },
  { name: "Lore", path: "/news" },
  { name: "About", path: "/about" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced decorative divider with layered waves */}
      <div className="absolute top-0 left-0 right-0 h-24 -translate-y-full pointer-events-none">
        <svg className="absolute w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,110.31,985.66,92.83Z" className="fill-neutral-950 opacity-80" />
        </svg>
        <svg className="absolute w-full h-full translate-y-3" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-neutral-950 opacity-60" transform="opacity" />
        </svg>
      </div>

      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-neutral-900/5 blur-3xl"></div>
        <div className="absolute top-40 right-10 w-48 h-48 rounded-full bg-neutral-800/5 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full bg-neutral-700/5 blur-3xl"></div>
      </div>

      <div className="bg-neutral-950 pt-16 pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-5 space-y-6">
              <Link to="/" className="inline-flex group">
                <div className="flex items-center relative">
                  <img src={yorushikaLogo} alt="Yorushika" className="h-12 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="ml-3 border-l border-neutral-700 pl-3 relative">
                    <span className="text-neutral-200 font-light text-lg tracking-wide block">
                      <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 to-slate-300 group-hover:from-neutral-300 group-hover:to-slate-200 transition-all">Fan</span> Zone
                    </span>
                    <span className="text-neutral-500 text-xs tracking-wider">Unofficial Fan Space</span>
                    <div className="absolute -bottom-1 left-3 w-0 h-[1px] bg-gradient-to-r from-neutral-500 to-slate-500 group-hover:w-2/3 transition-all duration-300"></div>
                  </div>
                </div>
              </Link>

              <p className="text-neutral-400 text-sm leading-relaxed max-w-md">Celebrating the music and artistry of Yorushika through this fan-created space. Join us in exploring the beautiful world of melodies and stories crafted by this remarkable Japanese musical duo.</p>

              <div className="flex space-x-7 pt-3">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-400 transform hover:scale-110 hover:rotate-3 transition-all duration-300" aria-label={link.name}>
                    <span className="text-xl relative">
                      {link.icon}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neutral-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-3 space-y-5">
              <h3 className="text-neutral-300 text-sm font-medium tracking-widest uppercase relative inline-block">
                Explore
                <div className="absolute -bottom-1 left-0 w-8 h-[1px] bg-gradient-to-r from-neutral-500 to-transparent"></div>
              </h3>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-neutral-400 hover:text-white transition-all duration-300 group flex items-center">
                      <span className="w-0 h-px bg-neutral-400 mr-0 group-hover:w-3 group-hover:mr-2 transition-all"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Decorative music-themed element */}
              <div className="mt-8 pl-2">
                <div className="flex items-center space-x-1">
                  <div className="w-[2px] h-8 bg-neutral-700 animate-pulse-slow"></div>
                  <div className="w-[2px] h-12 bg-neutral-700 animate-pulse-slower"></div>
                  <div className="w-[2px] h-6 bg-neutral-700 animate-pulse-slow"></div>
                  <div className="w-[2px] h-10 bg-neutral-700 animate-pulse-slowest"></div>
                  <div className="w-[2px] h-7 bg-neutral-700 animate-pulse-slow"></div>
                </div>
              </div>
            </div>

            {/* Connect Section (enhanced) */}
            <div className="md:col-span-4 space-y-5">
              <h3 className="text-neutral-300 text-sm font-medium tracking-widest uppercase relative inline-block">
                Connect
                <div className="absolute -bottom-1 left-0 w-8 h-[1px] bg-gradient-to-r from-neutral-500 to-transparent"></div>
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">This fan site is dedicated to celebrating Yorushika's art and music. All official content belongs to their rightful owners.</p>

              {/* Visual decorative element */}
              <div className="relative">
                <div className="h-px w-24 bg-gradient-to-r from-neutral-500 via-slate-400 to-neutral-800"></div>
                <div className="absolute top-3 left-0 h-px w-16 bg-gradient-to-r from-neutral-500/50 via-slate-400/50 to-neutral-800/0"></div>
              </div>

              {/* Added quote section */}
              <div className="pt-4 mt-2 border-t border-neutral-800/30">
                <blockquote className="text-neutral-400 text-sm italic pl-3 border-l-2 border-neutral-800/30">
                  "Life is just one compromise after another, I learned that pretty fast. <span className="font-bold text-green-600">Elma</span>, it’s you, You alone are my music"
                </blockquote>
              </div>
              <div className="pt-4 mt-2 border-t border-neutral-800/30">
                <blockquote className="text-neutral-400 text-sm italic pl-3 border-l-2 border-neutral-800/30">
                  "A hole opened up in my heart, Your words opened a hole in my heart. I understand now, “You alone are my music,” <span className="text-orange-800 font-bold"> Amy</span>"
                </blockquote>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-neutral-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-neutral-500">&copy; {currentYear} Yorushika Fan Site. This is an unofficial fan site.</p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-neutral-600">
                <span>All rights for Yorushika content belong to their respective owners.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Back to Top Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="bg-neutral-900/80 backdrop-blur text-white p-3 rounded-full shadow-lg hover:bg-neutral-600 transition-all duration-300 group border border-neutral-700/30" aria-label="Back to top">
          <IoArrowUpOutline className="text-lg group-hover:translate-y-[-2px] transition-transform duration-300" />
        </button>
      </motion.div>
    </footer>
  );
}
