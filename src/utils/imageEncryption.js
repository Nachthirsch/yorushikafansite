// Create a stronger obfuscation approach
function generateSecureKey() {
  return Array.from(
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint8Array(16))
      : Array(16)
          .fill(0)
          .map(() => Math.floor(Math.random() * 256))
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Cache busting mechanism with secure handling
let securityToken = generateSecureKey();
let lastReset = Date.now();

// Reset security token every 10 minutes
function getOrUpdateSecurityToken() {
  const now = Date.now();
  if (now - lastReset > 10 * 60 * 1000) {
    // 10 minutes
    securityToken = generateSecureKey();
    lastReset = now;
  }
  return securityToken;
}

// A more secure URL obfuscation
export function obfuscateImageUrl(url) {
  try {
    if (!url) return "";

    const token = getOrUpdateSecurityToken();
    const timestamp = Date.now().toString(36);

    // Add cache busting directly in URL to prevent caching
    const urlObj = new URL(url);
    urlObj.searchParams.set("_t", timestamp);
    urlObj.searchParams.set("_s", token.substring(0, 8));

    return urlObj.toString();
  } catch (error) {
    console.error("Error processing image URL");
    // Return original with minimal cache busting as fallback
    return url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now();
  }
}

// Function to safely store image references
const imageCache = new Map();

export function registerImage(id, url) {
  imageCache.set(id, url);
  return id;
}

export function getImageById(id) {
  return imageCache.get(id) || null;
}

export function clearImageCache() {
  imageCache.clear();
}
