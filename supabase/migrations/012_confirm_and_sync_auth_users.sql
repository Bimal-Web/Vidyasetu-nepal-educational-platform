-- ============================================================
-- VidyaSetu — Migration 012: Confirm Test Accounts in Supabase Auth
-- Ensures test users in Supabase Auth have confirmed emails and
-- matching profiles in public.users.
-- ============================================================

-- 1. Confirm any existing test users in auth.users
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email IN ('testuser123@gmail.com', 'bimalweb842@gmail.com', 'rayansormm@gmail.com', 'qqzillion@gmail.com');

-- 2. Ensure public.users has matching profile records for all auth.users
INSERT INTO public.users (id, email, full_name, auth_provider, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1), 'User'), 
  COALESCE(raw_app_meta_data->>'provider', 'email'), 
  'student'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  full_name = CASE WHEN public.users.full_name IS NULL OR public.users.full_name = '' THEN EXCLUDED.full_name ELSE public.users.full_name END,
  email = EXCLUDED.email;
