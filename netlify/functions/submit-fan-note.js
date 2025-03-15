const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const crypto = require("crypto");
const Filter = require("bad-words");

// Set headers for CORS and content type
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// Environment variables with improved validation
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  RECAPTCHA_SECRET_KEY,
  RATE_LIMIT_WINDOW = "300", // 5 minutes in seconds
  RATE_LIMIT_MAX_REQUESTS = "3", // Max 3 submissions in the window
  IP_SALT = "default-random-salt-12345",
} = process.env;

// Create a proper instance of the filter
// Note: Make sure this is instantiated correctly
const filter = new Filter();

// Add additional offensive words, including Indonesian profanity
filter.addWords([
  // Indonesian profanity
  "anjing",
  "babi",
  "bangsat",
  "kontol",
  "memek",
  "ngentot",
  "perek",
  "jancuk",
  "cuk",
  "asu",
  "togel",
  "tocil",
  "tempik",
  "ngewe",
  "tolol",
  "goblok",
  "goblog",
  "idiot",
  "keparat",
  "bego",
  "bodoh",
  // English additions
  "stfu",
  "kys",
  "gtfo",
]);

// Helper to hash IP addresses for privacy
const hashIp = (ip) => {
  return crypto.createHash("sha256").update(`${ip}:${IP_SALT}`).digest("hex");
};

// Moderate content using bad-words library
const moderateContent = (text) => {
  if (!text) {
    console.error("No text provided for content moderation");
    return false;
  }

  try {
    console.log("Checking content with bad-words filter...");

    // Check if text contains profanity
    const containsProfanity = filter.isProfane(text);

    if (containsProfanity) {
      console.log("Content flagged as inappropriate (contains profanity)");
      // Log the cleaned version with asterisks to see what was flagged
      console.log("Cleaned version would be:", filter.clean(text));
      return false;
    }

    console.log("Content passed moderation check");
    return true;
  } catch (error) {
    console.error("Content moderation error:", error.message);
    return false; // Block content when moderation fails
  }
};

// Verify reCAPTCHA token with improved error handling
const verifyRecaptcha = async (token) => {
  try {
    if (!RECAPTCHA_SECRET_KEY) {
      console.error("RECAPTCHA_SECRET_KEY is not set in environment variables");
      return false;
    }

    if (!token) {
      console.error("No reCAPTCHA token provided");
      return false;
    }

    console.log("Verifying reCAPTCHA token...");
    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    const success = response.data.success;
    const score = response.data.score;

    console.log("reCAPTCHA verification result:", {
      success,
      score: score || "N/A",
      hostname: response.data.hostname || "N/A",
      action: response.data.action || "N/A",
      challengeTs: response.data.challenge_ts || "N/A",
    });

    // For reCAPTCHA v3, check the score (if available)
    if (success && score !== undefined) {
      return score >= 0.5; // Threshold for bot detection
    }

    return success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
};

// Check rate limiting
const checkRateLimit = async (supabase, ipHash) => {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return false;
  }

  const windowStart = Math.floor(Date.now() / 1000) - parseInt(RATE_LIMIT_WINDOW);

  try {
    const { count, error } = await supabase
      .from("fan_notes")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(windowStart * 1000).toISOString());

    if (error) {
      console.error("Rate limit check error:", error);
      return false;
    }

    const isWithinLimit = count < parseInt(RATE_LIMIT_MAX_REQUESTS);
    console.log(`Rate limit check: ${count} submissions in window, limit is ${RATE_LIMIT_MAX_REQUESTS}`);
    return isWithinLimit;
  } catch (error) {
    console.error("Rate limiting error:", error.message);
    return false;
  }
};

exports.handler = async (event, context) => {
  // CORS handling for preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  // Validate required environment variables
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing Supabase environment variables");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Server configuration error (database)" }),
    };
  }

  // Initialize Supabase client
  let supabase;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log("Supabase client initialized");
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Failed to connect to database" }),
    };
  }

  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
      console.log("Request body parsed successfully");
    } catch (error) {
      console.error("JSON parse error:", error.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid JSON in request body" }),
      };
    }

    const { name, content, recaptchaToken } = requestBody;

    // Basic validation
    if (!content || content.trim() === "") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Note content is required" }),
      };
    }

    if (!recaptchaToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "reCAPTCHA token is required" }),
      };
    }

    if (content.length > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Note content exceeds 500 character limit" }),
      };
    }

    // Get client IP (with Netlify handling)
    const clientIp = event.headers["client-ip"] || event.headers["x-forwarded-for"] || "unknown";
    console.log("Client IP obtained:", clientIp === "unknown" ? "unknown" : "IP address present");
    const ipHash = hashIp(clientIp);

    // Step 1: Rate limit check
    const isWithinRateLimit = await checkRateLimit(supabase, ipHash);
    if (!isWithinRateLimit) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ message: "Too many submissions. Please try again later." }),
      };
    }

    // Step 2: Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "reCAPTCHA verification failed. Please try again." }),
      };
    }

    // Step 3: Content moderation (using bad-words)
    const isContentAppropriate = moderateContent(content);
    if (!isContentAppropriate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Your note contains inappropriate content that violates our community guidelines.",
        }),
      };
    }

    // Step 4: Save to database
    console.log("Saving note to database...");
    const { data, error } = await supabase.from("fan_notes").insert({
      name: name || "Anonymous",
      content,
      ip_hash: ipHash,
      // Automatically approve if it passes all checks
      approved: true,
    });

    if (error) {
      console.error("Error saving note:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Failed to save note. Please try again later." }),
      };
    }

    console.log("Note saved successfully");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Note submitted successfully",
        success: true,
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
