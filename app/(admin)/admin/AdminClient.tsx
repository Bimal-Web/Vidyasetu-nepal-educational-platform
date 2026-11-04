'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, FileText, Download, BarChart3, CheckCircle2, XCircle, MoreHorizontal, Shield } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  users: any[]
  userCount: number
  pendingSubmissions: any[]
  recentDownloads: any[]
  allContent: any[]
}

type AdminTab = 'submissions' | 'users' | 'analytics'

export function AdminClient({ users, userCount, pendingSubmissions, recentDownloads, allContent }: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState<AdminTab>('submissions')
  const [submissions, setSubmissions] = useState(pendingSubmissions)
  const [actioning, setActioning] = useState<string | null>(null)
  const [userList, setUserList] = useState(users)

  const approveOrReject = async (submissionId: string, contentId: string, action: 'approved' | 'rejected') => {
    setActioning(submissionId)
    await Promise.all([
      supabase.from('submissions').update({ status: action, reviewed_at: new Date().toISOString() }).eq('id', submissionId),
      supabase.from('content').update({ status: action }).eq('id', contentId),
    ])
    setSubmissions(prev => prev.filter(s => s.id !== submissionId))
    setActioning(null)
  }

  const changeRole = async (userId: string, role: string) => {
    await supabase.from('users').update({ role }).eq('id', userId)
    setUserList(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  // Analytics aggregates
  const totalDownloads = recentDownloads.length
  const approvedContent = allContent.filter(c => c.status === 'approved').length
  const pendingContent  = allContent.filter(c => c.status === 'pending').length

  // Downloads per day (last 7 days) for bar chart
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dlByDay = recentDownloads.reduce((acc: Record<string, number>, dl) => {
    const d = new Date(dl.downloaded_at).toLocaleDateString('en-US', { weekday: 'short' })
    acc[d] = (acc[d] ?? 0) + 1; return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-700 flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Admin Panel</h1>
          <p className="text-sm text-slate-400">Manage users, content, and platform health</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users',      value: userCount,       icon: Users,        color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900' },
          { label: 'Approved Content', value: approvedContent, icon: FileText,      color: 'text-emerald-600 bg-green-50 dark:bg-green-900' },
          { label: 'Pending Review',   value: pendingContent,  icon: MoreHorizontal,color: 'text-amber-600 bg-amber-50 dark:bg-amber-900' },
          { label: 'Total Downloads',  value: totalDownloads,  icon: Download,      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color.split(' ').slice(1).join(' ')}`}>
              <s.icon size={17} className={s.color.split(' ')[0]} />
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{s.value}</p>
            <p className="text-caption text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-6">
        {(['submissions', 'users', 'analytics'] as AdminTab[]).map(t => (
          <button key={t} id={`admin-tab-${t}`} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-indigo-700 text-indigo-700 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {t === 'submissions' ? `Pending Submissions (${submissions.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions tab */}
      {tab === 'submissions' && (
        <div className="card overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No pending submissions to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>{['Resource', 'Type', 'Contributor', 'Subject', 'Actions'].map(h => <th key={h} className="table-header text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="table-cell font-medium text-slate-800 dark:text-slate-100 max-w-48 truncate">
                        {sub.content?.title ?? '—'}
                      </td>
                      <td className="table-cell">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full capitalize whitespace-nowrap">
                          {sub.content?.type?.replace('_', ' ') ?? '—'}
                        </span>
                      </td>
                      <td className="table-cell text-slate-600 dark:text-slate-300 whitespace-nowrap">{sub.users?.full_name ?? sub.users?.email ?? '—'}</td>
                      <td className="table-cell text-slate-500 whitespace-nowrap">{sub.content?.subjects?.name ?? '—'}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button id={`admin-approve-${sub.id}`}
                            onClick={() => approveOrReject(sub.id, sub.content_id, 'approved')}
                            disabled={actioning === sub.id}
                            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:bg-green-50 dark:hover:bg-green-950 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button id={`admin-reject-${sub.id}`}
                            onClick={() => approveOrReject(sub.id, sub.content_id, 'rejected')}
                            disabled={actioning === sub.id}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>{['Name', 'Email', 'Role', 'Joined', 'Change Role'].map(h => <th key={h} className="table-header text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="table-cell font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">{u.full_name || '—'}</td>
                    <td className="table-cell text-slate-500 text-sm whitespace-nowrap">{u.email}</td>
                    <td className="table-cell">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        u.role === 'contributor' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>{u.role}</span>
                    </td>
                    <td className="table-cell text-slate-400 text-sm whitespace-nowrap">{formatDate(u.created_at)}</td>
                    <td className="table-cell">
                      <select
                        id={`admin-role-${u.id}`}
                        defaultValue={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        className="input text-sm py-1 px-2.5 w-32"
                      >
                        <option value="student">Student</option>
                        <option value="contributor">Contributor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics tab */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Downloads chart */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 size={17} className="text-indigo-600" /> Downloads This Week
            </h2>
            <div className="flex items-end gap-2 h-36">
              {dayLabels.map(d => {
                const val = dlByDay[d] ?? 0
                const max = Math.max(...dayLabels.map(day => dlByDay[day] ?? 0), 1)
                return (
                  <div key={d} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-caption text-slate-400">{val}</span>
                    <div className="w-full rounded-sm" style={{ height: `${(val / max) * 100}%`, background: d === 'Sun' ? '#f59e0b' : '#3730a3', opacity: 0.8 }} />
                    <span className="text-caption text-slate-400">{d}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content breakdown */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Content Breakdown</h2>
            {[
              { label: 'Notes',       count: allContent.filter(c => c.type === 'note').length,       color: '#3730a3' },
              { label: 'Past Papers', count: allContent.filter(c => c.type === 'past_paper').length, color: '#059669' },
              { label: 'MCQ Sets',    count: allContent.filter(c => c.type === 'mcq_set').length,    color: '#f59e0b' },
            ].map(row => {
              const total = allContent.length || 1
              return (
                <div key={row.label} className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                    <span className="font-semibold" style={{ color: row.color }}>{row.count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(row.count / total) * 100}%`, background: row.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
