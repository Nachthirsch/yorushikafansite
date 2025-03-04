import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { Transition } from "@headlessui/react";

export default function Navbar({ darkMode, setDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { name: "News", path: "/news" },
    { name: "Albums", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold transition-transform hover:scale-105 duration-300">
            <span className="text-blue-600 dark:text-blue-400">よ</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">るしか</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => `text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors" aria-label="Toggle menu">
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

      {/* Mobile Menu */}
      <Transition show={isMobileMenuOpen} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => `block px-3 py-3 text-base font-medium rounded-lg transition-colors ${isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </Transition>
    </header>
  );
}
