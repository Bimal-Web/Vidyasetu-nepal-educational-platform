-- ============================================================
-- VidyaSetu — Migration 013: Harden Google OAuth & Safe Profile Upsert
-- Safe to run multiple times in the Supabase SQL Editor (Idempotent)
-- ============================================================

-- 1. Ensure username and academic_goal columns exist on public.users
alter table public.users add column if not exists username text;
alter table public.users add column if not exists academic_goal text;

-- Create unique index on username (ignoring nulls)
create unique index if not exists idx_users_username_unique on public.users (lower(username)) where username is not null;

-- 2. Update handle_new_user trigger to safely upsert without overwriting role, username, or academic_goal
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_user_name text;
  clean_email_prefix text;
begin
  -- Generate unique default username from email prefix + random 4-digit number
  clean_email_prefix := coalesce(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'), 'student');
  default_user_name := clean_email_prefix || '_' || floor(1000 + random() * 9000)::text;

  insert into public.users (id, email, full_name, auth_provider, role, avatar_url, username)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Student'),
    coalesce(new.raw_app_meta_data->>'provider', 'google'),
    'student',
    new.raw_user_meta_data->>'avatar_url',
    default_user_name
  )
  on conflict (id) do update set
    -- ONLY update email, full_name and avatar_url
    -- NEVER overwrite role, existing username, or existing academic_goal!
    email = excluded.email,
    full_name = case 
      when excluded.full_name is not null and excluded.full_name <> '' then excluded.full_name 
      else public.users.full_name 
    end,
    avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url);

  return new;
end;
$$ language plpgsql security definer;

-- Reattach trigger safely
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Row Level Security (RLS) policies on public.users
alter table public.users enable row level security;

-- Drop existing policies if any to ensure clean idempotent configuration
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "Users can read own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;

-- Policy: A user can select only their own row
create policy "users_select_own" on public.users
  for select
  using (auth.uid() = id);

-- Policy: A user can update only their own row
create policy "users_update_own" on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: A user can insert only their own row
create policy "users_insert_own" on public.users
  for insert
  with check (auth.uid() = id);
