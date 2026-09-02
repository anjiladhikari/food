import { supabase } from "./supabase";

export async function getPurchases() {
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .order("purchased_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addPurchase(
  foodName,
  quantity,
  unit,
  price
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("purchases")
    .insert({
      user_id: user.id,
      food_name: foodName,
      quantity,
      unit,
      price,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}