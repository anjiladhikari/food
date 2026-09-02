import { supabase } from "./supabase";

export async function getMealCompletions(date) {
  const { data, error } = await supabase
    .from("meal_completions")
    .select("*")
    .eq("meal_date", date);

  if (error) throw error;

  return data;
}

export async function completeMeal(date, mealType) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("meal_completions")
    .insert({
      user_id: user.id,
      meal_date: date,
      meal_type: mealType,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}