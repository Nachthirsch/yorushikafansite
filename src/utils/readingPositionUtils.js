/**
 * Save the current reading position for a specific post
 */
export const saveReadingPosition = (postId, position) => {
  try {
    const readingPositions = JSON.parse(localStorage.getItem("readingPositions") || "{}");
    readingPositions[postId] = {
      position,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("readingPositions", JSON.stringify(readingPositions));
  } catch (error) {
    console.error("Failed to save reading position:", error);
  }
};

/**
 * Get the saved reading position for a specific post
 */
export const getReadingPosition = (postId) => {
  try {
    const readingPositions = JSON.parse(localStorage.getItem("readingPositions") || "{}");
    return readingPositions[postId] || null;
  } catch (error) {
    console.error("Failed to get reading position:", error);
    return null;
  }
};
