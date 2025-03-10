import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function TableOfContents({ headings, activeHeading, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  // Automatically close mobile TOC when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && !event.target.closest(".table-of-contents") && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Reset open state when page changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPage]);

  return (
    <div className="table-of-contents">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-5 sticky top-24">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Contents
          </h3>
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <ChevronDownIcon className={`h-5 w-5 transform ${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-200`} />
          </button>
        </div>

        <nav className={`lg:block ${isOpen ? "block" : "hidden"}`}>
          <ul className="space-y-2.5">
            {headings.map((heading) => (
              <li key={heading.id} className={`border-l-2 ${activeHeading === heading.id ? "border-neutral-500 dark:border-neutral-400" : "border-neutral-200 dark:border-neutral-700"}`}>
                <a href={`#${heading.id}`} className={`block pl-3 py-1 text-sm transition-colors hover:text-neutral-900 dark:hover:text-white ${activeHeading === heading.id ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-600 dark:text-neutral-400"}`}>
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
