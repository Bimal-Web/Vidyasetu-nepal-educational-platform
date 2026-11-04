-- ============================================================
-- VidyaSetu — Rich Seed Data Migration (003)
-- Run AFTER 001 (schema), 002 (programs/subjects), 005 (MCQs).
--
-- Automatically picks an admin/contributor from public.users, so
-- no manual UUID substitution is required. Quiz IDs use the
-- 44444444-0000-0000-0000-0000000001xx range to avoid clashing
-- with 005 (…001–005).
-- ============================================================

DO $$
DECLARE
  admin_id  uuid;
  physics_id  uuid := '33333333-0000-0000-0000-000000000001';
  chem_id     uuid := '33333333-0000-0000-0000-000000000002';
  bio_id      uuid := '33333333-0000-0000-0000-000000000003';
  math_id     uuid := '33333333-0000-0000-0000-000000000004';
  cs_id       uuid := '33333333-0000-0000-0000-000000000005';
  anatomy_id  uuid := '33333333-0000-0000-0000-000000000011';
  loksewa_id  uuid := '33333333-0000-0000-0000-000000000007';
BEGIN
  -- Prefer an existing admin, else any user; skip if there are no users.
  SELECT id INTO admin_id FROM public.users WHERE role = 'admin' ORDER BY created_at LIMIT 1;
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM public.users ORDER BY created_at LIMIT 1;
  END IF;
  IF admin_id IS NULL THEN
    RAISE NOTICE 'No users exist yet — create a user before running rich seed.';
    RETURN;
  END IF;

  -- ── Content ──────────────────────────────────────────────
  INSERT INTO public.content
    (subject_id, uploaded_by, title, type, status, views, downloads, created_at)
  VALUES
    (physics_id, admin_id, 'Chapter 1: Motion & Kinematics — Complete Notes',     'note',       'approved', 312, 141, now() - interval '30 days'),
    (physics_id, admin_id, 'Chapter 2: Laws of Motion (Newton)',                   'note',       'approved', 214,  98, now() - interval '25 days'),
    (physics_id, admin_id, 'Chapter 3: Work, Energy & Power',                      'note',       'approved', 188,  72, now() - interval '20 days'),
    (physics_id, admin_id, 'NEB 2079 Physics Board Paper — Q.1 to Q.9',            'past_paper', 'approved', 456, 221, now() - interval '15 days'),
    (physics_id, admin_id, 'NEB 2078 Physics Board Paper',                          'past_paper', 'approved', 389, 198, now() - interval '60 days'),
    (physics_id, admin_id, 'NEB 2077 Physics Board Paper',                          'past_paper', 'approved', 312, 163, now() - interval '90 days'),

    (chem_id,   admin_id, 'Organic Chemistry: Hydrocarbons — Full Chapter',         'note',       'approved', 298, 134, now() - interval '28 days'),
    (chem_id,   admin_id, 'Inorganic Chemistry: Transition Metals',                 'note',       'approved', 145,  67, now() - interval '22 days'),
    (chem_id,   admin_id, 'NEB 2079 Chemistry Board Paper',                         'past_paper', 'approved', 367, 178, now() - interval '12 days'),

    (bio_id,    admin_id, 'Zoology: Cell Biology & Genetics Chapter Notes',         'note',       'approved', 278, 121, now() - interval '27 days'),
    (bio_id,    admin_id, 'Botany: Plant Physiology & Reproduction',                'note',       'approved', 198,  88, now() - interval '21 days'),
    (bio_id,    admin_id, 'NEB 2079 Biology Board Paper',                           'past_paper', 'approved', 421, 211, now() - interval '14 days'),

    (math_id,   admin_id, 'Calculus — Differentiation & Integration Notes',         'note',       'approved', 389, 178, now() - interval '26 days'),
    (math_id,   admin_id, 'Trigonometry & Analytical Geometry Formulas Sheet',       'note',       'approved', 312, 145, now() - interval '18 days'),
    (math_id,   admin_id, 'NEB 2079 Mathematics Board Paper',                       'past_paper', 'approved', 534, 267, now() - interval '11 days'),

    (cs_id,     admin_id, 'C Programming — Functions & Pointers Notes',              'note',       'approved', 234,  98, now() - interval '23 days'),
    (cs_id,     admin_id, 'Database Management Systems — SQL Notes',                 'note',       'approved', 189,  78, now() - interval '17 days'),

    (anatomy_id,admin_id, 'Head & Neck Anatomy — Complete Module Notes',             'note',       'approved', 456, 234, now() - interval '35 days'),
    (anatomy_id,admin_id, 'Thorax & Abdomen Anatomy Notes',                          'note',       'approved', 312, 156, now() - interval '29 days'),
    (anatomy_id,admin_id, 'MBBS Anatomy Year 1 Past Papers — 2078 & 2079',          'past_paper', 'approved', 512, 289, now() - interval '8 days'),

    (loksewa_id,admin_id, 'Nepal Constitution 2072 — Full Summary Notes',            'note',       'approved', 678, 312, now() - interval '40 days'),
    (loksewa_id,admin_id, 'Loksewa Kharidar — GK Practice Set A (2080 Style)',       'mcq_set',    'approved', 423, 198, now() - interval '20 days'),
    (loksewa_id,admin_id, 'Loksewa Na.Su. — Previous Years Questions 2075–2079',    'past_paper', 'approved', 589, 267, now() - interval '10 days')
  ON CONFLICT DO NOTHING;

  -- ── Quizzes (distinct IDs — 1xx range) ─────────────────────
  INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes, created_by)
  VALUES
    ('44444444-0000-0000-0000-000000000101', physics_id,  'Physics Chapter 1 Quiz — Kinematics',      10, 20, admin_id),
    ('44444444-0000-0000-0000-000000000102', physics_id,  'NEB Physics Full Model Test (Set A)',       15, 30, admin_id),
    ('44444444-0000-0000-0000-000000000103', chem_id,     'Chemistry Organic MCQ Practice',           10, 20, admin_id),
    ('44444444-0000-0000-0000-000000000104', bio_id,      'Biology Cell & Genetics Quiz',             12, 25, admin_id),
    ('44444444-0000-0000-0000-000000000105', anatomy_id,  'Anatomy Head & Neck Practice',             15, 30, admin_id),
    ('44444444-0000-0000-0000-000000000106', loksewa_id,  'Loksewa GK Practice Set — 2080 Style',    20, 40, admin_id)
  ON CONFLICT (id) DO NOTHING;

  -- ── Questions: Physics Kinematics Quiz ───────────────────
  INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
  VALUES
    ('44444444-0000-0000-0000-000000000101',
     'A car starts from rest and accelerates uniformly at 4 m/s². What is its velocity after 5 seconds?',
     '10 m/s', '20 m/s', '15 m/s', '25 m/s', 'b',
     'Using v = u + at = 0 + 4×5 = 20 m/s'),
    ('44444444-0000-0000-0000-000000000101',
     'Which of the following is a scalar quantity?',
     'Velocity', 'Acceleration', 'Speed', 'Force', 'c',
     'Speed only has magnitude, making it a scalar. Velocity, acceleration, and force are vectors.'),
    ('44444444-0000-0000-0000-000000000101',
     'A body moving with uniform velocity has zero:',
     'Speed', 'Displacement', 'Acceleration', 'Momentum', 'c',
     'Uniform velocity means constant velocity, so acceleration = 0.'),
    ('44444444-0000-0000-0000-000000000101',
     'The slope of a displacement-time graph gives:',
     'Acceleration', 'Velocity', 'Distance', 'Speed', 'b',
     'Slope = Δdisplacement/Δtime = velocity.'),
    ('44444444-0000-0000-0000-000000000101',
     'A projectile is thrown horizontally from a cliff of height 80 m. Time to reach the ground is: (g = 10 m/s²)',
     '4 s', '8 s', '2 s', '6 s', 'a',
     'h = ½gt² → 80 = ½×10×t² → t² = 16 → t = 4 s'),
    ('44444444-0000-0000-0000-000000000101',
     'Which equation of motion relates velocity, acceleration and displacement?',
     'v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'a = (v-u)/t', 'c',
     'v² = u² + 2as is the equation that directly relates v, u, a and s without time.'),
    ('44444444-0000-0000-0000-000000000101',
     'An object is thrown vertically upward with velocity 20 m/s. Maximum height reached is: (g = 10 m/s²)',
     '10 m', '20 m', '30 m', '40 m', 'b',
     'Using v² = u² - 2gh → 0 = 400 - 20h → h = 20 m'),
    ('44444444-0000-0000-0000-000000000101',
     'Relative velocity of two objects moving in the same direction with velocities v₁ and v₂ (v₁ > v₂) is:',
     'v₁ + v₂', 'v₁ - v₂', 'v₁ × v₂', 'v₁ / v₂', 'b',
     'For same direction motion, relative velocity = v₁ - v₂.'),
    ('44444444-0000-0000-0000-000000000101',
     'The area under a velocity-time graph represents:',
     'Velocity', 'Acceleration', 'Displacement', 'Force', 'c',
     'Area under v-t graph = displacement covered.'),
    ('44444444-0000-0000-0000-000000000101',
     'A body is dropped from rest. Distance fallen in 3rd second is: (g = 10 m/s²)',
     '25 m', '30 m', '20 m', '45 m', 'a',
     'sₙ = u + g(2n-1)/2 = 0 + 10(5)/2 = 25 m');

  -- ── Questions: Loksewa GK Quiz ────────────────────────────
  INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
  VALUES
    ('44444444-0000-0000-0000-000000000106',
     'Nepal''s Constitution was promulgated on:',
     '2072 Asoj 3', '2072 Asoj 7', '2065 Jestha 15', '2047 Baishakh 23', 'a',
     'Nepal''s current constitution was promulgated on 2072 Asoj 3 (20 September 2015).'),
    ('44444444-0000-0000-0000-000000000106',
     'The Lumbini Zone is located in which province of Nepal?',
     'Province No. 3', 'Province No. 5', 'Province No. 4', 'Madhesh Province', 'b',
     'Lumbini is located in Lumbini Province (Province No. 5), the birthplace of Buddha.'),
    ('44444444-0000-0000-0000-000000000106',
     'Which article of the Nepal Constitution deals with the Right to Education?',
     'Article 17', 'Article 31', 'Article 18', 'Article 38', 'b',
     'Article 31 of the Constitution of Nepal 2072 guarantees the Right to Education.'),
    ('44444444-0000-0000-0000-000000000106',
     'The Public Service Commission (Lok Sewa Aayog) was established in Nepal in:',
     '2007 B.S.', '2008 B.S.', '2010 B.S.', '2013 B.S.', 'b',
     'PSC (Lok Sewa Aayog) was established in 2008 B.S. (1951 A.D.).'),
    ('44444444-0000-0000-0000-000000000106',
     'The highest peak in Nepal is:',
     'Kanchenjunga', 'Lhotse', 'Mount Everest (Sagarmatha)', 'Makalu', 'c',
     'Mount Everest (Sagarmatha), at 8,848.86 m, is the highest peak in both Nepal and the world.'),
    ('44444444-0000-0000-0000-000000000106',
     'Nepal''s national currency is:',
     'Indian Rupee', 'Nepali Rupee', 'Bhutanese Ngultrum', 'Tibetan Yuan', 'b',
     'The Nepali Rupee (NPR) is the official currency of Nepal.'),
    ('44444444-0000-0000-0000-000000000106',
     'The CIAA (Commission for Investigation of Abuse of Authority) is formed under which article?',
     'Article 237', 'Article 238', 'Article 236', 'Article 239', 'a',
     'CIAA is provisioned under Article 237-242 of the Constitution of Nepal 2072. Formation under Art 237.'),
    ('44444444-0000-0000-0000-000000000106',
     'Which of the following is NOT a province of Nepal?',
     'Bagmati Province', 'Gandaki Province', 'Narayani Province', 'Koshi Province', 'c',
     'Narayani is not a province name. Nepal has 7 provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, and Sudurpashchim.'),
    ('44444444-0000-0000-0000-000000000106',
     'Nepal became a Federal Democratic Republic on:',
     '2064 Jyestha 15', '2065 Jestha 15', '2064 Asoj 3', '2063 Falgun 1', 'b',
     'Nepal was declared a Federal Democratic Republic on 2065 Jestha 15 (May 28, 2008).'),
    ('44444444-0000-0000-0000-000000000106',
     'Total number of districts in Nepal is:',
     '72', '75', '77', '80', 'c',
     'Nepal currently has 77 districts organized into 7 provinces.'),
    ('44444444-0000-0000-0000-000000000106',
     'The first Prime Minister of Nepal after its declaration as a Republic was:',
     'G.P. Koirala', 'Pushpa Kamal Dahal', 'Sher Bahadur Deuba', 'Madhav Kumar Nepal', 'a',
     'Girija Prasad Koirala was the first Prime Minister after Nepal was declared a Republic in 2008.'),
    ('44444444-0000-0000-0000-000000000106',
     'Which river is called the "Sorrow of Nepal"?',
     'Koshi', 'Gandaki', 'Karnali', 'Bagmati', 'a',
     'The Koshi River is often called the "Sorrow of Nepal" due to its frequent devastating floods.'),
    ('44444444-0000-0000-0000-000000000106',
     'The Fiscal Year in Nepal follows which calendar?',
     'Gregorian Calendar (Jan-Dec)', 'Bikram Sambat (Shrawan - Ashadh)', 'Newari Calendar', 'Lunar Calendar', 'b',
     'Nepal''s fiscal year runs from Shrawan 1 to Ashadh end (mid-July to mid-July).'),
    ('44444444-0000-0000-0000-000000000106',
     'Sagarmatha National Park is located in which district?',
     'Dolakha', 'Taplejung', 'Solukhumbu', 'Sankhuwasabha', 'c',
     'Sagarmatha National Park, home to Mt. Everest, is located in Solukhumbu district.'),
    ('44444444-0000-0000-0000-000000000106',
     'Article 18 of the Constitution of Nepal guarantees:',
     'Right to Freedom', 'Right to Equality', 'Right to Privacy', 'Right to Justice', 'b',
     'Article 18 guarantees the Right to Equality, ensuring no discrimination on various grounds.'),
    ('44444444-0000-0000-0000-000000000106',
     'The National Planning Commission of Nepal comes under:',
     'Ministry of Finance', 'Office of the Prime Minister', 'Parliament Secretariat', 'Judiciary', 'b',
     'The National Planning Commission operates under the Office of the Prime Minister and Council of Ministers.'),
    ('44444444-0000-0000-0000-000000000106',
     'Which act governs the Civil Service of Nepal?',
     'Civil Service Act 2049', 'Administrative Act 2055', 'Public Administration Act 2064', 'Government Service Act 2063', 'a',
     'The Civil Service Act 2049 (and its 2064 amendments) governs civil servants in Nepal.'),
    ('44444444-0000-0000-0000-000000000106',
     'The minimum age to vote in Nepal is:',
     '16 years', '18 years', '21 years', '20 years', 'b',
     'The voting age in Nepal is 18 years as per the Constitution.'),
    ('44444444-0000-0000-0000-000000000106',
     'How many members are in the National Assembly (Rastriya Sabha) of Nepal?',
     '45', '59', '60', '55', 'b',
     'The National Assembly (upper house) has 59 members: 56 elected (8 from each province) + 3 nominated.'),
    ('44444444-0000-0000-0000-000000000106',
     'Chitwan National Park was established in:',
     '2029 B.S.', '2030 B.S.', '2028 B.S.', '2035 B.S.', 'b',
     'Chitwan National Park was established in 2030 B.S. (1973 A.D.) as Nepal''s first national park.');

END $$;
