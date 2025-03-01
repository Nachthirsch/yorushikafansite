import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-amber-600">よ</span>
              <span className={`${scrolled ? "text-gray-800" : "text-gray-900"}`}>るしか</span>
            </span>
            <span
              className={`text-xs font-medium tracking-wider uppercase
              ${scrolled ? "text-gray-600" : "text-gray-700"}`}
            >
              Fan Site
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {[
              { to: "/", label: "Albums" },
              { to: "/news", label: "News" },
              { to: "/about", label: "About" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    location.pathname === to
                      ? "text-amber-600 bg-amber-50"
                      : `${scrolled ? "text-gray-600" : "text-gray-800"} 
                       hover:bg-gray-100/80`
                  }`}
              >
                {label}
              </Link>
            ))}

            {/* Admin Button */}
            <Link
              to="/admin"
              className={`ml-2 px-4 py-2 text-sm font-medium rounded-lg
                border transition-all
                ${scrolled ? "border-gray-300 text-gray-600 hover:bg-gray-100" : "border-gray-400 text-gray-700 hover:bg-gray-100"}`}
            >
              Admin
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
