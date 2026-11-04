-- ============================================================
-- VidyaSetu — Migration 006: Discussion forum, newsletter,
-- and account-deletion RLS policies.
-- Run AFTER 005_mcq_questions.sql
-- ============================================================

-- ── Discussion Posts ────────────────────────────────────────
create table if not exists public.discussion_posts (
  id          uuid primary key default uuid_generate_v4(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_discussion_posts_subject on public.discussion_posts(subject_id);
create index if not exists idx_discussion_posts_user    on public.discussion_posts(user_id);

-- ── Discussion Replies ──────────────────────────────────────
create table if not exists public.discussion_replies (
  id        uuid primary key default uuid_generate_v4(),
  post_id   uuid not null references public.discussion_posts(id) on delete cascade,
  user_id   uuid not null references public.users(id) on delete cascade,
  content   text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_discussion_replies_post on public.discussion_replies(post_id);

-- ── Newsletter Subscribers ──────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.discussion_posts         enable row level security;
alter table public.discussion_replies       enable row level security;
alter table public.newsletter_subscribers   enable row level security;

-- Discussion posts — public read; authenticated users can create; own row update/delete
create policy "discussion_posts_public_read"  on public.discussion_posts for select using (true);
create policy "discussion_posts_insert"       on public.discussion_posts for insert with check (auth.uid() = user_id);
create policy "discussion_posts_own_update"   on public.discussion_posts for update using (auth.uid() = user_id);
create policy "discussion_posts_own_delete"   on public.discussion_posts for delete using (auth.uid() = user_id);

-- Replies — public read; authenticated users can create; own row update/delete
create policy "discussion_replies_public_read" on public.discussion_replies for select using (true);
create policy "discussion_replies_insert"      on public.discussion_replies for insert with check (auth.uid() = user_id);
create policy "discussion_replies_own_update"  on public.discussion_replies for update using (auth.uid() = user_id);
create policy "discussion_replies_own_delete"  on public.discussion_replies for delete using (auth.uid() = user_id);

-- Newsletter — anyone can subscribe; only admins can read/list
create policy "newsletter_public_insert" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter_admin_read"    on public.newsletter_subscribers for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Account self-deletion: allow a user to delete their own row and records
create policy "users_own_delete"        on public.users for delete using (auth.uid() = id);
create policy "content_own_delete"      on public.content for delete using (uploaded_by = auth.uid());
create policy "downloads_own_delete"    on public.downloads_log for delete using (user_id = auth.uid());
create policy "results_own_delete"      on public.results for delete using (user_id = auth.uid());
create policy "bookmarks_own_delete"    on public.bookmarks for delete using (user_id = auth.uid());
create policy "submissions_own_delete"  on public.submissions for delete using (contributor_id = auth.uid());
