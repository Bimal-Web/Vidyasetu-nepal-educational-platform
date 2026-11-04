import Link from 'next/link'
import { ArrowRight, Mail, BookOpen, Users, Shield, Zap, Heart, MapPin, GraduationCap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About VidyaSetu | The Bridge of Knowledge',
  description: 'VidyaSetu is Nepal\'s free digital education platform bridging the gap for students across all academic levels.',
}

const TEAM = [
  {
    name: 'Bimal Ghorsai',
    role: 'Full-Stack Developer',
    initials: 'BG',
    color: '#3730a3',
    bio: 'Passionate about making education accessible through technology. BCA student at Mechi Multiple Campus, TU.',
  },
  {
    name: 'Dipesh Timsina',
    role: 'UI/UX & Backend',
    initials: 'DT',
    color: '#059669',
    bio: 'Focused on intuitive design and scalable backend systems. BCA student at Mechi Multiple Campus, TU.',
  },
]

const SUPERVISOR = {
  name: 'Mr. Bishal Ghimire',
  role: 'Project Supervisor',
  initials: 'BG',
  color: '#f59e0b',
  institution: 'Mechi Multiple Campus, Tribhuvan University',
}

const VALUES = [
  {
    icon: BookOpen,
    title: 'Free Forever',
    desc: 'All resources — notes, past papers, and MCQ sets — remain completely free. No paywalls, no subscriptions.',
    color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  },
  {
    icon: Shield,
    title: 'Verified Quality',
    desc: 'Every uploaded resource goes through a review process to ensure accuracy and curriculum alignment.',
    color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    desc: 'Contributors from across Nepal share resources. Students help students — together we rise.',
    color: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  },
  {
    icon: Zap,
    title: 'Modern Learning',
    desc: 'Interactive MCQs, timed quizzes, and progress tracking built for the digital-native student.',
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  },
]

const TIMELINE = [
  { year: '2024 Jan', label: 'Idea born', desc: 'Frustrated by expensive coaching and scattered notes, the team decided to build a solution.' },
  { year: '2024 Jun', label: 'Design phase', desc: 'Wireframes, user research, and initial database schema designed.' },
  { year: '2025 Jan', label: 'Development started', desc: 'Built with Next.js 15, Supabase, and Tailwind CSS v4.' },
  { year: '2025 Aug', label: 'Launch', desc: 'VidyaSetu goes live — accessible to every student in Nepal.' },
]

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded-full px-4 py-1.5 mb-6">
          <Heart size={14} className="text-red-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Made with love for Nepali students</span>
        </div>
        <h1 className="text-section text-slate-900 dark:text-white mb-4">
          About <span className="text-indigo-700 dark:text-indigo-400">VidyaSetu</span>
        </h1>
        <p className="text-body text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-200">VidyaSetu</strong> (विद्यासेतु) means &quot;The Bridge of Knowledge&quot; in Nepali.
          We believe quality education should not depend on your zip code or your wallet.
          Our mission is to digitize and freely distribute verified academic resources to every student in Nepal.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Subjects Covered',  value: '850+', color: 'text-indigo-700' },
          { label: 'Free Resources',    value: '50K+', color: 'text-emerald-600' },
          { label: 'Active Students',   value: '120K+', color: 'text-amber-600' },
          { label: 'Academic Programs', value: '12+',  color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-caption text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Our Values</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">The principles that guide every decision we make.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map(v => (
            <div key={v.title} className="card p-6 flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${v.color}`}>
                <v.icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{v.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Origin Story / Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Our Journey</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">From a frustration to a platform for thousands.</p>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-6">
            {TIMELINE.map((t, i) => (
              <div key={i} className="relative flex gap-6 pl-12">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-indigo-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-md">
                  {i + 1}
                </div>
                <div className="card p-4 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900 px-2 py-0.5 rounded-full">{t.year}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{t.label}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">The Team</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">This project is a BCA Final Year Project by two passionate students.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {TEAM.map(m => (
            <div key={m.name} className="card p-6 flex gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                style={{ background: m.color }}>
                {m.initials}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{m.name}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">{m.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Supervisor */}
        <div className="card p-6 flex gap-4 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
            style={{ background: SUPERVISOR.color }}>
            {SUPERVISOR.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{SUPERVISOR.name}</h3>
              <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">SUPERVISOR</span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-1">{SUPERVISOR.role}</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={13} />
              <span>{SUPERVISOR.institution}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Institution */}
      <section className="mb-16 card p-6 flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={22} className="text-indigo-700 dark:text-indigo-300" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Mechi Multiple Campus</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            An affiliated campus under <strong className="text-slate-700 dark:text-slate-200">Tribhuvan University</strong>, Nepal.
            This project was submitted as a BCA (Bachelor of Computer Application) Final Year Project.
          </p>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="card p-8 text-center bg-gradient-to-br from-indigo-700 to-indigo-900 border-indigo-700 text-white">
        <h2 className="text-xl font-black mb-2">Get Involved</h2>
        <p className="text-indigo-200 text-sm mb-6 max-w-md mx-auto">
          Whether you want to contribute resources, report issues, or just say hi — we&apos;d love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contribute" id="about-contribute-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Contribute Resources <ArrowRight size={15} />
          </Link>
          <a href="mailto:support@vidyasetu.edu.np" id="about-email-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-indigo-300 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors">
            <Mail size={15} /> Email Us
          </a>
        </div>
        <p className="text-indigo-300 text-xs mt-4">support@vidyasetu.edu.np</p>
      </section>
    </div>
  )
}
