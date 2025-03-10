import { preloadImage } from "../components/SecureImage";

// Extracts all image URLs from a content block array
export const extractImageUrls = (contentBlocks) => {
  if (!Array.isArray(contentBlocks)) return [];

  const imageUrls = [];

  contentBlocks.forEach((block) => {
    if (block.type === "image" && block.url) {
      imageUrls.push(block.url);
    }
  });

  return imageUrls;
};

// Preloads all images in an array of blocks
export const preloadContentImages = (contentBlocks) => {
  const imageUrls = extractImageUrls(contentBlocks);

  imageUrls.forEach((url) => {
    preloadImage(url);
  });
};

// Preloads images for an array of posts
export const preloadPostsImages = (posts) => {
  if (!Array.isArray(posts)) return;

  posts.forEach((post) => {
    if (post.cover_image) {
      preloadImage(post.cover_image);
    }
  });
};
