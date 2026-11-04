'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, MessageSquare, Inbox, CheckCircle2, XCircle, MailOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  submissions: any[]
}

const REVIEW_MESSAGES: Record<string, { icon: any; title: string; cls: string }> = {
  approved: { icon: CheckCircle2, title: 'Your resource was approved', cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40' },
  rejected: { icon: XCircle, title: 'Your resource needs changes', cls: 'text-red-600 bg-red-50 dark:bg-red-900/40' },
}

export function MessagesPageClient({ submissions }: Props) {
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all')

  const list = submissions.filter(s => filter === 'all' || s.status === filter)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/contribute" className="hover:text-indigo-600 flex items-center gap-1">
          <ChevronLeft size={15} /> Contributor Console
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-indigo-700 font-medium">Messages</span>
      </nav>

      <div className="mb-8">
        <p className="text-caption text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-semibold mb-1">Inbox</p>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Messages &amp; Feedback</h1>
        <p className="text-sm text-slate-400 mt-1">Updates and review outcomes for your submitted resources.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-indigo-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center mx-auto mb-4">
            <Inbox size={26} className="text-indigo-600" />
          </div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {submissions.length === 0 ? 'No messages yet' : 'Nothing here'}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {submissions.length === 0
              ? `When moderators review your submissions, you'll see the outcome here.`
              : 'No messages match this filter.'}
          </p>
          <Link href="/contribute" className="btn-primary px-6 py-2.5 mt-6 inline-flex">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(sub => {
            const meta = REVIEW_MESSAGES[sub.status] ?? REVIEW_MESSAGES.approved
            const content = sub.content as any
            const reviewer = sub.users as any
            return (
              <div key={sub.id} className="card p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.cls}`}>
                  <meta.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{meta.title}</p>
                    <span className="text-caption text-slate-400 whitespace-nowrap">
                      {sub.reviewed_at ? formatDate(sub.reviewed_at) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <span className="font-medium text-slate-800 dark:text-slate-100">{content?.title ?? 'Your resource'}</span>{' '}
                    was {sub.status} by the review team.
                  </p>
                  <p className="text-caption text-slate-400 mt-2 flex items-center gap-1.5">
                    <MessageSquare size={12} /> {reviewer?.full_name ?? 'VidyaSetu Moderation'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 card p-5 bg-gradient-to-br from-indigo-700 to-indigo-900 border-indigo-700 text-white">
        <div className="flex items-center gap-3">
          <MailOpen size={18} className="text-indigo-200 flex-shrink-0" />
          <p className="text-sm">
            Questions about a review decision? Email <span className="font-semibold">support@vidyasetu.edu.np</span> and our team will help.
          </p>
        </div>
      </div>
    </div>
  )
}