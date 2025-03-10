import { useState, useEffect } from "react";

export default function useReadingProgress(targetRef) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      if (!targetRef.current) {
        return;
      }

      const element = targetRef.current;
      const totalHeight = element.clientHeight;
      const windowHeight = window.innerHeight;
      const position = window.pageYOffset;

      // Find the element's position relative to the viewport
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top + position;
      const elementBottom = elementTop + totalHeight;

      // Calculate how far we've scrolled within the element
      if (position <= elementTop) {
        // We haven't reached the element yet
        setReadingProgress(0);
      } else if (position + windowHeight >= elementBottom) {
        // We've scrolled past the element
        setReadingProgress(100);
      } else {
        // We're somewhere within the element
        const progress = ((position - elementTop) / (totalHeight - windowHeight)) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", updateReadingProgress);
    window.addEventListener("resize", updateReadingProgress);

    // Initial calculation
    updateReadingProgress();

    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
      window.removeEventListener("resize", updateReadingProgress);
    };
  }, [targetRef]);

  return readingProgress;
}
