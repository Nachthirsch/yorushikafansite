import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import yorushikaLogo from "../assets/yorushika.png";

export default function Navbar({ darkMode, setDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Albums", path: "/albums" },
    { name: "Lore", path: "/news" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? "bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md shadow-sm" : "bg-gradient-to-b from-neutral-50/80 to-transparent dark:from-neutral-950/80 dark:to-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center group">
            <div className="overflow-hidden rounded-full transition-all duration-500 group-hover:shadow-md group-hover:shadow-neutral-300 dark:group-hover:shadow-neutral-700">
              <img src={yorushikaLogo} alt="Yorushika" className="h-10 md:h-12 w-auto transition-transform duration-700 group-hover:scale-110" />
            </div>
            <span className="ml-2 font-medium text-neutral-900 pb-3 dark:text-neutral-100 text-sm md:text-base relative opacity-80 group-hover:opacity-100 transition-all duration-300">
              <span className="font-light">Fan</span>
              <span className="font-bold tracking-wider ml-1">Zone</span>
            </span>
          </Link>

          {/* Desktop Navigation - Vertical Line Style */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link, index) => (
              <div key={link.path} className="relative" onMouseEnter={() => setHoveredLink(link.path)} onMouseLeave={() => setHoveredLink(null)}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `
                    text-sm font-medium transition-all duration-300 px-1 py-1
                    ${isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"}
                  `}
                >
                  {link.name}
                  <div className={`absolute left-0 -bottom-1 w-full h-[2px] transform transition-transform duration-300 ${hoveredLink === link.path || location.pathname === link.path ? "scale-x-100 bg-neutral-400 dark:bg-neutral-500" : "scale-x-0 bg-neutral-300 dark:bg-neutral-700"} origin-left`}></div>
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button with improved animation */}
          <div className="flex md:hidden items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none transition-colors" aria-label="Toggle menu">
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex flex-col justify-between items-center">
                <span className={`bg-current transform transition-all duration-300 h-0.5 w-6 rounded-lg ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
                <span className={`bg-current transition-all duration-300 h-0.5 w-6 rounded-lg ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`bg-current transform transition-all duration-300 h-0.5 w-6 rounded-lg ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with improved design */}
      <Transition show={isMobileMenuOpen} enter="transition-all duration-300" enterFrom="opacity-0 max-h-0" enterTo="opacity-100 max-h-[400px]" leave="transition-all duration-300" leaveFrom="opacity-100 max-h-[400px]" leaveTo="opacity-0 max-h-0" className="overflow-hidden">
        <div className="md:hidden bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 
                  ${isActive ? "bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 border-l-2 border-neutral-400 dark:border-neutral-500" : "text-neutral-700 dark:text-neutral-300 border-l-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/30"}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </Transition>
    </header>
  );
}
