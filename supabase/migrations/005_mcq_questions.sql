-- ============================================================
-- VidyaSetu — MCQ Questions Seed (005)
-- Run AFTER migrations 001–004.
-- Adds real quiz + questions for several subjects.
-- ============================================================

-- ── First: create quizzes for subjects ──────────────────────────

-- Physics (Grade 12)
INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes, created_by)
SELECT
  '44444444-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000020',
  'Physics Grade 12 — Full Practice Set',
  15, 20,
  (SELECT id FROM public.users LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- Chemistry (Grade 12)
INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes, created_by)
SELECT
  '44444444-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000021',
  'Chemistry Grade 12 — Organic & Inorganic',
  12, 18,
  (SELECT id FROM public.users LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- Mathematics (Grade 12)
INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes, created_by)
SELECT
  '44444444-0000-0000-0000-000000000003',
  '33333333-0000-0000-0000-000000000023',
  'Mathematics Grade 12 — Calculus & Vectors',
  12, 20,
  (SELECT id FROM public.users LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- Loksewa Public Administration
INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes, created_by)
SELECT
  '44444444-0000-0000-0000-000000000004',
  '33333333-0000-0000-0000-000000000050',
  'Loksewa — Public Administration Officer Level',
  15, 25,
  (SELECT id FROM public.users LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- SEE Science & Technology
INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes, created_by)
SELECT
  '44444444-0000-0000-0000-000000000005',
  '33333333-0000-0000-0000-000000000030',
  'SEE Science — Complete Practice Set',
  15, 20,
  (SELECT id FROM public.users LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- ── PHYSICS QUESTIONS ─────────────────────────────────────────
INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES
('44444444-0000-0000-0000-000000000001',
 'Which of the following is the SI unit of electric charge?',
 'Ampere', 'Coulomb', 'Volt', 'Ohm', 'b',
 'The SI unit of electric charge is the Coulomb (C). Ampere is the unit of current.'),

('44444444-0000-0000-0000-000000000001',
 'A body is thrown vertically upward with velocity u. The time to reach maximum height is:',
 'u/g', '2u/g', 'u/2g', 'g/u', 'a',
 'At maximum height, v=0. Using v=u-gt → t = u/g.'),

('44444444-0000-0000-0000-000000000001',
 'The phenomenon of light bending around obstacles is called:',
 'Refraction', 'Reflection', 'Diffraction', 'Dispersion', 'c',
 'Diffraction is the bending of light waves around obstacles or through openings.'),

('44444444-0000-0000-0000-000000000001',
 'Which law states that the EMF induced is proportional to the rate of change of magnetic flux?',
 'Ampere''s Law', 'Coulomb''s Law', 'Faraday''s Law', 'Lenz''s Law', 'c',
 'Faraday''s Law of Electromagnetic Induction states EMF = -dΦ/dt.'),

('44444444-0000-0000-0000-000000000001',
 'In a simple pendulum, the time period T depends on:',
 'Mass of the bob', 'Length and gravity', 'Amplitude', 'Temperature', 'b',
 'T = 2π√(L/g). The period depends only on length L and gravitational acceleration g.'),

('44444444-0000-0000-0000-000000000001',
 'The work done by a force on a body is zero when the force is:',
 'Parallel to displacement', 'Anti-parallel to displacement', 'Perpendicular to displacement', 'None of the above', 'c',
 'W = F·d·cosθ. When θ = 90°, cos90° = 0, so W = 0.'),

('44444444-0000-0000-0000-000000000001',
 'Which type of wave cannot travel through vacuum?',
 'Light waves', 'X-rays', 'Sound waves', 'Radio waves', 'c',
 'Sound is a mechanical wave requiring a medium. EM waves (light, X-rays, radio) travel through vacuum.'),

('44444444-0000-0000-0000-000000000001',
 'The absolute zero temperature in Celsius scale is:',
 '-100°C', '-200°C', '-273.15°C', '-373°C', 'c',
 'Absolute zero is 0 K = -273.15°C, the theoretical lowest possible temperature.'),

('44444444-0000-0000-0000-000000000001',
 'Which mirror is used in vehicle headlights?',
 'Convex mirror', 'Concave mirror', 'Plane mirror', 'Both concave and convex', 'b',
 'Concave mirrors converge light to a focal point, making them ideal for headlights.'),

('44444444-0000-0000-0000-000000000001',
 'The energy stored in a capacitor with capacitance C and voltage V is:',
 'CV', 'CV²', '½CV²', '2CV²', 'c',
 'Energy = ½CV². This is derived from E = ∫V dq = ½Q²/C = ½CV².'),

('44444444-0000-0000-0000-000000000001',
 'Newton''s second law relates force to:',
 'Velocity', 'Acceleration', 'Displacement', 'Position', 'b',
 'F = ma. Newton''s second law: Force = mass × acceleration.'),

('44444444-0000-0000-0000-000000000001',
 'The critical angle for total internal reflection depends on:',
 'Wavelength only', 'Refractive index of the two media', 'Intensity of light', 'Color of light', 'b',
 'sinC = n2/n1. The critical angle depends on the refractive indices of both media.'),

('44444444-0000-0000-0000-000000000001',
 'Alpha particles are composed of:',
 'Electrons and protons', '2 protons and 2 neutrons', '1 proton and 1 neutron', 'Only protons', 'b',
 'Alpha particles (α) consist of 2 protons and 2 neutrons — identical to a Helium-4 nucleus.'),

('44444444-0000-0000-0000-000000000001',
 'The unit of magnetic flux density (B) is:',
 'Weber', 'Tesla', 'Henry', 'Farad', 'b',
 'Magnetic flux density B is measured in Tesla (T) = Wb/m².'),

('44444444-0000-0000-0000-000000000001',
 'In photoelectric effect, increasing the intensity of light:',
 'Increases maximum KE of electrons', 'Increases number of emitted electrons', 'Increases threshold frequency', 'Decreases stopping potential', 'b',
 'Intensity increases the number of photons, thus more electrons are emitted. KE depends only on frequency.');

-- ── CHEMISTRY QUESTIONS ───────────────────────────────────────
INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES
('44444444-0000-0000-0000-000000000002',
 'Which gas is produced when sodium reacts with water?',
 'Oxygen', 'Carbon dioxide', 'Hydrogen', 'Nitrogen', 'c',
 '2Na + 2H₂O → 2NaOH + H₂↑. Hydrogen gas is produced.'),

('44444444-0000-0000-0000-000000000002',
 'The pH of a neutral solution at 25°C is:',
 '0', '7', '14', '1', 'b',
 'pH = 7 indicates a neutral solution where [H⁺] = [OH⁻] = 10⁻⁷ M.'),

('44444444-0000-0000-0000-000000000002',
 'Which of the following is an example of an exothermic reaction?',
 'Melting of ice', 'Decomposition of CaCO₃', 'Combustion of coal', 'Electrolysis of water', 'c',
 'Combustion releases energy (heat) to surroundings — it is exothermic.'),

('44444444-0000-0000-0000-000000000002',
 'The molecular formula of ethanol is:',
 'CH₃OH', 'C₂H₅OH', 'C₃H₇OH', 'HCHO', 'b',
 'Ethanol (drinking alcohol) has the molecular formula C₂H₅OH.'),

('44444444-0000-0000-0000-000000000002',
 'Avogadro''s number is approximately:',
 '6.02 × 10²³', '3.14 × 10²³', '6.02 × 10²²', '9.8 × 10²³', 'a',
 'Avogadro''s number NA = 6.022 × 10²³ mol⁻¹. It represents the number of particles in one mole.'),

('44444444-0000-0000-0000-000000000002',
 'Which type of bond is present in NaCl?',
 'Covalent bond', 'Metallic bond', 'Ionic bond', 'Hydrogen bond', 'c',
 'NaCl is formed by ionic bonding — complete electron transfer from Na to Cl.'),

('44444444-0000-0000-0000-000000000002',
 'The IUPAC name of CH₃-CH₂-OH is:',
 'Methanol', 'Propanol', 'Ethanol', 'Butanol', 'c',
 'CH₃CH₂OH is ethanol (2 carbons with -OH group).'),

('44444444-0000-0000-0000-000000000002',
 'Which gas is responsible for acid rain?',
 'CO₂', 'SO₂ and NOₓ', 'CH₄', 'O₃', 'b',
 'Acid rain is caused by SO₂ and NOₓ reacting with water vapor to form sulfuric and nitric acid.'),

('44444444-0000-0000-0000-000000000002',
 'Rusting of iron is an example of:',
 'Physical change', 'Reduction', 'Oxidation', 'Displacement', 'c',
 'Rusting is oxidation: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃. Iron is oxidized.'),

('44444444-0000-0000-0000-000000000002',
 'The atomic number of Carbon is:',
 '12', '6', '8', '14', 'b',
 'Carbon has atomic number 6 (6 protons). Its mass number is 12.'),

('44444444-0000-0000-0000-000000000002',
 'Le Chatelier''s Principle states that when a system in equilibrium is disturbed, it will:',
 'Break down completely', 'Shift to reduce the disturbance', 'Increase pressure', 'Become acidic', 'b',
 'Le Chatelier''s Principle: A system responds to a disturbance by shifting to counteract it.'),

('44444444-0000-0000-0000-000000000002',
 'Galvanization is the process of coating iron with:',
 'Tin', 'Copper', 'Zinc', 'Aluminum', 'c',
 'Galvanization coats iron with zinc to prevent rusting by sacrificial protection.');

-- ── MATHEMATICS QUESTIONS ────────────────────────────────────
INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES
('44444444-0000-0000-0000-000000000003',
 'The derivative of sin(x) is:',
 '-cos(x)', 'cos(x)', '-sin(x)', 'tan(x)', 'b',
 'd/dx[sin(x)] = cos(x). This is a fundamental differentiation rule.'),

('44444444-0000-0000-0000-000000000003',
 'If A = [1 2; 3 4], the determinant |A| is:',
 '2', '-2', '10', '-10', 'b',
 'det(A) = (1×4) - (2×3) = 4 - 6 = -2.'),

('44444444-0000-0000-0000-000000000003',
 'The integral of 1/x dx is:',
 'x²/2 + C', 'ln|x| + C', 'e^x + C', '1/x² + C', 'b',
 '∫(1/x)dx = ln|x| + C. This is a standard integration rule.'),

('44444444-0000-0000-0000-000000000003',
 'Which of the following is correct for vectors A and B: A × B equals?',
 'B × A', '|A||B|sinθ n̂', '|A||B|cosθ', 'A · B', 'b',
 'Cross product: A × B = |A||B|sinθ n̂, where n̂ is the unit normal vector.'),

('44444444-0000-0000-0000-000000000003',
 'The slope of the line 3x + 2y = 6 is:',
 '3/2', '-3/2', '2/3', '-2/3', 'b',
 'Rewrite: 2y = -3x + 6, y = (-3/2)x + 3. Slope = -3/2.'),

('44444444-0000-0000-0000-000000000003',
 'If f(x) = x³ - 3x + 2, then f''(x) is:',
 '3x² - 3', '3x² + 3', 'x² - 3', '3x - 3', 'a',
 'f''(x) = d/dx(x³ - 3x + 2) = 3x² - 3.'),

('44444444-0000-0000-0000-000000000003',
 'The value of cos(60°) is:',
 '√3/2', '1/2', '1/√2', '√3', 'b',
 'cos(60°) = 1/2. This is a standard trigonometric value.'),

('44444444-0000-0000-0000-000000000003',
 'The equation of a circle with center (0,0) and radius r is:',
 'y = mx + c', 'x² + y² = r²', 'x²/a² + y²/b² = 1', 'ax² + bxy = 0', 'b',
 'Standard equation of a circle centered at origin: x² + y² = r².'),

('44444444-0000-0000-0000-000000000003',
 'How many terms are in the expansion of (a + b)^n?',
 'n', 'n-1', 'n+1', '2n', 'c',
 'By Binomial Theorem, (a+b)^n has n+1 terms.'),

('44444444-0000-0000-0000-000000000003',
 'lim(x→0) [sin(x)/x] equals:',
 '0', 'Undefined', '1', '∞', 'c',
 'The standard limit: lim(x→0) sin(x)/x = 1. This is a fundamental limit in calculus.'),

('44444444-0000-0000-0000-000000000003',
 'In a geometric progression, if a=2, r=3, then the 4th term is:',
 '18', '54', '27', '162', 'b',
 'nth term = ar^(n-1). 4th term = 2 × 3³ = 2 × 27 = 54.'),

('44444444-0000-0000-0000-000000000003',
 'The mean of 5, 10, 15, 20, 25 is:',
 '12', '13', '15', '20', 'c',
 'Mean = (5+10+15+20+25)/5 = 75/5 = 15.');

-- ── LOKSEWA QUESTIONS ─────────────────────────────────────────
INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES
('44444444-0000-0000-0000-000000000004',
 'Which article of the Constitution of Nepal 2072 guarantees the right to education?',
 'Article 29', 'Article 31', 'Article 25', 'Article 18', 'b',
 'Article 31 of the Constitution of Nepal 2072 guarantees the Right to Education.'),

('44444444-0000-0000-0000-000000000004',
 'The National Planning Commission of Nepal was established in:',
 '1956 B.S.', '2013 B.S.', '2006 B.S.', '2018 B.S.', 'b',
 'The National Planning Commission was established in 2013 B.S. (1956 A.D.).'),

('44444444-0000-0000-0000-000000000004',
 'Which body conducts Loksewa (Public Service Commission) examinations in Nepal?',
 'Ministry of Education', 'Lok Sewa Aayog', 'Election Commission', 'Supreme Court', 'b',
 'Lok Sewa Aayog (Public Service Commission) conducts civil service examinations in Nepal.'),

('44444444-0000-0000-0000-000000000004',
 'Who is the Chairman of the National Planning Commission by default?',
 'Finance Minister', 'President', 'Prime Minister', 'Vice President', 'c',
 'The Prime Minister is the ex-officio Chairman of the National Planning Commission of Nepal.'),

('44444444-0000-0000-0000-000000000004',
 'The concept of "Good Governance" includes which of the following?',
 'Transparency and accountability', 'Corruption and nepotism', 'Centralization', 'Discrimination', 'a',
 'Good Governance includes transparency, accountability, rule of law, efficiency, and participation.'),

('44444444-0000-0000-0000-000000000004',
 'Which of the following is a feature of a federal system of government?',
 'Single legislature', 'Division of powers between center and states', 'Unitary executive', 'No written constitution', 'b',
 'In a federal system, powers are constitutionally divided between central and regional governments.'),

('44444444-0000-0000-0000-000000000004',
 'The Sustainable Development Goals (SDGs) were adopted in:',
 '2000', '2010', '2015', '2020', 'c',
 'The 17 SDGs were adopted by the UN General Assembly in September 2015.'),

('44444444-0000-0000-0000-000000000004',
 'Which article of Nepal''s Constitution defines the fundamental duties of citizens?',
 'Article 47', 'Article 50', 'Article 48', 'Article 49', 'c',
 'Article 48 of the Constitution of Nepal 2072 defines fundamental duties of citizens.'),

('44444444-0000-0000-0000-000000000004',
 'The SAARC secretariat is located in:',
 'New Delhi, India', 'Kathmandu, Nepal', 'Dhaka, Bangladesh', 'Colombo, Sri Lanka', 'b',
 'The SAARC Secretariat is located in Kathmandu, Nepal, established in 1985.'),

('44444444-0000-0000-0000-000000000004',
 'In Nepal, the fiscal year runs from:',
 'January to December', 'April to March', 'Shrawan to Ashadh (mid-July to mid-July)', 'Baisakh to Chaitra', 'c',
 'Nepal''s fiscal year runs from 1 Shrawan to 31 Ashadh (approximately mid-July to mid-July).'),

('44444444-0000-0000-0000-000000000004',
 'Which commission is responsible for delineating constituencies in Nepal?',
 'Election Commission', 'National Human Rights Commission', 'Constitutional Commission', 'Boundary Commission', 'a',
 'The Election Commission of Nepal is responsible for constituency delineation and election management.'),

('44444444-0000-0000-0000-000000000004',
 'What does RTI stand for in the context of governance?',
 'Right to Information', 'Right to Income', 'Responsibility and Transparency Index', 'Revenue and Tax Index', 'a',
 'RTI = Right to Information. Nepal enacted the Right to Information Act in 2064 B.S.'),

('44444444-0000-0000-0000-000000000004',
 'The three pillars of sustainable development are:',
 'Economic, Social, Environmental', 'Political, Economic, Social', 'Environmental, Governance, Military', 'Trade, Finance, Law', 'a',
 'The three pillars of sustainable development are Economic growth, Social inclusion, and Environmental sustainability.'),

('44444444-0000-0000-0000-000000000004',
 'Which Act governs Civil Service in Nepal?',
 'Nepal Civil Service Act 2049', 'Civil Administration Act 2056', 'Public Service Act 2063', 'Government Service Act 2055', 'a',
 'The Civil Service Act 2049 B.S. and its Regulations govern Nepal''s civil service.'),

('44444444-0000-0000-0000-000000000004',
 'What is MBO in the context of public administration?',
 'Ministry-Based Organization', 'Management by Objectives', 'Monitoring and Budgeting Operations', 'Ministerial Budget Oversight', 'b',
 'MBO (Management by Objectives) is a strategic management approach where goals are agreed upon between management and employees.');

-- ── SEE SCIENCE QUESTIONS ─────────────────────────────────────
INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES
('44444444-0000-0000-0000-000000000005',
 'Which gas makes up the largest percentage of Earth''s atmosphere?',
 'Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon', 'c',
 'Nitrogen (N₂) makes up about 78% of Earth''s atmosphere.'),

('44444444-0000-0000-0000-000000000005',
 'The process by which plants make their own food using sunlight is called:',
 'Respiration', 'Photosynthesis', 'Transpiration', 'Digestion', 'b',
 'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.'),

('44444444-0000-0000-0000-000000000005',
 'What is the chemical formula of water?',
 'HO', 'H₂O', 'H₂O₂', 'OH', 'b',
 'Water has the chemical formula H₂O — two hydrogen atoms and one oxygen atom.'),

('44444444-0000-0000-0000-000000000005',
 'Which organ pumps blood throughout the body?',
 'Lungs', 'Liver', 'Heart', 'Kidney', 'c',
 'The heart is the muscular organ that pumps blood throughout the circulatory system.'),

('44444444-0000-0000-0000-000000000005',
 'Newton''s first law of motion is also known as:',
 'Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Gravitation', 'b',
 'Newton''s first law states objects remain at rest or in motion unless acted upon by external force — the Law of Inertia.'),

('44444444-0000-0000-0000-000000000005',
 'Which of the following is a non-renewable source of energy?',
 'Solar energy', 'Wind energy', 'Coal', 'Hydropower', 'c',
 'Coal is a fossil fuel — a non-renewable energy source that takes millions of years to form.'),

('44444444-0000-0000-0000-000000000005',
 'The smallest unit of life is:',
 'Atom', 'Molecule', 'Cell', 'Tissue', 'c',
 'The cell is the smallest structural and functional unit of life.'),

('44444444-0000-0000-0000-000000000005',
 'What force keeps planets in orbit around the Sun?',
 'Magnetic force', 'Gravitational force', 'Nuclear force', 'Electric force', 'b',
 'Gravitational force between the Sun and planets keeps them in orbit.'),

('44444444-0000-0000-0000-000000000005',
 'The speed of light in vacuum is approximately:',
 '3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s', 'b',
 'The speed of light c ≈ 3 × 10⁸ m/s (300,000 km/s) in vacuum.'),

('44444444-0000-0000-0000-000000000005',
 'Which vitamin is produced by the skin when exposed to sunlight?',
 'Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D', 'd',
 'Sunlight (UV-B) triggers the synthesis of Vitamin D in the skin.'),

('44444444-0000-0000-0000-000000000005',
 'Acid rain is caused by pollution from:',
 'CO₂ only', 'SO₂ and NOₓ', 'Water vapor', 'Argon gas', 'b',
 'SO₂ and NOₓ from burning fossil fuels react with water to form sulfuric and nitric acid — acid rain.'),

('44444444-0000-0000-0000-000000000005',
 'The process of converting solid directly to vapor is called:',
 'Evaporation', 'Condensation', 'Sublimation', 'Melting', 'c',
 'Sublimation is the direct phase change from solid to gas (e.g., dry ice → CO₂ gas).'),

('44444444-0000-0000-0000-000000000005',
 'DNA stands for:',
 'Deoxyribose Nucleic Acid', 'Deoxyribonucleic Acid', 'Diribonucleic Acid', 'Dioxyribose Nucleic Acid', 'b',
 'DNA = Deoxyribonucleic Acid, the molecule carrying genetic information in cells.'),

('44444444-0000-0000-0000-000000000005',
 'Which planet is known as the Red Planet?',
 'Jupiter', 'Venus', 'Mars', 'Saturn', 'c',
 'Mars is called the Red Planet due to iron oxide (rust) on its surface giving it a reddish color.'),

('44444444-0000-0000-0000-000000000005',
 'Which gas is exhaled by humans during respiration?',
 'Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen', 'c',
 'During cellular respiration, glucose + O₂ → CO₂ + H₂O + energy. CO₂ is exhaled.');
