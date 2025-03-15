import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Fetches approved fan notes
 * @param {number} limit - Maximum number of notes to fetch
 * @param {number} page - Page number for pagination
 * @returns {Promise<{data: Array, error: Error, count: number}>}
 */
export const getFanNotes = async (limit = 10, page = 0) => {
  const from = page * limit;
  const to = from + limit - 1;

  // Get count of all approved notes
  const { count, error: countError } = await supabase.from("fan_notes").select("*", { count: "exact", head: true }).eq("approved", true);

  if (countError) {
    return { data: [], error: countError, count: 0 };
  }

  // Get the actual notes with pagination
  const { data, error } = await supabase.from("fan_notes").select("id, name, content, created_at").eq("approved", true).order("created_at", { ascending: false }).range(from, to);

  return {
    data: data || [],
    error,
    count: count || 0,
  };
};
