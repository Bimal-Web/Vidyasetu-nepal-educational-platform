'use client'

import { cn } from '@/lib/utils'
import type { Question } from '@/types'

interface MCQCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedOption: string | null
  showResult?: boolean
  onSelect: (option: string) => void
}

const OPTIONS = ['a', 'b', 'c', 'd'] as const

export function MCQCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  showResult = false,
  onSelect,
}: MCQCardProps) {
  const optionLabels: Record<string, string> = {
    a: question.option_a,
    b: question.option_b,
    c: question.option_c,
    d: question.option_d,
  }

  const getOptionClass = (opt: string) => {
    if (!showResult) {
      return selectedOption === opt ? 'mcq-option selected' : 'mcq-option'
    }
    if (opt === question.correct_option) return 'mcq-option correct'
    if (opt === selectedOption && opt !== question.correct_option) return 'mcq-option wrong'
    return 'mcq-option'
  }

  const getBadgeClass = (opt: string) => {
    if (!showResult) {
      return selectedOption === opt
        ? 'bg-indigo-700 text-white'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
    }
    if (opt === question.correct_option) return 'bg-emerald-600 text-white'
    if (opt === selectedOption && opt !== question.correct_option) return 'bg-red-600 text-white'
    return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption text-slate-400 uppercase tracking-wide">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
          {question.question_text}
        </h2>
      </div>

      <div className="space-y-3 pt-2">
        {OPTIONS.map(opt => (
          <button
            key={opt}
            id={`mcq-option-${opt}`}
            onClick={() => !showResult && onSelect(opt)}
            disabled={showResult}
            className={cn(getOptionClass(opt), 'w-full text-left cursor-pointer disabled:cursor-default')}
          >
            <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors', getBadgeClass(opt))}>
              {opt.toUpperCase()}
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
              {optionLabels[opt]}
            </span>
          </button>
        ))}
      </div>

      {showResult && question.explanation && (
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 rounded-xl">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Explanation</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
