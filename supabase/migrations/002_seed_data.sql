-- ============================================================
-- VidyaSetu — Seed Data (realistic sample content)
-- Run AFTER 001_initial_schema.sql
-- You must create a Supabase Auth user with admin role first,
-- then replace 'YOUR_ADMIN_USER_ID' with that UUID.
-- ============================================================

-- Programs
insert into public.programs (id, name, level_order) values
  ('11111111-0000-0000-0000-000000000001', 'Pre-School & Primary', 1),
  ('11111111-0000-0000-0000-000000000002', 'Secondary School (SEE)', 2),
  ('11111111-0000-0000-0000-000000000003', 'Plus 2 (+2)', 3),
  ('11111111-0000-0000-0000-000000000004', 'Bachelor''s', 4),
  ('11111111-0000-0000-0000-000000000005', 'Entrance Prep', 5),
  ('11111111-0000-0000-0000-000000000006', 'Loksewa & PSC', 6),
  ('11111111-0000-0000-0000-000000000007', 'Government Competitive', 7)
on conflict (id) do nothing;

-- Faculties / Streams
insert into public.faculties_or_streams (id, program_id, name) values
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
on conflict (id) do nothing;

-- Subjects (Grade 11 Science)
insert into public.subjects (id, faculty_id, name, grade_or_semester, description, icon_key, color_key) values
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Physics',
    'Grade 11', 'Mechanics, Thermodynamics, Optics, and Electromagnetism basics.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Chemistry',
    'Grade 11', 'Inorganic, Organic, and Physical Chemistry fundamentals.', 'chemistry', 'amber'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 'Biology',
    'Grade 11', 'Comprehensive study of Zoology and Botany for science students.', 'biology', 'green'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'Mathematics',
    'Grade 11', 'Calculus, Algebra, Trigonometry, and Analytical Geometry.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000001', 'Computer Science',
    'Grade 11', 'Programming concepts, Networking, and Database Systems.', 'computer', 'blue'),
  ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001', 'English',
    'Grade 11', 'Literature summaries, Grammar guides, and Writing samples.', 'english', 'red'),
  -- Loksewa subjects
  ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000008', 'General Knowledge',
    'Kharidar', 'Comprehensive GK covering Nepal Constitution, Geography, and Current Affairs.', 'loksewa', 'indigo'),
  ('33333333-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000008', 'Nepali Language',
    'Kharidar', 'Grammar, comprehension, and writing skills for Loksewa exams.', 'english', 'amber'),
  -- Bachelor Engineering
  ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000004', 'Engineering Mathematics I',
    'Semester 1', 'Calculus, differential equations, and linear algebra for engineers.', 'math', 'blue'),
  ('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000004', 'C Programming',
    'Semester 1', 'Fundamentals of C programming including data structures.', 'computer', 'indigo'),
  -- Medical
  ('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000005', 'Anatomy',
    'Year 1', 'Human body structure, organs, and systems for MBBS students.', 'medical', 'red'),
  ('33333333-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000005', 'Physiology',
    'Year 1', 'Functions of the human body systems and physiological processes.', 'biology', 'green')
on conflict (id) do nothing;

-- Note: Content rows require a real user ID (uploaded_by FK).
-- After creating your first admin user via Supabase Auth, run:
--
-- insert into public.content (subject_id, uploaded_by, title, type, status, views, downloads)
-- values
--   ('33333333-0000-0000-0000-000000000001', 'YOUR_ADMIN_USER_ID', 'Chapter 1: Motion & Kinematics', 'note', 'approved', 142, 67),
--   ('33333333-0000-0000-0000-000000000001', 'YOUR_ADMIN_USER_ID', 'SEE 2078 Physics Paper', 'past_paper', 'approved', 89, 45),
--   ('33333333-0000-0000-0000-000000000002', 'YOUR_ADMIN_USER_ID', 'Organic Chemistry Notes', 'note', 'approved', 98, 38),
--   ('33333333-0000-0000-0000-000000000011', 'YOUR_ADMIN_USER_ID', 'Introduction to Anatomy – Head & Neck', 'note', 'approved', 200, 120);
--
-- And for quizzes:
-- insert into public.quizzes (subject_id, title, question_count, time_limit_minutes, created_by) values
--   ('33333333-0000-0000-0000-000000000001', 'Physics Chapter 1 Quiz', 14, 20, 'YOUR_ADMIN_USER_ID'),
--   ('33333333-0000-0000-0000-000000000011', 'Anatomy MCQ Practice', 20, 30, 'YOUR_ADMIN_USER_ID');
