import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import yorushikaLogo from "../assets/yorushika.png";

const socialLinks = [
  { name: "Twitter", url: "https://twitter.com/yorushika_", icon: <FaTwitter /> },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCRIgIJQWuBJ0Cv_VlU3USNA", icon: <FaYoutube /> },
  { name: "Instagram", url: "https://www.instagram.com/yorushika_official/", icon: <FaInstagram /> },
];

const navigationLinks = [
  { name: "Albums", path: "/" },
  { name: "Lore", path: "/news" },
  { name: "About", path: "/about" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24">
      {/* Decorative divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden h-20 -translate-y-full">
        <svg className="absolute w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-current text-neutral-950"></path>
        </svg>
      </div>

      <div className="bg-neutral-950 pt-16 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-5 space-y-6">
              <Link to="/" className="inline-flex group">
                <div className="flex items-center">
                  <img src={yorushikaLogo} alt="Yorushika" className="h-12 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300" />
                  <div className="ml-3 border-l border-neutral-700 pl-3">
                    <span className="text-neutral-200 font-light text-lg tracking-wide block">
                      <span className="font-medium">Fan</span> Zone
                    </span>
                    <span className="text-neutral-500 text-xs tracking-wider">Unofficial Fan Space</span>
                  </div>
                </div>
              </Link>

              <p className="text-neutral-400 text-sm leading-relaxed max-w-md">Celebrating the music and artistry of Yorushika through this fan-created space. Join us in exploring the beautiful world of their music.</p>

              <div className="flex space-x-6 pt-2">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-indigo-400 transform hover:scale-110 transition-all" aria-label={link.name}>
                    <span className="text-xl">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-3 space-y-5">
              <h3 className="text-neutral-300 text-sm font-medium tracking-widest uppercase">Explore</h3>
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
            </div>

            {/* Newsletter (placeholder for future use) */}
            <div className="md:col-span-4 space-y-5">
              <h3 className="text-neutral-300 text-sm font-medium tracking-widest uppercase">Connect</h3>
              <p className="text-neutral-400 text-sm">This fan site is dedicated to celebrating Yorushika's art and music. All official content belongs to their rightful owners.</p>
              <div className="h-px w-16 bg-gradient-to-r from-neutral-500 to-neutral-200"></div>
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

      {/* Back to Top Button */}
      <div className="fixed bottom-4 right-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="bg-neutral-900 text-white p-2 rounded-full shadow-lg hover:bg-indigo-600 transition-all" aria-label="Back to top">
          ↑
        </button>
      </div>
    </footer>
  );
}
