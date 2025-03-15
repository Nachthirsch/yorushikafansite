const { createClient } = require("@supabase/supabase-js");

// Environment variables
const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 0;

    // Calculate pagination range
    const from = page * limit;
    const to = from + limit - 1;

    // Get count of all approved notes
    const { count, error: countError } = await supabase.from("fan_notes").select("*", { count: "exact", head: true }).eq("approved", true);

    if (countError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to retrieve note count", error: countError }),
      };
    }

    // Get the actual notes with pagination
    const { data, error } = await supabase.from("fan_notes").select("id, name, content, created_at").eq("approved", true).order("created_at", { ascending: false }).range(from, to);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to retrieve notes", error }),
      };
    }

    return {
      statusCode: 200,
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
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
