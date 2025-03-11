import { useState, useEffect } from "react";

export default function useReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollCompletion);

    // Update on first load
    updateScrollCompletion();

    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return completion;
}
