import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import yorushikaLogo from "../assets/yorushika.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu with escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Albums", path: "/albums" },
    { name: "Lore", path: "/news" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? "bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md shadow-sm" : "bg-gradient-to-b from-neutral-50/80 to-transparent dark:from-neutral-950/80 dark:to-transparent"}`}>
        {/* Minimalist top decoration - horizontal line with dot */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent relative">
          <div className="absolute w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo with animation */}
            <Link to="/" className="flex items-center group">
              <div className="overflow-hidden rounded-full transition-all duration-500 group-hover:shadow-md group-hover:shadow-neutral-300 dark:group-hover:shadow-neutral-700 relative">
                {/* Subtle circle decoration around logo */}
                <div className="absolute inset-0 border border-neutral-200 dark:border-neutral-800 rounded-full opacity-0 group-hover:opacity-100 scale-110 transition-all duration-500"></div>
                <img src={yorushikaLogo} alt="Yorushika" className="h-12 md:h-14 w-auto transition-transform duration-700 group-hover:scale-110" />
              </div>
              <span className="ml-3 font-medium text-neutral-900 dark:text-neutral-100 text-base md:text-lg relative opacity-80 group-hover:opacity-100 transition-all duration-300">
                <span className="font-light">Fan</span>
                <span className="font-bold tracking-wider ml-1">Zone</span>
                {/* Minimalist underline decoration */}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-400 dark:bg-neutral-500 group-hover:w-full transition-all duration-500"></span>
              </span>
            </Link>

            {/* Theme Toggle & Menu Button */}
            <div className="flex items-center space-x-4 relative">
              {/* Decorative corner element */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-neutral-300 dark:border-neutral-700 opacity-70"></div>

              {/* Menu Button with improved animation */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-300 relative" aria-expanded={isMenuOpen} aria-controls="main-menu" aria-label="Main menu">
                <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                {isMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <div className="w-6 h-6 flex flex-col justify-between items-center">
                    <span className="bg-current h-0.5 w-6 rounded-lg transition-all duration-300" />
                    <span className="bg-current h-0.5 w-5 rounded-lg transition-all duration-300 self-end" />
                    <span className="bg-current h-0.5 w-6 rounded-lg transition-all duration-300" />
                  </div>
                )}
                {/* Decorative dot */}
                <div className={`absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full screen menu overlay - Fixed to use as="div" */}
      <Transition show={isMenuOpen} as="div" enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0" className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-neutral-50/95 dark:bg-neutral-950/98 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          {/* Minimalist background decoration - diagonal lines */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <div className="absolute -inset-1/2 border-[1px] border-neutral-900 dark:border-neutral-300 rotate-12 rounded-full"></div>
            <div className="absolute -inset-1/4 border-[1px] border-neutral-900 dark:border-neutral-300 -rotate-8 rounded-full"></div>
            <div className="absolute top-1/4 right-0 w-64 h-64 border-[1px] border-neutral-900 dark:border-neutral-300 rounded-full"></div>
            <div className="absolute bottom-1/4 left-0 w-32 h-32 border-[1px] border-neutral-900 dark:border-neutral-300 rounded-full"></div>
          </div>
        </div>

        <div className="relative h-full flex">
          {/* Main section - Logo */}
          <div className="flex-1 flex items-center justify-center p-6 relative">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="transform hover:scale-105 transition-transform duration-500 relative">
              <div className="relative block items-center justify-center">
                <img src={yorushikaLogo} alt="Yorushika" className="h-20 md:h-24 w-auto opacity-20 dark:opacity-10 relative z-10" />
              </div>

              {/* Decorative elements around the central logo */}
              <div className="absolute -inset-8 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-full opacity-30 transition-all duration-500 hover:opacity-50"></div>
              <div className="absolute -inset-16 border border-dotted border-neutral-200 dark:border-neutral-800 rounded-full opacity-20 transition-all duration-500 hover:opacity-40"></div>
            </Link>
          </div>

          {/* Vertical navigation menu */}
          <nav id="main-menu" className="w-full md:w-1/3 lg:w-1/4 border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-center items-start p-8 md:p-16 relative" aria-label="Main navigation">
            {/* Decorative elements in the menu section */}
            <div className="absolute top-12 right-12 w-6 h-6 border-t border-r border-neutral-300 dark:border-neutral-700 opacity-50"></div>
            <div className="absolute bottom-12 left-12 w-6 h-6 border-b border-l border-neutral-300 dark:border-neutral-700 opacity-50"></div>

            <Transition.Child as="div" enter="transition-all ease-in-out duration-300 delay-150" enterFrom="opacity-0 translate-x-8" enterTo="opacity-100 translate-x-0" leave="transition-all ease-in-out duration-200" leaveFrom="opacity-100 translate-x-0" leaveTo="opacity-0 translate-x-8" className="w-full">
              <div className="w-full space-y-8">
                {navLinks.map((link, index) => (
                  <Transition.Child as="div" key={link.path} enter="transition-all ease-in-out duration-300" enterFrom="opacity-0 translate-x-8" enterTo="opacity-100 translate-x-0" leave="transition-all ease-in-out duration-200" leaveFrom="opacity-100 translate-x-0" leaveTo="opacity-0 translate-x-8" className="relative w-full" style={{ transitionDelay: `${150 + index * 75}ms` }} onMouseEnter={() => setHoveredLink(link.path)} onMouseLeave={() => setHoveredLink(null)}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => `
                        block text-2xl md:text-3xl font-medium tracking-wide transition-all duration-300 py-2 pl-3
                        ${isActive ? "text-neutral-900 dark:text-neutral-100 translate-x-2" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"}
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}

                      {/* Visual indicator for active/hovered state */}
                      <div
                        className={`
                          absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-neutral-400 dark:bg-neutral-500 
                          transition-all duration-300 rounded-full overflow-hidden
                          ${hoveredLink === link.path || location.pathname === link.path ? "h-full opacity-100" : "opacity-0"}
                        `}
                      />

                      {/* Decorative dot for each menu item */}
                      <div
                        className={`
                          absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full
                          transition-all duration-500
                          ${hoveredLink === link.path || location.pathname === link.path ? "bg-neutral-400 dark:bg-neutral-500 opacity-100" : "bg-neutral-300 dark:bg-neutral-700 opacity-50"}
                        `}
                      />
                    </NavLink>
                  </Transition.Child>
                ))}
              </div>
            </Transition.Child>

            {/* Decorative minimal pattern at the bottom */}
            <div className="absolute bottom-6 left-12 right-12">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
              <div className="mt-2 flex justify-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
              </div>
            </div>
          </nav>
        </div>
      </Transition>
    </>
  );
}
