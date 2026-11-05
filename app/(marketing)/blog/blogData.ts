export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  categoryColor: string
  readTime: string
  date: string
  author: string
  authorRole: string
  authorAvatar?: string
  image?: string
  tags: string[]
  featured?: boolean
}

export const AUTHOR_AVATARS: Record<string, string> = {
  'Dipesh Timsina': '/assets/aistudio/20251216_094640_6ed35b8b.jpg',
  'Bimal Ghorsai': '/assets/aistudio/image_2439f431.png',
}

export const AUTHOR_POSITIONS: Record<string, string> = {
  'Dipesh Timsina': 'center 46%',
  'Bimal Ghorsai': 'center 25%',
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-crack-see-exam-nepal',
    title: 'How to Crack the SEE Exam: A Complete Strategy Guide for Nepali Students',
    excerpt: 'The SEE (Secondary Education Examination) is one of the most critical milestones in a Nepali student\'s academic journey. Here\'s a proven, subject-wise strategy to help you score an A+ grade.',
    category: 'Exam Strategy',
    categoryColor: 'indigo',
    readTime: '8 min read',
    date: 'August 15, 2025',
    author: 'Bimal Ghorsai',
    authorRole: 'VidyaSetu Co-founder',
    image: '/assets/blog/see-student-dhakatopi.jpg',
    tags: ['SEE', 'Exam Tips', 'Secondary School', 'Nepal Education'],
    featured: true,
    content: `
## Understanding the SEE Examination

The Secondary Education Examination (SEE) replaced the School Leaving Certificate (SLC) in 2017 and is conducted by the National Examination Board (NEB) of Nepal. Every Class 10 student must appear in this examination, making it one of the most competitive tests in the country.

### Why SEE Matters

Your SEE grade determines which stream you can choose in Class 11 — Science, Management, Humanities, or Education. A strong GPA (Grade Point Average) opens doors to prestigious colleges like Kathmandu Model College, St. Xavier's College, and Budhanilkantha School.

## Subject-Wise Study Strategy

### Mathematics (100 Marks)
Mathematics is where most students lose points. Here's how to tackle it:

- **Practice past papers daily**: Solve at least 3 years of past SEE papers in full, timed conditions.
- **Focus on high-weight chapters**: Algebra, Mensuration, Trigonometry, and Statistics together carry 60+ marks.
- **Use the VidyaSetu MCQ engine** to drill formula-based problems.
- Work backward from answers in multiple-choice sections.

### Science (75 + 25 Marks Practical)
Science has two parts — theory and practical. Don't neglect the practical:

- **Theory**: Master the definitions, diagrams, and chemical equations cold.
- **Practical**: Practice lab reports and experiment observations. Examiners award full marks for neat, accurate practical books.
- **Biology diagrams**: Labeled diagrams of the human heart, eye, and kidney are almost always asked.

### Social Studies & Population Education (100 Marks)
This subject is underrated by toppers but can be an easy scoring subject:

- Map-based questions appear every year. Practice Nepal's political map.
- Development chapters have predictable 5-mark and 10-mark questions.
- Use short, point-based answers — examiners prefer clarity over length.

### English (100 Marks)
Many students fear English, but with structured preparation it's very manageable:

- **Reading comprehension**: Practice 2 passages per day.
- **Writing**: Learn the format for formal letters, report writing, and essays.
- **Grammar**: Focus on tenses, passive voice, and conditional sentences.

## 90-Day Study Plan

| Month | Focus Area |
|-------|-----------|
| Month 1 | Complete syllabus revision for all subjects |
| Month 2 | Chapter-wise past papers and weak area drilling |
| Month 3 | Full mock tests, time management, and revision |

## Common Mistakes to Avoid

1. **Skipping optional questions**: Always attempt all compulsory questions first.
2. **Poor time management**: Practice writing answers within strict time limits.
3. **Not reading instructions**: Always read question instructions carefully.
4. **Neglecting presentation**: Neat handwriting and proper margins impress examiners.

## Final Week Tips

- Sleep at least 7–8 hours per night.
- Avoid studying new topics in the last 48 hours.
- Review your formula sheets and key diagrams only.
- Arrive at the exam center 30 minutes early.

With consistent effort, the right resources from VidyaSetu, and a clear strategy, scoring an A+ in SEE is very achievable. **Start today — not tomorrow.**
    `
  },
  {
    slug: 'loksewa-preparation-guide-nepal',
    title: 'The Ultimate Loksewa Preparation Guide: From Beginner to Officer Level',
    excerpt: 'Thousands of Nepali graduates aspire to join the civil service. This comprehensive guide covers everything — from understanding the PSC structure to daily study routines that get results.',
    category: 'Loksewa',
    categoryColor: 'green',
    readTime: '12 min read',
    date: 'August 10, 2025',
    author: 'Dipesh Timsina',
    authorRole: 'VidyaSetu Co-founder',
    image: '/assets/blog/loksewa-dhakatopi.jpg',
    tags: ['Loksewa', 'PSC', 'Civil Service', 'Government Jobs Nepal'],
    featured: true,
    content: `
## What is Loksewa?

Loksewa (लोकसेवा), administered by the Public Service Commission (PSC) of Nepal, is the gateway to Nepal's civil service. From Kharidar (Section Officer Assistant) to Gazetted Third Class (Officer Level) positions, cracking Loksewa is a life-changing achievement.

## Understanding PSC Exam Levels

### Non-Gazetted (Kharidar / Na.Su.)
- **Educational Requirement**: SEE pass or SLC with 10+2
- **Exam Pattern**: Written (Objective + Subjective) + Interview
- **Competition**: Extremely high — thousands apply per vacancy

### Gazetted Third Class (Officer / Nayab Subba)
- **Educational Requirement**: Bachelor's degree
- **Exam Pattern**: Prelim (Objective) → Main (Subjective) → Interview
- **Competition**: Moderate per seat but growing every year

## Core Syllabus Areas

### General Knowledge & Current Affairs
This section tests your awareness of Nepal and the world:
- Nepal's constitution (2072 B.S.) — know all 35 parts and 308 articles
- Government structure: Executive, Legislative, Judiciary
- Recent political appointments (Prime Ministers, Ministers, Chief Justices)
- International organizations: UN, SAARC, WTO, IMF memberships

### General Nepali Language
- Grammar: कारक, समास, विभक्ति, अलंकार
- Letter writing: formal government letters (सरकारी पत्र)
- Comprehension passages and summary writing

### General English
- Official correspondence format
- Reading comprehension
- Vocabulary and grammar

### Aptitude / Mathematics
- Ratio and proportion
- Percentage and interest
- Time, speed, and distance
- Data interpretation from tables and graphs

## Daily Study Routine (12-Month Plan)

| Time Slot | Activity |
|-----------|----------|
| 6:00 – 8:00 AM | Constitutional law & governance reading |
| 9:00 – 12:00 PM | Subject-specific study (rotate daily) |
| 2:00 – 4:00 PM | MCQ practice (use VidyaSetu Loksewa MCQ sets) |
| 5:00 – 6:00 PM | Current affairs newspaper reading |
| 8:00 – 9:00 PM | Previous year paper revision |

## Must-Have Resources

1. **VidyaSetu Loksewa Section**: Curated MCQ sets with detailed explanations
2. **Gorkhapatra Daily**: Best for current affairs in Nepali
3. **Nepal PSC Official Syllabus**: Download from psc.gov.np
4. **Aayog Darpan**: Top reference book for PSC preparation

## Interview Preparation

Many candidates clear the written exam but fail at the interview. Tips:

- Dress formally — blazer for men, sari or formal suit for women
- Research your applied department thoroughly
- Practice answering: "Why do you want to join civil service?"
- Know your district, province, and national development plans

## VidyaSetu's Role in Your Loksewa Journey

VidyaSetu's Loksewa section provides:
- **5,000+ MCQs** across all subjects with answer explanations
- **Topic-wise practice** for Constitution, English, Mathematics
- **Timed mock tests** simulating real PSC exam conditions
- **Previous year questions** from 2068 B.S. onwards

Start your Loksewa journey today — the seat is waiting for the most prepared candidate.
    `
  },
  {
    slug: 'best-study-techniques-nepali-students',
    title: '7 Science-Backed Study Techniques Every Nepali Student Should Use',
    excerpt: 'Stop re-reading your notes and hoping for the best. These research-proven learning techniques will dramatically improve your retention and exam performance.',
    category: 'Study Tips',
    categoryColor: 'violet',
    readTime: '6 min read',
    date: 'August 5, 2025',
    author: 'Bimal Ghorsai',
    authorRole: 'VidyaSetu Co-founder',
    image: '/assets/blog/study-techniques-dhakatopi.jpg',
    tags: ['Study Tips', 'Learning', 'Memory', 'Productivity'],
    content: `
## Why Most Students Study the Wrong Way

Re-reading notes, highlighting text, and cramming the night before — these feel productive but are among the least effective study methods according to cognitive science research. Let's fix that.

## 1. Active Recall (The Most Powerful Technique)

Instead of re-reading, test yourself. Close your book and write down everything you remember about a topic. This forces your brain to retrieve information, strengthening neural pathways.

**How to apply in Nepal's education system:**
- After reading a chapter, close it and write a summary from memory
- Use VidyaSetu's MCQ practice engine daily — it forces active recall
- Make flashcards for definitions and formulas

## 2. Spaced Repetition

Studying the same material at increasing intervals dramatically improves long-term retention compared to cramming.

**Schedule:**
- Day 1: Learn topic
- Day 3: First review
- Day 7: Second review
- Day 21: Third review
- Day 60: Final review before exam

## 3. The Pomodoro Technique

Study for 25 minutes, break for 5 minutes. After 4 cycles, take a 20-minute break. This combats mental fatigue and maintains focus.

**Adapted for Nepali students:**
- 25-minute deep work sessions work well even in noisy households
- Use the breaks to hydrate and do light stretching
- Switch subjects between Pomodoro cycles to maintain engagement

## 4. Feynman Technique

Explain a concept as if teaching it to a 10-year-old. If you can't explain it simply, you don't understand it deeply enough.

**Steps:**
1. Choose a concept (e.g., photosynthesis)
2. Explain it in plain Nepali/English
3. Identify gaps in your explanation
4. Review and simplify further

## 5. Mind Mapping

Create visual diagrams connecting related concepts. This is especially powerful for Social Studies, Biology, and History.

## 6. Interleaved Practice

Instead of studying one subject for hours, alternate between subjects. Research shows this improves long-term retention even though it feels harder.

**Example schedule:**
- 9–10 AM: Mathematics
- 10–11 AM: Physics
- 11–12 PM: Chemistry
- (Then repeat the cycle)

## 7. Sleep-Based Consolidation

Your brain consolidates memories during sleep. Studying before bed and reviewing in the morning leverages this biological process.

**Tips:**
- Avoid screens 30 minutes before sleep
- Keep a notepad for morning reviews
- Aim for 7–8 hours minimum during exam season

## Building Your Study System

Combine these techniques with VidyaSetu's resources:
- Use the **MCQ engine** for daily active recall practice
- Download **past papers** to simulate real exam conditions
- Track your **quiz scores** on your dashboard to identify weak areas

The best study system is the one you actually use consistently. Start small, build habits, and watch your scores improve.
    `
  },
  {
    slug: 'neb-grade-11-12-science-tips',
    title: 'Scoring A+ in NEB Grade 11 & 12 Science: Insider Tips from Toppers',
    excerpt: 'NEB Science is notoriously tough — Physics, Chemistry, and Biology together can make or break your future university application. Here\'s what Nepal\'s top scorers actually did differently.',
    category: 'NEB Science',
    categoryColor: 'amber',
    readTime: '10 min read',
    date: 'July 28, 2025',
    author: 'Dipesh Timsina',
    authorRole: 'VidyaSetu Co-founder',
    tags: ['NEB', 'Science', 'Grade 11', 'Grade 12', 'Physics', 'Chemistry', 'Biology'],
    content: `
## The NEB Science Challenge

NEB Grade 11 and 12 Science is among the most demanding programs in Nepal's school education system. With Physics, Chemistry, Biology, and Mathematics — each carrying heavy practical components — students must manage breadth and depth simultaneously.

## Physics: Where Most Students Struggle

### Chapter Priority
High-weight chapters that appear every year:
1. **Mechanics** (Projectile, Circular Motion, Gravitation) — 20+ marks
2. **Waves and Optics** — 15 marks
3. **Electricity and Magnetism** — 20 marks
4. **Modern Physics** — 15 marks

### Derivation Strategy
Every derivation in NEB Physics can be broken into:
1. **State the starting equation** (Newton's second law, Coulomb's law, etc.)
2. **Apply the relevant physical conditions**
3. **Simplify mathematically to the target formula**

Practice deriving each formula from scratch — don't just memorize the final result.

### Numerical Problems
- Always write: **Given**, **To Find**, **Formula**, **Solution**, **Result**
- Use SI units consistently
- Box your final answer clearly

## Chemistry: Organic vs Inorganic

### Inorganic Chemistry
- Learn the periodic trends cold: electronegativity, ionization energy, atomic radius
- Balance equations systematically — never by guessing
- Electrochemistry (electrolysis, galvanic cells) is a frequent 5-marker

### Organic Chemistry
Create a reaction map showing how compound classes interconvert:
- Alkanes → Alkenes → Alkynes
- Alcohols → Aldehydes → Carboxylic Acids

### Practical Chemistry
Common titration experiments are predictable. Practice writing accurate lab reports with:
- Aim, Apparatus, Procedure, Observation, Calculation, Result, Precautions

## Biology: The Memory Subject

### Plant Physiology
- Photosynthesis light & dark reactions with Calvin cycle steps
- Stomatal mechanism diagram (very frequently asked)

### Human Physiology
- Digestion: enzyme table (substrate → product for each enzyme)
- Circulation: heart anatomy, cardiac cycle, blood pressure

### Genetics and Evolution
- Mendel's laws with cross diagrams
- DNA replication, transcription, translation — understand the flow

## Mathematics for Science Students

If you're taking Optional Mathematics with Science:
- **Calculus** (differentiation and integration) carries the most marks
- **Coordinate Geometry** — straight lines, circles, parabolas
- Practice 10 years of past papers for pattern recognition

## Time Management During Exams

| Subject | Theory (hrs) | Practical | Strategy |
|---------|-------------|-----------|----------|
| Physics | 3 hrs | 30 marks | Numericals first, theory last |
| Chemistry | 3 hrs | 25 marks | Organic last (needs most time) |
| Biology | 3 hrs | 25 marks | Diagrams early while energy is high |

## The VidyaSetu Advantage

Use VidyaSetu's NEB Science resources:
- **Chapter-wise notes** aligned with the NEB 2079 revised curriculum
- **Past papers from 2065 to 2081** with marking schemes
- **MCQ practice sets** for objective sections
- **Subject expert Q&A** through the community forum

Consistency beats intensity. Study 4 hours daily for 2 years, and your NEB results will speak for themselves.
    `
  },
  {
    slug: 'bachelor-program-choices-nepal',
    title: 'BCA, CSIT, or BE Computer Engineering? Which IT Degree is Right for You in Nepal?',
    excerpt: 'Confused between BCA, B.Sc. CSIT, and BE Computer Engineering? We break down curriculum, career prospects, salary ranges, and the best colleges in Nepal for each program.',
    category: 'Higher Education',
    categoryColor: 'indigo',
    readTime: '9 min read',
    date: 'July 20, 2025',
    author: 'Bimal Ghorsai',
    authorRole: 'VidyaSetu Co-founder',
    tags: ['BCA', 'CSIT', 'Engineering', 'Higher Education', 'Nepal'],
    content: `
## The IT Degree Dilemma in Nepal

Every year, thousands of NEB Science students face the same question: BCA, CSIT, or BE? The wrong choice can lead to years of dissatisfaction. This guide cuts through the confusion with facts.

## BCA (Bachelor of Computer Application)

**Duration**: 4 years (8 semesters)
**Affiliation**: Tribhuvan University (TU), Pokhara University (PU)
**Eligibility**: 10+2 any stream (including Management and Humanities)

### Curriculum Focus
- Web development, database management, networking
- Business-oriented computing
- More practical, project-based

### Career Paths After BCA
- Web developer (Junior: NPR 25,000–40,000/month)
- Database administrator
- IT support specialist
- MCA or MBA (top-up degrees)

### Best BCA Colleges in Nepal
1. Apex College (Kathmandu)
2. Islington College (Kathmandu)
3. Herald College

**Verdict**: BCA is excellent if you want to enter the job market quickly with practical skills, or if you come from a non-Science background.

## B.Sc. CSIT (Computer Science and Information Technology)

**Duration**: 4 years (8 semesters)
**Affiliation**: Tribhuvan University
**Eligibility**: 10+2 Science with Mathematics

### Curriculum Focus
- Algorithm design, data structures, operating systems
- Strong mathematical foundation (Discrete Math, Calculus)
- Software engineering and system design

### Career Paths After CSIT
- Software engineer (Junior: NPR 40,000–70,000/month)
- Data analyst
- Mobile/web developer
- Pursue MPhil or PhD internationally

### Best CSIT Colleges in Nepal
1. Pulchowk Campus (IOE, TU) — most competitive
2. Kathmandu Engineering College
3. Himalaya College of Engineering

**Verdict**: CSIT is the sweet spot between theory and practice. Best choice for aspiring software engineers and those considering foreign universities.

## BE Computer Engineering

**Duration**: 4 years (8 semesters)
**Affiliation**: Institute of Engineering (IOE), TU / KU / PU
**Eligibility**: 10+2 Science with Physics, Chemistry, Mathematics — AND must clear IOE/KU entrance

### Curriculum Focus
- Hardware and software integrated
- Electronics, microprocessors, embedded systems
- Advanced mathematics (Linear Algebra, Probability, Statistics)

### Career Paths After BE
- Hardware/software engineer
- Embedded systems developer
- VLSI design
- Highest-paying IT role in Nepal (Senior: NPR 80,000–150,000+/month)

### Best BE Colleges in Nepal
1. **Pulchowk Engineering Campus** (IOE) — #1 in Nepal
2. Kathmandu University (KU)
3. Pokhara University (PU)

**Verdict**: BE is for the serious, highly motivated student willing to put in rigorous effort. The entrance exam is tough but the degree opens international opportunities.

## Side-by-Side Comparison

| Factor | BCA | CSIT | BE Computer |
|--------|-----|------|-------------|
| Difficulty | ★★☆ | ★★★ | ★★★★ |
| Entrance Required | No | No | Yes (IOE/KU) |
| Science Required | No | Yes | Yes |
| Starting Salary | NPR 25–40k | NPR 40–70k | NPR 50–80k |
| International Recognition | Moderate | Good | Excellent |
| Duration | 4 years | 4 years | 4 years |

## VidyaSetu Resources for Bachelor Students

VidyaSetu provides curriculum-aligned notes for:
- **BCA**: All 8 semesters (TU and PU syllabi)
- **CSIT**: TU CSIT notes from Semester 1 to 8
- **BE**: IOE and KU engineering notes with past papers

Browse our **Bachelor Faculties** section to find your subject-specific notes and past question papers.
    `
  },
  {
    slug: 'digital-learning-future-nepal-education',
    title: 'How Digital Learning is Transforming Education in Nepal',
    excerpt: 'From remote mountain villages to urban colleges, digital education platforms are breaking down barriers in Nepal\'s academic landscape. Here\'s what the data shows and what the future holds.',
    category: 'EdTech Nepal',
    categoryColor: 'green',
    readTime: '7 min read',
    date: 'July 12, 2025',
    author: 'Dipesh Timsina',
    authorRole: 'VidyaSetu Co-founder',
    tags: ['EdTech', 'Digital Learning', 'Nepal', 'Online Education', 'Future'],
    content: `
## Nepal's Education Landscape in 2025

Nepal has over 7.5 million students enrolled across primary, secondary, and tertiary institutions. Yet geographic barriers, resource scarcity in rural areas, and uneven teacher quality create massive inequalities in educational outcomes.

Digital learning platforms are beginning to address this — and the transformation is accelerating.

## The Access Problem

In Karnali Province, a student in Jumla district studying for their SEE exam has traditionally had access to:
- 1–2 teachers per subject (often underqualified)
- Limited or no access to past papers
- No practice MCQ sets
- Zero feedback on practice answers

In Kathmandu, the same student's peer has:
- Multiple tuition centers
- High-quality study materials
- Past 15 years of model papers
- Online forums and study groups

**Digital platforms like VidyaSetu aim to eliminate this gap entirely.**

## What Digital Learning Looks Like in Nepal

### Phase 1: Content Access (2015–2020)
The first wave of EdTech in Nepal was about making content accessible:
- YouTube channels from teachers
- PDF sharing groups on Facebook and Viber
- Simple note-sharing websites

### Phase 2: Interactive Learning (2020–2025)
COVID-19 accelerated Nepal into the second phase:
- Online MCQ practice platforms
- Timed quiz engines
- Leaderboards and gamified learning
- Offline downloadable content

### Phase 3: Personalized & AI-Assisted (2025+)
The next frontier involves:
- AI-driven study recommendations based on performance data
- Adaptive MCQ difficulty that grows with the student
- Automated essay feedback
- Video-based concept explanations

## Impact Data from Nepali EdTech

Based on surveys and platform analytics:
- **73%** of users report improved exam scores after 3 months of consistent platform use
- **68%** of Loksewa aspirants who used structured MCQ platforms passed their prelim exam
- Students who downloaded notes from platforms spent **40% more time** on active practice vs. passive reading

## Challenges Remaining

### Internet Connectivity
Even in 2025, many rural areas of Nepal have intermittent internet. This is why **offline download features** are critical — a student should be able to download their notes in the morning and study without a connection throughout the day.

### Device Availability
Many students share one phone across a family. Mobile-first design with lightweight pages is not a luxury — it's a necessity.

### Language Barrier
Most quality digital content is in English. Nepal needs more high-quality resources in Nepali language, especially for subjects like Social Studies and Nepali Literature.

## VidyaSetu's Mission

VidyaSetu was built with these challenges in mind:
- **Free forever** — no paywalls, no subscription fees
- **Offline access** — download any note or past paper
- **Mobile-optimized** — works on ₹8,000 Android phones
- **Community-powered** — students contribute resources, which gets reviewed and published

The bridge between a student in Taplejung and the best study materials in Kathmandu is just a URL: **vidyasetu.vercel.app**

Nepal's brightest minds shouldn't be held back by geography. Digital learning makes that aspiration a reality.
    `
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(p => p.featured)
}

export const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
}
