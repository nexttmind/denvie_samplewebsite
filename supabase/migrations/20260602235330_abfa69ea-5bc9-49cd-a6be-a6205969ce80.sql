
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Tighten newsletter insert: limit one row per email (already unique) and basic shape
drop policy if exists "newsletter public insert" on public.newsletter_subscribers;
create policy "newsletter public insert" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (char_length(email) between 5 and 255 and email like '%_@_%.__%');
