import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { ChevronRight, Clock, Brain, ArrowRight, Filter, Sparkles, Award, Zap, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import { QuizSearch } from './QuizSearch'

export const metadata: Metadata = {
  title: 'Quiz Hub | VidyaSetu',
  description: 'Interactive timed quizzes and MCQ test series for SEE, NEB Grade 11/12, IOE Entrance, MBBS, and Loksewa exams.',
}

interface QuizzesPageProps {
  searchParams: Promise<{ subject?: string; q?: string }>
}

async function getData(sp: Awaited<QuizzesPageProps['searchParams']>) {
  const supabase = await createClient()

  const [{ data: subjects }, { data: quizzes }] = await Promise.all([
    supabase.from('subjects').select('id, name, icon_key, color_key').order('name').limit(100),
    supabase
      .from('quizzes')
      .select('*, subjects(name, icon_key, color_key)')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  let list = (quizzes ?? []).filter(q => q.subjects)
  if (sp.subject) list = list.filter(q => q.subject_id === sp.subject)
  if (sp.q) {
    const q = sp.q.toLowerCase()
    list = list.filter(
      quiz =>
        quiz.title.toLowerCase().includes(q) ||
        (quiz.subjects?.name ?? '').toLowerCase().includes(q)
    )
  }

  return { subjects: subjects ?? [], quizzes: list }
}

export default async function QuizzesPage({ searchParams }: QuizzesPageProps) {
  const sp = await searchParams
  const { subjects, quizzes } = await getData(sp)

  const activeSubject = subjects.find(s => s.id === sp.subject)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-700">Home</Link>
        <ChevronRight size={14} />
        <Link href="/browse" className="hover:text-indigo-700">Browse</Link>
        <ChevronRight size={14} />
        <span className="text-indigo-700 font-medium">Quizzes</span>
      </nav>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 mb-8 shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 mb-3">
            <Sparkles size={13} className="text-amber-400" /> Interactive Exam Practice Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeSubject ? `${activeSubject.name} Quizzes` : 'Master Your Subjects with Timed Quizzes'}
          </h1>
          <p className="text-sm text-indigo-200/90 mt-2 leading-relaxed">
            Test your knowledge with model exam sets, instant scoring, step-by-step explanations, and real-time performance analytics across SEE, NEB Grade 11/12, IOE, MBBS, and Loksewa.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-indigo-700/50 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-emerald-400 flex-shrink-0" />
              <span><strong>{quizzes.length}</strong> Quizzes Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-400 flex-shrink-0" />
              <span>Instant Score Review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
              <span>Verified Explanations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {activeSubject ? `${activeSubject.name} Test Sets` : 'Available Quizzes'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {sp.q ? `Found ${quizzes.length} match${quizzes.length === 1 ? '' : 'es'} for "${sp.q}"` : `Showing ${quizzes.length} practice sets`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Suspense fallback={<div className="w-40 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />}>
            <QuizSearch defaultValue={sp.q ?? ''} />
          </Suspense>
          <Link href="/browse?type=quiz" className="btn-secondary text-sm px-4 py-2 flex-shrink-0 hidden sm:flex items-center gap-1.5">
            <Brain size={15} /> Subject Directory
          </Link>
        </div>
      </div>

      {/* Subject filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        <Filter size={15} className="text-slate-400 flex-shrink-0" />
        <Link
          href="/quizzes"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            !sp.subject
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All Subjects
        </Link>
        {subjects.map(s => (
          <Link
            key={s.id}
            href={`/quizzes?subject=${s.id}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              sp.subject === s.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {s.name}
          </Link>
        ))}
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-24 card p-8 text-slate-400">
          <Brain size={44} className="mx-auto mb-3 text-indigo-400 opacity-40" />
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">No quizzes match your filter.</p>
          <p className="text-sm mt-1 text-slate-500">Try clearing your search query or selecting a different subject.</p>
          <Link href="/quizzes" className="btn-secondary text-sm mt-4 inline-flex items-center gap-2">
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const subject = quiz.subjects as any
            const difficultyLabel = quiz.question_count >= 15 ? 'Exam Set' : quiz.time_limit_minutes <= 15 ? 'Speed Drill' : 'Standard'
            const badgeColor = quiz.question_count >= 15 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'

            return (
              <div key={quiz.id} className="card p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                    <Brain size={13} /> {subject?.name ?? 'General'}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                    {difficultyLabel}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                      <Clock size={13} className="text-indigo-500" /> {quiz.time_limit_minutes} min
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                      <Brain size={13} className="text-emerald-500" /> {quiz.question_count} MCQs
                    </span>
                  </div>
                </div>

                <Link
                  href={`/quiz/${quiz.id}`}
                  className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-all"
                  id={`quiz-card-start-${quiz.id}`}
                >
                  Start Practice Quiz <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

