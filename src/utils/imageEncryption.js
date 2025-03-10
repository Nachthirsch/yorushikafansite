function generateNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function encryptImageUrl(url) {
  try {
    // Simple obfuscation
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(7);
    const key = timestamp.toString(36) + nonce;

    // Basic string manipulation
    const processed = url
      .split("")
      .reverse()
      .map((c) => c.charCodeAt(0).toString(36))
      .join("");

    return `${key}:${processed}`;
  } catch (error) {
    console.error("Error encrypting URL:", error);
    return url;
  }
}

// Helper function jika diperlukan untuk debugging
export function decryptImageUrl(encoded) {
  try {
    const [key, processed] = encoded.split(":");

    return processed
      .split(/(.{2})/)
      .filter(Boolean)
      .map((c) => String.fromCharCode(parseInt(c, 36)))
      .reverse()
      .join("");
  } catch (error) {
    console.error("Error decrypting URL:", error);
    return encoded;
  }
}

// Helper function untuk mengacak string
function scrambleString(str) {
  return str
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ 0x7f))
    .join("");
}
