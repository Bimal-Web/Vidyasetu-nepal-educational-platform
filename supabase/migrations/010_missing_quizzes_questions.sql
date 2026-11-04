-- ============================================================
-- VidyaSetu — Missing Quizzes Questions Migration (010)
-- This populates the 6 remaining quizzes that had no questions
-- 10 questions each for: Physics Gr 12, Chemistry Gr 12, Math Gr 12, Loksewa Public Admin, SEE Science, Loksewa GK
-- ============================================================

-- Clear any old question duplicates for these specific quizzes to remain idempotent
DELETE FROM public.questions WHERE quiz_id IN (
  '44444444-0000-0000-0000-000000000001',
  '44444444-0000-0000-0000-000000000002',
  '44444444-0000-0000-0000-000000000003',
  '44444444-0000-0000-0000-000000000004',
  '44444444-0000-0000-0000-000000000005',
  '44444444-0000-0000-0000-000000000106'
);

INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
-- Physics Grade 12 (001)
  ('44444444-0000-0000-0000-000000000001', 'What is the working principle of a transformer?', 'Self induction', 'Mutual induction', 'Electromagnetic repulsion', 'Ohm''s law', 'b', 'A transformer works on the principle of mutual induction between two coils.'),
  ('44444444-0000-0000-0000-000000000001', 'Magnetic field at the center of a circular current-carrying coil of radius R is proportional to:', '1/R', 'R', 'R²', '1/R²', 'a', 'B = (μ₀·I)/(2R), so B is inversely proportional to R.'),
  ('44444444-0000-0000-0000-000000000001', 'In Young''s Double Slit Experiment, the fringe width is given by:', 'λd/D', 'λD/d', 'dD/λ', 'λ/dD', 'b', 'Fringe width β = λD/d where D is distance to screen and d is slit separation.'),
  ('44444444-0000-0000-0000-000000000001', 'The photoelectric effect successfully proves the:', 'Wave nature of light', 'Particle nature of light', 'Dual nature of matter', 'Diffraction of light', 'b', 'Einstein explained photoelectric effect using photons, proving light''s particle nature.'),
  ('44444444-0000-0000-0000-000000000001', 'The half-life of a radioactive substance with decay constant λ is:', 'λ/ln2', 'ln2/λ', '1/λ', 'e^λ', 'b', 'Half-life T = ln(2)/λ ≈ 0.693/λ.'),
  ('44444444-0000-0000-0000-000000000001', 'According to Coulomb''s Law, the force between two point charges is inversely proportional to:', 'Distance between them', 'Square of the distance between them', 'Product of charges', 'Permittivity', 'b', 'F = k·(q₁q₂)/r². Force is inversely proportional to r².'),
  ('44444444-0000-0000-0000-000000000001', 'In a p-type semiconductor, the majority charge carriers are:', 'Electrons', 'Protons', 'Holes', 'Neutrons', 'c', 'Trivalent doping creates an excess of holes, making them majority carriers.'),
  ('44444444-0000-0000-0000-000000000001', 'According to Bohr''s model, angular momentum of an electron is quantized as integral multiples of:', 'h/2π', 'h/π', '2π/h', 'h', 'a', 'Angular momentum L = n(h/2π).'),
  ('44444444-0000-0000-0000-000000000001', 'Lenz''s Law is a consequence of the law of conservation of:', 'Charge', 'Momentum', 'Energy', 'Mass', 'c', 'Lenz''s law follows the principle of conservation of energy.'),
  ('44444444-0000-0000-0000-000000000001', 'The capacitance of a parallel plate capacitor is directly proportional to:', 'Distance between plates', 'Area of the plates', 'Voltage applied', 'Charge stored', 'b', 'C = (ε₀A)/d, so C is directly proportional to Area (A).'),

