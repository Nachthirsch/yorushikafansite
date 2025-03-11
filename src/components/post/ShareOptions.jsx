import { motion, AnimatePresence } from "framer-motion";
import { LinkIcon } from "@heroicons/react/24/outline";

const shareOptions = [
  {
    id: "twitter",
    name: "Twitter",
    icon: (
      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
    shareUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: (
      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
    shareUrl: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: (
      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
    ),
    shareUrl: (text, url) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: (
      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18.166-.26.339-.39.505-2.443 5.086-4.898 10.166-7.345 15.247-.368.775-1.249 1.16-2.073.847a1.918 1.918 0 0 1-.471-.202c-.866-.551-1.742-1.092-2.589-1.68-.748-.516-.993-1.408-.622-2.183.127-.264.328-.49.571-.674 1.494-1.137 2.996-2.267 4.483-3.416.226-.175.423-.367.586-.573.414-.521.296-1.24-.268-1.534-.41-.21-.85-.14-1.195.167-1.318 1.166-2.648 2.319-3.974 3.475-1.016.889-2.03 1.779-3.048 2.665a1.313 1.313 0 0 1-.597.323c-.488.092-.932-.24-1.15-.706a3.48 3.48 0 0 1-.125-.32 1.18 1.18 0 0 1 .382-1.314c.342-.325.689-.646 1.03-.973.965-.92 1.928-1.843 2.896-2.759 1.101-1.043 2.205-2.083 3.31-3.122.243-.228.514-.408.811-.533a1.733 1.733 0 0 1 1.216-.03c.324.1.618.273.867.508 1.384 1.313 2.764 2.63 4.146 3.946.174.164.301.36.366.58a1.236 1.236 0 0 1-.327 1.249c-.323.294-.666.57-1.015.834a377.698 377.698 0 0 1-4.863 3.653c-.247.184-.51.333-.787.44-.277.107-.578.161-.877.14a1.98 1.98 0 0 1-.357-.057 2.099 2.099 0 0 1-1.338-1.015 2.12 2.12 0 0 1-.031-1.95c1.516-4.464 3.036-8.925 4.557-13.386.206-.63.71-1.064 1.367-1.185.191-.035.385-.04.579-.012z" />
      </svg>
    ),
    shareUrl: (text, url) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "copy",
    name: "Copy Link",
    icon: <LinkIcon className="w-5 h-5 mr-3" />,
    action: async (url) => {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link: ", err);
      }
    },
  },
];

export default function ShareOptions({ isOpen, onClose, post, selectedText }) {
  const handleOptionClick = (optionId) => {
    handleShare(optionId);
    onClose();
  };

  const handleShare = async (platform) => {
    const postUrl = window.location.href;
    const shareText = selectedText ? `"${selectedText}" - from ${post.title}` : `Check out this post: ${post.title}`;

    const option = shareOptions.find((opt) => opt.id === platform);
    if (!option) return;

    if (platform === "copy") {
      try {
        let textToCopy = selectedText ? `"${selectedText}"\n\nFrom: ${post.title}\n${postUrl}` : postUrl;
        await navigator.clipboard.writeText(textToCopy);
        alert("Copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    } else if (option.shareUrl) {
      window.open(option.shareUrl(shareText, postUrl), "_blank");
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: postUrl,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg 
              border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
        >
          <div className="py-1">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="flex items-center w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                {option.icon}
                {option.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
