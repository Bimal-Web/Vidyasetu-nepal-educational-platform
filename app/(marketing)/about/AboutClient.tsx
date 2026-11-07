'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen, ShieldCheck, Users, GraduationCap, Award, ArrowRight,
  Mail, MapPin, Globe, ChevronRight, Library, Sparkles, Check, Brain
} from 'lucide-react'

const METRICS = [
  { value: '850+', label: 'Curated Subjects', sub: 'Across 12 Academic Streams' },
  { value: '50,000+', label: 'Verified Resources', sub: 'PDF Notes, Papers & MCQs' },
  { value: '120,000+', label: 'Active Students', sub: 'From Mechi to Mahakali' },
  { value: '77', label: 'Districts Reached', sub: 'All 7 Provinces of Nepal' },
]

const PILLARS = [
  {
    icon: BookOpen,
    tag: 'Unrestricted Access',
    title: 'Free Forever, No Hidden Paywalls',
    desc: 'Education is a fundamental human right. Every note, past paper, model question, and quiz on VidyaSetu is completely free to view, download, and study — without subscriptions, forced logins, or paid tiers.',
    highlights: ['Zero subscription or download fees', 'Low-bandwidth, lightweight PDF delivery', 'Direct Google Drive verified mirrors']
  },
  {
    icon: ShieldCheck,
    tag: 'Academic Integrity',
    title: 'Curriculum-Verified Materials',
    desc: 'We collaborate with experienced educators and high-achieving university scholars to curate content strictly aligned with Nepal’s official curricula from CDC, NEB, and Tribhuvan University.',
    highlights: ['Official CDC SEE & BLE model question banks', 'Latest NEB Class 11 & 12 stream syllabi', 'Accredited TU BCA, CSIT & BBS question sets']
  },
  {
    icon: Brain,
    tag: 'Cognitive Reinforcement',
    title: 'Exam Simulation & Active Recall',
    desc: 'Passive reading is not enough. VidyaSetu integrates timed interactive MCQs, instant rationale breakdowns, and district-level competitive leaderboards that mirror real exam time pressures.',
    highlights: ['Timed exam engine with negative marking simulation', 'Immediate explanations and syllabus citations', 'Chapter-wise mastery and accuracy tracking']
  },
  {
    icon: Users,
    tag: 'Open Collaboration',
    title: 'Community of 120,000+ Learners',
    desc: 'A nationwide knowledge-sharing network where top students, campus toppers, and teachers upload their personal notes, lecture handouts, and solved papers to empower peers across remote districts.',
    highlights: ['Multi-stage peer review and moderation pipeline', 'Contributor recognition and verified author profiles', 'Direct doubt clearance discussion forums']
  }
]

const ACADEMIC_PROGRAMS = [
  {
    id: 'school',
    name: 'Secondary Education (SEE & BLE)',
    badge: 'Class 8 & 10',
    authority: 'CDC Sanothimi & District Examination Committees',
    desc: 'Comprehensive coverage for BLE (Class 8) and SEE (Class 10) students with full CDC model papers, solved past papers from 2075–2081, and chapter-wise formula cheatsheets.',
    subjects: ['Compulsory Mathematics', 'Science & Technology', 'English', 'Nepali', 'Social Studies', 'Optional Mathematics', 'Computer Science', 'Health & Physical']
  },
  {
    id: 'plus2',
    name: 'Higher Secondary (+2 NEB)',
    badge: 'Class 11 & 12',
    authority: 'National Examination Board (NEB)',
    desc: 'Stream-specific preparation for Science, Management, Humanities, and Law. Includes NEB model question papers, practical lab manuals, numerical guides, and board past papers.',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Accountancy', 'Economics', 'Business Studies', 'Computer Science']
  },
  {
    id: 'university',
    name: 'Undergraduate Programs',
    badge: 'TU, PU & KU',
    authority: 'Tribhuvan University & Affiliated Campuses',
    desc: 'Semester-wise notes, lab projects, and previous 10-year board questions for IT, Computer Science, and Business faculties across Nepal.',
    subjects: ['BCA (Computer Application)', 'B.Sc. CSIT', 'BBM & BBA', 'BBS (Business Studies)', 'B.E. Computer Engineering', 'BIT & Information Tech']
  },
  {
    id: 'loksewa',
    name: 'Public Service (Loksewa Aayog)',
    badge: 'Competitive Exams',
    authority: 'Public Service Commission Nepal',
    desc: 'Curated general knowledge (GK), contemporary Nepal affairs, Constitution, and IQ practice sets tailored for government recruitment examinations.',
    subjects: ['Kharidar (Level 4)', 'Nayab Subba (Level 5)', 'Section Officer (Sakha Adhikrit)', 'Banking Preparation', 'Nepal Constitution & Governance', 'Contemporary National Affairs']
  }
]

