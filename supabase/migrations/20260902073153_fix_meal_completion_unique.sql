alter table public.meal_completions
drop constraint meal_completions_meal_date_meal_type_key;

alter table public.meal_completions
add constraint meal_completions_user_date_meal_unique
unique (user_id, meal_date, meal_type);