create table public.inventory (
    id uuid primary key default gen_random_uuid(),

    user_id uuid references auth.users(id) on delete cascade,

    food_name text not null,
    quantity numeric not null default 0 check (quantity >= 0),
    unit text not null,

    updated_at timestamptz not null default now()
);

alter table public.inventory enable row level security;