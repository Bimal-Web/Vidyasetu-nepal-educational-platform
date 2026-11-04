-- ============================================================
-- VidyaSetu — Supabase PostgreSQL Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Programs ──────────────────────────────────────────────
create table if not exists public.programs (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  level_order  int  not null default 0
);

-- ── Faculties / Streams ────────────────────────────────────
create table if not exists public.faculties_or_streams (
  id          uuid primary key default uuid_generate_v4(),
  program_id  uuid not null references public.programs(id) on delete cascade,
  name        text not null
);
create index if not exists idx_faculties_program on public.faculties_or_streams(program_id);

-- ── Subjects ──────────────────────────────────────────────
create table if not exists public.subjects (
  id               uuid primary key default uuid_generate_v4(),
  faculty_id       uuid not null references public.faculties_or_streams(id) on delete cascade,
  name             text not null,
  grade_or_semester text not null default '',
  description      text not null default '',
  icon_key         text not null default 'global',
  color_key        text not null default 'indigo'
);
create index if not exists idx_subjects_faculty on public.subjects(faculty_id);

-- ── Users (mirrors Supabase Auth) ─────────────────────────
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null default '',
  email         text not null,
  auth_provider text not null default 'email',
  role          text not null default 'student' check (role in ('student','contributor','admin')),
  avatar_url    text,
  created_at    timestamptz not null default now()
);

-- ── Content ───────────────────────────────────────────────
create table if not exists public.content (
  id          uuid primary key default uuid_generate_v4(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  uploaded_by uuid not null references public.users(id) on delete cascade,
  title       text not null,
  type        text not null check (type in ('note','past_paper','mcq_set')),
  file_url    text,
  drive_url   text,
  file_size   bigint,
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  views       int  not null default 0,
  downloads   int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_content_subject    on public.content(subject_id);
create index if not exists idx_content_status     on public.content(status);
create index if not exists idx_content_uploaded_by on public.content(uploaded_by);

-- ── Quizzes ───────────────────────────────────────────────
create table if not exists public.quizzes (
  id                  uuid primary key default uuid_generate_v4(),
  subject_id          uuid not null references public.subjects(id) on delete cascade,
  title               text not null,
  question_count      int  not null default 0,
  time_limit_minutes  int  not null default 30,
  created_by          uuid not null references public.users(id) on delete cascade,
  created_at          timestamptz not null default now()
);
create index if not exists idx_quizzes_subject on public.quizzes(subject_id);

-- ── Questions ─────────────────────────────────────────────
create table if not exists public.questions (
  id             uuid primary key default uuid_generate_v4(),
  quiz_id        uuid not null references public.quizzes(id) on delete cascade,
  question_text  text not null,
  option_a       text not null,
  option_b       text not null,
  option_c       text not null,
  option_d       text not null,
  correct_option text not null check (correct_option in ('a','b','c','d')),
  explanation    text
);
create index if not exists idx_questions_quiz on public.questions(quiz_id);

-- ── Results ───────────────────────────────────────────────
create table if not exists public.results (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade,
  quiz_id             uuid not null references public.quizzes(id) on delete cascade,
  score               int  not null,
  correct_count       int  not null default 0,
  incorrect_count     int  not null default 0,
  skipped_count       int  not null default 0,
  time_taken_seconds  int  not null default 0,
  attempted_at        timestamptz not null default now()
);
create index if not exists idx_results_user on public.results(user_id);
create index if not exists idx_results_quiz on public.results(quiz_id);

-- ── Bookmarks ─────────────────────────────────────────────
create table if not exists public.bookmarks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  content_id  uuid references public.content(id) on delete cascade,
  subject_id  uuid references public.subjects(id) on delete cascade,
  created_at  timestamptz not null default now(),
  check (content_id is not null or subject_id is not null)
);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);

-- ── Downloads Log ─────────────────────────────────────────
create table if not exists public.downloads_log (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  content_id     uuid not null references public.content(id) on delete cascade,
  downloaded_at  timestamptz not null default now()
);
create index if not exists idx_downloads_user    on public.downloads_log(user_id);
create index if not exists idx_downloads_content on public.downloads_log(content_id);

-- ── Submissions ───────────────────────────────────────────
create table if not exists public.submissions (
  id              uuid primary key default uuid_generate_v4(),
  contributor_id  uuid not null references public.users(id) on delete cascade,
  content_id      uuid not null references public.content(id) on delete cascade,
  status          text not null default 'under_review' check (status in ('under_review','approved','rejected')),
  reviewed_by     uuid references public.users(id),
  reviewed_at     timestamptz
);
create index if not exists idx_submissions_contributor on public.submissions(contributor_id);
create index if not exists idx_submissions_status      on public.submissions(status);

-- ============================================================
-- Row Level Security Policies
-- ============================================================

alter table public.programs              enable row level security;
alter table public.faculties_or_streams  enable row level security;
alter table public.subjects              enable row level security;
alter table public.users                 enable row level security;
alter table public.content               enable row level security;
alter table public.quizzes               enable row level security;
alter table public.questions             enable row level security;
alter table public.results               enable row level security;
alter table public.bookmarks             enable row level security;
alter table public.downloads_log         enable row level security;
alter table public.submissions           enable row level security;

-- Programs / Faculties / Subjects — public read
create policy "public_read_programs"    on public.programs            for select using (true);
create policy "public_read_faculties"   on public.faculties_or_streams for select using (true);
create policy "public_read_subjects"    on public.subjects             for select using (true);

-- Users — own row or admin
create policy "users_own_read"   on public.users for select using (auth.uid() = id);
create policy "users_own_update" on public.users for update using (auth.uid() = id);
create policy "users_insert"     on public.users for insert with check (auth.uid() = id);
create policy "admin_read_users" on public.users for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Content — public read approved; owner/admin can manage
create policy "content_public_read"  on public.content for select using (status = 'approved');
create policy "content_own_read"     on public.content for select using (uploaded_by = auth.uid());
create policy "content_insert"       on public.content for insert with check (uploaded_by = auth.uid());
create policy "admin_content_all"    on public.content for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Quizzes & Questions — public read
create policy "quizzes_public_read"   on public.quizzes   for select using (true);
create policy "questions_public_read" on public.questions  for select using (true);
create policy "quizzes_admin_insert"  on public.quizzes    for insert with check (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','contributor'))
);
create policy "questions_admin_insert" on public.questions for insert with check (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','contributor'))
);

-- Results — own only
create policy "results_own_all" on public.results for all using (user_id = auth.uid());

-- Bookmarks — own only
create policy "bookmarks_own_all" on public.bookmarks for all using (user_id = auth.uid());

-- Downloads log — own insert, admin read all
create policy "downloads_own_insert" on public.downloads_log for insert with check (user_id = auth.uid());
create policy "downloads_own_read"   on public.downloads_log for select using (user_id = auth.uid());
create policy "admin_downloads_read" on public.downloads_log for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Submissions — contributor own; admin all
create policy "submissions_own_all" on public.submissions for all using (contributor_id = auth.uid());
create policy "admin_submissions_all" on public.submissions for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);
