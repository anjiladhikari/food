import { supabase } from "./supabase";

async function currentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  return user;
}

export async function getInventory() {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("food_name");

  if (error) throw error;

  return data;
}

export async function addInventoryItem(foodName, quantity, unit) {
  const user = await currentUser();

  const { data: existing, error: findError } = await supabase
    .from("inventory")
    .select("*")
    .eq("user_id", user.id)
    .ilike("food_name", foodName)
    .maybeSingle();

  if (findError) throw findError;

  // Food already exists → increase quantity
  if (existing) {
    if (existing.unit !== unit) {
      throw new Error(
        `${existing.food_name} already uses ${existing.unit}`
      );
    }

    const newQuantity =
      Number(existing.quantity) + Number(quantity);

    const { data, error } = await supabase
      .from("inventory")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // New food
  const { data, error } = await supabase
    .from("inventory")
    .insert({
      user_id: user.id,
      food_name: foodName,
      quantity,
      unit,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateInventoryQuantity(id, quantity) {
  const { error } = await supabase
    .from("inventory")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteInventoryItem(id) {
  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function deductInventoryItem(foodName, amount) {
  const user = await currentUser();

  const { data: item, error: findError } = await supabase
    .from("inventory")
    .select("*")
    .eq("user_id", user.id)
    .ilike("food_name", foodName)
    .maybeSingle();

  if (findError) throw findError;

  // Ignore foods not tracked in inventory
  if (!item) return;

  const newQuantity = Math.max(
    0,
    Number(item.quantity) - Number(amount)
  );

  const { error } = await supabase
    .from("inventory")
    .update({
      quantity: newQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id);

  if (error) throw error;
}