-- Chemistry Grade 12 (002)
  ('44444444-0000-0000-0000-000000000002', 'Oxidation of a primary alcohol with acidified KMnO₄ yields:', 'Ketone', 'Aldehyde then Carboxylic acid', 'Alkene', 'Ester', 'b', 'Primary alcohols oxidize first to aldehydes, then further to carboxylic acids with strong oxidants.'),
  ('44444444-0000-0000-0000-000000000002', 'SN2 reactions proceed with:', 'Retention of configuration', 'Racemization', 'Inversion of configuration', 'No stereochemical change', 'c', 'SN2 attacks from the backside, leading to Walden inversion (inversion of configuration).'),
  ('44444444-0000-0000-0000-000000000002', 'In a galvanic cell, oxidation occurs at the:', 'Anode', 'Cathode', 'Salt bridge', 'Electrolyte', 'a', 'By definition, oxidation always occurs at the anode (An Ox).'),
  ('44444444-0000-0000-0000-000000000002', 'Transition metals generally form colored complexes due to:', 'd-d transition of electrons', 'Charge transfer', 'Complete d-orbitals', 'High ionization energy', 'a', 'Unpaired d-electrons undergo d-d transition absorbing visible light, resulting in color.'),
  ('44444444-0000-0000-0000-000000000002', 'Cannizzaro reaction is given by aldehydes that:', 'Have alpha-hydrogen', 'Lack alpha-hydrogen', 'Are aliphatic', 'Are unsaturated', 'b', 'Aldehydes with no α-hydrogen (like formaldehyde or benzaldehyde) undergo Cannizzaro reaction.'),
  ('44444444-0000-0000-0000-000000000002', 'The unit of rate constant (k) for a zero-order reaction is:', 's⁻¹', 'mol L⁻¹ s⁻¹', 'L mol⁻¹ s⁻¹', 'L² mol⁻² s⁻¹', 'b', 'For zero order, rate = k, so k has units of concentration/time: mol L⁻¹ s⁻¹.'),
  ('44444444-0000-0000-0000-000000000002', 'When Phenol is heated with zinc dust, the main product is:', 'Toluene', 'Benzene', 'Benzoic acid', 'Aniline', 'b', 'Zinc dust reduces phenol to benzene by removing oxygen.'),
  ('44444444-0000-0000-0000-000000000002', 'Hess''s Law of constant heat summation is an application of:', 'First law of thermodynamics', 'Second law of thermodynamics', 'Third law of thermodynamics', 'Zeroth law of thermodynamics', 'a', 'Hess''s law is based on the conservation of energy (First law).'),
  ('44444444-0000-0000-0000-000000000002', 'What is the molecular formula of Mohr''s salt?', 'FeSO₄·7H₂O', 'FeSO₄(NH₄)₂SO₄·6H₂O', 'CuSO₄·5H₂O', 'K₂SO₄·Al₂(SO₄)₃·24H₂O', 'b', 'Mohr''s salt is ferrous ammonium sulfate hexahydrate.'),
  ('44444444-0000-0000-0000-000000000002', 'Which equation relates the standard electrode potential to concentration of ions?', 'Arrhenius equation', 'Nernst equation', 'Gibbs-Helmholtz equation', 'Henderson-Hasselbalch equation', 'b', 'Nernst equation calculates cell potential at non-standard conditions.'),

-- Mathematics Grade 12 (003)
  ('44444444-0000-0000-0000-000000000003', 'If two vectors A and B are parallel, their cross product A × B is:', '1', 'A·B', 'Zero vector', 'Unit vector', 'c', 'Cross product magnitude is |A||B|sinθ. For parallel vectors, θ=0, sin0=0.'),
  ('44444444-0000-0000-0000-000000000003', 'If A and B are independent events, then P(A ∩ B) equals:', 'P(A) + P(B)', 'P(A) × P(B)', 'P(A) / P(B)', 'P(A|B)', 'b', 'For independent events, the probability of both occurring is the product of their individual probabilities.'),
  ('44444444-0000-0000-0000-000000000003', 'The derivative of ln(sin x) with respect to x is:', 'cos x', 'tan x', 'cot x', 'sec x', 'c', 'By chain rule, (1/sin x) * cos x = cot x.'),
  ('44444444-0000-0000-0000-000000000003', 'The integration by parts formula is ∫ u dv =', 'u v - ∫ v du', 'u v + ∫ v du', 'du dv - u v', 'v du - ∫ u dv', 'a', 'Standard integration by parts formula derived from the product rule.'),
  ('44444444-0000-0000-0000-000000000003', 'The order of the differential equation d²y/dx² + (dy/dx)³ = y is:', '1', '2', '3', '4', 'b', 'Order is the highest derivative present, which is d²y/dx² (second order).'),
  ('44444444-0000-0000-0000-000000000003', 'The direction cosines of the x-axis are:', '(0, 1, 1)', '(1, 0, 0)', '(0, 0, 1)', '(1, 1, 1)', 'b', 'The x-axis makes angles 0, 90, 90 degrees with x, y, z axes. cosines are 1, 0, 0.'),
  ('44444444-0000-0000-0000-000000000003', 'For a Binomial distribution with parameters n and p, the variance is:', 'np', 'np(1-p)', 'p(1-n)', 'n/p', 'b', 'Variance of binomial distribution is npq, where q = 1-p.'),
  ('44444444-0000-0000-0000-000000000003', 'The maximum value of the function f(x) = sin x + cos x is:', '1', '√2', '2', '0', 'b', 'The maximum value of a*sin x + b*cos x is √(a² + b²) = √(1² + 1²) = √2.'),
  ('44444444-0000-0000-0000-000000000003', 'The general solution of the differential equation dy/dx = y is:', 'y = x + c', 'y = c e^x', 'y = c x', 'y = ln(x) + c', 'b', 'dy/y = dx -> ln|y| = x + c -> y = c e^x.'),
  ('44444444-0000-0000-0000-000000000003', 'The limit lim (x→0) (sin x / x) is equal to:', '0', '1', '∞', 'Undefined', 'b', 'A fundamental trigonometric limit in calculus.'),

