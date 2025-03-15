const { createClient } = require("@supabase/supabase-js");

// Set headers for CORS and content type
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
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

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  // Environment variables
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

  // Validate required environment variables
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing Supabase environment variables");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Server configuration error (database)" }),
    };
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log("Supabase client initialized");

    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 0;

    // Calculate pagination range
    const from = page * limit;
    const to = from + limit - 1;

    // Get count of all approved notes
    console.log("Fetching note count...");
    const { count, error: countError } = await supabase.from("fan_notes").select("*", { count: "exact", head: true }).eq("approved", true);

    if (countError) {
      console.error("Error retrieving note count:", countError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: "Failed to retrieve note count",
          error: countError,
        }),
      };
    }

    // Get the actual notes with pagination
    console.log(`Fetching notes (page ${page}, limit ${limit})...`);
    const { data, error } = await supabase.from("fan_notes").select("id, name, content, created_at").eq("approved", true).order("created_at", { ascending: false }).range(from, to);

    if (error) {
      console.error("Error retrieving notes:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: "Failed to retrieve notes",
          error,
        }),
      };
    }

    console.log(`Retrieved ${data?.length || 0} notes`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        notes: data || [],
        count: count || 0,
        page,
        limit,
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
