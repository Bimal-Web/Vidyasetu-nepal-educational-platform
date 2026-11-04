-- ============================================================
-- VidyaSetu — Extended Subjects Migration (004)
-- Run AFTER migrations 001, 002, 003.
-- This adds Grade 12, SEE, and more subjects.
-- ============================================================

-- Grade 12 Science subjects
INSERT INTO public.subjects (id, faculty_id, name, grade_or_semester, description, icon_key, color_key)
VALUES
  ('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000001', 'Physics',
    'Grade 12', 'Advanced Mechanics, Waves, Modern Physics and Electromagnetism for Grade 12.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000021', '22222222-0000-0000-0000-000000000001', 'Chemistry',
    'Grade 12', 'Advanced Organic Chemistry, Electrochemistry and Industrial Chemistry.', 'chemistry', 'amber'),
  ('33333333-0000-0000-0000-000000000022', '22222222-0000-0000-0000-000000000001', 'Biology',
    'Grade 12', 'Advanced Genetics, Evolution, Ecology and Human Physiology.', 'biology', 'green'),
  ('33333333-0000-0000-0000-000000000023', '22222222-0000-0000-0000-000000000001', 'Mathematics',
    'Grade 12', 'Advanced Calculus, Vectors, Complex Numbers, and Statistics.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000024', '22222222-0000-0000-0000-000000000001', 'Computer Science',
    'Grade 12', 'Data Structures, Web Technology, and Programming Paradigms.', 'computer', 'blue'),

  -- Grade 12 Management
  ('33333333-0000-0000-0000-000000000025', '22222222-0000-0000-0000-000000000002', 'Business Studies',
    'Grade 12', 'Management principles, business functions, and entrepreneurship.', 'loksewa', 'indigo'),
  ('33333333-0000-0000-0000-000000000026', '22222222-0000-0000-0000-000000000002', 'Accountancy',
    'Grade 12', 'Financial accounting, partnership accounts, and company accounts.', 'math', 'amber'),
  ('33333333-0000-0000-0000-000000000027', '22222222-0000-0000-0000-000000000002', 'Economics',
    'Grade 12', 'Macro and Micro Economics fundamentals for management students.', 'loksewa', 'green'),

  -- SEE Subjects
  ('33333333-0000-0000-0000-000000000030', '22222222-0000-0000-0000-000000000012', 'Science & Technology',
    'Class 10', 'Complete SEE Science including Physics, Chemistry and Biology fundamentals.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000031', '22222222-0000-0000-0000-000000000012', 'Mathematics',
    'Class 10', 'SEE Mathematics covering Algebra, Geometry, Statistics and Trigonometry.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000032', '22222222-0000-0000-0000-000000000012', 'Nepali',
    'Class 10', 'SEE Nepali grammar, comprehension and essay writing.', 'english', 'green'),
  ('33333333-0000-0000-0000-000000000033', '22222222-0000-0000-0000-000000000012', 'Social Studies',
    'Class 10', 'SEE Social Studies covering History, Geography and Civics of Nepal.', 'loksewa', 'amber'),
  ('33333333-0000-0000-0000-000000000034', '22222222-0000-0000-0000-000000000012', 'English',
    'Class 10', 'SEE English Grammar, Reading Comprehension and Writing skills.', 'english', 'blue'),

  -- IOE Entrance Subjects
  ('33333333-0000-0000-0000-000000000040', '22222222-0000-0000-0000-000000000010', 'IOE Physics',
    'Entrance', 'Intensive IOE entrance physics practice with past questions 2070–2080.', 'physics', 'indigo'),
  ('33333333-0000-0000-0000-000000000041', '22222222-0000-0000-0000-000000000010', 'IOE Mathematics',
    'Entrance', 'Full-coverage IOE entrance mathematics including Sets, Calculus and Vectors.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000042', '22222222-0000-0000-0000-000000000010', 'IOE Chemistry',
    'Entrance', 'IOE entrance chemistry practice sets and past year solutions.', 'chemistry', 'amber'),

  -- Loksewa Officer Level
  ('33333333-0000-0000-0000-000000000050', '22222222-0000-0000-0000-000000000009', 'Public Administration',
    'Officer Level', 'Public Admin theory, governance and policy for Nayab Subba/Officer level.', 'loksewa', 'purple'),
  ('33333333-0000-0000-0000-000000000051', '22222222-0000-0000-0000-000000000009', 'Management & GK',
    'Officer Level', 'Management concepts and GK for Nepal government officer level exams.', 'loksewa', 'indigo')
ON CONFLICT (id) DO NOTHING;
