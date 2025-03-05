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
  { name: "News", path: "/news" },
  { name: "About", path: "/about" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative">
      {/* Improved Decorative Wave Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 w-full h-60 transform translate-y-1/3 opacity-8 dark:opacity-5" viewBox="0 0 1440 320">
          <path fill="currentColor" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,170.7C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative bg-neutral-950 pt-24 pb-16 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            {/* Enhanced Brand Section */}
            <div className="space-y-6 md:col-span-2">
              <Link to="/" className="inline-block group">
                <div className="flex items-center">
                  <img src={yorushikaLogo} alt="Yorushika" className="h-11 w-auto shadow-lg group-hover:scale-105 transition-all duration-300" />
                  <span className="ml-2 font-light text-neutral-200 text-sm relative -top-1">
                    <span className="font-medium">Fan</span> Zone
                  </span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-neutral-400 max-w-md">Celebrating the music and artistry of Yorushika through this fan-created space. Join us in exploring the beautiful world of their music.</p>
              <div className="flex space-x-5">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transform hover:scale-115 transition-all duration-300" aria-label={link.name}>
                    <span className="text-xl">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Improved Navigation Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-2">Quick Links</h3>
              <ul className="space-y-4">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-neutral-400 hover:text-white transition-all duration-300 flex items-center group">
                      <span className="mr-2 text-neutral-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all duration-300">→</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Contact Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-2">Contact</h3>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:contact@yorushikafan.com" className="text-sm text-neutral-400 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="mr-2 text-neutral-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all duration-300">✉</span>
                    Email Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Refined Bottom Bar */}
          <div className="pt-10 mt-10 border-t border-neutral-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <p className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors duration-300">&copy; {currentYear} Yorushika Fan Site. This is an unofficial fan site.</p>
              <p className="text-xs text-neutral-600">All rights for Yorushika content belong to their respective owners.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
