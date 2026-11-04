'use client'

import Link from 'next/link'
import { SubjectBadge } from './SubjectBadge'
import type { Subject } from '@/types'
import { ArrowRight } from 'lucide-react'

interface SubjectCardProps {
  subject: Subject
  noteCount?: number
  paperCount?: number
  quizCount?: number
}

export function SubjectCard({ subject, noteCount = 0, paperCount = 0, quizCount = 0 }: SubjectCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-4 hover:scale-[1.01] transition-transform">
      <SubjectBadge iconKey={subject.icon_key} colorKey={subject.color_key} size="md" />

      <div className="flex-1">
        <h3 className="text-card font-semibold text-slate-800 dark:text-slate-100">{subject.name}</h3>
        <p className="text-caption text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{subject.description}</p>
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          <span className="font-bold text-indigo-700 dark:text-indigo-400 text-lg leading-none">{noteCount}</span>
          <p className="text-caption text-slate-400 uppercase tracking-wide">Notes</p>
        </div>
        <div>
          <span className="font-bold text-indigo-700 dark:text-indigo-400 text-lg leading-none">{paperCount}</span>
          <p className="text-caption text-slate-400 uppercase tracking-wide">Past Papers</p>
        </div>
        {quizCount > 0 && (
          <div>
            <span className="font-bold text-indigo-700 dark:text-indigo-400 text-lg leading-none">{quizCount}</span>
            <p className="text-caption text-slate-400 uppercase tracking-wide">Quizzes</p>
          </div>
        )}
      </div>

      <Link
        href={`/subject/${subject.id}`}
        className="btn-primary w-full justify-center text-sm py-2.5"
        id={`subject-card-view-${subject.id}`}
      >
        View Subject <ArrowRight size={15} />
      </Link>
    </div>
  )
}
