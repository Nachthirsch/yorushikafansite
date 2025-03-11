import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function TableOfContents({ content }) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract headings from content blocks
  const sections = content
    .filter((block) => block.title)
    .map((block) => ({
      id: block.title.toLowerCase().replace(/\s+/g, "-"),
      title: block.title,
    }));

  if (sections.length === 0) return null;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl mb-6">
      <button className="flex items-center justify-between w-full p-4 text-neutral-800 dark:text-neutral-200 font-medium" onClick={() => setIsOpen(!isOpen)}>
        <span>Table of Contents</span>
        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <ul className="border-l border-neutral-200 dark:border-neutral-700 ml-2">
            {sections.map((section, index) => (
              <li key={index} className="pl-4 py-1.5">
                <a href={`#${section.id}`} className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
