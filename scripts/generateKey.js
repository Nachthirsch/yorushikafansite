import { randomBytes } from "crypto";

// Generate a random 32-byte (256-bit) key
const key = randomBytes(32).toString("base64");
console.log("Generated Secret Key:", key);
