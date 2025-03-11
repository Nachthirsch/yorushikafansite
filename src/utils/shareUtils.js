/**
 * Utility functions for sharing content
 */

/**
 * Upload an image to a server and return the URL
 * This is a placeholder that would need to be implemented with your backend
 *
 * @param {string} imageData - base64 encoded image data
 * @returns {Promise<string>} URL of the uploaded image
 */
export const uploadImageToServer = async (imageData) => {
  // This would be your API call to upload the image
  // Example:
  // const response = await fetch('/api/upload', {
  //   method: 'POST',
  //   body: JSON.stringify({ image: imageData }),
  //   headers: { 'Content-Type': 'application/json' }
  // });
  // const data = await response.json();
  // return data.imageUrl;

  // For now, just simulate the upload with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a placeholder URL
      resolve("https://yorushikafansite.com/shared-image-" + Date.now() + ".png");
    }, 500);
  });
};

/**
 * Share content to social media platforms
 *
 * @param {string} platform - 'twitter', 'facebook', etc.
 * @param {object} content - { text, url, title, imageUrl }
 * @returns {void}
 */
export const shareToSocialMedia = (platform, { text, url, title, imageUrl }) => {
  switch (platform) {
    case "twitter":
      // Twitter has character limits
      const twitterText = text.length > 240 ? text.substring(0, 237) + "..." : text;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`, "_blank");
      break;

    case "facebook":
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, "_blank");
      break;

    case "linkedin":
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
      break;

    default:
      console.log(`Sharing to ${platform} not implemented yet`);
  }
};

/**
 * Download a generated image
 *
 * @param {string} imageData - base64 encoded image
 * @param {string} filename - name for the downloaded file
 */
export const downloadImage = (imageData, filename = "share-image.png") => {
  const link = document.createElement("a");
  link.href = imageData;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
