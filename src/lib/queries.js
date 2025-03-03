import { supabase } from "../lib/supabaseClient";

export const fetchPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchAlbums = async () => {
  const { data, error } = await supabase.from("albums").select("*").order("release_date", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchSongs = async () => {
  const { data, error } = await supabase.from("songs").select("*").order("title", { ascending: true });

  if (error) throw error;
  return data;
};

export const deleteItem = async (item) => {
  const { error } = await supabase.from(item.type).delete().eq("id", item.id);

  if (error) throw error;
};