-- Loksewa Public Administration (004)
  ('44444444-0000-0000-0000-000000000004', 'Who is considered the father of Public Administration?', 'Max Weber', 'Woodrow Wilson', 'Henri Fayol', 'F.W. Taylor', 'b', 'Woodrow Wilson''s 1887 essay "The Study of Administration" laid the foundation of the discipline.'),
  ('44444444-0000-0000-0000-000000000004', 'In which year was the first Civil Service Act of Nepal promulgated?', '2007 B.S.', '2013 B.S.', '2049 B.S.', '2063 B.S.', 'b', 'The first Civil Service Act of Nepal was enacted in 2013 B.S. by PM Tanka Prasad Acharya.'),
  ('44444444-0000-0000-0000-000000000004', 'What is the maximum age limit for male candidates entering the Nepal Civil Service (Officer level)?', '30 years', '35 years', '40 years', '45 years', 'b', 'The age limit is 35 years for males and 40 years for females.'),
  ('44444444-0000-0000-0000-000000000004', 'The concept of "Bureaucracy" as an ideal organization type was developed by:', 'Karl Marx', 'Elton Mayo', 'Max Weber', 'Herbert Simon', 'c', 'German sociologist Max Weber developed the bureaucratic theory of management.'),
  ('44444444-0000-0000-0000-000000000004', 'In the POSDCORB acronym coined by Luther Gulick, what does ''CO'' stand for?', 'Co-operation', 'Co-ordination', 'Control', 'Communication', 'b', 'It stands for Co-ordinating the various parts of the work.'),
  ('44444444-0000-0000-0000-000000000004', 'The Constitution of Nepal (present) was promulgated on:', 'Jestha 15, 2065', 'Mangsir 4, 2070', 'Ashoj 3, 2072', 'Baisakh 12, 2072', 'c', 'It was promulgated by President Ram Baran Yadav on Ashoj 3, 2072 B.S.'),
  ('44444444-0000-0000-0000-000000000004', 'Who appoints the Chief Secretary of the Government of Nepal?', 'President', 'Prime Minister', 'Council of Ministers', 'Public Service Commission', 'c', 'The Council of Ministers (Cabinet) appoints the Chief Secretary from among secretaries.'),
  ('44444444-0000-0000-0000-000000000004', 'New Public Management (NPM) primarily emphasizes:', 'Strict rules and procedures', 'Hierarchy', 'Results, efficiency, and market principles', 'Centralization', 'c', 'NPM applies private sector management principles to government for better efficiency.'),
  ('44444444-0000-0000-0000-000000000004', 'The supreme body for selecting meritorious candidates for Nepal Civil Service is:', 'Ministry of General Administration', 'Public Service Commission (Loksewa Aayog)', 'Council of Ministers', 'Parliament', 'b', 'Loksewa Aayog is the constitutional body mandated for civil service recruitment.'),
  ('44444444-0000-0000-0000-000000000004', 'Delegation of authority means:', 'Transfer of responsibility permanently', 'Transferring authority to subordinates while retaining accountability', 'Centralizing power', 'Avoiding decisions', 'b', 'A manager delegates authority to subordinates to perform tasks, but remains ultimately responsible.'),

