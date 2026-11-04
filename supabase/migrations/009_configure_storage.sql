-- ============================================================
-- VidyaSetu — Migration 009: Configure Supabase Storage Buckets
-- Creates public bucket 'content-uploads' and access policies
-- ============================================================

-- 1. Create storage bucket for content-uploads if not exists
insert into storage.buckets (id, name, public, file_size_limit)
values (
  'content-uploads',
  'content-uploads',
  true,
  52428800 -- 50 MB limit
)
on conflict (id) do update set public = true;

-- 2. Storage RLS Policies
-- Allow public read access to uploaded notes and resources
drop policy if exists "Public Read Access content-uploads" on storage.objects;
create policy "Public Read Access content-uploads"
  on storage.objects for select
  using (bucket_id = 'content-uploads');

-- Allow users to upload notes/past papers
drop policy if exists "Auth Upload Access content-uploads" on storage.objects;
create policy "Auth Upload Access content-uploads"
  on storage.objects for insert
  with check (bucket_id = 'content-uploads');

-- Allow owners to update their uploaded files
drop policy if exists "Owner Update content-uploads" on storage.objects;
create policy "Owner Update content-uploads"
  on storage.objects for update
  using (bucket_id = 'content-uploads' and auth.uid() = owner);

-- Allow owners to delete their uploaded files
drop policy if exists "Owner Delete content-uploads" on storage.objects;
create policy "Owner Delete content-uploads"
  on storage.objects for delete
  using (bucket_id = 'content-uploads' and auth.uid() = owner);
