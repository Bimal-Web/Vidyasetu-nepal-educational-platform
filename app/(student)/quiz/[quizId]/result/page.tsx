import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle2, XCircle, MinusCircle, RotateCcw, ArrowLeft } from 'lucide-react'
import { getScoreGrade } from '@/lib/utils'

interface ResultPageProps {
  params: Promise<{ quizId: string }>
  searchParams: Promise<{ score?: string; correct?: string; incorrect?: string; skipped?: string; time?: string; total?: string }>
}

export default async function QuizResultPage({ params, searchParams }: ResultPageProps) {
  const { quizId } = await params
  const sp = await searchParams

  const score     = Number(sp.score     ?? 0)
  const correct   = Number(sp.correct   ?? 0)
  const incorrect = Number(sp.incorrect ?? 0)
  const skipped   = Number(sp.skipped   ?? 0)
  const time      = Number(sp.time      ?? 0)
  const total     = Number(sp.total     ?? correct + incorrect + skipped)

  const supabase = await createClient()
  const { data: quiz } = await supabase.from('quizzes').select('*, subjects(name)').eq('id', quizId).single()

  const grade = getScoreGrade(score)
  const mins = Math.floor(time / 60)
  const secs = time % 60

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Score card */}
      <div className="card p-8 text-center mb-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${score >= 60 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="40" cy="40" r="30" fill="none"
                stroke={score >= 60 ? '#059669' : score >= 40 ? '#d97706' : '#dc2626'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 30 * (score / 100)} ${2 * Math.PI * 30}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="relative font-black text-xl text-slate-800 dark:text-slate-100">{score}%</span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">{grade.label}!</h1>
        {quiz && <p className="text-slate-500 text-sm">{(quiz.subjects as any)?.name} — {quiz.title}</p>}
        <p className="text-slate-400 text-sm mt-1">Time taken: {mins}m {secs}s</p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <CheckCircle2 size={22} className="text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-black text-emerald-600">{correct}</p>
            <p className="text-caption text-slate-500">Correct</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <XCircle size={22} className="text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-black text-red-500">{incorrect}</p>
            <p className="text-caption text-slate-500">Incorrect</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            <MinusCircle size={22} className="text-slate-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-slate-600 dark:text-slate-300">{skipped}</p>
            <p className="text-caption text-slate-500">Skipped</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link href={`/quiz/${quizId}`} className="btn-primary px-6 py-2.5 flex items-center gap-2 justify-center" id="result-retake-btn">
            <RotateCcw size={16} /> Retake Quiz
          </Link>
          <Link href="/dashboard" className="btn-secondary px-6 py-2.5 flex items-center gap-2 justify-center" id="result-dashboard-btn">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-lg">Score Breakdown</h2>
        <div className="space-y-4">
          {[
            { label: 'Correct', value: correct, total, color: '#059669' },
            { label: 'Incorrect', value: incorrect, total, color: '#dc2626' },
            { label: 'Skipped', value: skipped, total, color: '#94a3b8' },
          ].map(row => (
            <div key={row.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                <span className="font-semibold" style={{ color: row.color }}>
                  {row.value} / {row.total}{row.total > 0 ? ` (${Math.round((row.value / row.total) * 100)}%)` : ''}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${row.total > 0 ? (row.value / row.total) * 100 : 0}%`, background: row.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-4 p-5 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
          {score >= 80 ? '🎉 Outstanding performance!' : score >= 60 ? '👍 Good job! Keep practicing.' : '📚 Don\'t worry, practice makes perfect.'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {score < 80 ? 'Review the questions you got wrong and retry for a better score.' : 'You\'re ready for the next level! Try a harder quiz.'}
        </p>
      </div>
    </div>
  )
}
