import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BookmarkIcon, Download, Trophy, Flame, FileText, Brain,
  ArrowRight, TrendingUp, Target, Clock, Star
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | VidyaSetu',
  description: 'Track your learning progress, quiz history, and bookmarks.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/dashboard')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const {
    data: bookmarks,
  } = await supabase.from('bookmarks').select('*, content(title, type, subjects(name)), subjects(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6)
  const {
    data: results,
  } = await supabase.from('results').select('*, quizzes(title, subjects(name))').eq('user_id', user.id).order('attempted_at', { ascending: false }).limit(8)
  const {
    data: downloadHistory,
  } = await supabase.from('downloads_log').select('*, content(title, subjects(name))').eq('user_id', user.id).order('downloaded_at', { ascending: false }).limit(5)
  const {
    count: totalDownloads,
  } = await supabase.from('downloads_log').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  const {
    data: recentSubjects,
  } = await supabase.from('subjects').select('*, faculties_or_streams(programs(name))').order('name').limit(6)

  // Real "continue learning" subjects: subjects the user recently downloaded or quizzed
  const { data: dlSubjects } = await supabase
    .from('downloads_log')
    .select('content(subjects(id, name, icon_key, color_key))')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })
    .limit(30)
  const { data: quizSubjects } = await supabase
    .from('results')
    .select('quizzes(subjects(id, name, icon_key, color_key))')
    .eq('user_id', user.id)
    .order('attempted_at', { ascending: false })
    .limit(30)

  const recentMap = new Map<string, any>()
  ;(dlSubjects ?? []).forEach(dl => {
    const s = (dl.content as any)?.subjects
    if (s && !recentMap.has(s.id)) recentMap.set(s.id, s)
  })
  ;(quizSubjects ?? []).forEach(r => {
    const s = (r.quizzes as any)?.subjects
    if (s && !recentMap.has(s.id)) recentMap.set(s.id, s)
  })
  const continueSubjects = Array.from(recentMap.values()).slice(0, 5)

  // Real activity data for streak / heatmap / study time
  const { data: allResults } = await supabase
    .from('results')
    .select('attempted_at, time_taken_seconds, score')
    .eq('user_id', user.id)
  const { data: allDownloads } = await supabase
    .from('downloads_log')
    .select('downloaded_at')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })

  // Build a set of activity dates (YYYY-MM-DD)
  const activityDays = new Map<string, number>()
  ;(allResults ?? []).forEach(r => {
    const d = new Date(r.attempted_at).toISOString().slice(0, 10)
    activityDays.set(d, (activityDays.get(d) ?? 0) + 1)
  })
  ;(allDownloads ?? []).forEach(dl => {
    const d = new Date(dl.downloaded_at).toISOString().slice(0, 10)
    activityDays.set(d, (activityDays.get(d) ?? 0) + 1)
  })

  // Current streak: consecutive days ending today or yesterday
  let streak = 0
  const check = (offset: number) => {
    const d = new Date()
    d.setDate(d.getDate() - offset)
    return activityDays.has(d.toISOString().slice(0, 10))
  }
  const start = check(0) ? 0 : check(1) ? 1 : -1
  if (start >= 0) {
    streak = 1
    let offset = start + 1
    while (activityDays.has(new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10))) {
      streak++
      offset++
    }
  }

  // Heatmap: last 28 days
  const heatmap = Array.from({ length: 28 }, (_, i) => {
    const day = new Date(Date.now() - (27 - i) * 86400000).toISOString().slice(0, 10)
    const count = activityDays.get(day) ?? 0
    return {
      day,
      count,
      intensity: count === 0 ? 0 : Math.min(1, 0.3 + count * 0.25),
    }
  })

  // Study time this week: sum quiz durations + per-download estimate (2 min each)
  const now = new Date()
  const weekStart = new Date(now.getTime() - 7 * 86400000)
  const weekSeconds = (allResults ?? [])
    .filter(r => new Date(r.attempted_at) >= weekStart)
    .reduce((a, r) => a + (r.time_taken_seconds ?? 0), 0)
  const downloadEstimate = (allDownloads ?? []).filter(dl => new Date(dl.downloaded_at) >= weekStart).length * 120
  const totalStudySeconds = weekSeconds + downloadEstimate
  const studyHours = Math.floor(totalStudySeconds / 3600)
  const studyMins = Math.floor((totalStudySeconds % 3600) / 60)
  const studyTimeLabel = `${studyHours}h ${studyMins}m`

  // Weekly challenge: quizzes attempted in the last 7 days
  const weekQuizCount = (allResults ?? []).filter(r => new Date(r.attempted_at) >= weekStart).length

  // Weekly bar chart from real activity
  const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyBars = dayOrder.map(d => {
    const dayIndex = dayOrder.indexOf(d)
    let max = 0
    for (let w = 0; w < 6; w++) {
      const day = new Date(now.getTime() - (now.getDay() - dayIndex + 7 * (1 - w)) * 86400000)
      max = Math.max(max, activityDays.get(day.toISOString().slice(0, 10)) ?? 0)
    }
    return max
  })
  const weekMax = Math.max(1, ...weeklyBars)

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Student'
  const avgScore = allResults?.length ? Math.round(allResults.reduce((a, r) => a + r.score, 0) / allResults.length) : 0
  const bestScore = allResults?.length ? Math.max(...allResults.map(r => r.score)) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Hero greeting ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 mb-8 shadow-xl border border-indigo-700/40">
        {/* Subtle radial glow */}
        <div
          className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none select-none"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-400 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-indigo-900/90 flex items-center justify-center text-white font-black text-xl sm:text-2xl">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-300">Welcome back 👋</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  🔥 {streak}-day streak
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{displayName}</h1>
              <p className="text-indigo-200/80 text-xs sm:text-sm mt-0.5">
                Ready to conquer your next exam practice milestone today?
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
            <Link
              href="/browse"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              id="dashboard-browse-btn"
            >
              Browse Subjects <ArrowRight size={14} />
            </Link>
            <Link
              href="/quizzes"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              id="dashboard-quiz-btn"
            >
              <Brain size={14} /> Practice Quizzes
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Quizzes Taken',   value: allResults?.length ?? 0, icon: Brain,       color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900' },
          { label: 'Avg Score',       value: `${avgScore}%`,         icon: TrendingUp,   color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-900' },
          { label: 'Best Score',      value: `${bestScore}%`,        icon: Trophy,       color: 'text-emerald-600',bg: 'bg-green-50 dark:bg-green-900' },
          { label: 'Downloads',       value: totalDownloads ?? 0, icon: Download, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900' },
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
        {/* ── Main: Quiz History + Downloads ────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz History */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Trophy size={17} className="text-amber-500" /> Quiz History
              </h2>
              <Link href="/quizzes" className="text-sm text-indigo-600 hover:underline font-medium" id="dashboard-quiz-browse-link">
                Take a Quiz
              </Link>
            </div>
            {!results?.length ? (
              <div className="text-center py-10 text-slate-400">
                <Brain size={36} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm font-medium text-slate-500">No quizzes attempted yet.</p>
                <p className="text-caption mt-1">Start with any subject to track your performance.</p>
                <Link href="/quizzes" className="btn-primary text-sm px-5 py-2.5 mt-5 inline-flex" id="dashboard-start-quiz-btn">
                  Start Practicing
                </Link>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
                {results.map(r => {
                  const pct = r.score
                  const isGood = pct >= 60
                  return (
                    <div key={r.id} className="flex items-center gap-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition-colors">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${isGood ? 'bg-green-100 text-emerald-700 dark:bg-green-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {(r.quizzes as any)?.title ?? 'Quiz'}
                        </p>
                        <p className="text-caption text-slate-400">
                          {(r.quizzes as any)?.subjects?.name && `${(r.quizzes as any).subjects.name} · `}
                          {formatDate(r.attempted_at)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{r.correct_count}✓ {r.incorrect_count}✗</p>
                        <div className="w-20 progress-bar mt-1">
                          <div className={`progress-fill ${isGood ? 'green' : ''}`} style={{ width: `${pct}%`, background: isGood ? undefined : '#dc2626' }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Downloads */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
              <Download size={17} className="text-blue-500" /> Recent Downloads
            </h2>
            {(downloadHistory?.length ?? 0) === 0 ? (
              <div className="text-center py-8">
                <Download size={28} className="mx-auto mb-2 opacity-25 text-slate-400" />
                <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">Nothing downloaded yet.</p>
                <Link href="/browse" className="text-sm text-indigo-600 hover:underline font-medium inline-block mt-2" id="dashboard-downloads-empty-link">
                  Browse resources to get started
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {downloadHistory!.map(d => (
                  <div key={d.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {(d.content as any)?.title ?? '—'}
                      </p>
                      <p className="text-caption text-slate-400">{formatDate(d.downloaded_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity heatmap */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Flame size={17} className="text-amber-500" /> Activity — Last 4 Weeks
            </h2>
            <div className="flex gap-1" role="img" aria-label="Study activity over the last 28 days">
              {heatmap.map(day => (
                <div key={day.day} title={`${day.day}: ${day.count} activity`} aria-label={`${day.day}: ${day.count} activities`}
                  className={`h-7 flex-1 rounded-sm ${day.count > 0 ? 'bg-indigo-700' : 'bg-slate-100 dark:bg-slate-800'}`}
                  style={{ opacity: day.count > 0 ? day.intensity : undefined }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-caption text-slate-400">🔥 {streak}-day streak · Keep going!</p>
              <div className="flex items-center gap-1.5 text-caption text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800 inline-block" /> Less
                <span className="w-3 h-3 rounded-sm bg-indigo-300 dark:bg-indigo-700 inline-block opacity-50" />
                <span className="w-3 h-3 rounded-sm bg-indigo-700 inline-block" /> More
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Bookmarks */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookmarkIcon size={16} className="text-indigo-600" /> Bookmarks
              </h2>
              <div className="flex items-center gap-3">
                {(bookmarks?.length ?? 0) > 0 && (
                  <Link href="/bookmarks" className="text-caption text-indigo-600 hover:underline font-medium" id="dashboard-bookmarks-link">
                    View all
                  </Link>
                )}
                <span className="text-caption text-slate-400">{bookmarks?.length ?? 0}</span>
              </div>
            </div>
            {!bookmarks?.length ? (
              <p className="text-sm text-slate-400 text-center py-6">No bookmarks yet. Save resources as you browse!</p>
            ) : (
              <div className="space-y-3">
                {bookmarks.map(b => {
                  const target = b.subject_id
                    ? `/subject/${b.subject_id}`
                    : b.content_id
                    ? `/browse?q=${encodeURIComponent((b.content as any)?.title ?? '')}`
                    : null
                  const label = (b.content as any)?.title ?? (b.subjects as any)?.name ?? '—'
                  return (
                    <div key={b.id}>
                      {target ? (
                        <Link
                          href={target}
                          className="flex items-start gap-2.5 rounded-lg px-1 -mx-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText size={13} className="text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate leading-tight">
                              {label}
                            </p>
                            <p className="text-caption text-slate-400">{formatDate(b.created_at)}</p>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText size={13} className="text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate leading-tight">
                              {label}
                            </p>
                            <p className="text-caption text-slate-400">{formatDate(b.created_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Weekly Challenge */}
          <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-amber-600" />
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Weekly Challenge</p>
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Complete 3 Quizzes</p>
            <p className="text-caption text-slate-500 mb-3">Attempt 3 quizzes this week to earn the &ldquo;Consistent Learner&rdquo; badge.</p>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-500">This week</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.min(weekQuizCount, 3)}/3
              </span>
            </div>
            <div className="progress-bar mb-3">
              <div className="progress-fill amber" style={{ width: `${Math.min(weekQuizCount / 3, 1) * 100}%` }} />
            </div>
            {weekQuizCount >= 3 ? (
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Trophy size={14} /> Challenge complete — badge earned!
              </p>
            ) : (
              <Link href="/browse" className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1" id="dashboard-challenge-link">
                Take a quiz now <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* Quick Access Subjects */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm flex items-center gap-2">
              <Star size={15} className="text-indigo-500" /> {continueSubjects.length > 0 ? 'Continue Learning' : 'Popular Subjects'}
            </h2>
            <div className="space-y-2">
              {(continueSubjects.length > 0 ? continueSubjects : (recentSubjects ?? []).slice(0, 5)).map(s => (
                <Link key={s.id} href={`/subject/${s.id}`} id={`dashboard-subject-${s.id}`}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group transition-colors">
                  <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {s.name}
                  </span>
                  <ArrowRight size={13} className="text-slate-300 group-hover:text-indigo-400 flex-shrink-0 ml-2 transition-colors" />
                </Link>
              ))}
            </div>
            <Link href="/browse" className="flex items-center gap-1 mt-4 text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:underline" id="dashboard-view-all-subjects">
              View all subjects <ArrowRight size={13} />
            </Link>
          </div>

          {/* Quick timer info */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-slate-400" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Study Time This Week</h2>
            </div>
            <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400">{studyTimeLabel}</p>
            <p className="text-caption text-slate-400 mt-1">Based on quiz sessions and downloads</p>
            <div className="flex items-end gap-0.5 mt-3 h-16">
              {['M','T','W','T','F','S','S'].map((d, i) => {
                const val = weeklyBars[(i + 1) % 7]
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className={`w-full rounded-sm ${i === 3 ? 'bg-amber-500 dark:bg-amber-400' : 'bg-indigo-700 dark:bg-indigo-400'} opacity-80`} style={{
                      height: `${Math.max(4, Math.round((val / weekMax) * 44))}px`,
                    }} />
                    <span className="text-[10px] text-slate-400">{d}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
