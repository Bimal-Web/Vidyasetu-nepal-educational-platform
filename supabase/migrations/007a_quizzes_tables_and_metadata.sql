-- ============================================================
-- VidyaSetu — All-Subject Quizzes & Question Sets (Migration 007)
-- Configures comprehensive quizzes and MCQs for every subject in the platform
-- Self-contained: seeds programs, faculties, subjects, quizzes, and questions
-- ============================================================

-- ── 0a. Ensure UUID extension is enabled ───────────────────
create extension if not exists "uuid-ossp";

-- ── 0b. Ensure core tables exist ────────────────────────────
create table if not exists public.programs (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  level_order int  not null default 0
);

create table if not exists public.faculties_or_streams (
  id         uuid primary key default uuid_generate_v4(),
  program_id uuid not null references public.programs(id) on delete cascade,
  name       text not null
);

create table if not exists public.subjects (
  id               uuid primary key default uuid_generate_v4(),
  faculty_id       uuid not null references public.faculties_or_streams(id) on delete cascade,
  name             text not null,
  grade_or_semester text not null default '',
  description      text not null default '',
  icon_key         text not null default 'global',
  color_key        text not null default 'indigo'
);

create table if not exists public.quizzes (
  id                 uuid primary key default uuid_generate_v4(),
  subject_id         uuid not null references public.subjects(id) on delete cascade,
  title              text not null,
  question_count     int  not null default 0,
  time_limit_minutes int  not null default 30,
  created_by         uuid,  -- nullable: system-seeded quizzes have no user owner
  created_at         timestamptz not null default now()
);
create index if not exists idx_quizzes_subject on public.quizzes(subject_id);

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

-- ── 0c. Safe ALTER: drop NOT NULL on created_by if it exists ─
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'quizzes'
      AND column_name = 'created_by'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.quizzes ALTER COLUMN created_by DROP NOT NULL;
  END IF;
END
$$;

-- ── 0d. Ensure Programs Exist ────────────────────────────────
INSERT INTO public.programs (id, name, level_order) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Pre-School & Primary', 1),
  ('11111111-0000-0000-0000-000000000002', 'Secondary School (SEE)', 2),
  ('11111111-0000-0000-0000-000000000003', 'Plus 2 (+2)', 3),
  ('11111111-0000-0000-0000-000000000004', 'Bachelor''s', 4),
  ('11111111-0000-0000-0000-000000000005', 'Entrance Prep', 5),
  ('11111111-0000-0000-0000-000000000006', 'Loksewa & PSC', 6),
  ('11111111-0000-0000-0000-000000000007', 'Government Competitive', 7)
ON CONFLICT (id) DO NOTHING;

-- ── 0e. Ensure Faculties / Streams Exist ─────────────────────
INSERT INTO public.faculties_or_streams (id, program_id, name) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Science'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', 'Management'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', 'Humanities'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'Engineering / CSIT'),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'Medical (MBBS/BDS)'),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000004', 'Management (BBS/BBA)'),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004', 'Education (B.Ed)'),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000006', 'Kharidar / Na.Su.'),
  ('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000006', 'Officer Level'),
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000005', 'IOE Entrance'),
  ('22222222-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000005', 'IOM / Medical Entrance'),
  ('22222222-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000002', 'Class 9-10 (SEE)')
ON CONFLICT (id) DO NOTHING;

