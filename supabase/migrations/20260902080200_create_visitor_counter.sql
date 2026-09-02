create table public.site_stats (
    id text primary key,
    visits bigint not null default 0
);

insert into public.site_stats (id, visits)
values ('main', 0);

alter table public.site_stats enable row level security;


create or replace function public.increment_visitor_count()
returns bigint
language sql
security definer
set search_path = public
as $$
    update public.site_stats
    set visits = visits + 1
    where id = 'main'
    returning visits;
$$;


create or replace function public.get_visitor_count()
returns bigint
language sql
security definer
set search_path = public
as $$
    select visits
    from public.site_stats
    where id = 'main';
$$;


grant execute on function public.increment_visitor_count()
to anon, authenticated;

grant execute on function public.get_visitor_count()
to anon, authenticated;