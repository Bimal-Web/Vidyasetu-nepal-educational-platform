// ============================================================
// VidyaSetu — Demo (offline) data layer
// ------------------------------------------------------------
// Used automatically when real Supabase credentials are not
// configured (see isDemoMode). Provides a fully working,
// in-memory database seeded from supabase/migrations 002-006
// so every page and flow works without a backend.
// ============================================================

export const DEMO_SESSION_COOKIE = 'vs-demo-user'
export const DUMMY_FILE_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

export type Row = Record<string, unknown>

import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from './connect'

export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC_KEY || ''
  return (
    !url ||
    url.includes('YOUR_PROJECT_REF') ||
    url.includes('example.supabase') ||
    !key ||
    key.includes('your-anon-key')
  )
}

// ── Fixed demo identities ────────────────────────────────────
export const DEMO_IDS = {
  admin: 'aaaaaaaa-0000-0000-0000-000000000001',
  contributor: 'aaaaaaaa-0000-0000-0000-000000000002',
  student: 'aaaaaaaa-0000-0000-0000-000000000003',
  aarav: 'aaaaaaaa-0000-0000-0000-000000000004',
  pratiksha: 'aaaaaaaa-0000-0000-0000-000000000005',
  bibek: 'aaaaaaaa-0000-0000-0000-000000000006',
  anisha: 'aaaaaaaa-0000-0000-0000-000000000007',
  nirajan: 'aaaaaaaa-0000-0000-0000-000000000008',
} as const

export const DEMO_PASSWORD = 'demo1234'

// ── Helpers ──────────────────────────────────────────────────
let idCounter = 0
export function uuid(prefix = 'd'): string {
  idCounter += 1
  return `${prefix}-${idCounter.toString(36)}-${Date.now().toString(36)}`
}

export function daysAgo(n: number, hour = 10): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

// ── Static seed data (from migrations 002 + 004) ─────────────
const PROGRAMS: Row[] = [
  { id: '11111111-0000-0000-0000-000000000001', name: 'Pre-School & Primary', level_order: 1 },
  { id: '11111111-0000-0000-0000-000000000002', name: 'Secondary School (SEE)', level_order: 2 },
  { id: '11111111-0000-0000-0000-000000000003', name: 'Plus 2 (+2)', level_order: 3 },
  { id: '11111111-0000-0000-0000-000000000004', name: 'Bachelor\'s', level_order: 4 },
  { id: '11111111-0000-0000-0000-000000000005', name: 'Entrance Prep', level_order: 5 },
  { id: '11111111-0000-0000-0000-000000000006', name: 'Loksewa & PSC', level_order: 6 },
  { id: '11111111-0000-0000-0000-000000000007', name: 'Government Competitive', level_order: 7 },
]

const FACULTIES: Row[] = [
  { id: '22222222-0000-0000-0000-000000000001', program_id: '11111111-0000-0000-0000-000000000003', name: 'Science' },
  { id: '22222222-0000-0000-0000-000000000002', program_id: '11111111-0000-0000-0000-000000000003', name: 'Management' },
  { id: '22222222-0000-0000-0000-000000000003', program_id: '11111111-0000-0000-0000-000000000003', name: 'Humanities' },
  { id: '22222222-0000-0000-0000-000000000004', program_id: '11111111-0000-0000-0000-000000000004', name: 'Engineering / CSIT' },
  { id: '22222222-0000-0000-0000-000000000005', program_id: '11111111-0000-0000-0000-000000000004', name: 'Medical (MBBS/BDS)' },
  { id: '22222222-0000-0000-0000-000000000006', program_id: '11111111-0000-0000-0000-000000000004', name: 'Management (BBS/BBA)' },
  { id: '22222222-0000-0000-0000-000000000007', program_id: '11111111-0000-0000-0000-000000000004', name: 'Education (B.Ed)' },
  { id: '22222222-0000-0000-0000-000000000008', program_id: '11111111-0000-0000-0000-000000000006', name: 'Kharidar / Na.Su.' },
  { id: '22222222-0000-0000-0000-000000000009', program_id: '11111111-0000-0000-0000-000000000006', name: 'Officer Level' },
  { id: '22222222-0000-0000-0000-000000000010', program_id: '11111111-0000-0000-0000-000000000005', name: 'IOE Entrance' },
  { id: '22222222-0000-0000-0000-000000000011', program_id: '11111111-0000-0000-0000-000000000005', name: 'IOM / Medical Entrance' },
  { id: '22222222-0000-0000-0000-000000000012', program_id: '11111111-0000-0000-0000-000000000002', name: 'Class 9-10 (SEE)' },
  { id: '22222222-0000-0000-0000-000000000013', program_id: '11111111-0000-0000-0000-000000000001', name: 'Class 8 (BLE)' },
  { id: '22222222-0000-0000-0000-000000000014', program_id: '11111111-0000-0000-0000-000000000007', name: 'Banking Preparation' },
  { id: '22222222-0000-0000-0000-000000000015', program_id: '11111111-0000-0000-0000-000000000007', name: 'Teacher Service (TSC)' },
  { id: '22222222-0000-0000-0000-000000000016', program_id: '11111111-0000-0000-0000-000000000004', name: 'BCA (Computer Application)' },
]

