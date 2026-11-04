'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MCQCard } from '@/components/features/MCQCard'
import { createClient } from '@/lib/supabase/client'
import { formatTimeSeconds } from '@/lib/utils'
import { Flag, ChevronLeft, ChevronRight, SkipForward, Lightbulb, Bookmark, AlertTriangle } from 'lucide-react'
import type { Question } from '@/types'

interface MCQEngineProps {
  quizId: string
  questions: Question[]
  subjectName: string
  subjectCategory: string
  timeLimit: number // minutes
  userId: string | null
}

type AnswerMap = Record<string, string | null>

export function MCQEngine({ quizId, questions, subjectName, subjectCategory, timeLimit, userId }: MCQEngineProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [startTime] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [score, setScore] = useState(0) // running score
  const [rank, setRank] = useState<number | null>(null)
  const rankScoresRef = useRef<number[] | null>(null)

  const currentQ = questions[current]
  const totalQ = questions.length
  const answeredCount = Object.values(answers).filter(v => v !== null && v !== undefined).length

  // Use a ref so the timer always calls the latest handleSubmit without re-creating the interval
  const submitRef = useRef<() => void>(() => {})
  const answersRef = useRef<AnswerMap>(answers)
  answersRef.current = answers

  // Fetch this quiz's historical scores ONCE on mount — rank is computed locally after that
  useEffect(() => {
    if (!userId) return
    supabase
      .from('results')
      .select('score')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        rankScoresRef.current = (data ?? []).map(r => r.score)
        const correctNow = questions.filter(q => answersRef.current[q.id] === q.correct_option).length
        const currentPct = Math.round((correctNow / totalQ) * 100)
        const position = rankScoresRef.current.filter(s => s >= currentPct).length + 1
        setRank(position)
      })
  }, [userId, quizId, supabase, totalQ, questions])

  // Timer countdown
  useEffect(() => {
    if (timeLimit === 0) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); submitRef.current(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLimit])

  // Running score + rank (local, no network calls per answer)
  const correct = questions.filter(q => answers[q.id] === q.correct_option).length
  useEffect(() => {
    setScore(correct)
    const currentPct = Math.round((correct / totalQ) * 100)
    if (userId && rankScoresRef.current) {
      const position = rankScoresRef.current.filter(s => s >= currentPct).length + 1
      setRank(position)
    }
  }, [correct, totalQ, userId])

  // Warn before leaving mid-quiz with unanswered questions
  useEffect(() => {
    if (submitting) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answeredCount > 0 || flagged.size > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [answeredCount, flagged.size, submitting])

  const handleSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: option }))
  }

  const handleSkip = () => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: null }))
    if (current < totalQ - 1) setCurrent(c => c + 1)
  }

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev)
      if (next.has(currentQ.id)) next.delete(currentQ.id)
      else next.add(currentQ.id)
      return next
    })
  }

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const correctCount = questions.filter(q => answers[q.id] === q.correct_option).length
    const skippedCount = questions.filter(q => answers[q.id] === null || answers[q.id] === undefined).length
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
          quiz_id: quizId,
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

    router.push(`/quiz/${quizId}/result?score=${scoreVal}&correct=${correctCount}&incorrect=${incorrectCount}&skipped=${skippedCount}&time=${timeTaken}&total=${totalQ}`)
  }, [submitting, answers, questions, quizId, userId, startTime, router, supabase, totalQ])

  // Keep the ref always pointing to the latest handleSubmit
  submitRef.current = handleSubmit

  // Esc closes the confirm dialog
  useEffect(() => {
    if (!showConfirm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showConfirm])

  const timeColor = timeLeft < 60 ? 'text-red-600' : timeLeft < 300 ? 'text-amber-600' : 'text-slate-700 dark:text-slate-200'

  const getNavBtnClass = (idx: number) => {
    const q = questions[idx]
    if (idx === current) return 'bg-indigo-700 text-white'
    if (flagged.has(q.id)) return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300'
    if (answers[q.id] !== undefined) return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* ── Live Session Stats (Sidebar) ─────────────────── */}
      <aside className="lg:col-span-1 order-2 lg:order-1 space-y-4">
        <div className="card p-5">
          <p className="text-caption text-slate-400 uppercase tracking-widest mb-3">Live Session Stats</p>

          <p className="text-xs text-slate-400 mb-1">Current Score</p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{score}</span>
            <span className="text-slate-400 text-sm pb-1">/ {totalQ}</span>
          </div>
          <div className="progress-bar mb-4">
            <div className="progress-fill amber" style={{ width: `${(score / totalQ) * 100}%` }} />
          </div>

          <div className="flex gap-3 text-sm">
            <div className="flex-1">
              <p className="text-caption text-slate-400 mb-0.5">Time Spent</p>
              <p className={`font-mono font-bold ${timeColor}`}>
                {timeLimit > 0 ? formatTimeSeconds(timeLimit * 60 - timeLeft) : formatTimeSeconds(Math.round((Date.now() - startTime) / 1000))}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-caption text-slate-400 mb-0.5">Rank</p>
              <p className="font-bold text-amber-600 dark:text-amber-400">{rank ? `#${rank}` : '—'}</p>
            </div>
          </div>
        </div>

        {/* Question navigator */}
        <div className="card p-4">
          <p className="text-caption text-slate-400 uppercase tracking-widest mb-3">
            Questions <span className="normal-case tracking-normal text-slate-400">{answeredCount}/{totalQ} answered</span>
          </p>
          <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto pr-0.5">
            {questions.map((_, idx) => (
              <button
                key={idx}
                id={`q-nav-${idx + 1}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to question ${idx + 1}`}
                aria-current={idx === current ? 'step' : undefined}
                className={`h-8 w-full rounded-lg text-xs font-semibold transition-colors ${getNavBtnClass(idx)}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main Question Panel ───────────────────────────── */}
      <div className="lg:col-span-3 order-1 lg:order-2 space-y-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
            Q. {String(current + 1).padStart(2, '0')} / {totalQ}
          </span>
          <div className="flex-1 progress-bar">
            <div className="progress-fill" style={{ width: `${((current + 1) / totalQ) * 100}%` }} />
          </div>
          <button
            onClick={toggleFlag}
            aria-pressed={flagged.has(currentQ.id)}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${flagged.has(currentQ.id) ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Flag size={13} /> {flagged.has(currentQ.id) ? 'Flagged' : 'Flag'}
          </button>
        </div>

        {/* Question card */}
        <div className="card p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
            {subjectCategory} • {subjectName}
          </p>
          <MCQCard
            question={currentQ}
            questionNumber={current + 1}
            totalQuestions={totalQ}
            selectedOption={answers[currentQ.id] ?? null}
            onSelect={handleSelect}
          />

          {/* Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
            <button
              id="mcq-prev-btn"
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="btn-ghost flex items-center gap-1.5 disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              id="mcq-skip-btn"
              onClick={handleSkip}
              className="btn-ghost text-slate-500 flex items-center gap-1.5 order-last sm:order-none"
            >
              <SkipForward size={15} /> Skip Question
            </button>
            {current < totalQ - 1 ? (
              <button
                id="mcq-next-btn"
                onClick={() => setCurrent(c => Math.min(totalQ - 1, c + 1))}
                className="btn-primary flex items-center gap-1.5"
              >
                Next Question <ChevronRight size={16} />
              </button>
            ) : (
              <button
                id="mcq-submit-btn"
                onClick={() => setShowConfirm(true)}
                className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>

        {/* Bottom hint cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-4 flex items-start gap-3">
            <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Did you know?</p>
              <p className="text-caption text-slate-500 mt-0.5">{currentQ.explanation ?? 'No additional hint for this question.'}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Flag for Review</p>
              <p className="text-caption text-slate-400">Revisit this question before submitting.</p>
            </div>
            <button
              id="mcq-bookmark-btn"
              onClick={toggleFlag}
              aria-pressed={flagged.has(currentQ.id)}
              aria-label={flagged.has(currentQ.id) ? 'Remove flag from this question' : 'Flag this question for review'}
              className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
            >
              <Bookmark size={18} className={flagged.has(currentQ.id) ? 'text-indigo-700 fill-indigo-700' : 'text-slate-400'} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm submit dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mcq-confirm-title"
          onClick={() => setShowConfirm(false)}
        >
          <div className="card p-8 max-w-sm w-full text-center animate-scale-in" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={36} className="text-amber-500 mx-auto mb-4" />
            <h2 id="mcq-confirm-title" className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">Submit Quiz?</h2>
            <p className="text-sm text-slate-500 mb-6">
              You have answered {answeredCount} of {totalQ} questions.{' '}
              {totalQ - answeredCount > 0 && `${totalQ - answeredCount} unanswered questions will be marked as skipped.`}
            </p>
            {submitError && (
              <p className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400" role="alert">
                {submitError}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1" id="mcq-cancel-btn">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700" id="mcq-confirm-submit-btn">
                {submitting ? 'Submitting…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}