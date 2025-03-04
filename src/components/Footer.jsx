import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

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
      {/* Decorative Wave Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 w-full h-48 transform translate-y-1/2 opacity-10 dark:opacity-5" viewBox="0 0 1440 320">
          <path fill="currentColor" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,170.7C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-12">
            {/* Brand Section */}
            <div className="space-y-6 md:col-span-2">
              <Link to="/" className="text-3xl font-bold inline-block hover:scale-105 transition-transform duration-300">
                <span className="text-blue-600 dark:text-blue-400">よ</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">るしか</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 max-w-md">Celebrating the music and artistry of Yorushika through this fan-created space. Join us in exploring the beautiful world of their music.</p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all">
                    <span className="text-xl">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-4">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-2 inline-flex items-center">
                      <span className="mr-2">→</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Contact</h3>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:contact@yorushikafan.com" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-2 inline-flex items-center">
                    <span className="mr-2">✉</span> Email Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <p className="text-xs text-gray-600 dark:text-gray-400">&copy; {currentYear} Yorushika Fan Site. This is an unofficial fan site.</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">All rights for Yorushika content belong to their respective owners.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