const JOURNEY_MILESTONES = [
  {
    phase: '01',
    heading: 'The Resource Inequality Challenge',
    sub: 'Identifying the National Gap',
    text: 'In Nepal, thousands of students outside the Kathmandu Valley face acute shortages of affordable coaching, up-to-date question banks, and verified study notes. Textbooks often arrive late in mountainous districts, and coaching institutes charge fees that many families cannot afford. VidyaSetu was conceived to permanently eliminate this geographic and economic divide.'
  },
  {
    phase: '02',
    heading: 'Curriculum Digitization & Standardization',
    sub: 'CDC & University Alignment',
    text: 'Rather than uploading unvetted files, we established a rigorous digitization initiative: transcribing official CDC model question sets, organizing 7 years of NEB board papers by subject, and structuring university semester syllabi. Every resource was classified by board, class, and examination year.'
  },
  {
    phase: '03',
    heading: 'Building The Interactive Knowledge Platform',
    sub: 'Beyond Static Textbooks',
    text: 'To foster active learning, we expanded VidyaSetu into an interactive learning hub — introducing timed MCQ practice engines with negative marking, custom PDF reader integration, discussion boards for doubt-solving, and a verified contributor portal for teachers and scholars.'
  },
  {
    phase: '04',
    heading: 'A Unified Network Across 77 Districts',
    sub: 'Democratizing Higher Education',
    text: 'Today, VidyaSetu serves learners across all 7 provinces of Nepal — from Jhapa to Kanchanpur, and Mustang to Rautahat. Over 120,000 students rely on the platform monthly to prepare for their exams with confidence, dignity, and zero financial burden.'
  }
]

const TEAM_MEMBERS = [
  {
    name: 'Bimal Ghorsai',
    role: 'Lead Architect & Engineering',
    roleNepali: 'प्रविधि तथा प्रणाली प्रमुख',
    image: '/assets/aistudio/image_2439f431.png',
    position: 'center 25%',
    institution: 'Mechi Multiple Campus, Tribhuvan University',
    bio: 'Dedicated to dismantling educational resource bottlenecks in Nepal through accessible digital infrastructure, modern web architecture, and secure student data systems.',
    focus: ['Architecture', 'Security', 'Web Engineering']
  },
  {
    name: 'Dipesh Timsina',
    role: 'Product Design & Core Systems',
    roleNepali: 'उत्पादन डिजाइन तथा प्रणाली प्रमुख',
    image: '/assets/aistudio/20251216_094640_6ed35b8b.jpg',
    position: 'center 46%',
    institution: 'Mechi Multiple Campus, Tribhuvan University',
    bio: 'Specializing in student-centric user experience, scalable database schemas, and intuitive educational interfaces designed for high responsiveness across all devices.',
    focus: ['UI/UX Design', 'Database Systems', 'User Research']
  }
]

const ADVISOR = {
  name: 'Mr. Bishal Ghimire',
  role: 'Academic Advisor & Project Supervisor',
  image: '/assets/aistudio/558843769_24796568323292938_8697520990670861040_n_fc26b9d9.jpg',
  position: 'center 38%',
  institution: 'Department of Computer Science, Mechi Multiple Campus, Tribhuvan University',
  bio: 'Guiding the pedagogical foundation, research methodology, and academic rigor of the VidyaSetu digital education platform.',
}