-- ── 1. Ensure All Subjects Exist ─────────────────────────────
INSERT INTO public.subjects (id, faculty_id, name, grade_or_semester, description, icon_key, color_key) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Physics', 'Grade 11', 'Mechanics, Thermodynamics, Optics, and Electromagnetism basics.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Chemistry', 'Grade 11', 'Inorganic, Organic, and Physical Chemistry fundamentals.', 'chemistry', 'amber'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 'Biology', 'Grade 11', 'Comprehensive study of Zoology and Botany for science students.', 'biology', 'green'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'Mathematics', 'Grade 11', 'Calculus, Algebra, Trigonometry, and Analytical Geometry.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000001', 'Computer Science', 'Grade 11', 'Programming concepts, Networking, and Database Systems.', 'computer', 'blue'),
  ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001', 'English', 'Grade 11', 'Literature summaries, Grammar guides, and Writing samples.', 'english', 'red'),
  ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000008', 'General Knowledge', 'Kharidar', 'Comprehensive GK covering Nepal Constitution, Geography, and Current Affairs.', 'loksewa', 'indigo'),
  ('33333333-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000008', 'Nepali Language', 'Kharidar', 'Grammar, comprehension, and writing skills for Loksewa exams.', 'english', 'amber'),
  ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000004', 'Engineering Mathematics I', 'Semester 1', 'Calculus, differential equations, and linear algebra for engineers.', 'math', 'blue'),
  ('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000004', 'C Programming', 'Semester 1', 'Fundamentals of C programming including data structures.', 'computer', 'indigo'),
  ('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000005', 'Anatomy', 'Year 1', 'Human body structure, organs, and systems for MBBS students.', 'medical', 'red'),
  ('33333333-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000005', 'Physiology', 'Year 1', 'Functions of the human body systems and physiological processes.', 'biology', 'green'),
  ('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000001', 'Physics', 'Grade 12', 'Advanced Mechanics, Waves, Modern Physics and Electromagnetism.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000021', '22222222-0000-0000-0000-000000000001', 'Chemistry', 'Grade 12', 'Advanced Organic Chemistry, Electrochemistry and Industrial Chemistry.', 'chemistry', 'amber'),
  ('33333333-0000-0000-0000-000000000022', '22222222-0000-0000-0000-000000000001', 'Biology', 'Grade 12', 'Advanced Genetics, Evolution, Ecology and Human Physiology.', 'biology', 'green'),
  ('33333333-0000-0000-0000-000000000023', '22222222-0000-0000-0000-000000000001', 'Mathematics', 'Grade 12', 'Advanced Calculus, Vectors, Complex Numbers, and Statistics.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000024', '22222222-0000-0000-0000-000000000001', 'Computer Science', 'Grade 12', 'Data Structures, Web Technology, and Programming Paradigms.', 'computer', 'blue'),
  ('33333333-0000-0000-0000-000000000025', '22222222-0000-0000-0000-000000000002', 'Business Studies', 'Grade 12', 'Management principles, business functions, and entrepreneurship.', 'loksewa', 'indigo'),
  ('33333333-0000-0000-0000-000000000026', '22222222-0000-0000-0000-000000000002', 'Accountancy', 'Grade 12', 'Financial accounting, partnership accounts, and company accounts.', 'math', 'amber'),
  ('33333333-0000-0000-0000-000000000027', '22222222-0000-0000-0000-000000000002', 'Economics', 'Grade 12', 'Macro and Micro Economics fundamentals for management students.', 'loksewa', 'green'),
  ('33333333-0000-0000-0000-000000000030', '22222222-0000-0000-0000-000000000012', 'Science & Technology', 'Class 10', 'Complete SEE Science including Physics, Chemistry and Biology.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000031', '22222222-0000-0000-0000-000000000012', 'Mathematics', 'Class 10', 'SEE Mathematics covering Algebra, Geometry, Statistics and Trigonometry.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000032', '22222222-0000-0000-0000-000000000012', 'Nepali', 'Class 10', 'SEE Nepali grammar, comprehension and essay writing.', 'english', 'green'),
  ('33333333-0000-0000-0000-000000000033', '22222222-0000-0000-0000-000000000012', 'Social Studies', 'Class 10', 'SEE Social Studies covering History, Geography and Civics of Nepal.', 'loksewa', 'amber'),
  ('33333333-0000-0000-0000-000000000034', '22222222-0000-0000-0000-000000000012', 'English', 'Class 10', 'SEE English Grammar, Reading Comprehension and Writing skills.', 'english', 'blue'),
  ('33333333-0000-0000-0000-000000000040', '22222222-0000-0000-0000-000000000010', 'IOE Physics', 'Entrance', 'Intensive IOE entrance physics practice with past questions.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000041', '22222222-0000-0000-0000-000000000010', 'IOE Mathematics', 'Entrance', 'Full-coverage IOE entrance mathematics including Sets & Calculus.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000042', '22222222-0000-0000-0000-000000000010', 'IOE Chemistry', 'Entrance', 'IOE entrance chemistry practice sets and past year solutions.', 'chemistry', 'amber'),
  ('33333333-0000-0000-0000-000000000050', '22222222-0000-0000-0000-000000000009', 'Public Administration', 'Officer Level', 'Public Admin theory, governance and policy.', 'loksewa', 'purple'),
  ('33333333-0000-0000-0000-000000000051', '22222222-0000-0000-0000-000000000009', 'Management & GK', 'Officer Level', 'Management concepts and GK for Nepal government officer exams.', 'loksewa', 'indigo')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Create Quizzes for Every Subject ─────────────────────────

INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes) VALUES
  ('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000020', 'Physics Grade 12 — Full Practice Set', 15, 20),
  ('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000021', 'Chemistry Grade 12 — Organic & Inorganic', 12, 18),
  ('44444444-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000023', 'Mathematics Grade 12 — Calculus & Vectors', 12, 20),
  ('44444444-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000050', 'Loksewa — Public Administration Officer Level', 15, 25),
  ('44444444-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000030', 'SEE Science — Complete Practice Set', 15, 20),
  ('44444444-0000-0000-0000-000000000101', '33333333-0000-0000-0000-000000000001', 'Physics Chapter 1 Quiz — Kinematics', 10, 20),
  ('44444444-0000-0000-0000-000000000102', '33333333-0000-0000-0000-000000000001', 'NEB Physics Grade 11 — Heat & Thermodynamics', 10, 20),
  ('44444444-0000-0000-0000-000000000103', '33333333-0000-0000-0000-000000000002', 'Chemistry Grade 11 — Physical & Organic Practice', 10, 20),
  ('44444444-0000-0000-0000-000000000104', '33333333-0000-0000-0000-000000000003', 'Biology Grade 11 — Cell Biology & Taxonomy', 10, 20),
  ('44444444-0000-0000-0000-000000000105', '33333333-0000-0000-0000-000000000011', 'Anatomy Head, Neck & Gross Anatomy', 10, 20),
  ('44444444-0000-0000-0000-000000000106', '33333333-0000-0000-0000-000000000007', 'Loksewa GK Practice Set — 2080 Style', 20, 40),
  ('44444444-0000-0000-0000-000000000200', '33333333-0000-0000-0000-000000000022', 'Biology Grade 12 — Genetics & Evolution', 10, 20),
  ('44444444-0000-0000-0000-000000000201', '33333333-0000-0000-0000-000000000005', 'Computer Science Gr 11 — C Programming Basics', 10, 20),
  ('44444444-0000-0000-0000-000000000202', '33333333-0000-0000-0000-000000000024', 'Computer Science Gr 12 — Data Structures & OOP', 10, 20),
  ('44444444-0000-0000-0000-000000000203', '33333333-0000-0000-0000-000000000004', 'Mathematics Grade 11 — Algebra & Trigonometry', 10, 20),
  ('44444444-0000-0000-0000-000000000204', '33333333-0000-0000-0000-000000000026', 'Accountancy Gr 12 — Financial Accounting MCQs', 10, 20),
  ('44444444-0000-0000-0000-000000000205', '33333333-0000-0000-0000-000000000027', 'Economics Grade 12 — Macro & Micro Quiz', 10, 20),
  ('44444444-0000-0000-0000-000000000206', '33333333-0000-0000-0000-000000000025', 'Business Studies — Management Principles MCQ', 10, 20),
  ('44444444-0000-0000-0000-000000000207', '33333333-0000-0000-0000-000000000031', 'SEE Mathematics — Algebra & Geometry MCQs', 10, 20),
  ('44444444-0000-0000-0000-000000000208', '33333333-0000-0000-0000-000000000034', 'SEE English — Grammar & Comprehension Quiz', 10, 15),
  ('44444444-0000-0000-0000-000000000209', '33333333-0000-0000-0000-000000000033', 'SEE Social Studies — Nepal History & Civics', 10, 15),
  ('44444444-0000-0000-0000-000000000210', '33333333-0000-0000-0000-000000000040', 'IOE Entrance Physics — Full Mock Test', 10, 20),
  ('44444444-0000-0000-0000-000000000211', '33333333-0000-0000-0000-000000000041', 'IOE Entrance Mathematics — Practice Set', 10, 20),
  ('44444444-0000-0000-0000-000000000212', '33333333-0000-0000-0000-000000000012', 'Physiology MBBS — Cardiovascular & Renal', 10, 20),
  ('44444444-0000-0000-0000-000000000213', '33333333-0000-0000-0000-000000000008', 'Loksewa Nepali — व्याकरण र भाषा दक्षता', 10, 15),
  ('44444444-0000-0000-0000-000000000214', '33333333-0000-0000-0000-000000000051', 'Loksewa Management & GK — Officer Level', 10, 20),
  ('44444444-0000-0000-0000-000000000216', '33333333-0000-0000-0000-000000000006', 'English Grade 11 — Grammar & Literature Review', 10, 15),
  ('44444444-0000-0000-0000-000000000217', '33333333-0000-0000-0000-000000000032', 'SEE Nepali — व्याकरण र अभ्यास सेट', 10, 15),
  ('44444444-0000-0000-0000-000000000218', '33333333-0000-0000-0000-000000000009', 'Engineering Math I — Calculus & Linear Algebra', 10, 20),
  ('44444444-0000-0000-0000-000000000219', '33333333-0000-0000-0000-000000000010', 'C Programming — Functions, Pointers & Structures', 10, 20),
  ('44444444-0000-0000-0000-000000000220', '33333333-0000-0000-0000-000000000042', 'IOE Entrance Chemistry — Practice Set', 10, 20)
ON CONFLICT (id) DO NOTHING;
