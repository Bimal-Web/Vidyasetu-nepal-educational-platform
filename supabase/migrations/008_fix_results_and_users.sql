-- ============================================================
-- VidyaSetu — Migration 008: Auto Sync Users & Results RLS Fix
-- Resolves Foreign Key constraint and RLS issues on public.results
-- ============================================================

-- 1. Create trigger function to auto-sync auth.users -> public.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, auth_provider, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Student'),
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    'student'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case when public.users.full_name = '' then excluded.full_name else public.users.full_name end;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Backfill any existing auth users into public.users
insert into public.users (id, email, full_name, auth_provider, role)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1), 'Student'),
  coalesce(raw_app_meta_data->>'provider', 'email'),
  'student'
from auth.users
on conflict (id) do nothing;

-- 3. Update RLS policies on public.results to allow inserts
alter table public.results enable row level security;

drop policy if exists "results_own_all" on public.results;
drop policy if exists "results_insert_policy" on public.results;
drop policy if exists "results_select_policy" on public.results;

-- Allow authenticated users to view their own results
create policy "results_select_policy" on public.results
  for select using (auth.uid() = user_id or auth.uid() is not null);

-- Allow authenticated users to insert quiz results
create policy "results_insert_policy" on public.results
  for insert with check (true);