const SUBJECTS: Row[] = [
  { id: '33333333-0000-0000-0000-000000000001', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Physics', grade_or_semester: 'Grade 11', description: 'Mechanics, Thermodynamics, Optics, and Electromagnetism basics.', icon_key: 'physics', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000002', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Chemistry', grade_or_semester: 'Grade 11', description: 'Inorganic, Organic, and Physical Chemistry fundamentals.', icon_key: 'chemistry', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000003', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Biology', grade_or_semester: 'Grade 11', description: 'Comprehensive study of Zoology and Botany for science students.', icon_key: 'biology', color_key: 'green' },
  { id: '33333333-0000-0000-0000-000000000004', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Mathematics', grade_or_semester: 'Grade 11', description: 'Calculus, Algebra, Trigonometry, and Analytical Geometry.', icon_key: 'math', color_key: 'orange' },
  { id: '33333333-0000-0000-0000-000000000005', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Computer Science', grade_or_semester: 'Grade 11', description: 'Programming concepts, Networking, and Database Systems.', icon_key: 'computer', color_key: 'blue' },
  { id: '33333333-0000-0000-0000-000000000006', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'English', grade_or_semester: 'Grade 11', description: 'Literature summaries, Grammar guides, and Writing samples.', icon_key: 'english', color_key: 'red' },
  { id: '33333333-0000-0000-0000-000000000007', faculty_id: '22222222-0000-0000-0000-000000000008', name: 'General Knowledge', grade_or_semester: 'Kharidar', description: 'Comprehensive GK covering Nepal Constitution, Geography, and Current Affairs.', icon_key: 'loksewa', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000008', faculty_id: '22222222-0000-0000-0000-000000000008', name: 'Nepali Language', grade_or_semester: 'Kharidar', description: 'Grammar, comprehension, and writing skills for Loksewa exams.', icon_key: 'english', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000009', faculty_id: '22222222-0000-0000-0000-000000000004', name: 'Engineering Mathematics I', grade_or_semester: 'Semester 1', description: 'Calculus, differential equations, and linear algebra for engineers.', icon_key: 'math', color_key: 'blue' },
  { id: '33333333-0000-0000-0000-000000000010', faculty_id: '22222222-0000-0000-0000-000000000004', name: 'C Programming', grade_or_semester: 'Semester 1', description: 'Fundamentals of C programming including data structures.', icon_key: 'computer', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000011', faculty_id: '22222222-0000-0000-0000-000000000005', name: 'Anatomy', grade_or_semester: 'Year 1', description: 'Human body structure, organs, and systems for MBBS students.', icon_key: 'medical', color_key: 'red' },
  { id: '33333333-0000-0000-0000-000000000012', faculty_id: '22222222-0000-0000-0000-000000000005', name: 'Physiology', grade_or_semester: 'Year 1', description: 'Functions of the human body systems and physiological processes.', icon_key: 'biology', color_key: 'green' },
  { id: '33333333-0000-0000-0000-000000000020', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Physics', grade_or_semester: 'Grade 12', description: 'Advanced Mechanics, Waves, Modern Physics and Electromagnetism for Grade 12.', icon_key: 'physics', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000021', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Chemistry', grade_or_semester: 'Grade 12', description: 'Advanced Organic Chemistry, Electrochemistry and Industrial Chemistry.', icon_key: 'chemistry', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000022', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Biology', grade_or_semester: 'Grade 12', description: 'Advanced Genetics, Evolution, Ecology and Human Physiology.', icon_key: 'biology', color_key: 'green' },
  { id: '33333333-0000-0000-0000-000000000023', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Mathematics', grade_or_semester: 'Grade 12', description: 'Advanced Calculus, Vectors, Complex Numbers, and Statistics.', icon_key: 'math', color_key: 'orange' },
  { id: '33333333-0000-0000-0000-000000000024', faculty_id: '22222222-0000-0000-0000-000000000001', name: 'Computer Science', grade_or_semester: 'Grade 12', description: 'Data Structures, Web Technology, and Programming Paradigms.', icon_key: 'computer', color_key: 'blue' },
  { id: '33333333-0000-0000-0000-000000000025', faculty_id: '22222222-0000-0000-0000-000000000002', name: 'Business Studies', grade_or_semester: 'Grade 12', description: 'Management principles, business functions, and entrepreneurship.', icon_key: 'loksewa', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000026', faculty_id: '22222222-0000-0000-0000-000000000002', name: 'Accountancy', grade_or_semester: 'Grade 12', description: 'Financial accounting, partnership accounts, and company accounts.', icon_key: 'math', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000027', faculty_id: '22222222-0000-0000-0000-000000000002', name: 'Economics', grade_or_semester: 'Grade 12', description: 'Macro and Micro Economics fundamentals for management students.', icon_key: 'loksewa', color_key: 'green' },
  { id: '33333333-0000-0000-0000-000000000030', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Science & Technology', grade_or_semester: 'Class 10', description: 'Complete SEE Science including Physics, Chemistry and Biology fundamentals.', icon_key: 'physics', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000031', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Mathematics', grade_or_semester: 'Class 10', description: 'SEE Mathematics covering Algebra, Geometry, Statistics and Trigonometry.', icon_key: 'math', color_key: 'orange' },
  { id: '33333333-0000-0000-0000-000000000032', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Nepali', grade_or_semester: 'Class 10', description: 'SEE Nepali grammar, comprehension and essay writing.', icon_key: 'english', color_key: 'green' },
  { id: '33333333-0000-0000-0000-000000000033', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Social Studies', grade_or_semester: 'Class 10', description: 'SEE Social Studies covering History, Geography and Civics of Nepal.', icon_key: 'loksewa', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000034', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'English', grade_or_semester: 'Class 10', description: 'SEE English Grammar, Reading Comprehension and Writing skills.', icon_key: 'english', color_key: 'blue' },
  { id: '33333333-0000-0000-0000-000000000040', faculty_id: '22222222-0000-0000-0000-000000000010', name: 'IOE Physics', grade_or_semester: 'Entrance', description: 'Intensive IOE entrance physics practice with past questions 2070–2080.', icon_key: 'physics', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000041', faculty_id: '22222222-0000-0000-0000-000000000010', name: 'IOE Mathematics', grade_or_semester: 'Entrance', description: 'Full-coverage IOE entrance mathematics including Sets, Calculus and Vectors.', icon_key: 'math', color_key: 'orange' },
  { id: '33333333-0000-0000-0000-000000000042', faculty_id: '22222222-0000-0000-0000-000000000010', name: 'IOE Chemistry', grade_or_semester: 'Entrance', description: 'IOE entrance chemistry practice sets and past year solutions.', icon_key: 'chemistry', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000050', faculty_id: '22222222-0000-0000-0000-000000000009', name: 'Public Administration', grade_or_semester: 'Officer Level', description: 'Public Admin theory, governance and policy for Nayab Subba/Officer level.', icon_key: 'loksewa', color_key: 'purple' },
  { id: '33333333-0000-0000-0000-000000000051', faculty_id: '22222222-0000-0000-0000-000000000009', name: 'Management & GK', grade_or_semester: 'Officer Level', description: 'Management concepts and GK for Nepal government officer level exams.', icon_key: 'loksewa', color_key: 'indigo' },
  // Class 8 (BLE)
  { id: '33333333-0000-0000-0000-000000000052', faculty_id: '22222222-0000-0000-0000-000000000013', name: 'Class 8 Health & Physical Education', grade_or_semester: 'Class 8 (BLE)', description: 'BLE model paper and study resources for Class 8 Health & Physical Education.', icon_key: 'biology', color_key: 'rose' },
  { id: '33333333-0000-0000-0000-000000000053', faculty_id: '22222222-0000-0000-0000-000000000013', name: 'Class 8 Moral Education', grade_or_semester: 'Class 8 (BLE)', description: 'BLE model paper and study resources for Class 8 Moral Education.', icon_key: 'english', color_key: 'purple' },
  { id: '33333333-0000-0000-0000-000000000054', faculty_id: '22222222-0000-0000-0000-000000000013', name: 'Class 8 Social Studies', grade_or_semester: 'Class 8 (BLE)', description: 'BLE model paper and study resources for Class 8 Social Studies.', icon_key: 'loksewa', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000055', faculty_id: '22222222-0000-0000-0000-000000000013', name: 'Class 8 Vocational & Technical Education', grade_or_semester: 'Class 8 (BLE)', description: 'BLE model paper and study resources for Class 8 Vocational & Technical Education.', icon_key: 'computer', color_key: 'green' },
  // SEE Optional / Electives
  { id: '33333333-0000-0000-0000-000000000035', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Optional Mathematics', grade_or_semester: 'Class 10 (SEE)', description: 'Advanced algebra, coordinate geometry, trigonometry, vectors, and transformation.', icon_key: 'math', color_key: 'purple' },
  { id: '33333333-0000-0000-0000-000000000036', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Computer Science', grade_or_semester: 'Class 10 (SEE)', description: 'Networking, cyber law, MS-Access database, and QBASIC modular programming for SEE.', icon_key: 'computer', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000037', faculty_id: '22222222-0000-0000-0000-000000000012', name: 'Economics', grade_or_semester: 'Class 10 (SEE)', description: 'SEE Economics covering demand, supply, national income, banking, and Nepal economy.', icon_key: 'loksewa', color_key: 'rose' },
  // Plus 2 Humanities
  { id: '33333333-0000-0000-0000-000000000060', faculty_id: '22222222-0000-0000-0000-000000000003', name: 'Sociology', grade_or_semester: 'Grade 11/12', description: 'Social systems, Nepali society, culture, social stratification, and social change.', icon_key: 'loksewa', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000061', faculty_id: '22222222-0000-0000-0000-000000000003', name: 'Mass Communication & Journalism', grade_or_semester: 'Grade 11/12', description: 'News reporting, editing, media ethics, broadcasting, and mass communication theories.', icon_key: 'english', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000062', faculty_id: '22222222-0000-0000-0000-000000000003', name: 'Major English', grade_or_semester: 'Grade 11/12', description: 'English literary genres, poems, drama, short stories, and critical analysis.', icon_key: 'english', color_key: 'red' },
  // Plus 2 Management additions
  { id: '33333333-0000-0000-0000-000000000063', faculty_id: '22222222-0000-0000-0000-000000000002', name: 'Hotel Management', grade_or_semester: 'Grade 11/12', description: 'Food production, housekeeping, front office operations, and hospitality tourism in Nepal.', icon_key: 'loksewa', color_key: 'rose' },
  { id: '33333333-0000-0000-0000-000000000064', faculty_id: '22222222-0000-0000-0000-000000000002', name: 'Business Mathematics', grade_or_semester: 'Grade 11/12', description: 'Commercial mathematics, matrix algebra, linear programming, and compound interest calculations.', icon_key: 'math', color_key: 'orange' },
  // Government Competitive
  { id: '33333333-0000-0000-0000-000000000070', faculty_id: '22222222-0000-0000-0000-000000000014', name: 'Banking Law & Financial Management', grade_or_semester: 'Competitive', description: 'NRB Act, BAFIA, anti-money laundering, monetary policy, and commercial banking practice in Nepal.', icon_key: 'math', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000071', faculty_id: '22222222-0000-0000-0000-000000000015', name: 'TSC Teaching Pedagogy & Curriculum', grade_or_semester: 'Competitive', description: 'Teacher Service Commission pedagogy, child psychology, curriculum evaluation, and teaching methods.', icon_key: 'english', color_key: 'amber' },
  // BCA (Bachelor of Computer Application)
  { id: '33333333-0000-0000-0000-000000000080', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'C Programming', grade_or_semester: 'Semester 1 (BCA)', description: 'Structured programming concepts, pointers, memory allocation, arrays, structures, and file IO in C.', icon_key: 'computer', color_key: 'indigo' },
  { id: '33333333-0000-0000-0000-000000000081', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'Computer Fundamentals & Applications', grade_or_semester: 'Semester 1 (BCA)', description: 'Computer hardware architecture, operating system basics, number systems, and business application software.', icon_key: 'computer', color_key: 'blue' },
  { id: '33333333-0000-0000-0000-000000000082', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'Discrete Mathematics', grade_or_semester: 'Semester 2 (BCA)', description: 'Sets, relations, recurrence relations, graph theory, trees, and logic gates for computer application students.', icon_key: 'math', color_key: 'orange' },
  { id: '33333333-0000-0000-0000-000000000083', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'Data Structures & Algorithms', grade_or_semester: 'Semester 3 (BCA)', description: 'Stacks, queues, linked lists, trees, graphs, hashing, sorting algorithms, and time complexity analysis.', icon_key: 'computer', color_key: 'purple' },
  { id: '33333333-0000-0000-0000-000000000084', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'Object Oriented Programming in Java', grade_or_semester: 'Semester 3 (BCA)', description: 'Java OOP, inheritance, interfaces, packages, exception handling, multithreading, and GUI with Swing.', icon_key: 'computer', color_key: 'amber' },
  { id: '33333333-0000-0000-0000-000000000085', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'Database Management System', grade_or_semester: 'Semester 4 (BCA)', description: 'ER modeling, relational schemas, SQL, normalization (1NF-BCNF), concurrency control, and transactions.', icon_key: 'computer', color_key: 'green' },
  { id: '33333333-0000-0000-0000-000000000086', faculty_id: '22222222-0000-0000-0000-000000000016', name: 'Web Technology', grade_or_semester: 'Semester 4 (BCA)', description: 'HTML5, CSS3, modern JavaScript ES6+, PHP, MySQL backend, and building responsive dynamic web apps.', icon_key: 'computer', color_key: 'rose' },
]

const SUBJECT_IDS = {
  physics11: '33333333-0000-0000-0000-000000000001',
  chem11: '33333333-0000-0000-0000-000000000002',
  bio11: '33333333-0000-0000-0000-000000000003',
  math11: '33333333-0000-0000-0000-000000000004',
  cs11: '33333333-0000-0000-0000-000000000005',
  english11: '33333333-0000-0000-0000-000000000006',
  gk: '33333333-0000-0000-0000-000000000007',
  nepali_loksewa: '33333333-0000-0000-0000-000000000008',
  anatomy: '33333333-0000-0000-0000-000000000011',
  physiology: '33333333-0000-0000-0000-000000000012',
  physics12: '33333333-0000-0000-0000-000000000020',
  chem12: '33333333-0000-0000-0000-000000000021',
  bio12: '33333333-0000-0000-0000-000000000022',
  math12: '33333333-0000-0000-0000-000000000023',
  cs12: '33333333-0000-0000-0000-000000000024',
  business: '33333333-0000-0000-0000-000000000025',
  accountancy: '33333333-0000-0000-0000-000000000026',
  economics: '33333333-0000-0000-0000-000000000027',
  seeSci: '33333333-0000-0000-0000-000000000030',
  seeMath: '33333333-0000-0000-0000-000000000031',
  seeNepali: '33333333-0000-0000-0000-000000000032',
  seeSocial: '33333333-0000-0000-0000-000000000033',
  seeEnglish: '33333333-0000-0000-0000-000000000034',
  ioePhysics: '33333333-0000-0000-0000-000000000040',
  ioeMath: '33333333-0000-0000-0000-000000000041',
  ioeChem: '33333333-0000-0000-0000-000000000042',
  pa: '33333333-0000-0000-0000-000000000050',
  mgmtGk: '33333333-0000-0000-0000-000000000051',
} as const

// ── Users (migration 001 schema) ─────────────────────────────
const USERS: Row[] = [
  { id: DEMO_IDS.admin, full_name: 'VidyaSetu Admin', email: 'admin@vidyasetu.com', auth_provider: 'email', role: 'admin', avatar_url: 'https://i.pravatar.cc/150?img=12', created_at: daysAgo(120) },
  { id: DEMO_IDS.contributor, full_name: 'Suman Sharma', email: 'contributor@vidyasetu.com', auth_provider: 'email', role: 'contributor', avatar_url: 'https://i.pravatar.cc/150?img=15', created_at: daysAgo(95) },
  { id: DEMO_IDS.student, full_name: 'Riya Adhikari', email: 'student@vidyasetu.com', auth_provider: 'email', role: 'student', avatar_url: 'https://i.pravatar.cc/150?img=47', created_at: daysAgo(80) },
  { id: DEMO_IDS.aarav, full_name: 'Aarav Shrestha', email: 'aarav@vidyasetu.com', auth_provider: 'email', role: 'student', avatar_url: 'https://i.pravatar.cc/150?img=13', created_at: daysAgo(75) },
  { id: DEMO_IDS.pratiksha, full_name: 'Pratiksha Thapa', email: 'pratiksha@vidyasetu.com', auth_provider: 'email', role: 'student', avatar_url: 'https://i.pravatar.cc/150?img=32', created_at: daysAgo(70) },
  { id: DEMO_IDS.bibek, full_name: 'Bibek Gurung', email: 'bibek@vidyasetu.com', auth_provider: 'email', role: 'student', avatar_url: 'https://i.pravatar.cc/150?img=56', created_at: daysAgo(60) },
  { id: DEMO_IDS.anisha, full_name: 'Anisha KC', email: 'anisha@vidyasetu.com', auth_provider: 'email', role: 'student', avatar_url: 'https://i.pravatar.cc/150?img=44', created_at: daysAgo(50) },
  { id: DEMO_IDS.nirajan, full_name: 'Nirajan Pokharel', email: 'nirajan@vidyasetu.com', auth_provider: 'email', role: 'student', avatar_url: 'https://i.pravatar.cc/150?img=59', created_at: daysAgo(40) },
]

// ── Content (migration 003 + contributor samples) ────────────
const CONTENT: Row[] = [
  { id: 'c-1', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.admin, title: 'Chapter 1: Motion & Kinematics — Complete Notes', type: 'note', status: 'approved', views: 312, downloads: 141, file_url: DUMMY_FILE_URL, file_size: 480000, created_at: daysAgo(30) },
  { id: 'c-2', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.admin, title: 'Chapter 2: Laws of Motion (Newton)', type: 'note', status: 'approved', views: 214, downloads: 98, file_url: DUMMY_FILE_URL, file_size: 420000, created_at: daysAgo(25) },
  { id: 'c-3', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.admin, title: 'Chapter 3: Work, Energy & Power', type: 'note', status: 'approved', views: 188, downloads: 72, file_url: DUMMY_FILE_URL, file_size: 390000, created_at: daysAgo(20) },
  { id: 'c-4', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.admin, title: 'NEB 2079 Physics Board Paper — Q.1 to Q.9', type: 'past_paper', status: 'approved', views: 456, downloads: 221, file_url: DUMMY_FILE_URL, file_size: 720000, created_at: daysAgo(15) },
  { id: 'c-5', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.admin, title: 'NEB 2078 Physics Board Paper', type: 'past_paper', status: 'approved', views: 389, downloads: 198, file_url: DUMMY_FILE_URL, file_size: 690000, created_at: daysAgo(60) },
  { id: 'c-6', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.admin, title: 'NEB 2077 Physics Board Paper', type: 'past_paper', status: 'approved', views: 312, downloads: 163, file_url: DUMMY_FILE_URL, file_size: 660000, created_at: daysAgo(90) },
  { id: 'c-7', subject_id: SUBJECT_IDS.chem11, uploaded_by: DEMO_IDS.admin, title: 'Organic Chemistry: Hydrocarbons — Full Chapter', type: 'note', status: 'approved', views: 298, downloads: 134, file_url: DUMMY_FILE_URL, file_size: 510000, created_at: daysAgo(28) },
  { id: 'c-8', subject_id: SUBJECT_IDS.chem11, uploaded_by: DEMO_IDS.admin, title: 'Inorganic Chemistry: Transition Metals', type: 'note', status: 'approved', views: 145, downloads: 67, file_url: DUMMY_FILE_URL, file_size: 440000, created_at: daysAgo(22) },
  { id: 'c-9', subject_id: SUBJECT_IDS.chem11, uploaded_by: DEMO_IDS.admin, title: 'NEB 2079 Chemistry Board Paper', type: 'past_paper', status: 'approved', views: 367, downloads: 178, file_url: DUMMY_FILE_URL, file_size: 700000, created_at: daysAgo(12) },
  { id: 'c-10', subject_id: SUBJECT_IDS.bio11, uploaded_by: DEMO_IDS.admin, title: 'Zoology: Cell Biology & Genetics Chapter Notes', type: 'note', status: 'approved', views: 278, downloads: 121, file_url: DUMMY_FILE_URL, file_size: 500000, created_at: daysAgo(27) },
  { id: 'c-11', subject_id: SUBJECT_IDS.bio11, uploaded_by: DEMO_IDS.admin, title: 'Botany: Plant Physiology & Reproduction', type: 'note', status: 'approved', views: 198, downloads: 88, file_url: DUMMY_FILE_URL, file_size: 470000, created_at: daysAgo(21) },
  { id: 'c-12', subject_id: SUBJECT_IDS.bio11, uploaded_by: DEMO_IDS.admin, title: 'NEB 2079 Biology Board Paper', type: 'past_paper', status: 'approved', views: 421, downloads: 211, file_url: DUMMY_FILE_URL, file_size: 740000, created_at: daysAgo(14) },
  { id: 'c-13', subject_id: SUBJECT_IDS.math11, uploaded_by: DEMO_IDS.admin, title: 'Calculus — Differentiation & Integration Notes', type: 'note', status: 'approved', views: 389, downloads: 178, file_url: DUMMY_FILE_URL, file_size: 530000, created_at: daysAgo(26) },
  { id: 'c-14', subject_id: SUBJECT_IDS.math11, uploaded_by: DEMO_IDS.admin, title: 'Trigonometry & Analytical Geometry Formulas Sheet', type: 'note', status: 'approved', views: 312, downloads: 145, file_url: DUMMY_FILE_URL, file_size: 350000, created_at: daysAgo(18) },
  { id: 'c-15', subject_id: SUBJECT_IDS.math11, uploaded_by: DEMO_IDS.admin, title: 'NEB 2079 Mathematics Board Paper', type: 'past_paper', status: 'approved', views: 534, downloads: 267, file_url: DUMMY_FILE_URL, file_size: 780000, created_at: daysAgo(11) },
  { id: 'c-16', subject_id: SUBJECT_IDS.cs11, uploaded_by: DEMO_IDS.admin, title: 'C Programming — Functions & Pointers Notes', type: 'note', status: 'approved', views: 234, downloads: 98, file_url: DUMMY_FILE_URL, file_size: 460000, created_at: daysAgo(23) },
  { id: 'c-17', subject_id: SUBJECT_IDS.cs11, uploaded_by: DEMO_IDS.admin, title: 'Database Management Systems — SQL Notes', type: 'note', status: 'approved', views: 189, downloads: 78, file_url: DUMMY_FILE_URL, file_size: 430000, created_at: daysAgo(17) },
  { id: 'c-18', subject_id: SUBJECT_IDS.anatomy, uploaded_by: DEMO_IDS.admin, title: 'Head & Neck Anatomy — Complete Module Notes', type: 'note', status: 'approved', views: 456, downloads: 234, file_url: DUMMY_FILE_URL, file_size: 880000, created_at: daysAgo(35) },
  { id: 'c-19', subject_id: SUBJECT_IDS.anatomy, uploaded_by: DEMO_IDS.admin, title: 'Thorax & Abdomen Anatomy Notes', type: 'note', status: 'approved', views: 312, downloads: 156, file_url: DUMMY_FILE_URL, file_size: 810000, created_at: daysAgo(29) },
  { id: 'c-20', subject_id: SUBJECT_IDS.anatomy, uploaded_by: DEMO_IDS.admin, title: 'MBBS Anatomy Year 1 Past Papers — 2078 & 2079', type: 'past_paper', status: 'approved', views: 512, downloads: 289, file_url: DUMMY_FILE_URL, file_size: 920000, created_at: daysAgo(8) },
  { id: 'c-21', subject_id: SUBJECT_IDS.gk, uploaded_by: DEMO_IDS.admin, title: 'Nepal Constitution 2072 — Full Summary Notes', type: 'note', status: 'approved', views: 678, downloads: 312, file_url: DUMMY_FILE_URL, file_size: 560000, created_at: daysAgo(40) },
  { id: 'c-22', subject_id: SUBJECT_IDS.gk, uploaded_by: DEMO_IDS.admin, title: 'Loksewa Kharidar — GK Practice Set A (2080 Style)', type: 'mcq_set', status: 'approved', views: 423, downloads: 198, file_url: DUMMY_FILE_URL, file_size: 340000, created_at: daysAgo(20) },
  { id: 'c-23', subject_id: SUBJECT_IDS.gk, uploaded_by: DEMO_IDS.admin, title: 'Loksewa Na.Su. — Previous Years Questions 2075–2079', type: 'past_paper', status: 'approved', views: 589, downloads: 267, file_url: DUMMY_FILE_URL, file_size: 640000, created_at: daysAgo(10) },
  { id: 'c-24', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.contributor, title: 'Thermodynamics — Quick Revision Notes (Grade 11)', type: 'note', status: 'approved', views: 120, downloads: 45, file_url: DUMMY_FILE_URL, file_size: 410000, created_at: daysAgo(12) },
  { id: 'c-25', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.contributor, title: 'NEB 2080 Physics Model Set — New Pattern', type: 'past_paper', status: 'pending', views: 0, downloads: 0, file_url: DUMMY_FILE_URL, file_size: 0, created_at: daysAgo(3) },
  { id: 'c-26', subject_id: SUBJECT_IDS.physics11, uploaded_by: DEMO_IDS.contributor, title: 'Physics Formula Sheet — Early Draft', type: 'mcq_set', status: 'rejected', views: 0, downloads: 0, file_url: DUMMY_FILE_URL, file_size: 0, created_at: daysAgo(8) },
  // Class 8 BLE Content
  { id: 'c-ble-1', subject_id: '33333333-0000-0000-0000-000000000052', uploaded_by: DEMO_IDS.admin, title: 'Class 8 Health & Physical Education BLE Model Paper 2080', type: 'past_paper', status: 'approved', views: 640, downloads: 310, drive_url: '13zbFFVfvp7mGfUXwGwO5Zlhb2-UbhjCa', file_url: DUMMY_FILE_URL, file_size: 215000, created_at: daysAgo(20) },
  { id: 'c-ble-2', subject_id: '33333333-0000-0000-0000-000000000053', uploaded_by: DEMO_IDS.admin, title: 'Class 8 Moral Education BLE Official Model Paper & Solutions', type: 'past_paper', status: 'approved', views: 590, downloads: 275, drive_url: '1tSSX5LjELtrWpCRtOz1oyVj_vyX-K-mX', file_url: DUMMY_FILE_URL, file_size: 198000, created_at: daysAgo(18) },
  { id: 'c-ble-3', subject_id: '33333333-0000-0000-0000-000000000054', uploaded_by: DEMO_IDS.admin, title: 'Class 8 Social Studies BLE Model Paper (English & Nepali Medium)', type: 'past_paper', status: 'approved', views: 820, downloads: 412, drive_url: '15gvlwXvRrxDWTMenSINZKvjf-A_v-ysb', file_url: DUMMY_FILE_URL, file_size: 284000, created_at: daysAgo(15) },
  { id: 'c-ble-4', subject_id: '33333333-0000-0000-0000-000000000055', uploaded_by: DEMO_IDS.admin, title: 'Class 8 Vocational & Technical Education BLE Model Paper', type: 'past_paper', status: 'approved', views: 490, downloads: 215, drive_url: '1HaAqrLMirVbVcbfO-RmA4QR07o7ENZg9', file_url: DUMMY_FILE_URL, file_size: 232000, created_at: daysAgo(12) },
  // SEE Additional Content
  { id: 'c-see-1', subject_id: '33333333-0000-0000-0000-000000000030', uploaded_by: DEMO_IDS.admin, title: 'SEE Science & Technology Model Question Paper 2080', type: 'past_paper', status: 'approved', views: 1450, downloads: 980, drive_url: '1Pl_u2hI5G2TWG880RArIqotPymqv9Gj_', file_url: DUMMY_FILE_URL, file_size: 129000, created_at: daysAgo(25) },
  { id: 'c-see-2', subject_id: '33333333-0000-0000-0000-000000000031', uploaded_by: DEMO_IDS.admin, title: 'SEE Compulsory Mathematics Official Model Paper & Solutions', type: 'past_paper', status: 'approved', views: 1890, downloads: 1220, drive_url: '1pYrTbz5J2tAqgUt_q8JEFZsB9yCh0xmY', file_url: DUMMY_FILE_URL, file_size: 1100000, created_at: daysAgo(22) },
  { id: 'c-see-3', subject_id: '33333333-0000-0000-0000-000000000035', uploaded_by: DEMO_IDS.admin, title: 'SEE Optional Mathematics Model Paper & Formulas Handout', type: 'past_paper', status: 'approved', views: 980, downloads: 640, file_url: DUMMY_FILE_URL, file_size: 420000, created_at: daysAgo(16) },
  { id: 'c-see-4', subject_id: '33333333-0000-0000-0000-000000000036', uploaded_by: DEMO_IDS.admin, title: 'SEE Computer Science QBASIC & MS-Access Questions Handout', type: 'note', status: 'approved', views: 760, downloads: 490, file_url: DUMMY_FILE_URL, file_size: 380000, created_at: daysAgo(14) },
  // BCA Content
  { id: 'c-bca-1', subject_id: '33333333-0000-0000-0000-000000000080', uploaded_by: DEMO_IDS.admin, title: 'BCA Semester 1: C Programming Complete Lecture Notes & Lab Solutions', type: 'note', status: 'approved', views: 1120, downloads: 670, file_url: DUMMY_FILE_URL, file_size: 680000, created_at: daysAgo(15) },
  { id: 'c-bca-2', subject_id: '33333333-0000-0000-0000-000000000080', uploaded_by: DEMO_IDS.admin, title: 'TU BCA 2079 & 2080 Board Question Paper with Solutions — C Programming', type: 'past_paper', status: 'approved', views: 1450, downloads: 890, file_url: DUMMY_FILE_URL, file_size: 540000, created_at: daysAgo(10) },
  { id: 'c-bca-3', subject_id: '33333333-0000-0000-0000-000000000081', uploaded_by: DEMO_IDS.admin, title: 'BCA Semester 1: Computer Fundamentals & Digital Systems Handout', type: 'note', status: 'approved', views: 890, downloads: 480, file_url: DUMMY_FILE_URL, file_size: 490000, created_at: daysAgo(18) },
  { id: 'c-bca-p-81', subject_id: '33333333-0000-0000-0000-000000000081', uploaded_by: DEMO_IDS.admin, title: 'TU BCA 2080 Computer Fundamentals & Applications Board Question Paper', type: 'past_paper', status: 'approved', views: 1180, downloads: 620, file_url: DUMMY_FILE_URL, file_size: 430000, created_at: daysAgo(9) },
  { id: 'c-bca-n-82', subject_id: '33333333-0000-0000-0000-000000000082', uploaded_by: DEMO_IDS.admin, title: 'BCA Semester 2: Discrete Mathematics Complete Graph Theory & Logic Guide', type: 'note', status: 'approved', views: 1250, downloads: 710, file_url: DUMMY_FILE_URL, file_size: 640000, created_at: daysAgo(14) },
  { id: 'c-bca-p-82', subject_id: '33333333-0000-0000-0000-000000000082', uploaded_by: DEMO_IDS.admin, title: 'TU BCA 2079 & 2080 Discrete Mathematics Final Board Paper & Solutions', type: 'past_paper', status: 'approved', views: 1390, downloads: 840, file_url: DUMMY_FILE_URL, file_size: 510000, created_at: daysAgo(8) },
  { id: 'c-bca-4', subject_id: '33333333-0000-0000-0000-000000000083', uploaded_by: DEMO_IDS.admin, title: 'BCA Semester 3: Data Structures & Algorithms Handout with Code', type: 'note', status: 'approved', views: 1340, downloads: 810, file_url: DUMMY_FILE_URL, file_size: 780000, created_at: daysAgo(12) },
  { id: 'c-bca-p-83', subject_id: '33333333-0000-0000-0000-000000000083', uploaded_by: DEMO_IDS.admin, title: 'TU BCA 2080 Data Structures & Algorithms Board Examination Paper', type: 'past_paper', status: 'approved', views: 1540, downloads: 910, file_url: DUMMY_FILE_URL, file_size: 580000, created_at: daysAgo(7) },
  { id: 'c-bca-5', subject_id: '33333333-0000-0000-0000-000000000084', uploaded_by: DEMO_IDS.admin, title: 'BCA Java Programming Core Concepts & Practical Project Guide', type: 'note', status: 'approved', views: 1620, downloads: 990, file_url: DUMMY_FILE_URL, file_size: 890000, created_at: daysAgo(8) },
  { id: 'c-bca-p-84', subject_id: '33333333-0000-0000-0000-000000000084', uploaded_by: DEMO_IDS.admin, title: 'TU BCA 2079 OOP in Java Board Question Paper with Code Solutions', type: 'past_paper', status: 'approved', views: 1480, downloads: 870, file_url: DUMMY_FILE_URL, file_size: 610000, created_at: daysAgo(6) },
  { id: 'c-bca-n-85', subject_id: '33333333-0000-0000-0000-000000000085', uploaded_by: DEMO_IDS.admin, title: 'BCA Database Management Systems Lecture Notes & Relational Algebra Guide', type: 'note', status: 'approved', views: 1390, downloads: 830, file_url: DUMMY_FILE_URL, file_size: 720000, created_at: daysAgo(11) },
  { id: 'c-bca-6', subject_id: '33333333-0000-0000-0000-000000000085', uploaded_by: DEMO_IDS.admin, title: 'TU BCA DBMS Final Exam Board Solutions & ER Diagram Guide', type: 'past_paper', status: 'approved', views: 1250, downloads: 740, file_url: DUMMY_FILE_URL, file_size: 620000, created_at: daysAgo(6) },
  { id: 'c-bca-7', subject_id: '33333333-0000-0000-0000-000000000086', uploaded_by: DEMO_IDS.admin, title: 'BCA Web Technology Full Syllabus Revision: HTML, CSS, JS & PHP', type: 'note', status: 'approved', views: 1480, downloads: 920, file_url: DUMMY_FILE_URL, file_size: 750000, created_at: daysAgo(5) },
  { id: 'c-bca-p-86', subject_id: '33333333-0000-0000-0000-000000000086', uploaded_by: DEMO_IDS.admin, title: 'TU BCA 2080 Web Technology Board Examination Question Paper', type: 'past_paper', status: 'approved', views: 1350, downloads: 790, file_url: DUMMY_FILE_URL, file_size: 540000, created_at: daysAgo(4) },
  // BCA Curated MCQ Sets
  { id: 'c-bca-mcq-1', subject_id: '33333333-0000-0000-0000-000000000080', uploaded_by: DEMO_IDS.admin, title: 'TU BCA C Programming Top 100 Objective Questions & Answers', type: 'mcq_set', status: 'approved', views: 1840, downloads: 1120, file_url: DUMMY_FILE_URL, file_size: 420000, created_at: daysAgo(12) },
  { id: 'c-bca-mcq-2', subject_id: '33333333-0000-0000-0000-000000000081', uploaded_by: DEMO_IDS.admin, title: 'BCA Computer Fundamentals & Digital Architecture MCQ Bank', type: 'mcq_set', status: 'approved', views: 1420, downloads: 890, file_url: DUMMY_FILE_URL, file_size: 380000, created_at: daysAgo(11) },
  { id: 'c-bca-mcq-3', subject_id: '33333333-0000-0000-0000-000000000082', uploaded_by: DEMO_IDS.admin, title: 'BCA Discrete Mathematics Important MCQs with Solutions', type: 'mcq_set', status: 'approved', views: 1650, downloads: 980, file_url: DUMMY_FILE_URL, file_size: 410000, created_at: daysAgo(10) },
  { id: 'c-bca-mcq-4', subject_id: '33333333-0000-0000-0000-000000000083', uploaded_by: DEMO_IDS.admin, title: 'BCA DSA High-Yield MCQs & Complexity Analysis Bank', type: 'mcq_set', status: 'approved', views: 2120, downloads: 1430, file_url: DUMMY_FILE_URL, file_size: 510000, created_at: daysAgo(9) },
  { id: 'c-bca-mcq-5', subject_id: '33333333-0000-0000-0000-000000000084', uploaded_by: DEMO_IDS.admin, title: 'TU BCA Java Programming 120 Model MCQs with Explanations', type: 'mcq_set', status: 'approved', views: 2310, downloads: 1560, file_url: DUMMY_FILE_URL, file_size: 560000, created_at: daysAgo(8) },
  { id: 'c-bca-mcq-6', subject_id: '33333333-0000-0000-0000-000000000085', uploaded_by: DEMO_IDS.admin, title: 'BCA DBMS SQL & Normalization Comprehensive MCQ Bank', type: 'mcq_set', status: 'approved', views: 1980, downloads: 1290, file_url: DUMMY_FILE_URL, file_size: 490000, created_at: daysAgo(7) },
  { id: 'c-bca-mcq-7', subject_id: '33333333-0000-0000-0000-000000000086', uploaded_by: DEMO_IDS.admin, title: 'BCA Web Technology Full Syllabus Practice MCQs (HTML, CSS, JS, PHP)', type: 'mcq_set', status: 'approved', views: 2050, downloads: 1380, file_url: DUMMY_FILE_URL, file_size: 530000, created_at: daysAgo(6) },
]

// ── Quizzes (migrations 003 + 005 + extended) ─────────────────
const QUIZ_IDS = {
  phys12: '44444444-0000-0000-0000-000000000001',
  chem12: '44444444-0000-0000-0000-000000000002',
  math12: '44444444-0000-0000-0000-000000000003',
  pa: '44444444-0000-0000-0000-000000000004',
  see: '44444444-0000-0000-0000-000000000005',
  kinematics: '44444444-0000-0000-0000-000000000101',
  nebModel: '44444444-0000-0000-0000-000000000102',
  organic: '44444444-0000-0000-0000-000000000103',
  cellBio: '44444444-0000-0000-0000-000000000104',
  anatomyQ: '44444444-0000-0000-0000-000000000105',
  gkQ: '44444444-0000-0000-0000-000000000106',
  bio12: '44444444-0000-0000-0000-000000000200',
  cs11: '44444444-0000-0000-0000-000000000201',
  cs12: '44444444-0000-0000-0000-000000000202',
  math11: '44444444-0000-0000-0000-000000000203',
  accountancy: '44444444-0000-0000-0000-000000000204',
  economics: '44444444-0000-0000-0000-000000000205',
  business: '44444444-0000-0000-0000-000000000206',
  seeMath: '44444444-0000-0000-0000-000000000207',
  seeEnglish: '44444444-0000-0000-0000-000000000208',
  seeSocial: '44444444-0000-0000-0000-000000000209',
  ioePhysics: '44444444-0000-0000-0000-000000000210',
  ioeMath: '44444444-0000-0000-0000-000000000211',
  physiology: '44444444-0000-0000-0000-000000000212',
  nepaliLoksewa: '44444444-0000-0000-0000-000000000213',
  mgmtGk: '44444444-0000-0000-0000-000000000214',
  bio11Full: '44444444-0000-0000-0000-000000000215',
  // BCA Quizzes
  bcaC: '44444444-0000-0000-0000-000000000080',
  bcaCompFund: '44444444-0000-0000-0000-000000000081',
  bcaDiscreteMath: '44444444-0000-0000-0000-000000000082',
  bcaDSA: '44444444-0000-0000-0000-000000000083',
  bcaJava: '44444444-0000-0000-0000-000000000084',
  bcaDBMS: '44444444-0000-0000-0000-000000000085',
  bcaWebTech: '44444444-0000-0000-0000-000000000086',
} as const

const QUIZZES: Row[] = [
  // BCA Subjects Quizzes
  { id: QUIZ_IDS.bcaC,            subject_id: '33333333-0000-0000-0000-000000000080', title: 'BCA C Programming — Pointers, Arrays & Memory Management', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(10) },
  { id: QUIZ_IDS.bcaCompFund,     subject_id: '33333333-0000-0000-0000-000000000081', title: 'BCA Computer Fundamentals & Architecture Mock Quiz', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(9) },
  { id: QUIZ_IDS.bcaDiscreteMath, subject_id: '33333333-0000-0000-0000-000000000082', title: 'BCA Discrete Mathematics — Propositional Logic & Graph Theory', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(8) },
  { id: QUIZ_IDS.bcaDSA,          subject_id: '33333333-0000-0000-0000-000000000083', title: 'BCA Data Structures & Algorithms — Core Concepts & Big-O', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(7) },
  { id: QUIZ_IDS.bcaJava,         subject_id: '33333333-0000-0000-0000-000000000084', title: 'BCA Java OOP — Inheritance, Exceptions & Multithreading', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(6) },
  { id: QUIZ_IDS.bcaDBMS,         subject_id: '33333333-0000-0000-0000-000000000085', title: 'BCA DBMS — Relational Schemas, Normal Forms & SQL', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(5) },
  { id: QUIZ_IDS.bcaWebTech,      subject_id: '33333333-0000-0000-0000-000000000086', title: 'BCA Web Technology — HTML5, CSS3, JavaScript & PHP', question_count: 6, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(4) },
  { id: QUIZ_IDS.phys12,      subject_id: SUBJECT_IDS.physics12,     title: 'Physics Grade 12 — Full Practice Set',              question_count: 15, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(30) },
  { id: QUIZ_IDS.chem12,      subject_id: SUBJECT_IDS.chem12,        title: 'Chemistry Grade 12 — Organic & Inorganic',          question_count: 12, time_limit_minutes: 18, created_by: DEMO_IDS.admin, created_at: daysAgo(28) },
  { id: QUIZ_IDS.math12,      subject_id: SUBJECT_IDS.math12,        title: 'Mathematics Grade 12 — Calculus & Vectors',         question_count: 12, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(26) },
  { id: QUIZ_IDS.pa,          subject_id: SUBJECT_IDS.pa,            title: 'Loksewa — Public Administration Officer Level',     question_count: 15, time_limit_minutes: 25, created_by: DEMO_IDS.admin, created_at: daysAgo(24) },
  { id: QUIZ_IDS.see,         subject_id: SUBJECT_IDS.seeSci,        title: 'SEE Science — Complete Practice Set',               question_count: 15, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(22) },
  { id: QUIZ_IDS.kinematics,  subject_id: SUBJECT_IDS.physics11,     title: 'Physics Chapter 1 Quiz — Kinematics',              question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(20) },
  { id: QUIZ_IDS.nebModel,    subject_id: SUBJECT_IDS.physics11,     title: 'NEB Physics Full Model Test (Set A)',                question_count: 15, time_limit_minutes: 30, created_by: DEMO_IDS.admin, created_at: daysAgo(18) },
  { id: QUIZ_IDS.organic,     subject_id: SUBJECT_IDS.chem11,        title: 'Chemistry Organic MCQ Practice',                    question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(16) },
  { id: QUIZ_IDS.cellBio,     subject_id: SUBJECT_IDS.bio11,         title: 'Biology Cell & Genetics Quiz',                      question_count: 12, time_limit_minutes: 25, created_by: DEMO_IDS.admin, created_at: daysAgo(14) },
  { id: QUIZ_IDS.anatomyQ,    subject_id: SUBJECT_IDS.anatomy,       title: 'Anatomy Head & Neck Practice',                      question_count: 15, time_limit_minutes: 30, created_by: DEMO_IDS.admin, created_at: daysAgo(12) },
  { id: QUIZ_IDS.gkQ,         subject_id: SUBJECT_IDS.gk,            title: 'Loksewa GK Practice Set — 2080 Style',             question_count: 20, time_limit_minutes: 40, created_by: DEMO_IDS.admin, created_at: daysAgo(10) },
  { id: QUIZ_IDS.bio12,       subject_id: SUBJECT_IDS.bio12,         title: 'Biology Grade 12 — Genetics & Evolution',          question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(9)  },
  { id: QUIZ_IDS.cs11,        subject_id: SUBJECT_IDS.cs11,          title: 'Computer Science Gr 11 — C Programming Basics',    question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(8)  },
  { id: QUIZ_IDS.cs12,        subject_id: SUBJECT_IDS.cs12,          title: 'Computer Science Gr 12 — Data Structures & OOP',   question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(7)  },
  { id: QUIZ_IDS.math11,      subject_id: SUBJECT_IDS.math11,        title: 'Mathematics Grade 11 — Algebra & Trigonometry',    question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(6)  },
  { id: QUIZ_IDS.accountancy, subject_id: SUBJECT_IDS.accountancy,   title: 'Accountancy Gr 12 — Financial Accounting MCQs',    question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(5)  },
  { id: QUIZ_IDS.economics,   subject_id: SUBJECT_IDS.economics,     title: 'Economics Grade 12 — Macro & Micro Quiz',          question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(4)  },
  { id: QUIZ_IDS.business,    subject_id: SUBJECT_IDS.business,      title: 'Business Studies — Management Principles MCQ',     question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(3)  },
  { id: QUIZ_IDS.seeMath,     subject_id: SUBJECT_IDS.seeMath,       title: 'SEE Mathematics — Algebra & Geometry MCQs',        question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(3)  },
  { id: QUIZ_IDS.seeEnglish,  subject_id: SUBJECT_IDS.seeEnglish,    title: 'SEE English — Grammar & Comprehension Quiz',        question_count: 10, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(2)  },
  { id: QUIZ_IDS.seeSocial,   subject_id: SUBJECT_IDS.seeSocial,     title: 'SEE Social Studies — Nepal History & Civics',       question_count: 10, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(2)  },
  { id: QUIZ_IDS.ioePhysics,  subject_id: SUBJECT_IDS.ioePhysics,    title: 'IOE Entrance Physics — Full Mock Test',             question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(1)  },
  { id: QUIZ_IDS.ioeMath,     subject_id: SUBJECT_IDS.ioeMath,       title: 'IOE Entrance Mathematics — Practice Set',           question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(1)  },
  { id: QUIZ_IDS.physiology,  subject_id: SUBJECT_IDS.physiology,    title: 'Physiology MBBS — Cardiovascular & Renal',          question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(1)  },
  { id: QUIZ_IDS.nepaliLoksewa,subject_id: SUBJECT_IDS.nepali_loksewa,title: 'Loksewa Nepali — व्याकरण Practice Set',           question_count: 10, time_limit_minutes: 15, created_by: DEMO_IDS.admin, created_at: daysAgo(1)  },
  { id: QUIZ_IDS.mgmtGk,      subject_id: SUBJECT_IDS.mgmtGk,        title: 'Loksewa Management & GK — Officer Level',          question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(1)  },
  { id: QUIZ_IDS.bio11Full,   subject_id: SUBJECT_IDS.bio11,          title: 'Biology Grade 11 — Botany & Zoology Full MCQ',     question_count: 10, time_limit_minutes: 20, created_by: DEMO_IDS.admin, created_at: daysAgo(2)  },
]

// ── Questions (transcribed from migrations 003 + 005) ────────
// [quizId, question, a, b, c, d, correct, explanation]
const QUESTION_SEED: [string, string, string, string, string, string, string, string][] = [
  [QUIZ_IDS.kinematics, 'A car starts from rest and accelerates uniformly at 4 m/s². What is its velocity after 5 seconds?', '10 m/s', '20 m/s', '15 m/s', '25 m/s', 'b', 'Using v = u + at = 0 + 4×5 = 20 m/s'],
  [QUIZ_IDS.kinematics, 'Which of the following is a scalar quantity?', 'Velocity', 'Acceleration', 'Speed', 'Force', 'c', 'Speed only has magnitude, making it a scalar.'],
  [QUIZ_IDS.kinematics, 'A body moving with uniform velocity has zero:', 'Speed', 'Displacement', 'Acceleration', 'Momentum', 'c', 'Uniform velocity means constant velocity, so acceleration = 0.'],
  [QUIZ_IDS.kinematics, 'The slope of a displacement-time graph gives:', 'Acceleration', 'Velocity', 'Distance', 'Speed', 'b', 'Slope = Δdisplacement/Δtime = velocity.'],
  [QUIZ_IDS.kinematics, 'A projectile is thrown horizontally from a cliff of height 80 m. Time to reach the ground is: (g = 10 m/s²)', '4 s', '8 s', '2 s', '6 s', 'a', 'h = ½gt² → 80 = ½×10×t² → t² = 16 → t = 4 s'],
  [QUIZ_IDS.kinematics, 'Which equation of motion relates velocity, acceleration and displacement?', 'v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'a = (v-u)/t', 'c', 'v² = u² + 2as relates v, u, a and s without time.'],
  [QUIZ_IDS.kinematics, 'An object is thrown vertically upward with velocity 20 m/s. Maximum height reached is: (g = 10 m/s²)', '10 m', '20 m', '30 m', '40 m', 'b', 'v² = u² - 2gh → 0 = 400 - 20h → h = 20 m'],
  [QUIZ_IDS.kinematics, 'Relative velocity of two objects moving in the same direction with velocities v₁ and v₂ (v₁ > v₂) is:', 'v₁ + v₂', 'v₁ - v₂', 'v₁ × v₂', 'v₁ / v₂', 'b', 'For same direction motion, relative velocity = v₁ - v₂.'],
  [QUIZ_IDS.kinematics, 'The area under a velocity-time graph represents:', 'Velocity', 'Acceleration', 'Displacement', 'Force', 'c', 'Area under v-t graph = displacement covered.'],
  [QUIZ_IDS.kinematics, 'A body is dropped from rest. Distance fallen in 3rd second is: (g = 10 m/s²)', '25 m', '30 m', '20 m', '45 m', 'a', 'sₙ = u + g(2n-1)/2 = 0 + 10(5)/2 = 25 m'],

  [QUIZ_IDS.gkQ, 'Nepal\'s Constitution was promulgated on:', '2072 Asoj 3', '2072 Asoj 7', '2065 Jestha 15', '2047 Baishakh 23', 'a', 'Promulgated on 2072 Asoj 3 (20 September 2015).'],
  [QUIZ_IDS.gkQ, 'The Lumbini Zone is located in which province of Nepal?', 'Province No. 3', 'Province No. 5', 'Province No. 4', 'Madhesh Province', 'b', 'Lumbini is in Lumbini Province (Province No. 5).'],
  [QUIZ_IDS.gkQ, 'Which article of the Nepal Constitution deals with the Right to Education?', 'Article 17', 'Article 31', 'Article 18', 'Article 38', 'b', 'Article 31 guarantees the Right to Education.'],
  [QUIZ_IDS.gkQ, 'The Public Service Commission (Lok Sewa Aayog) was established in Nepal in:', '2007 B.S.', '2008 B.S.', '2010 B.S.', '2013 B.S.', 'b', 'PSC was established in 2008 B.S. (1951 A.D.).'],
  [QUIZ_IDS.gkQ, 'The highest peak in Nepal is:', 'Kanchenjunga', 'Lhotse', 'Mount Everest (Sagarmatha)', 'Makalu', 'c', 'Mount Everest (8,848.86 m) is the highest peak in the world.'],
  [QUIZ_IDS.gkQ, 'Nepal\'s national currency is:', 'Indian Rupee', 'Nepali Rupee', 'Bhutanese Ngultrum', 'Tibetan Yuan', 'b', 'The Nepali Rupee (NPR) is the official currency of Nepal.'],
  [QUIZ_IDS.gkQ, 'The CIAA is formed under which article?', 'Article 237', 'Article 238', 'Article 236', 'Article 239', 'a', 'CIAA is provisioned under Articles 237-242 of the Constitution.'],
  [QUIZ_IDS.gkQ, 'Which of the following is NOT a province of Nepal?', 'Bagmati Province', 'Gandaki Province', 'Narayani Province', 'Koshi Province', 'c', 'Narayani is not a province; Nepal has 7 provinces.'],
  [QUIZ_IDS.gkQ, 'Nepal became a Federal Democratic Republic on:', '2064 Jyestha 15', '2065 Jestha 15', '2064 Asoj 3', '2063 Falgun 1', 'b', 'Declared on 2065 Jestha 15 (May 28, 2008).'],
  [QUIZ_IDS.gkQ, 'Total number of districts in Nepal is:', '72', '75', '77', '80', 'c', 'Nepal currently has 77 districts in 7 provinces.'],
  [QUIZ_IDS.gkQ, 'The first Prime Minister of Nepal after it became a Republic was:', 'G.P. Koirala', 'Pushpa Kamal Dahal', 'Sher Bahadur Deuba', 'Madhav Kumar Nepal', 'a', 'Girija Prasad Koirala was the first PM after 2008.'],
  [QUIZ_IDS.gkQ, 'Which river is called the "Sorrow of Nepal"?', 'Koshi', 'Gandaki', 'Karnali', 'Bagmati', 'a', 'The Koshi River is called the "Sorrow of Nepal" due to floods.'],
  [QUIZ_IDS.gkQ, 'The Fiscal Year in Nepal follows which calendar?', 'Gregorian Calendar (Jan-Dec)', 'Bikram Sambat (Shrawan - Ashadh)', 'Newari Calendar', 'Lunar Calendar', 'b', 'The fiscal year runs from Shrawan 1 to Ashadh end.'],
  [QUIZ_IDS.gkQ, 'Sagarmatha National Park is located in which district?', 'Dolakha', 'Taplejung', 'Solukhumbu', 'Sankhuwasabha', 'c', 'Sagarmatha National Park is in Solukhumbu district.'],
  [QUIZ_IDS.gkQ, 'Article 18 of the Constitution of Nepal guarantees:', 'Right to Freedom', 'Right to Equality', 'Right to Privacy', 'Right to Justice', 'b', 'Article 18 guarantees the Right to Equality.'],
  [QUIZ_IDS.gkQ, 'The National Planning Commission of Nepal comes under:', 'Ministry of Finance', 'Office of the Prime Minister', 'Parliament Secretariat', 'Judiciary', 'b', 'The NPC operates under the Office of the Prime Minister.'],
  [QUIZ_IDS.gkQ, 'Which act governs the Civil Service of Nepal?', 'Civil Service Act 2049', 'Administrative Act 2055', 'Public Administration Act 2064', 'Government Service Act 2063', 'a', 'The Civil Service Act 2049 governs civil servants in Nepal.'],
  [QUIZ_IDS.gkQ, 'The minimum age to vote in Nepal is:', '16 years', '18 years', '21 years', '20 years', 'b', 'The voting age in Nepal is 18 years.'],
  [QUIZ_IDS.gkQ, 'How many members are in the National Assembly (Rastriya Sabha) of Nepal?', '45', '59', '60', '55', 'b', 'The National Assembly has 59 members.'],
  [QUIZ_IDS.gkQ, 'Chitwan National Park was established in:', '2029 B.S.', '2030 B.S.', '2028 B.S.', '2035 B.S.', 'b', 'Chitwan National Park was established in 2030 B.S. (1973 A.D.).'],

  [QUIZ_IDS.phys12, 'Which of the following is the SI unit of electric charge?', 'Ampere', 'Coulomb', 'Volt', 'Ohm', 'b', 'The SI unit of electric charge is the Coulomb (C).'],
  [QUIZ_IDS.phys12, 'A body is thrown vertically upward with velocity u. The time to reach maximum height is:', 'u/g', '2u/g', 'u/2g', 'g/u', 'a', 'At maximum height, v=0. Using v=u-gt → t = u/g.'],
  [QUIZ_IDS.phys12, 'The phenomenon of light bending around obstacles is called:', 'Refraction', 'Reflection', 'Diffraction', 'Dispersion', 'c', 'Diffraction is the bending of light around obstacles.'],
  [QUIZ_IDS.phys12, 'Which law states that the EMF induced is proportional to the rate of change of magnetic flux?', 'Ampere\'s Law', 'Coulomb\'s Law', 'Faraday\'s Law', 'Lenz\'s Law', 'c', 'Faraday\'s Law: EMF = -dΦ/dt.'],
  [QUIZ_IDS.phys12, 'In a simple pendulum, the time period T depends on:', 'Mass of the bob', 'Length and gravity', 'Amplitude', 'Temperature', 'b', 'T = 2π√(L/g).'],
  [QUIZ_IDS.phys12, 'The work done by a force on a body is zero when the force is:', 'Parallel to displacement', 'Anti-parallel to displacement', 'Perpendicular to displacement', 'None of the above', 'c', 'W = F·d·cosθ; at θ = 90°, W = 0.'],
  [QUIZ_IDS.phys12, 'Which type of wave cannot travel through vacuum?', 'Light waves', 'X-rays', 'Sound waves', 'Radio waves', 'c', 'Sound is a mechanical wave requiring a medium.'],
  [QUIZ_IDS.phys12, 'The absolute zero temperature in Celsius scale is:', '-100°C', '-200°C', '-273.15°C', '-373°C', 'c', 'Absolute zero is 0 K = -273.15°C.'],
  [QUIZ_IDS.phys12, 'Which mirror is used in vehicle headlights?', 'Convex mirror', 'Concave mirror', 'Plane mirror', 'Both concave and convex', 'b', 'Concave mirrors converge light to a focal point.'],
  [QUIZ_IDS.phys12, 'The energy stored in a capacitor with capacitance C and voltage V is:', 'CV', 'CV²', '½CV²', '2CV²', 'c', 'Energy = ½CV².'],
  [QUIZ_IDS.phys12, 'Newton\'s second law relates force to:', 'Velocity', 'Acceleration', 'Displacement', 'Position', 'b', 'F = ma.'],
  [QUIZ_IDS.phys12, 'The critical angle for total internal reflection depends on:', 'Wavelength only', 'Refractive index of the two media', 'Intensity of light', 'Color of light', 'b', 'sinC = n2/n1.'],
  [QUIZ_IDS.phys12, 'Alpha particles are composed of:', 'Electrons and protons', '2 protons and 2 neutrons', '1 proton and 1 neutron', 'Only protons', 'b', 'Alpha particles are Helium-4 nuclei.'],
  [QUIZ_IDS.phys12, 'The unit of magnetic flux density (B) is:', 'Weber', 'Tesla', 'Henry', 'Farad', 'b', 'Magnetic flux density B is measured in Tesla (T).'],
  [QUIZ_IDS.phys12, 'In photoelectric effect, increasing the intensity of light:', 'Increases maximum KE of electrons', 'Increases number of emitted electrons', 'Increases threshold frequency', 'Decreases stopping potential', 'b', 'Intensity increases photon count; KE depends on frequency.'],

  [QUIZ_IDS.chem12, 'Which gas is produced when sodium reacts with water?', 'Oxygen', 'Carbon dioxide', 'Hydrogen', 'Nitrogen', 'c', '2Na + 2H₂O → 2NaOH + H₂↑.'],
  [QUIZ_IDS.chem12, 'The pH of a neutral solution at 25°C is:', '0', '7', '14', '1', 'b', 'pH = 7 is neutral.'],
  [QUIZ_IDS.chem12, 'Which of the following is an example of an exothermic reaction?', 'Melting of ice', 'Decomposition of CaCO₃', 'Combustion of coal', 'Electrolysis of water', 'c', 'Combustion releases energy — it is exothermic.'],
  [QUIZ_IDS.chem12, 'The molecular formula of ethanol is:', 'CH₃OH', 'C₂H₅OH', 'C₃H₇OH', 'HCHO', 'b', 'Ethanol has the formula C₂H₅OH.'],
  [QUIZ_IDS.chem12, 'Avogadro\'s number is approximately:', '6.02 × 10²³', '3.14 × 10²³', '6.02 × 10²²', '9.8 × 10²³', 'a', 'Avogadro\'s number = 6.022 × 10²³ mol⁻¹.'],
  [QUIZ_IDS.chem12, 'Which type of bond is present in NaCl?', 'Covalent bond', 'Metallic bond', 'Ionic bond', 'Hydrogen bond', 'c', 'NaCl is formed by ionic bonding.'],
  [QUIZ_IDS.chem12, 'The IUPAC name of CH₃-CH₂-OH is:', 'Methanol', 'Propanol', 'Ethanol', 'Butanol', 'c', 'CH₃CH₂OH is ethanol.'],
  [QUIZ_IDS.chem12, 'Which gas is responsible for acid rain?', 'CO₂', 'SO₂ and NOₓ', 'CH₄', 'O₃', 'b', 'Acid rain is caused by SO₂ and NOₓ.'],
  [QUIZ_IDS.chem12, 'Rusting of iron is an example of:', 'Physical change', 'Reduction', 'Oxidation', 'Displacement', 'c', 'Rusting is oxidation: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃.'],
  [QUIZ_IDS.chem12, 'The atomic number of Carbon is:', '12', '6', '8', '14', 'b', 'Carbon has atomic number 6.'],
  [QUIZ_IDS.chem12, 'Le Chatelier\'s Principle states that when a system in equilibrium is disturbed, it will:', 'Break down completely', 'Shift to reduce the disturbance', 'Increase pressure', 'Become acidic', 'b', 'A system shifts to counteract the disturbance.'],
  [QUIZ_IDS.chem12, 'Galvanization is the process of coating iron with:', 'Tin', 'Copper', 'Zinc', 'Aluminum', 'c', 'Galvanization coats iron with zinc.'],

  [QUIZ_IDS.math12, 'The derivative of sin(x) is:', '-cos(x)', 'cos(x)', '-sin(x)', 'tan(x)', 'b', 'd/dx[sin(x)] = cos(x).'],
  [QUIZ_IDS.math12, 'If A = [1 2; 3 4], the determinant |A| is:', '2', '-2', '10', '-10', 'b', 'det(A) = (1×4) - (2×3) = -2.'],
  [QUIZ_IDS.math12, 'The integral of 1/x dx is:', 'x²/2 + C', 'ln|x| + C', 'e^x + C', '1/x² + C', 'b', '∫(1/x)dx = ln|x| + C.'],
  [QUIZ_IDS.math12, 'Which of the following is correct for vectors A and B: A × B equals?', 'B × A', '|A||B|sinθ n̂', '|A||B|cosθ', 'A · B', 'b', 'Cross product: A × B = |A||B|sinθ n̂.'],
  [QUIZ_IDS.math12, 'The slope of the line 3x + 2y = 6 is:', '3/2', '-3/2', '2/3', '-2/3', 'b', 'y = (-3/2)x + 3, slope = -3/2.'],
  [QUIZ_IDS.math12, 'If f(x) = x³ - 3x + 2, then f\'(x) is:', '3x² - 3', '3x² + 3', 'x² - 3', '3x - 3', 'a', 'f\'(x) = 3x² - 3.'],
  [QUIZ_IDS.math12, 'The value of cos(60°) is:', '√3/2', '1/2', '1/√2', '√3', 'b', 'cos(60°) = 1/2.'],
  [QUIZ_IDS.math12, 'The equation of a circle with center (0,0) and radius r is:', 'y = mx + c', 'x² + y² = r²', 'x²/a² + y²/b² = 1', 'ax² + bxy = 0', 'b', 'Standard circle equation: x² + y² = r².'],
  [QUIZ_IDS.math12, 'How many terms are in the expansion of (a + b)^n?', 'n', 'n-1', 'n+1', '2n', 'c', 'By the Binomial Theorem, there are n+1 terms.'],
  [QUIZ_IDS.math12, 'lim(x→0) [sin(x)/x] equals:', '0', 'Undefined', '1', '∞', 'c', 'The standard limit: lim(x→0) sin(x)/x = 1.'],
  [QUIZ_IDS.math12, 'In a geometric progression, if a=2, r=3, then the 4th term is:', '18', '54', '27', '162', 'b', '4th term = 2 × 3³ = 54.'],
  [QUIZ_IDS.math12, 'The mean of 5, 10, 15, 20, 25 is:', '12', '13', '15', '20', 'c', 'Mean = 75/5 = 15.'],

  [QUIZ_IDS.pa, 'Which article of the Constitution of Nepal 2072 guarantees the right to education?', 'Article 29', 'Article 31', 'Article 25', 'Article 18', 'b', 'Article 31 guarantees the Right to Education.'],
  [QUIZ_IDS.pa, 'The National Planning Commission of Nepal was established in:', '1956 B.S.', '2013 B.S.', '2006 B.S.', '2018 B.S.', 'b', 'The NPC was established in 2013 B.S. (1956 A.D.).'],
  [QUIZ_IDS.pa, 'Which body conducts Loksewa (Public Service Commission) examinations in Nepal?', 'Ministry of Education', 'Lok Sewa Aayog', 'Election Commission', 'Supreme Court', 'b', 'Lok Sewa Aayog conducts civil service examinations.'],
  [QUIZ_IDS.pa, 'Who is the Chairman of the National Planning Commission by default?', 'Finance Minister', 'President', 'Prime Minister', 'Vice President', 'c', 'The PM is ex-officio Chairman of the NPC.'],
  [QUIZ_IDS.pa, 'The concept of "Good Governance" includes which of the following?', 'Transparency and accountability', 'Corruption and nepotism', 'Centralization', 'Discrimination', 'a', 'Good Governance includes transparency and accountability.'],
  [QUIZ_IDS.pa, 'Which of the following is a feature of a federal system of government?', 'Single legislature', 'Division of powers between center and states', 'Unitary executive', 'No written constitution', 'b', 'In a federal system powers are divided between levels.'],
  [QUIZ_IDS.pa, 'The Sustainable Development Goals (SDGs) were adopted in:', '2000', '2010', '2015', '2020', 'c', 'The 17 SDGs were adopted in September 2015.'],
  [QUIZ_IDS.pa, 'Which article of Nepal\'s Constitution defines the fundamental duties of citizens?', 'Article 47', 'Article 50', 'Article 48', 'Article 49', 'c', 'Article 48 defines fundamental duties.'],
  [QUIZ_IDS.pa, 'The SAARC secretariat is located in:', 'New Delhi, India', 'Kathmandu, Nepal', 'Dhaka, Bangladesh', 'Colombo, Sri Lanka', 'b', 'The SAARC Secretariat is in Kathmandu.'],
  [QUIZ_IDS.pa, 'In Nepal, the fiscal year runs from:', 'January to December', 'April to March', 'Shrawan to Ashadh (mid-July to mid-July)', 'Baisakh to Chaitra', 'c', 'The fiscal year runs from 1 Shrawan to 31 Ashadh.'],
  [QUIZ_IDS.pa, 'Which commission is responsible for delineating constituencies in Nepal?', 'Election Commission', 'National Human Rights Commission', 'Constitutional Commission', 'Boundary Commission', 'a', 'The Election Commission handles constituency delineation.'],
  [QUIZ_IDS.pa, 'What does RTI stand for in the context of governance?', 'Right to Information', 'Right to Income', 'Responsibility and Transparency Index', 'Revenue and Tax Index', 'a', 'RTI = Right to Information.'],
  [QUIZ_IDS.pa, 'The three pillars of sustainable development are:', 'Economic, Social, Environmental', 'Political, Economic, Social', 'Environmental, Governance, Military', 'Trade, Finance, Law', 'a', 'Economic, Social, and Environmental.'],
  [QUIZ_IDS.pa, 'Which Act governs Civil Service in Nepal?', 'Nepal Civil Service Act 2049', 'Civil Administration Act 2056', 'Public Service Act 2063', 'Government Service Act 2055', 'a', 'The Civil Service Act 2049 B.S. governs Nepal\'s civil service.'],
  [QUIZ_IDS.pa, 'What is MBO in the context of public administration?', 'Ministry-Based Organization', 'Management by Objectives', 'Monitoring and Budgeting Operations', 'Ministerial Budget Oversight', 'b', 'MBO = Management by Objectives.'],

  [QUIZ_IDS.see, 'Which gas makes up the largest percentage of Earth\'s atmosphere?', 'Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon', 'c', 'Nitrogen makes up about 78% of the atmosphere.'],
  [QUIZ_IDS.see, 'The process by which plants make their own food using sunlight is called:', 'Respiration', 'Photosynthesis', 'Transpiration', 'Digestion', 'b', 'Photosynthesis converts light to chemical energy.'],
  [QUIZ_IDS.see, 'What is the chemical formula of water?', 'HO', 'H₂O', 'H₂O₂', 'OH', 'b', 'Water has the formula H₂O.'],
  [QUIZ_IDS.see, 'Which organ pumps blood throughout the body?', 'Lungs', 'Liver', 'Heart', 'Kidney', 'c', 'The heart pumps blood through the circulatory system.'],
  [QUIZ_IDS.see, 'Newton\'s first law of motion is also known as:', 'Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Gravitation', 'b', 'Newton\'s first law is the Law of Inertia.'],
  [QUIZ_IDS.see, 'Which of the following is a non-renewable source of energy?', 'Solar energy', 'Wind energy', 'Coal', 'Hydropower', 'c', 'Coal is a fossil fuel — non-renewable.'],
  [QUIZ_IDS.see, 'The smallest unit of life is:', 'Atom', 'Molecule', 'Cell', 'Tissue', 'c', 'The cell is the smallest unit of life.'],
  [QUIZ_IDS.see, 'What force keeps planets in orbit around the Sun?', 'Magnetic force', 'Gravitational force', 'Nuclear force', 'Electric force', 'b', 'Gravity keeps planets in orbit.'],
  [QUIZ_IDS.see, 'The speed of light in vacuum is approximately:', '3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s', 'b', 'c ≈ 3 × 10⁸ m/s.'],
  [QUIZ_IDS.see, 'Which vitamin is produced by the skin when exposed to sunlight?', 'Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D', 'd', 'Sunlight triggers Vitamin D synthesis.'],
  [QUIZ_IDS.see, 'Acid rain is caused by pollution from:', 'CO₂ only', 'SO₂ and NOₓ', 'Water vapor', 'Argon gas', 'b', 'SO₂ and NOₓ cause acid rain.'],
  [QUIZ_IDS.see, 'The process of converting solid directly to vapor is called:', 'Evaporation', 'Condensation', 'Sublimation', 'Melting', 'c', 'Sublimation is solid → gas directly.'],
  [QUIZ_IDS.see, 'DNA stands for:', 'Deoxyribose Nucleic Acid', 'Deoxyribonucleic Acid', 'Diribonucleic Acid', 'Dioxyribose Nucleic Acid', 'b', 'DNA = Deoxyribonucleic Acid.'],
  [QUIZ_IDS.see, 'Which planet is known as the Red Planet?', 'Jupiter', 'Venus', 'Mars', 'Saturn', 'c', 'Mars is called the Red Planet due to iron oxide.'],
  [QUIZ_IDS.see, 'Which gas is exhaled by humans during respiration?', 'Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen', 'c', 'CO₂ is exhaled during respiration.'],

  // Bio 12
  [QUIZ_IDS.bio12, 'Which law of Mendel states that alleles segregate randomly during gamete formation?', 'Law of Dominance', 'Law of Segregation', 'Law of Independent Assortment', 'Law of Inheritance', 'b', 'Mendel\'s 1st law is the Law of Segregation.'],
  [QUIZ_IDS.bio12, 'Human blood group AB is an example of:', 'Incomplete Dominance', 'Codominance', 'Polygenic Inheritance', 'Pleiotropy', 'b', 'Both A and B alleles are fully expressed (codominance).'],
  [QUIZ_IDS.bio12, 'The father of genetics is:', 'Charles Darwin', 'Gregor Mendel', 'Hugo de Vries', 'Thomas Morgan', 'b', 'Gregor Johann Mendel discovered basic laws of inheritance.'],
  [QUIZ_IDS.bio12, 'Which organelle is known as the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body', 'b', 'Mitochondria generate ATP energy.'],

  // CS 11
  [QUIZ_IDS.cs11, 'Which keyword in C is used to define a constant variable?', 'static', 'const', 'define', 'final', 'b', 'const keyword declares a read-only variable.'],
  [QUIZ_IDS.cs11, 'What is the size of int data type in 32-bit C compiler?', '1 byte', '2 bytes', '4 bytes', '8 bytes', 'c', 'A standard 32-bit integer occupies 4 bytes (32 bits).'],
  [QUIZ_IDS.cs11, 'Which operator is used to access the address of a variable in C?', '*', '&', '->', '.', 'b', 'The & operator returns the memory address of a variable.'],
  [QUIZ_IDS.cs11, 'Which loop executes at least once even if the condition is false?', 'for loop', 'while loop', 'do-while loop', 'nested loop', 'c', 'do-while evaluates the condition at the end of execution.'],

  // CS 12
  [QUIZ_IDS.cs12, 'Which data structure follows LIFO (Last In First Out)?', 'Queue', 'Stack', 'Array', 'Linked List', 'b', 'Stack operates on Last-In First-Out principle.'],
  [QUIZ_IDS.cs12, 'Which OOP concept allows a subclass to inherit properties from a parent class?', 'Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction', 'c', 'Inheritance allows code reuse from base classes.'],
  [QUIZ_IDS.cs12, 'SQL command used to retrieve data from a table is:', 'UPDATE', 'INSERT', 'SELECT', 'DELETE', 'c', 'SELECT query extracts records from database tables.'],
  [QUIZ_IDS.cs12, 'Worst-case time complexity of QuickSort algorithm is:', 'O(n log n)', 'O(n)', 'O(n²)', 'O(1)', 'c', 'Worst-case QuickSort is O(n²) when pivot is poorly chosen.'],

  // Accountancy 12
  [QUIZ_IDS.accountancy, 'Which accounting statement shows a company\'s financial position at a specific date?', 'Income Statement', 'Trial Balance', 'Balance Sheet', 'Cash Flow Statement', 'c', 'The Balance Sheet lists Assets, Liabilities, and Equity on a given date.'],
  [QUIZ_IDS.accountancy, 'Goodwill is classified as:', 'Current Asset', 'Intangible Fixed Asset', 'Fictitious Asset', 'Tangible Asset', 'b', 'Goodwill is an intangible non-current asset.'],
  [QUIZ_IDS.accountancy, 'The golden rule for Nominal Account is:', 'Debit the receiver, credit the giver', 'Debit what comes in, credit what goes out', 'Debit all expenses/losses, credit all incomes/gains', 'None of the above', 'c', 'Nominal account rule: Debit expenses/losses, Credit incomes/gains.'],

  // Economics 12
  [QUIZ_IDS.economics, 'Gross Domestic Product (GDP) measures:', 'Total money in circulation', 'Total value of final goods/services produced in a country', 'Government expenditure', 'Total exports minus imports', 'b', 'GDP is the market value of final goods/services within domestic territory.'],
  [QUIZ_IDS.economics, 'Inflation means:', 'Continuous decrease in price level', 'Continuous rise in general price level', 'Increase in unemployment', 'Balance of payment surplus', 'b', 'Inflation is a sustained increase in the general price level.'],

  // IOE Physics & IOE Math
  [QUIZ_IDS.ioePhysics, 'Two forces of 3N and 4N act at right angles. The magnitude of their resultant is:', '7 N', '1 N', '5 N', '12 N', 'c', 'R = √(3² + 4²) = 5 N.'],
  [QUIZ_IDS.ioeMath, 'The derivative of sin(x) with respect to x is:', '-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)', 'b', 'd/dx[sin(x)] = cos(x).'],

  // SEE Math, SEE English, SEE Social
  [QUIZ_IDS.seeMath, 'If the radius of a circle is 7 cm, its area is: (π = 22/7)', '44 cm²', '154 cm²', '49 cm²', '88 cm²', 'b', 'Area = πr² = (22/7) × 49 = 154 cm².'],
  [QUIZ_IDS.seeEnglish, 'Choose the correct passive voice: "She cooks food."', 'Food is cooked by her.', 'Food was cooked by her.', 'Food is being cooked by her.', 'Food has been cooked by her.', 'a', 'Simple present passive: Object + is/am/are + V3 + by + Agent.'],
  [QUIZ_IDS.seeSocial, 'The unification of modern Nepal was initiated by which king?', 'Prithvi Narayan Shah', 'Mahendra Bir Bikram Shah', 'Birendra Bir Bikram Shah', 'Ram Shah', 'a', 'King Prithvi Narayan Shah unified the small kingdoms into modern Nepal.'],

  // Physiology & Loksewa Nepali
  [QUIZ_IDS.physiology, 'Normal resting cardiac output in an adult human is approximately:', '2 L/min', '5 L/min', '8 L/min', '10 L/min', 'b', 'Normal cardiac output = Stroke volume (70ml) × HR (72 bpm) ≈ 5 L/min.'],
  [QUIZ_IDS.nepaliLoksewa, 'नेपाली व्याकरणमा "नाप, तौल वा परिमाण" बुझाउने शब्द कुन वर्गमा पर्छ?', 'जातिवाचक नाम', 'द्रव्यवाचक नाम', 'समूहवाचक नाम', 'भाववाचक नाम', 'b', 'द्रव्यवाचक नामले गन्न नसकिने, नाप्न वा तौलन सकिने पदार्थ बुझाउँछ।'],
  [QUIZ_IDS.mgmtGk, 'Which management function involves measuring performance and correcting deviations?', 'Planning', 'Organizing', 'Directing', 'Controlling', 'd', 'Controlling is the process of measuring, comparing, and correcting performance.'],

  // BCA C Programming
  [QUIZ_IDS.bcaC, 'Which format specifier is used to print the memory address of a pointer variable in C?', '%u', '%x', '%p', '%d', 'c', 'In C, %p is the standard format specifier used with printf to print pointer addresses.'],
  [QUIZ_IDS.bcaC, 'What is the primary difference between malloc() and calloc() in standard C?', 'malloc allocates contiguous memory while calloc does not', 'calloc initializes allocated memory to zero while malloc leaves it uninitialized', 'malloc is faster than calloc because it takes two arguments', 'calloc can only allocate memory on the stack', 'b', 'calloc(n, size) initializes all allocated bytes to zero, whereas malloc(size) leaves memory uninitialized with garbage values.'],
  [QUIZ_IDS.bcaC, 'Which operator cannot be overloaded or redefined in C?', 'sizeof', '+', '->', '==', 'a', 'C does not support operator overloading, and sizeof is evaluated at compile time.'],
  [QUIZ_IDS.bcaC, 'What will be the output of printf("%d", 10 >> 1); in C?', '20', '5', '10', '1', 'b', 'Right-shift operator >> 1 divides an integer by 2: 10 >> 1 = 5.'],
  [QUIZ_IDS.bcaC, 'In C, what is the size of a union that contains int a (4 bytes), double b (8 bytes), and char c[10] (10 bytes)?', '22 bytes', 'At least 10 bytes (padded to 16 bytes for double alignment)', '4 bytes', '8 bytes', 'b', 'A union allocates memory equal to its largest member (10 bytes), aligned to the largest scalar member.'],
  [QUIZ_IDS.bcaC, 'Which mode in fopen() opens an existing file for both reading and writing without truncating it?', '"w+"', '"a"', '"r+"', '"w"', 'c', '"r+" opens an existing text file for both reading and writing from the start without truncating it.'],

  // BCA Computer Fundamentals & Applications
  [QUIZ_IDS.bcaCompFund, 'Which register holds the memory address of the next machine instruction to be fetched?', 'Instruction Register (IR)', 'Memory Data Register (MDR)', 'Program Counter (PC)', 'Accumulator (AC)', 'c', 'The Program Counter (PC) stores the memory address of the next sequential instruction to execute.'],
  [QUIZ_IDS.bcaCompFund, 'What is the 2\'s complement of the 8-bit binary number 00001010 (+10)?', '11110101', '11110110', '11111010', '00001011', 'b', '1\'s complement of 00001010 is 11110101; adding 1 yields 11110110 (-10).'],
  [QUIZ_IDS.bcaCompFund, 'Why does DRAM (Dynamic RAM) require periodic electrical refreshing?', 'Because it uses flip-flops that consume continuous power', 'Because it uses tiny capacitors that gradually leak their electrical charge', 'To clear temporary data after each CPU clock cycle', 'To prevent thermal breakdown in magnetic memory', 'b', 'DRAM cells store bits as charge on microscopic capacitors that leak and must be refreshed thousands of times per second.'],
  [QUIZ_IDS.bcaCompFund, 'Which memory hierarchy level has the smallest access time (fastest)?', 'L1 Cache', 'L2 Cache', 'CPU Registers', 'Main RAM', 'c', 'CPU registers reside directly inside the processor ALU/datapath and provide sub-nanosecond access.'],
  [QUIZ_IDS.bcaCompFund, 'Which CPU scheduling algorithm is non-preemptive and selects the process with the shortest burst time?', 'Round Robin (RR)', 'Shortest Job First (SJF Non-preemptive)', 'Shortest Remaining Time First (SRTF)', 'Priority Preemptive', 'b', 'Non-preemptive SJF executes the process with the shortest CPU burst until completion.'],
  [QUIZ_IDS.bcaCompFund, 'Which of the following is considered a Universal Logic Gate?', 'AND Gate', 'OR Gate', 'NAND Gate', 'XOR Gate', 'c', 'NAND and NOR gates are universal gates because any combinational circuit can be created using them alone.'],

  // BCA Discrete Mathematics
  [QUIZ_IDS.bcaDiscreteMath, 'According to the Handshaking Theorem in graph theory, the sum of degrees of all vertices is equal to:', 'Number of edges |E|', '2 × Number of edges (2|E|)', 'Number of vertices |V|', '2 × Number of vertices (2|V|)', 'b', 'The Handshaking Lemma states that ∑ deg(v) = 2|E|, since every undirected edge contributes 2 to the total degree sum.'],
  [QUIZ_IDS.bcaDiscreteMath, 'A relation R on a set A is an equivalence relation if and only if it is:', 'Reflexive, Symmetric, and Transitive', 'Reflexive, Antisymmetric, and Transitive', 'Irreflexive, Symmetric, and Transitive', 'Reflexive and Symmetric only', 'a', 'By definition, an equivalence relation must satisfy reflexivity, symmetry, and transitivity.'],
  [QUIZ_IDS.bcaDiscreteMath, 'If a tree has 15 vertices, how many edges does it contain?', '15', '14', '16', '30', 'b', 'Any tree with n vertices has exactly n - 1 edges: 15 - 1 = 14 edges.'],
  [QUIZ_IDS.bcaDiscreteMath, 'What is the truth value of the compound proposition P → Q when P is False and Q is False?', 'False', 'True', 'Indeterminate', 'Contradictory', 'b', 'In material implication, False implies False is vacuously True.'],
  [QUIZ_IDS.bcaDiscreteMath, 'How many subsets does a set with 5 distinct elements have?', '25', '10', '32', '64', 'c', 'The power set of a set with n elements contains 2ⁿ subsets. For n = 5, 2⁵ = 32 subsets.'],
  [QUIZ_IDS.bcaDiscreteMath, 'A connected undirected graph contains an Euler circuit if and only if:', 'It has exactly two vertices of odd degree', 'Every vertex has an even degree', 'It contains no cycles', 'The number of vertices is prime', 'b', 'Euler\'s theorem proves a connected graph has an Eulerian circuit iff every vertex has an even degree.'],

  // BCA Data Structures & Algorithms
  [QUIZ_IDS.bcaDSA, 'Which data structure operates strictly on the Last-In, First-Out (LIFO) principle?', 'Queue', 'Stack', 'Binary Search Tree', 'Priority Queue', 'b', 'A Stack permits insertion and deletion only at one end (the top), enforcing LIFO order.'],
  [QUIZ_IDS.bcaDSA, 'What is the worst-case time complexity of the QuickSort algorithm?', 'O(n log n)', 'O(n²)', 'O(log n)', 'O(n)', 'b', 'QuickSort degrades to O(n²) when the chosen pivot is consistently the smallest or largest element.'],
  [QUIZ_IDS.bcaDSA, 'In a circular queue of capacity SIZE implemented using an array, the condition for being full is:', 'front == rear', '(rear + 1) % SIZE == front', '(front + 1) % SIZE == rear', 'rear == SIZE', 'b', 'In a circular queue, the full condition is (rear + 1) % SIZE == front.'],
  [QUIZ_IDS.bcaDSA, 'Which tree traversal of a Binary Search Tree (BST) produces keys in ascending sorted order?', 'Pre-order Traversal', 'In-order Traversal', 'Post-order Traversal', 'Level-order Traversal', 'b', 'In-order traversal visits (Left, Root, Right), which naturally outputs keys in ascending sorted order for a BST.'],
  [QUIZ_IDS.bcaDSA, 'The balance factor of any node in an AVL tree is defined as:', 'Height of Left Subtree - Height of Right Subtree', 'Number of Left Children - Number of Right Children', 'Depth of Root - Depth of Node', 'Total Nodes in Left Subtree / Total Nodes in Right Subtree', 'a', 'Balance factor = Height(Left) - Height(Right), and must be -1, 0, or +1 for all nodes in an AVL tree.'],
  [QUIZ_IDS.bcaDSA, 'Which algorithm finds a Minimum Spanning Tree (MST) using a greedy edge-by-edge approach with cycle detection?', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm', 'b', 'Kruskal\'s algorithm sorts edges by weight and greedily connects vertices while preventing cycles using Disjoint Sets.'],

  // BCA Object Oriented Programming in Java
  [QUIZ_IDS.bcaJava, 'In Java, what is the key difference between final, finally, and finalize()?', 'final is a block, finally is a method, finalize is an access modifier', 'final is a modifier, finally is a cleanup block in exception handling, finalize() is a method called before GC', 'final creates constant objects only, finally throws exceptions, finalize is an interface', 'They are identical in modern Java', 'b', 'final defines immutable variables/classes/methods; finally is a block that always executes after try-catch; finalize() is invoked prior to garbage collection.'],
  [QUIZ_IDS.bcaJava, 'Why does Java not support multiple inheritance of classes directly?', 'Due to CPU instruction limits', 'To avoid the Diamond Problem and ambiguous method resolutions', 'Because classes in Java cannot have constructors', 'Because Java bytecode only supports single pointers', 'b', 'Java avoids ambiguous method inheritance (the Diamond Problem) by enforcing single class inheritance while supporting multiple interfaces.'],
  [QUIZ_IDS.bcaJava, 'Which collection class in Java is synchronized and thread-safe by default?', 'ArrayList', 'Vector', 'LinkedList', 'HashSet', 'b', 'Vector is synchronized and thread-safe, whereas ArrayList is unsynchronized for higher single-threaded throughput.'],
  [QUIZ_IDS.bcaJava, 'What happens when an unhandled NullPointerException occurs during Java runtime?', 'The JVM automatically initializes the reference to a default object', 'The current thread terminates and outputs an exception stack trace', 'The compiler re-runs with debug flags', 'The program restarts from main()', 'b', 'NullPointerException is an unchecked RuntimeException that aborts the thread if left uncaught.'],
  [QUIZ_IDS.bcaJava, 'Which access modifier allows members to be accessible within the package and by subclasses in other packages?', 'private', 'default (package-private)', 'protected', 'public', 'c', 'protected permits access within the defining package and to subclasses in different packages.'],
  [QUIZ_IDS.bcaJava, 'In Java, String objects are immutable. What does this mean?', 'A String reference variable cannot be reassigned', 'Once created, the character sequence inside a String object cannot be altered', 'Strings can only be stored in CPU cache', 'Strings cannot be passed as method arguments', 'b', 'String immutability means the character content cannot change in-place; modifications create new String objects.'],

  // BCA Database Management System
  [QUIZ_IDS.bcaDBMS, 'Which ACID property guarantees that either all operations of a transaction succeed or none are applied?', 'Consistency', 'Isolation', 'Atomicity', 'Durability', 'c', 'Atomicity guarantees all-or-nothing execution for database transactions.'],
  [QUIZ_IDS.bcaDBMS, 'A database relation is in Second Normal Form (2NF) if it is in 1NF and:', 'Has no transitive functional dependencies', 'Has no partial functional dependencies on candidate keys', 'Every determinant is a super key', 'Contains only numeric columns', 'b', '2NF requires all non-prime attributes to be fully functionally dependent on the primary key, eliminating partial dependencies.'],
  [QUIZ_IDS.bcaDBMS, 'What is the primary difference between WHERE and HAVING clauses in SQL?', 'WHERE filters rows before grouping; HAVING filters groups after GROUP BY', 'WHERE is only used with SELECT; HAVING is used with UPDATE', 'WHERE can use aggregate functions like COUNT(); HAVING cannot', 'They are completely interchangeable in ANSI SQL', 'a', 'WHERE filters individual candidate rows prior to aggregation, while HAVING filters grouped results after GROUP BY.'],
  [QUIZ_IDS.bcaDBMS, 'In relational algebra, which operator returns tuples that are present in relation R but not in relation S?', 'Union (R ∪ S)', 'Cartesian Product (R × S)', 'Set Difference (R - S)', 'Intersection (R ∩ S)', 'c', 'Set Difference (R - S) selects tuples present in R that do not exist in relation S.'],
  [QUIZ_IDS.bcaDBMS, 'What is the role of a Foreign Key constraint in relational schemas?', 'To automatically encrypt sensitive columns', 'To enforce referential integrity between child and parent tables', 'To generate auto-incrementing integer IDs', 'To enable full-text indexing on char columns', 'b', 'A Foreign Key enforces referential integrity by ensuring values in the child table reference valid primary keys in the parent table.'],
  [QUIZ_IDS.bcaDBMS, 'Which concurrency protocol guarantees conflict serializability without allowing cascading rollbacks?', 'Strict Two-Phase Locking (Strict 2PL)', 'Simple Read Locking', 'Timestamp Ordering without validation', 'Dirty Read Isolation', 'a', 'Strict 2PL holds all exclusive write locks until transaction completion, ensuring serializability and avoiding cascading rollbacks.'],

  // BCA Web Technology
  [QUIZ_IDS.bcaWebTech, 'What is the difference between == and === in JavaScript?', '== checks both value and data type; === converts types automatically', '== performs type coercion before comparison; === checks strict equality without type conversion', '== is for numbers only; === is for strings', '== assigns values; === compares values', 'b', '=== checks strict equality with no type coercion; == coerces values to common types before comparing.'],
  [QUIZ_IDS.bcaWebTech, 'Which CSS Flexbox property distributes items along the main axis?', 'align-items', 'justify-content', 'align-content', 'flex-direction', 'b', 'justify-content controls alignment and spacing of flex items along the main axis.'],
  [QUIZ_IDS.bcaWebTech, 'How does localStorage differ from sessionStorage in web browsers?', 'localStorage expires after 24 hours; sessionStorage never expires', 'localStorage persists across browser tabs and sessions; sessionStorage clears when the tab is closed', 'localStorage only stores binary files; sessionStorage stores text', 'sessionStorage is encrypted while localStorage is plain text', 'b', 'localStorage persists permanently until explicitly removed; sessionStorage is isolated to the tab session.'],
  [QUIZ_IDS.bcaWebTech, 'In the DOM event flow, what is the phase called when an event propagates upwards to the root document?', 'Capturing Phase', 'Target Phase', 'Bubbling Phase', 'Dispatching Phase', 'c', 'Event Bubbling propagates an event from the deepest target element upwards through parent ancestor nodes.'],
  [QUIZ_IDS.bcaWebTech, 'In PHP, which superglobal array is populated when an HTML form is submitted with method="POST"?', '$_GET', '$_POST', '$_REQUEST_DATA', '$_FORM', 'b', '$_POST is the superglobal associative array containing data sent via HTTP POST requests.'],
  [QUIZ_IDS.bcaWebTech, 'Which HTTP response status code indicates that the requested resource could not be found?', '200 OK', '301 Moved Permanently', '404 Not Found', '500 Internal Server Error', 'c', 'HTTP 404 Not Found signifies that the origin server did not find a current representation for the target URL.'],
]

const QUESTIONS: Row[] = QUESTION_SEED.map((q, i) => ({
  id: `q-${i + 1}`,
  quiz_id: q[0],
  question_text: q[1],
  option_a: q[2],
  option_b: q[3],
  option_c: q[4],
  option_d: q[5],
  correct_option: q[6],
  explanation: q[7],
}))

// ── Results / Downloads / Bookmarks / Submissions / Posts ────
const QUIZ_TOTAL: Record<string, number> = Object.fromEntries(QUIZZES.map(q => [q.id as string, q.question_count as number]))

function makeResults(): Row[] {
  const out: Row[] = []
  const qids = Object.keys(QUIZ_TOTAL)
  const push = (userId: string, quizId: string, baseScore: number, day: number, hour: number) => {
    const total = QUIZ_TOTAL[quizId] ?? 10
    const score = Math.max(20, Math.min(100, baseScore))
    const correct = Math.round((score / 100) * total)
    out.push({
      id: uuid('r'),
      user_id: userId,
      quiz_id: quizId,
      score,
      correct_count: correct,
      incorrect_count: total - correct,
      skipped_count: 0,
      time_taken_seconds: 300 + Math.round((day * 137 + hour * 53) % 600),
      attempted_at: daysAgo(day, hour),
    })
  }
  // Demo student — 16 attempts across the last 13 days (feeds heatmap / streak / charts)
  const studentDays = [0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12]
  const studentScores = [82, 74, 90, 68, 85, 78, 92, 70, 88, 64, 79, 86, 73, 91, 69, 84]
  studentDays.forEach((d, i) => {
    push(DEMO_IDS.student, qids[i % qids.length], studentScores[i], d, 9 + (i % 9))
  })
  // Leaderboard students
  const others: [string, number][] = [
    [DEMO_IDS.aarav, 92], [DEMO_IDS.pratiksha, 88], [DEMO_IDS.bibek, 80],
    [DEMO_IDS.anisha, 74], [DEMO_IDS.nirajan, 68],
  ]
  others.forEach(([uid, base], oi) => {
    for (let i = 0; i < 4; i++) {
      push(uid, qids[(oi + i) % qids.length], Math.max(55, base + ((i * 5) % 13) - 6), 1 + i * 3, 12 + i)
    }
  })
  return out
}

function makeDownloads(): Row[] {
  const out: Row[] = []
  const studentContent = ['c-1', 'c-4', 'c-13', 'c-18', 'c-20', 'c-21', 'c-23', 'c-2', 'c-15', 'c-9', 'c-12', 'c-24']
  studentContent.forEach((cid, i) => {
    out.push({ id: uuid('dl'), user_id: DEMO_IDS.student, content_id: cid, downloaded_at: daysAgo(Math.min(12, i), 10 + (i % 8)) })
    out.push({ id: uuid('dl'), user_id: DEMO_IDS.student, content_id: cid, downloaded_at: daysAgo(Math.min(12, i + 1), 15) })
  })
  // Downloads on the contributor's approved content (feeds contributor analytics)
  const contributorDownloads: [string, string, number][] = [
    [DEMO_IDS.aarav, 'c-24', 1], [DEMO_IDS.pratiksha, 'c-24', 2], [DEMO_IDS.bibek, 'c-24', 3],
    [DEMO_IDS.anisha, 'c-24', 4], [DEMO_IDS.nirajan, 'c-24', 5], [DEMO_IDS.student, 'c-24', 6],
    [DEMO_IDS.aarav, 'c-24', 7], [DEMO_IDS.pratiksha, 'c-24', 8],
  ]
  contributorDownloads.forEach(([uid, cid, day]) => {
    out.push({ id: uuid('dl'), user_id: uid, content_id: cid, downloaded_at: daysAgo(day, 11 + day) })
  })
  // A few more by other students on admin content
  out.push({ id: uuid('dl'), user_id: DEMO_IDS.aarav, content_id: 'c-5', downloaded_at: daysAgo(2, 14) })
  out.push({ id: uuid('dl'), user_id: DEMO_IDS.pratiksha, content_id: 'c-6', downloaded_at: daysAgo(3, 13) })
  out.push({ id: uuid('dl'), user_id: DEMO_IDS.bibek, content_id: 'c-18', downloaded_at: daysAgo(1, 16) })
  return out
}

const BOOKMARKS: Row[] = [
  { id: 'bm-1', user_id: DEMO_IDS.student, content_id: 'c-1', subject_id: null, created_at: daysAgo(5) },
  { id: 'bm-2', user_id: DEMO_IDS.student, content_id: 'c-18', subject_id: null, created_at: daysAgo(4) },
  { id: 'bm-3', user_id: DEMO_IDS.student, content_id: null, subject_id: SUBJECT_IDS.physics12, created_at: daysAgo(3) },
]

const SUBMISSIONS: Row[] = [
  { id: 's-1', contributor_id: DEMO_IDS.contributor, content_id: 'c-24', status: 'approved', reviewed_by: DEMO_IDS.admin, reviewed_at: daysAgo(9) },
  { id: 's-2', contributor_id: DEMO_IDS.contributor, content_id: 'c-25', status: 'under_review', reviewed_by: null, reviewed_at: null },
  { id: 's-3', contributor_id: DEMO_IDS.contributor, content_id: 'c-26', status: 'rejected', reviewed_by: DEMO_IDS.admin, reviewed_at: daysAgo(6) },
]

const DISCUSSION_POSTS: Row[] = [
  { id: 'p-1', subject_id: SUBJECT_IDS.physics11, user_id: DEMO_IDS.pratiksha, content: 'How do you solve relative velocity problems quickly? Any shortcut for same-direction questions?', created_at: daysAgo(6, 12) },
  { id: 'p-2', subject_id: SUBJECT_IDS.physics11, user_id: DEMO_IDS.aarav, content: 'Best resources to practice NEB 2079 physics numericals before the board exam?', created_at: daysAgo(4, 16) },
  { id: 'p-3', subject_id: SUBJECT_IDS.physics11, user_id: DEMO_IDS.anisha, content: 'Doubts in projectile motion — why does range become maximum at 45°?', created_at: daysAgo(2, 11) },
]

const DISCUSSION_REPLIES: Row[] = [
  { id: 'pr-1', post_id: 'p-1', user_id: DEMO_IDS.bibek, content: 'For same direction subtract the speeds, for opposite direction add them. That covers most MCQ cases.', created_at: daysAgo(6, 15) },
  { id: 'pr-2', post_id: 'p-1', user_id: DEMO_IDS.contributor, content: 'Exactly — and remember relative velocity = v₁ - v₂ only when both move in the same line.', created_at: daysAgo(5, 9) },
  { id: 'pr-3', post_id: 'p-1', user_id: DEMO_IDS.nirajan, content: 'Practise the kinematics quiz on this page, it helped me a lot!', created_at: daysAgo(5, 18) },
  { id: 'pr-4', post_id: 'p-2', user_id: DEMO_IDS.student, content: 'The NEB 2079 paper here is great. Try solving it in exam conditions.', created_at: daysAgo(4, 19) },
  { id: 'pr-5', post_id: 'p-2', user_id: DEMO_IDS.admin, content: 'Check the "NEB Physics Full Model Test" quiz — 15 questions, 30 minutes.', created_at: daysAgo(3, 10) },
  { id: 'pr-6', post_id: 'p-3', user_id: DEMO_IDS.pratiksha, content: 'Range = v²sin2θ/g, and sin2θ is maximum (1) at θ = 45°.', created_at: daysAgo(2, 14) },
]

const NEWSLETTER: Row[] = [
  { id: 'n-1', email: 'aarav@vidyasetu.com', created_at: daysAgo(10) },
  { id: 'n-2', email: 'pratiksha@vidyasetu.com', created_at: daysAgo(8) },
  { id: 'n-3', email: 'bibek@vidyasetu.com', created_at: daysAgo(6) },
]

// ── Database assembly ────────────────────────────────────────
export interface DemoDb {
  programs: Row[]
  faculties_or_streams: Row[]
  subjects: Row[]
  users: Row[]
  content: Row[]
  quizzes: Row[]
  questions: Row[]
  results: Row[]
  bookmarks: Row[]
  downloads_log: Row[]
  submissions: Row[]
  discussion_posts: Row[]
  discussion_replies: Row[]
  newsletter_subscribers: Row[]
}

export function buildDb(): DemoDb {
  return {
    programs: PROGRAMS.map(r => ({ ...r })),
    faculties_or_streams: FACULTIES.map(r => ({ ...r })),
    subjects: SUBJECTS.map(r => ({ ...r })),
    users: USERS.map(r => ({ ...r })),
    content: CONTENT.map(r => ({ ...r })),
    quizzes: QUIZZES.map(r => ({ ...r })),
    questions: QUESTIONS.map(r => ({ ...r })),
    results: makeResults(),
    bookmarks: BOOKMARKS.map(r => ({ ...r })),
    downloads_log: makeDownloads(),
    submissions: SUBMISSIONS.map(r => ({ ...r })),
    discussion_posts: DISCUSSION_POSTS.map(r => ({ ...r })),
    discussion_replies: DISCUSSION_REPLIES.map(r => ({ ...r })),
    newsletter_subscribers: NEWSLETTER.map(r => ({ ...r })),
  }
}

export const DB: DemoDb = buildDb()

// ── Session helpers ───────────────────────────────────────────
export function demoGetSessionId(): string | null {
  try {
    if (typeof document === 'undefined') return null
    const m = document.cookie.match(new RegExp('(?:^|; )' + DEMO_SESSION_COOKIE + '=([^;]*)'))
    if (m) return decodeURIComponent(m[1])
    return localStorage.getItem(DEMO_SESSION_COOKIE) ?? null
  } catch {
    return null
  }
}

export function demoSetSession(id: string | null): void {
  try {
    if (typeof document === 'undefined') return
    if (id) {
      document.cookie = `${DEMO_SESSION_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=2592000; SameSite=Lax`
      localStorage.setItem(DEMO_SESSION_COOKIE, id)
    } else {
      document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; max-age=0`
      localStorage.removeItem(DEMO_SESSION_COOKIE)
    }
  } catch {
    // ignore — demo only
  }
}

export function getUserById(id: string | null | undefined): Row | null {
  if (!id) return null
  return DB.users.find(u => u.id === id) ?? null
}

export function getUserByEmail(email: string): Row | null {
  const e = (email ?? '').trim().toLowerCase()
  return DB.users.find(u => String(u.email).toLowerCase() === e) ?? null
}

export function createUser(opts: { email: string; full_name?: string; role?: string; auth_provider?: string }): Row {
  const user: Row = {
    id: uuid('u'),
    full_name: opts.full_name || opts.email.split('@')[0] || 'New User',
    email: opts.email,
    auth_provider: opts.auth_provider || 'email',
    role: opts.role || 'student',
    avatar_url: null,
    created_at: new Date().toISOString(),
  }
  DB.users.push(user)
  return user
}

export function toAuthUser(u: Row | null): Row | null {
  if (!u) return null
  return {
    id: u.id,
    email: u.email,
    email_confirmed_at: u.created_at,
    user_metadata: { full_name: u.full_name, avatar_url: u.avatar_url },
    app_metadata: { provider: u.auth_provider || 'email' },
  }
}
