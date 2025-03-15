const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const crypto = require("crypto");

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
  PERSPECTIVE_API_KEY,
  RATE_LIMIT_WINDOW = "300", // 5 minutes in seconds
  RATE_LIMIT_MAX_REQUESTS = "3", // Max 3 submissions in the window
  IP_SALT = "default-random-salt-12345",
} = process.env;

// Helper to hash IP addresses for privacy
const hashIp = (ip) => {
  return crypto.createHash("sha256").update(`${ip}:${IP_SALT}`).digest("hex");
};

// Verify reCAPTCHA token with improved error handling
// Only update the verifyRecaptcha function - rest remains the same
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

// Check content using Perspective API with better validation
const checkContentWithPerspective = async (text) => {
  if (!PERSPECTIVE_API_KEY) {
    console.log("Skipping content moderation - PERSPECTIVE_API_KEY not set");
    console.log("IMPORTANT: Set the PERSPECTIVE_API_KEY environment variable to enable content moderation");
    return true; // Let's content through without moderation
  }

  if (!text || text.trim().length === 0) {
    console.error("No text provided for content moderation");
    return false;
  }

  try {
    console.log("Checking content with Perspective API...");
    const response = await axios.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`, {
      comment: { text },
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        INSULT: {},
        PROFANITY: {},
        THREAT: {},
        SEXUALLY_EXPLICIT: {},
        SPAM: {},
      },
    });

    const scores = response.data.attributeScores;

    // Log scores for debugging
    console.log("Content moderation scores:", {
      TOXICITY: scores.TOXICITY?.summaryScore?.value || "N/A",
      SEVERE_TOXICITY: scores.SEVERE_TOXICITY?.summaryScore?.value || "N/A",
      IDENTITY_ATTACK: scores.IDENTITY_ATTACK?.summaryScore?.value || "N/A",
      INSULT: scores.INSULT?.summaryScore?.value || "N/A",
      PROFANITY: scores.PROFANITY?.summaryScore?.value || "N/A",
      THREAT: scores.THREAT?.summaryScore?.value || "N/A",
      SEXUALLY_EXPLICIT: scores.SEXUALLY_EXPLICIT?.summaryScore?.value || "N/A",
      SPAM: scores.SPAM?.summaryScore?.value || "N/A",
    });

    // FIXED COMPLETE CONDITION: Check for problematic content
    // Values range from 0 to 1 where higher values indicate higher likelihood of the attribute
    if (scores.TOXICITY?.summaryScore?.value > 0.8 || scores.SEVERE_TOXICITY?.summaryScore?.value > 0.7 || scores.IDENTITY_ATTACK?.summaryScore?.value > 0.8 || scores.INSULT?.summaryScore?.value > 0.8 || scores.PROFANITY?.summaryScore?.value > 0.8 || scores.THREAT?.summaryScore?.value > 0.8 || scores.SEXUALLY_EXPLICIT?.summaryScore?.value > 0.8 || scores.SPAM?.summaryScore?.value > 0.8) {
      console.log("Content flagged as inappropriate");
      return false; // Content is inappropriate
    }

    console.log("Content passed moderation check");
    return true; // Content is appropriate
  } catch (error) {
    console.error("Perspective API error:", error.message);
    if (error.response) {
      console.error("API response data:", error.response.data);
      console.error("API response status:", error.response.status);
    }

    // If the API fails, we can either:
    // 1. Block the content (safer) - return false
    // 2. Allow the content through (current implementation) - return true

    // For safety, let's change to block content when API fails:
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

    // Step 3: Content moderation
    const isContentAppropriate = await checkContentWithPerspective(content);
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
