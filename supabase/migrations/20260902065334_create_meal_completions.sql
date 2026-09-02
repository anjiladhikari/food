create table public.meal_completions (
    id uuid primary key default gen_random_uuid(),

    user_id uuid references auth.users(id) on delete cascade,

    meal_date date not null,
    meal_type text not null check (
        meal_type in ('breakfast', 'lunch', 'dinner')
    ),

    completed_at timestamptz not null default now(),

    unique (meal_date, meal_type)
);

alter table public.meal_completions enable row level security;