-- SEE Science (005)
  ('44444444-0000-0000-0000-000000000005', 'What is the SI unit of the power of a lens?', 'Meter', 'Watt', 'Diopter', 'Joule', 'c', 'The power of a lens is measured in Diopters (D), where 1 D = 1 m⁻¹.'),
  ('44444444-0000-0000-0000-000000000005', 'The chemical formula of Baking Soda is:', 'Na₂CO₃', 'NaHCO₃', 'NaCl', 'NaOH', 'b', 'Baking soda is Sodium Bicarbonate (NaHCO₃).'),
  ('44444444-0000-0000-0000-000000000005', 'How many chambers are there in a normal human heart?', '2', '3', '4', '5', 'c', 'The human heart has 4 chambers (2 atria, 2 ventricles).'),
  ('44444444-0000-0000-0000-000000000005', 'The principle of floatation was discovered by:', 'Isaac Newton', 'Albert Einstein', 'Archimedes', 'Galileo', 'c', 'Archimedes discovered the laws of buoyancy and floatation.'),
  ('44444444-0000-0000-0000-000000000005', 'The normal blood pressure of a healthy adult human is:', '100/60 mmHg', '120/80 mmHg', '140/90 mmHg', '160/100 mmHg', 'b', '120 mmHg systolic and 80 mmHg diastolic is considered normal.'),
  ('44444444-0000-0000-0000-000000000005', 'Which of the following gases is primarily responsible for the greenhouse effect?', 'Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen', 'c', 'CO₂ traps heat in the atmosphere, driving the greenhouse effect.'),
  ('44444444-0000-0000-0000-000000000005', 'The valency of Carbon is:', '1', '2', '3', '4', 'd', 'Carbon has 4 electrons in its valence shell, so its valency is 4 (tetravalent).'),
  ('44444444-0000-0000-0000-000000000005', 'What is the main ore of Iron?', 'Bauxite', 'Hematite', 'Cinnabar', 'Galena', 'b', 'Hematite (Fe₂O₃) is the primary ore from which iron is extracted.'),
  ('44444444-0000-0000-0000-000000000005', 'The female reproductive part of a flower is called:', 'Androecium', 'Gynoecium (Pistil)', 'Corolla', 'Calyx', 'b', 'The gynoecium contains the stigma, style, and ovary.'),
  ('44444444-0000-0000-0000-000000000005', 'Deficiency of Vitamin D causes which disease?', 'Scurvy', 'Night blindness', 'Rickets', 'Beri-beri', 'c', 'Lack of Vitamin D leads to poor bone development, known as Rickets in children.'),

-- Loksewa GK (106)
  ('44444444-0000-0000-0000-000000000106', 'What is the total geographical area of Nepal?', '141,181 sq. km', '147,181 sq. km', '152,181 sq. km', '147,516 sq. km', 'b', 'The officially recognized traditional area is 147,181 sq. km (though newly updated map claims 147,516 sq. km).'),
  ('44444444-0000-0000-0000-000000000106', 'Who is known as the founder of modern unified Nepal?', 'King Tribhuvan', 'King Mahendra', 'King Prithvi Narayan Shah', 'Bhanubhakta Acharya', 'c', 'King Prithvi Narayan Shah unified the small principalities into a single nation.'),
  ('44444444-0000-0000-0000-000000000106', 'How many provinces are there in the federal structure of Nepal?', '5', '7', '14', '77', 'b', 'The 2015 Constitution divided Nepal into 7 federal provinces.'),
  ('44444444-0000-0000-0000-000000000106', 'Which is the largest district of Nepal by land area?', 'Kathmandu', 'Mustang', 'Dolpa', 'Humla', 'c', 'Dolpa is the largest district with an area of 7,889 sq. km.'),
  ('44444444-0000-0000-0000-000000000106', 'The deepest gorge in the world, the Kali Gandaki Gorge, is located in which country?', 'China', 'India', 'Nepal', 'Peru', 'c', 'It is located in the Himalayas in Nepal between the Dhaulagiri and Annapurna peaks.'),
  ('44444444-0000-0000-0000-000000000106', 'What is the national bird of Nepal?', 'Peacock', 'Danphe (Lophophorus)', 'Spurfowl', 'Eagle', 'b', 'The Himalayan Monal, locally known as Danphe, is the national bird of Nepal.'),
  ('44444444-0000-0000-0000-000000000106', 'The headquarters of the South Asian Association for Regional Cooperation (SAARC) is located in:', 'New Delhi', 'Dhaka', 'Kathmandu', 'Colombo', 'c', 'The SAARC Secretariat was established in Kathmandu, Nepal in 1987.'),
  ('44444444-0000-0000-0000-000000000106', 'Who was the first democratically elected Prime Minister of Nepal?', 'Tanka Prasad Acharya', 'Matrika Prasad Koirala', 'B.P. Koirala', 'Krishna Prasad Bhattarai', 'c', 'Bishweshwar Prasad (B.P.) Koirala became the first elected PM in 1959.'),
  ('44444444-0000-0000-0000-000000000106', 'Which river in Nepal is known as the "River of Sorrow" in Bihar, India?', 'Koshi', 'Gandaki', 'Karnali', 'Bagmati', 'a', 'The Koshi River causes devastating floods in Bihar, earning this title.'),
  ('44444444-0000-0000-0000-000000000106', 'What is the height of Mount Everest according to the latest joint measurement by Nepal and China?', '8848 m', '8848.86 m', '8850 m', '8844 m', 'b', 'In 2020, it was officially announced as 8848.86 meters.')
;
