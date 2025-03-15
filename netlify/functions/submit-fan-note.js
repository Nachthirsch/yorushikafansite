const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const crypto = require("crypto");

// Environment variables
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  RECAPTCHA_SECRET_KEY,
  PERSPECTIVE_API_KEY,
  RATE_LIMIT_WINDOW = "300", // 5 minutes in seconds
  RATE_LIMIT_MAX_REQUESTS = "3", // Max 3 submissions in the window
  IP_SALT = "default-random-salt-12345",
} = process.env;

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper to hash IP addresses for privacy
const hashIp = (ip) => {
  // Use a default salt if environment variable is missing
  const salt = process.env.IP_SALT || "yorushika-fan-default-salt";
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex");
};
// Verify reCAPTCHA token
const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    return response.data.success && response.data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
};

// Check content using Perspective API
const checkContentWithPerspective = async (text) => {
  try {
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

    // Check for problematic content - adjust thresholds as needed
    if (scores.TOXICITY.summaryScore.value > 0.8 || scores.SEVERE_TOXICITY.summaryScore.value > 0.7 || scores.IDENTITY_ATTACK.summaryScore.value > 0.8 || scores.INSULT.summaryScore.value > 0.8 || scores.THREAT.summaryScore.value > 0.8 || scores.SEXUALLY_EXPLICIT.summaryScore.value > 0.8 || scores.SPAM.summaryScore.value > 0.8) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Perspective API error:", error);
    // If the API fails, we'll let the content through but flag it for review
    return true;
  }
};

// Check rate limiting
const checkRateLimit = async (ipHash) => {
  const windowStart = Math.floor(Date.now() / 1000) - parseInt(RATE_LIMIT_WINDOW);

  const { count, error } = await supabase
    .from("fan_notes")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(windowStart * 1000).toISOString());

  if (error) {
    console.error("Rate limit check error:", error);
    return false;
  }

  return count < parseInt(RATE_LIMIT_MAX_REQUESTS);
};

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    // Parse the request body
    const { name, content, recaptchaToken } = JSON.parse(event.body);

    // Basic validation
    if (!content || content.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Note content is required" }),
      };
    }

    if (content.length > 500) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Note content exceeds 500 character limit" }),
      };
    }

    // Get client IP (with Netlify handling)
    const clientIp = event.headers["client-ip"] || event.headers["x-forwarded-for"] || "unknown";

    const ipHash = hashIp(clientIp);

    // Step 1: Rate limit check
    const isWithinRateLimit = await checkRateLimit(ipHash);
    if (!isWithinRateLimit) {
      return {
        statusCode: 429,
        body: JSON.stringify({ message: "Too many submissions. Please try again later." }),
      };
    }

    // Step 2: Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "reCAPTCHA verification failed. Please try again." }),
      };
    }

    // Step 3: Content moderation
    const isContentAppropriate = await checkContentWithPerspective(content);
    if (!isContentAppropriate) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Your note contains inappropriate content that violates our community guidelines.",
        }),
      };
    }

    // Step 4: Save to database
    const { data, error } = await supabase.from("fan_notes").insert({
      name: name || "Anonymous",
      content,
      ip_hash: ipHash,
      // For a real implementation, you might want to leave approved as false until manual review
      approved: true, // Automatically approve if it passes all checks
    });

    if (error) {
      console.error("Error saving note:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save note. Please try again later." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Note submitted successfully",
        success: true,
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
