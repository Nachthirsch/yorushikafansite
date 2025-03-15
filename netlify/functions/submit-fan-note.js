const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const crypto = require("crypto");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
  GEMINI_API_KEY, // New environment variable for Gemini AI
  RATE_LIMIT_WINDOW = "300",
  RATE_LIMIT_MAX_REQUESTS = "3",
  IP_SALT = "default-random-salt-12345",
} = process.env;

// Initialize Google Generative AI with your API key
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Helper to hash IP addresses for privacy
const hashIp = (ip) => {
  return crypto.createHash("sha256").update(`${ip}:${IP_SALT}`).digest("hex");
};

// Content moderation using Gemini AI
const moderateContentWithGemini = async (text) => {
  if (!genAI) {
    console.warn("Gemini AI not configured - falling back to basic moderation");
    return moderateContentBasic(text);
  }

  if (!text) {
    console.error("No text provided for content moderation");
    return false;
  }

  try {
    console.log("Checking content with Gemini AI...");

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a moderation prompt
    const prompt = `
      I need you to analyze this fan message for inappropriate content. 
      The message is for a music fan site for the Japanese band Yorushika.
      
      MESSAGE TO ANALYZE: "${text}"
      
      Check for:
      1. Profanity or obscene language
      2. Sexual content
      3. Hate speech or discrimination
      4. Harassment or bullying
      5. Violence or threats
      6. Spam or promotional content
      
      Respond with ONLY "SAFE" if the content is appropriate, or "UNSAFE" if it contains any inappropriate content.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();

    // Log the result
    console.log("Gemini AI moderation result:", responseText);

    // Check if content is safe
    if (responseText.includes("SAFE")) {
      console.log("Content passed Gemini AI moderation check");
      return true;
    } else {
      console.log("Content flagged as inappropriate by Gemini AI");
      return false;
    }
  } catch (error) {
    console.error("Gemini AI moderation error:", error.message);
    // Fall back to basic moderation if Gemini fails
    console.log("Falling back to basic moderation...");
    return moderateContentBasic(text);
  }
};

// Basic content moderation as fallback
const moderateContentBasic = (text) => {
  if (!text) {
    console.error("No text provided for basic moderation");
    return false;
  }

  try {
    console.log("Checking content with basic profanity filter...");

    // Define offensive words directly in the code
    const offensiveWords = [
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
      // English profanity
      "fuck",
      "shit",
      "ass",
      "bitch",
      "cunt",
      "dick",
      "pussy",
      "whore",
      "slut",
      "bastard",
      "nigger",
      "faggot",
      "retard",
      "stfu",
      "kys",
      "gtfo",
      "wtf",
      "ffs",
    ];

    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();

    // Check each offensive word
    for (const word of offensiveWords) {
      // Use word boundary regex to match whole words only
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(lowerText)) {
        console.log(`Content flagged as inappropriate (contains '${word}')`);
        return false;
      }
    }

    console.log("Content passed basic moderation check");
    return true;
  } catch (error) {
    console.error("Basic moderation error:", error.message);
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

    // Step 3: Content moderation (using Gemini AI with fallback)
    const isContentAppropriate = await moderateContentWithGemini(content);
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
