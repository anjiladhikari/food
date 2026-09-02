drop policy if exists "local dev inventory access"
on public.inventory;

drop policy if exists "local dev purchases access"
on public.purchases;

drop policy if exists "local dev meal completions access"
on public.meal_completions;


create policy "user inventory"
on public.inventory
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());


create policy "user purchases"
on public.purchases
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());


create policy "user meal completions"
on public.meal_completions
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());