import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormattedText from "../common/FormattedText";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function TextSelectionModal({ isOpen, onClose, post, onTextSelected, showSharePlatforms, onShare }) {
  const [selection, setSelection] = useState("");
  const contentRef = useRef(null);

  // Extract and format text content from the post
  const extractPostContent = () => {
    if (!post || !post.content) return "";

    // Handle different content structures
    if (Array.isArray(post.content)) {
      const textContent = post.content
        .filter((block) => block.type === "text")
        .map((block) => block.value)
        .join("\n\n");

      return <FormattedText text={textContent} />;
    }

    return <FormattedText text={String(post.content)} />;
  };

  // Watch for text selection within the modal
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!contentRef.current) return;

      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (selectedText && contentRef.current.contains(selection.anchorNode)) {
        setSelection(selectedText);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Handle confirming the selected text
  const handleConfirmSelection = () => {
    if (selection) {
      onTextSelected(selection);
    }
  };

  const shareOptions = [
    {
      id: "twitter",
      name: "Twitter",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
        </svg>
      ),
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18.166-.26.339-.39.505-2.443 5.086-4.898 10.166-7.345 15.247-.368.775-1.249 1.16-2.073.847a1.918 1.918 0 0 1-.471-.202c-.866-.551-1.742-1.092-2.589-1.68-.748-.516-.993-1.408-.622-2.183.127-.264.328-.49.571-.674 1.494-1.137 2.996-2.267 4.483-3.416.226-.175.423-.367.586-.573.414-.521.296-1.24-.268-1.534-.41-.21-.85-.14-1.195.167-1.318 1.166-2.648 2.319-3.974 3.475-1.016.889-2.03 1.779-3.048 2.665a1.313 1.313 0 0 1-.597.323c-.488.092-.932-.24-1.15-.706a3.48 3.48 0 0 1-.125-.32 1.18 1.18 0 0 1 .382-1.314c.342-.325.689-.646 1.03-.973.965-.92 1.928-1.843 2.896-2.759 1.101-1.043 2.205-2.083 3.31-3.122.243-.228.514-.408.811-.533a1.733 1.733 0 0 1 1.216-.03c.324.1.618.273.867.508 1.384 1.313 2.764 2.63 4.146 3.946.174.164.301.36.366.58a1.236 1.236 0 0 1-.327 1.249c-.323.294-.666.57-1.015.834a377.698 377.698 0 0 1-4.863 3.653c-.247.184-.51.333-.787.44-.277.107-.578.161-.877.14a1.98 1.98 0 0 1-.357-.057 2.099 2.099 0 0 1-1.338-1.015 2.12 2.12 0 0 1-.031-1.95c1.516-4.464 3.036-8.925 4.557-13.386.206-.63.71-1.064 1.367-1.185.191-.035.385-.04.579-.012z" />
        </svg>
      ),
    },
    {
      id: "copy",
      name: "Copy",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{showSharePlatforms ? "Share Selected Text" : "Select Text to Share"}</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                <XMarkIcon className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!showSharePlatforms ? (
                <>
                  <div ref={contentRef} className="prose prose-neutral dark:prose-invert max-w-none mb-6 max-h-[50vh] overflow-y-auto px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700 select-text cursor-text">
                    {extractPostContent()}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{selection ? <span>Selected: {selection.length} characters</span> : <span>Select text above to share</span>}</div>
                    <button
                      onClick={handleConfirmSelection}
                      disabled={!selection}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                        ${selection ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"}`}
                    >
                      <CheckIcon className="w-5 h-5" />
                      <span>Confirm Selection</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Selected text preview */}
                  <div className="mb-6">
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700 px-4 py-3">
                      <blockquote className="relative">
                        <span className="block absolute -top-3 -left-1 text-4xl text-neutral-300 dark:text-neutral-600">"</span>
                        <div className="relative z-10 italic text-neutral-700 dark:text-neutral-300 pl-6 pr-2">
                          <FormattedText text={selection} />
                        </div>
                        <span className="block absolute -bottom-5 -right-1 text-4xl text-neutral-300 dark:text-neutral-600">"</span>
                      </blockquote>
                    </div>
                  </div>

                  {/* Share platform options */}
                  <div className="grid grid-cols-5 gap-4">
                    {shareOptions.map((platform) => (
                      <button key={platform.id} onClick={() => onShare(platform.id)} className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <div className="text-neutral-700 dark:text-neutral-300 mb-2">{platform.icon}</div>
                        <span className="text-sm">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