const PROVINCES = [
  { name: 'Koshi Province', count: '14 Districts', highlight: 'Eastern Academic Hub' },
  { name: 'Madhesh Province', count: '8 Districts', highlight: 'Expanding Rural Reach' },
  { name: 'Bagmati Province', count: '13 Districts', highlight: 'University & Board Hub' },
  { name: 'Gandaki Province', count: '11 Districts', highlight: 'Regional Excellence' },
  { name: 'Lumbini Province', count: '12 Districts', highlight: 'Active Student Hub' },
  { name: 'Karnali Province', count: '10 Districts', highlight: 'Bridging Remote Access' },
  { name: 'Sudurpashchim', count: '9 Districts', highlight: 'Western Frontier Access' },
]

export function AboutClient() {
  const [selectedProgram, setSelectedProgram] = useState('school')
  const activeProgram = ACADEMIC_PROGRAMS.find(p => p.id === selectedProgram) || ACADEMIC_PROGRAMS[0]

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Subtle Editorial Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
            <Globe size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>NEPAL’S OPEN DIGITAL EDUCATION REPOSITORY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
            The Digital Bridge Across Every Classroom in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">
              Nepal
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-semibold">VidyaSetu (विद्यासेतु)</strong> translates to{' '}
            <em>&quot;The Bridge of Knowledge.&quot;</em> We are on a mission to ensure that academic success in Nepal is governed by curiosity and effort — never by geographical isolation or financial privilege.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 transition-all"
            >
              <Library size={16} />
              <span>Explore The Repository</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/contribute"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
            >
              <Award size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>Join As A Contributor</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Showcase */}
        <div className="mt-12 sm:mt-16 relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-slate-900 group">
          <div className="relative aspect-[16/9] max-h-[520px] w-full">
            <Image
              src="/images/about_hero_learning.jpg"
              alt="Nepali students studying with digital resources at VidyaSetu"
              fill
              priority
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              sizes="(max-w: 1280px) 100vw, 1200px"
            />
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          </div>

          {/* Floating High-Yield Glass Highlights */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/60 text-white">
              <p className="text-[11px] font-medium text-slate-200 uppercase tracking-wider">Universal Reach</p>
              <p className="text-sm sm:text-base font-bold mt-0.5">Covering 77 Districts</p>
              <p className="text-xs text-slate-300 mt-0.5">High-speed downloads optimized for low-bandwidth zones</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/60 text-white">
              <p className="text-[11px] font-medium text-slate-200 uppercase tracking-wider">Rigorous Curation</p>
              <p className="text-sm sm:text-base font-bold mt-0.5">CDC, NEB & TU Syllabi</p>
              <p className="text-xs text-slate-300 mt-0.5">Verified solutions, chapter breakdowns & marking schemes</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/60 text-white">
              <p className="text-[11px] font-medium text-slate-200 uppercase tracking-wider">Social Mission</p>
              <p className="text-sm sm:text-base font-bold mt-0.5">100% Free Forever</p>
              <p className="text-xs text-slate-300 mt-0.5">Democratizing knowledge with zero monetization barriers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUANTITATIVE IMPACT BAR ────────────────────────────── */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {METRICS.map(m => (
            <div key={m.label} className="space-y-1.5">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums font-mono">
                {m.value}
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {m.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {m.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. ARCHITECTURAL PILLARS (BENTO GRID) ──────────────────── */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Guiding Philosophy
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Built On Four Immutable Pillars
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Every architectural and pedagogical decision at VidyaSetu is designed around the lived reality of students studying across Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map(p => (
            <div
              key={p.title}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <p.icon size={22} />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Check size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. ACADEMIC DOMAINS COVERED (INTERACTIVE) ──────────────── */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              National Curriculum Scope
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              From Class 8 to Public Service
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Select an academic level to inspect curriculum alignment, examination bodies, and verified subject syllabi.
            </p>
          </div>

          {/* Interactive Stream Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
            {ACADEMIC_PROGRAMS.map(prog => (
              <button
                key={prog.id}
                onClick={() => setSelectedProgram(prog.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedProgram === prog.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {prog.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Stream Details Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {activeProgram.name}
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                Accredited Authority: {activeProgram.authority}
              </p>
            </div>
            <Link
              href={
                activeProgram.id === 'school' ? '/class10' :
                activeProgram.id === 'plus2' ? '/class11' :
                `/browse?program=${activeProgram.id}`
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Explore {activeProgram.badge} Resources</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeProgram.desc}
          </p>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Core Subject Modules Available
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeProgram.subjects.map((sub, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 truncate"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="truncate">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. THE VIDYASETU EVOLUTION (REPLACED DEVELOPER TIMELINE) ─ */}
      <section className="space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Platform Evolution
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            How VidyaSetu Transformed Into A National Network
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            From confronting the textbook shortage in regional campuses to empowering over 120,000 learners across Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {JOURNEY_MILESTONES.map(m => (
            <div
              key={m.phase}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
            >
              <div className="text-4xl font-black text-indigo-100 dark:text-indigo-950/80 font-mono absolute right-6 top-6 select-none pointer-events-none group-hover:text-indigo-200 dark:group-hover:text-indigo-900 transition-colors">
                {m.phase}
              </div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                {m.sub}
              </p>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {m.heading}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. NATIONWIDE PROVINCIAL REACH ─────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 text-white p-6 sm:p-12">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/images/about_nepal_campus.jpg"
            alt="Academic campus in Nepal"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <MapPin size={13} className="text-red-400" />
            <span>ACROSS 7 PROVINCES & 77 DISTRICTS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Reaching Students Where Physical Classrooms Face Resource Constraints
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Whether a student is studying for SEE in a remote village of Karnali, preparing for +2 Science in Pokhara, or aiming for Loksewa recruitment in Biratnagar, VidyaSetu provides identical, high-caliber study materials with zero financial friction.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {PROVINCES.slice(0, 4).map(p => (
              <div key={p.name} className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-white">{p.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{p.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. INSTITUTIONAL FOUNDATION & ARCHITECTS ───────────────── */}
      <section className="space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Institutional Origins & Team
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Academic Research Roots
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            VidyaSetu originated from collegiate research at Mechi Multiple Campus, Tribhuvan University — engineered by students who intimately understood the challenges of studying in Nepal.
          </p>
        </div>

        {/* Founding Engineers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM_MEMBERS.map(m => (
            <div
              key={m.name}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start gap-5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 ring-2 ring-indigo-500/20 shadow-md">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="80px"
                  style={{ objectPosition: m.position }}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {m.role} <span className="text-slate-400 font-normal">· {m.roleNepali}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {m.institution}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {m.bio}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {m.focus.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Supervisor & Institution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supervisor Card */}
          <div className="md:col-span-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:from-slate-900/90 dark:to-slate-800/80 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 ring-2 ring-amber-500/30 shadow-md">
              <Image
                src={ADVISOR.image}
                alt={ADVISOR.name}
                fill
                sizes="80px"
                style={{ objectPosition: ADVISOR.position }}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {ADVISOR.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                  Advisory
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {ADVISOR.role}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <MapPin size={12} className="shrink-0" />
                <span>{ADVISOR.institution}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                {ADVISOR.bio}
              </p>
            </div>
          </div>

          {/* Academic Institution Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mechi Multiple Campus
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Constituent campus of <strong className="text-slate-800 dark:text-slate-200">Tribhuvan University</strong>, established in 2021 B.S. in Bhadrapur, Jhapa. A premier institution advancing computer science and multidisciplinary education in Eastern Nepal.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              Tribhuvan University Accredited
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. GET INVOLVED / PARTICIPATE CALL TO ACTION ──────────── */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-14 border border-indigo-700 shadow-2xl">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center text-indigo-300">
            <Sparkles size={24} />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Contribute To The Future Of Education In Nepal
          </h2>

          <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
            Whether you are a university professor, a top-ranking student with clean handwritten notes, or a peer preparing for exams — your contribution elevates thousands of fellow learners.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contribute"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all"
            >
              <span>Share Notes & Past Papers</span>
              <ArrowRight size={15} />
            </Link>
            <a
              href="mailto:support@vidyasetu.edu.np"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              <Mail size={15} />
              <span>Contact Academic Outreach</span>
            </a>
          </div>

          <p className="text-xs text-indigo-300/80">
            Official Inquiry: support@vidyasetu.edu.np · Bhadrapur, Jhapa, Nepal
          </p>
        </div>
      </section>
    </div>
  )
}
