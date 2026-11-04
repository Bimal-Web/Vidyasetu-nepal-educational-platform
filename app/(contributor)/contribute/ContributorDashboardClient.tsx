'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UploadDropzone } from '@/components/features/UploadDropzone'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Clock, Download, Zap, MoreHorizontal, Link2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  profile: any
  totalContribs: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalDownloads: number
  submissions: any[]
  topContributors: any[]
  subjects: any[]
  userId: string
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  approved:     { label: 'APPROVED',     cls: 'status-approved' },
  under_review: { label: 'UNDER REVIEW', cls: 'status-pending'  },
  rejected:     { label: 'REJECTED',     cls: 'status-rejected' },
}

const TIERS = ['GOLD TIER', 'SILVER TIER', 'BRONZE TIER']
const TIER_COLORS: Record<string, string> = {
  'GOLD TIER':   'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  'SILVER TIER': 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  'BRONZE TIER': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
}

export function ContributorDashboardClient({ profile, totalContribs, pendingCount, approvedCount, rejectedCount, totalDownloads, submissions, topContributors, subjects, userId }: Props) {
  const supabase = createClient()

  // Upload state
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [contentType, setContentType] = useState<'note' | 'past_paper' | 'mcq_set'>('note')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)

  // Real impact score: approved content weighted + downloads, minus rejection penalty
  const impactScore = Math.min(99.9, Math.max(
    0,
    (approvedCount * 12) + (totalDownloads * 0.02) - (rejectedCount * 5) + (pendingCount * 2)
  ))

  const displayName = profile?.full_name || 'Contributor'

  const handleUpload = async () => {
    if (!title || !subjectId || !selectedFiles.length) {
      setUploadMsg('Please fill in all fields and select a file.')
      return
    }
    setUploading(true); setProgress(10); setUploadMsg(null)
    try {
      const file = selectedFiles[0]
      const ext = file.name.split('.').pop()
      const path = `${subjectId}/${contentType}/${Date.now()}.${ext}`

      // Upload to Supabase Storage
      const { error: storErr } = await supabase.storage.from('content-uploads').upload(path, file, { upsert: false })
      if (storErr) throw storErr
      setProgress(60)

      const { data: urlData } = supabase.storage.from('content-uploads').getPublicUrl(path)

      // Insert content row
      const { data: contentRow, error: dbErr } = await supabase.from('content').insert({
        subject_id: subjectId,
        uploaded_by: userId,
        title,
        type: contentType,
        file_url: urlData.publicUrl,
        file_size: file.size,
        status: 'pending',
        views: 0,
        downloads: 0,
      }).select().single()
      if (dbErr) throw dbErr
      setProgress(80)

      // Insert submission record
      await supabase.from('submissions').insert({
        contributor_id: userId,
        content_id: contentRow.id,
        status: 'under_review',
      })
      setProgress(100)
      setUploadMsg('✓ Submitted successfully! It will appear after review.')
      setTitle(''); setSubjectId(''); setSelectedFiles([]); setContentType('note')
    } catch (e: any) {
      setUploadMsg(`Error: ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-caption text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-semibold mb-1">Contributor Console</p>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Welcome back, {displayName}</h1>
          <p className="text-sm text-slate-400 mt-0.5">Your recent contributions have helped students this week.</p>
        </div>
        <button onClick={handleUpload} id="new-submission-btn"
          className="btn-primary px-5 py-2.5 gap-2 flex-shrink-0">
          + New Submission
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Contributions', value: totalContribs,     icon: TrendingUp, trend: '+12%', color: 'text-indigo-600' },
          { label: 'Pending Reviews',     value: pendingCount,       icon: Clock,      trend: '',     color: 'text-amber-600' },
          { label: 'Total Downloads',     value: totalDownloads >= 1000 ? `${(totalDownloads / 1000).toFixed(1)}k` : totalDownloads, icon: Download, trend: '+8%', color: 'text-emerald-600' },
          { label: 'Impact Score',        value: impactScore.toFixed(1), icon: Zap,    trend: '+2.3', color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-caption text-slate-400 uppercase tracking-wide">{s.label}</p>
              <s.icon size={15} className={s.color} />
            </div>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{s.value}</p>
            {s.trend && <p className="text-caption text-emerald-600 mt-1">{s.trend} this week</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Upload + Submissions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Upload */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Upload</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Title</label>
                <input id="upload-title" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. MBBS Anatomy – Thorax Notes" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Type</label>
                <select id="upload-type" value={contentType} onChange={e => setContentType(e.target.value as any)} className="input">
                  <option value="note">Note</option>
                  <option value="past_paper">Past Paper</option>
                  <option value="mcq_set">MCQ Set</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Subject</label>
                <select id="upload-subject" value={subjectId} onChange={e => setSubjectId(e.target.value)} className="input">
                  <option value="">Select subject…</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <UploadDropzone
              onFilesSelected={setSelectedFiles}
              uploading={uploading}
              progress={progress}
            />

            {uploadMsg && (
              <p className={`mt-3 text-sm font-medium ${uploadMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                {uploadMsg}
              </p>
            )}

            <button onClick={handleUpload} disabled={uploading} id="upload-submit-btn"
              className="btn-primary mt-4 px-6 py-2.5">
              {uploading ? 'Uploading…' : 'Submit for Review'}
            </button>
          </div>

          {/* Recent Submissions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Recent Submissions</h2>
              <Link href="/contribute/upload" className="text-sm text-indigo-600 hover:underline font-medium" id="view-all-submissions-btn">Upload More</Link>
            </div>

            {submissions.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No submissions yet. Upload your first resource!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {['Resource Name', 'Category', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="table-header text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => {
                      const content = sub.content as any
                      const statusInfo = STATUS_MAP[sub.status] ?? STATUS_MAP.under_review
                      return (
                        <tr key={sub.id}>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                <Link2 size={13} className="text-slate-500" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-36">
                                {content?.title ?? '—'}
                              </span>
                            </div>
                          </td>
                          <td className="table-cell text-slate-500 text-sm whitespace-nowrap">
                            {content?.subjects?.name ?? '—'}
                          </td>
                          <td className="table-cell text-slate-400 text-sm whitespace-nowrap">
                            {content?.created_at ? formatDate(content.created_at) : '—'}
                          </td>
                          <td className="table-cell whitespace-nowrap">
                            <span className={statusInfo.cls}>{statusInfo.label}</span>
                          </td>
                          <td className="table-cell">
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Top Contributors</h2>
            <div className="space-y-4">
              {topContributors.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {c.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{c.full_name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[TIERS[i]] ?? TIER_COLORS['BRONZE TIER']}`}>
                      {TIERS[i] ?? 'MEMBER'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    +{(120 - i * 35)}pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Breakdown */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Impact Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: 'Visual Clarity',   pct: 92 },
                { label: 'Content Accuracy', pct: 96 },
                { label: 'User Engagement',  pct: 74 },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">{row.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
