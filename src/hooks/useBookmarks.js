import { useState, useEffect } from "react";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("postBookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      // If there's an error, reset bookmarks
      localStorage.removeItem("postBookmarks");
    }
  }, []);

  const saveBookmarks = (newBookmarks) => {
    try {
      localStorage.setItem("postBookmarks", JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };

  const addBookmark = (post) => {
    const newBookmarks = [...bookmarks, post];
    saveBookmarks(newBookmarks);
  };

  const removeBookmark = (postId) => {
    const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== postId);
    saveBookmarks(newBookmarks);
  };

  const isBookmarked = (postId) => {
    return bookmarks.some((bookmark) => bookmark.id === postId);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
