import { useState, useEffect } from "react";

export default function useReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function updateScrollCompletion() {
      // Get the total scrollable height
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Get current scroll position
      const currentScroll = window.scrollY;

      // Calculate completion percentage
      if (totalHeight) {
        setCompletion(Number((currentScroll / totalHeight) * 100).toFixed(2));
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", updateScrollCompletion);

    // Initial calculation
    updateScrollCompletion();

    // Cleanup
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return completion;
}
