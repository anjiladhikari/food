create table public.purchases (
    id uuid primary key default gen_random_uuid(),

    user_id uuid references auth.users(id) on delete cascade,

    food_name text not null,
    quantity numeric not null check (quantity > 0),
    unit text not null,

    price numeric(10,2) not null check (price >= 0),

    purchased_at timestamptz not null default now()
);

alter table public.purchases enable row level security;