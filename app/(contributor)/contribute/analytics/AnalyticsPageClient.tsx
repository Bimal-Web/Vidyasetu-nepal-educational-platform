'use client'

import Link from 'next/link'
import { ChevronLeft, Eye, Download, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  content: any[]
  perContent: Record<string, { downloads: number; views: number }>
  totalViews: number
  totalDownloads: number
  approvedCount: number
  pendingCount: number
}

export function AnalyticsPageClient({
  content,
  perContent,
  totalViews,
  totalDownloads,
  approvedCount,
  pendingCount,
}: Props) {
  const sorted = [...content].sort(
    (a, b) => (perContent[b.id]?.downloads ?? 0) - (perContent[a.id]?.downloads ?? 0)
  )
  const maxDownloads = Math.max(1, ...sorted.map(c => perContent[c.id]?.downloads ?? 0))
  const approvalRate = content.length ? Math.round((approvedCount / content.length) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/contribute" className="hover:text-indigo-600 flex items-center gap-1">
          <ChevronLeft size={15} /> Contributor Console
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-indigo-700 font-medium">Analytics</span>
      </nav>

      <div className="mb-8">
        <p className="text-caption text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-semibold mb-1">Your impact</p>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Contribution Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">See how students are engaging with the resources you share.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Resources', value: content.length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900' },
          { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900' },
          { label: 'Total Downloads', value: totalDownloads, icon: Download, color: 'text-emerald-600', bg: 'bg-green-50 dark:bg-green-900' },
          { label: 'Approval Rate', value: `${approvalRate}%`, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.bg}`}>
              <s.icon size={17} className={s.color} />
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{s.value}</p>
            <p className="text-caption text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Downloads by resource */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Downloads by Resource</h2>
            <span className="text-caption text-slate-400">{approvedCount} approved · {pendingCount} pending</span>
          </div>

          {content.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">No content uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {sorted.map(c => {
                const downloads = perContent[c.id]?.downloads ?? 0
                const views = perContent[c.id]?.views ?? 0
                const pct = Math.round((downloads / maxDownloads) * 100)
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{c.title}</p>
                        <span className="text-caption text-slate-400 hidden sm:inline">
                          {c.subjects?.name} · {formatDate(c.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-caption text-slate-400 flex-shrink-0">
                        <span className="flex items-center gap-1"><Eye size={12} /> {views}</span>
                        <span className="flex items-center gap-1"><Download size={12} /> {downloads}</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill green" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="card p-6 h-fit">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-6">Status Breakdown</h2>
          {[
            { label: 'Approved', value: approvedCount, icon: CheckCircle2, cls: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/40' },
            { label: 'Pending Review', value: pendingCount, icon: Clock, cls: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/40' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${row.bg}`}>
                <row.icon size={16} className={row.cls} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.label}</p>
                <div className="progress-bar mt-1.5">
                  <div className="progress-fill" style={{ width: `${content.length ? (row.value / content.length) * 100 : 0}%`, background: row.label === 'Approved' ? '#059669' : '#f59e0b' }} />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.value}</span>
            </div>
          ))}
          <p className="text-caption text-slate-400 mt-4">
            Keep uploading quality content to grow your approval rate and community impact.
          </p>
        </div>
      </div>
    </div>
  )
}