'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MCQCard } from '@/components/features/MCQCard'
import { formatTimeSeconds } from '@/lib/utils'
import { Clock, Flag, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import type { Quiz, Question } from '@/types'

interface QuizSessionProps {
  quiz: Quiz & { subjects?: { name: string; icon_key: string; color_key: string } }
  questions: Question[]
  userId: string | null
}

export function QuizSession({ quiz, questions, userId }: QuizSessionProps) {
  const router = useRouter()
  const supabase = createClient()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | null>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_minutes * 60)
  const [startTime] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totalQ = questions.length
  const currentQ = questions[current]
  const answered = Object.values(answers).filter(v => v !== null && v !== undefined).length

  const submit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const correctCount = questions.filter(q => answers[q.id] === q.correct_option).length
    const skippedCount = questions.filter(q => !answers[q.id]).length
    const incorrectCount = totalQ - correctCount - skippedCount
    const scoreVal = Math.round((correctCount / totalQ) * 100)

    if (userId) {
      try {
        const { data: authUser } = await supabase.auth.getUser()
        if (authUser?.user) {
          await supabase.from('users').upsert({
            id: authUser.user.id,
            email: authUser.user.email ?? '',
            full_name: authUser.user.user_metadata?.full_name || authUser.user.email?.split('@')[0] || 'Student',
            auth_provider: authUser.user.app_metadata?.provider || 'email',
            role: 'student',
          }, { onConflict: 'id' })
        }

        const { error } = await supabase.from('results').insert({
          user_id: userId,
          quiz_id: quiz.id,
          score: scoreVal,
          correct_count: correctCount,
          incorrect_count: incorrectCount,
          skipped_count: skippedCount,
          time_taken_seconds: timeTaken,
        })
        if (error) {
          console.error('Quiz result save error:', error)
        }
      } catch (err) {
        console.warn('Quiz result save exception:', err)
      }
    }
    router.push(`/quiz/${quiz.id}/result?score=${scoreVal}&correct=${correctCount}&incorrect=${incorrectCount}&skipped=${skippedCount}&time=${timeTaken}&total=${totalQ}`)
  }, [submitting, answers, questions, quiz.id, userId, startTime, router, supabase, totalQ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); submit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [submit])

  // Warn before leaving mid-quiz
  useEffect(() => {
    if (submitting) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answered > 0 || flagged.size > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [answered, flagged.size, submitting])

  // Esc closes the confirm dialog + focus moves to it when opened
  useEffect(() => {
    if (!showConfirm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showConfirm])

  const timerColor = timeLeft < 60 ? 'text-red-600 bg-red-50 dark:bg-red-950' : timeLeft < 300 ? 'text-amber-600 bg-amber-50 dark:bg-amber-950' : 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950'

  const getNavClass = (idx: number) => {
    const q = questions[idx]
    if (idx === current) return 'bg-indigo-700 text-white'
    if (flagged.has(q.id)) return 'bg-amber-100 dark:bg-amber-900 text-amber-700 border border-amber-300'
    if (answers[q.id]) return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700'
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-caption text-slate-400 uppercase tracking-wide">{quiz.subjects?.name}</p>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{quiz.title}</h1>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${timerColor}`}>
          <Clock size={18} />
          {formatTimeSeconds(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigator */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="card p-4 sticky top-24">
            <p className="text-caption text-slate-400 uppercase tracking-wide mb-3">
              Answered {answered}/{totalQ}
            </p>
            <div className="grid grid-cols-5 gap-1.5 mb-4 max-h-72 overflow-y-auto pr-0.5">
              {questions.map((_, idx) => (
                <button key={idx} onClick={() => setCurrent(idx)} id={`quiz-nav-${idx + 1}`}
                  aria-label={`Go to question ${idx + 1}`}
                  aria-current={idx === current ? 'step' : undefined}
                  className={`h-8 w-full rounded-lg text-xs font-semibold transition-colors ${getNavClass(idx)}`}>
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { color: 'bg-indigo-700', label: 'Current' },
                { color: 'bg-emerald-200 dark:bg-emerald-900', label: 'Answered' },
                { color: 'bg-amber-200 dark:bg-amber-900', label: 'Flagged' },
                { color: 'bg-slate-200 dark:bg-slate-700', label: 'Not visited' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-sm ${l.color}`} />
                  <span className="text-slate-500 dark:text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Question */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="card p-7">
            <MCQCard
              question={currentQ}
              questionNumber={current + 1}
              totalQuestions={totalQ}
              selectedOption={answers[currentQ.id] ?? null}
              onSelect={opt => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
            />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                className="btn-ghost flex items-center gap-1.5 disabled:opacity-40" id="quiz-prev-btn">
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => setFlagged(prev => { const n = new Set(prev); if (n.has(currentQ.id)) { n.delete(currentQ.id) } else { n.add(currentQ.id) }; return n })}
                aria-pressed={flagged.has(currentQ.id)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors order-last sm:order-none ${flagged.has(currentQ.id) ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' : 'text-slate-400 hover:text-slate-600'}`}
                id="quiz-flag-btn"
              >
                <Flag size={14} /> {flagged.has(currentQ.id) ? 'Unflag' : 'Flag'}
              </button>
              {current < totalQ - 1 ? (
                <button onClick={() => setCurrent(c => Math.min(totalQ - 1, c + 1))}
                  className="btn-primary flex items-center gap-1.5" id="quiz-next-btn">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={() => setShowConfirm(true)} className="btn-primary bg-emerald-600 hover:bg-emerald-700" id="quiz-submit-btn">
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-confirm-title"
          onClick={() => setShowConfirm(false)}
        >
          <div className="card p-8 max-w-sm w-full text-center animate-scale-in" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={36} className="text-amber-500 mx-auto mb-4" />
            <h2 id="quiz-confirm-title" className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">Submit Quiz?</h2>
            <p className="text-sm text-slate-500 mb-6">
              You have answered {answered} of {totalQ} questions.{' '}
              {totalQ - answered > 0 && `${totalQ - answered} unanswered questions will be marked as skipped.`}
            </p>
            {submitError && (
              <p className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400" role="alert">
                {submitError}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1" id="quiz-cancel-btn">Cancel</button>
              <button onClick={submit} disabled={submitting} className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700" id="quiz-confirm-submit-btn">
                {submitting ? 'Submitting…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}