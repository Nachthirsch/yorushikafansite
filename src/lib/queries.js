import { supabase } from "./supabase";

export const fetchPosts = async ({ page = 0, pageSize = 10, filters = {} }) => {
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .lte("publish_date", new Date().toISOString())
    .order("created_at", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  // Apply filters
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  return query;
};

export const fetchAllPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchAlbums = async ({ page = 0, pageSize = 10, filters = {} }) => {
  let query = supabase
    .from("albums")
    .select(
      `
      *,
      songs (
        id,
        title,
        track_number,
        duration
      )
    `,
      { count: "exact" }
    )
    .order("release_date", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  // Apply filters
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }
  if (filters.year && filters.year !== "all") {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query.gte("release_date", startDate).lte("release_date", endDate);
  }

  return query;
};

export const fetchSongs = async ({ page = 0, pageSize = 10, filters = {} }) => {
  let query = supabase
    .from("songs")
    .select("*", { count: "exact" })
    .order("title", { ascending: true })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  // Apply filters
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }
  if (filters.albumId) {
    query = query.eq("album_id", filters.albumId);
  }

  return query;
};

export const deleteItem = async (item) => {
  const { error } = await supabase.from(item.type).delete().eq("id", item.id);

  if (error) throw error;
};

// Real-time subscriptions setup
export const subscribeToUpdates = (table, callback) => {
  const subscription = supabase
    .from(table)
    .on("*", (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeSubscription(subscription);
  };
};

// Error handling helper
export const handleError = (error) => {
  console.error("Database error:", error);

  if (error.code === "PGRST116") {
    return "Invalid query parameters";
  }
  if (error.code === "42P01") {
    return "Requested resource not found";
  }

  return "An unexpected error occurred. Please try again later.";
};
