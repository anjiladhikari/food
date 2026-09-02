import { supabase } from "./supabase";

export async function getVisitorCount() {
  const { data, error } = await supabase.rpc("get_visitor_count");

  if (error) throw error;

  return data;
}

export async function incrementVisitorCount() {
  const { data, error } = await supabase.rpc("increment_visitor_count");

  if (error) throw error;

  return data;
}