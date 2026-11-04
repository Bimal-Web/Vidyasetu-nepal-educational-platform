import { createClient } from '@/lib/supabase/server'
import { Trophy, Star, Flame, Brain, TrendingUp, ArrowRight, Sparkles, Award, Crown, Zap, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { AVATAR_COLORS } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Leaderboard | VidyaSetu',
  description: 'See Nepal\'s top-performing students on VidyaSetu. Compete, learn, and reach the top!',
}

const DEMO_LEADERBOARD = [
  { id: '1', name: 'Riya Adhikari', email: 'student@vidyasetu.com', avgScore: 96, quizzesTaken: 24, bestScore: 100, avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: '2', name: 'Aarav Shrestha', email: 'aarav@vidyasetu.com', avgScore: 93, quizzesTaken: 19, bestScore: 98, avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: '3', name: 'Pratiksha Thapa', email: 'pratiksha@vidyasetu.com', avgScore: 89, quizzesTaken: 15, bestScore: 96, avatar: 'https://i.pravatar.cc/150?img=32' },
  { id: '4', name: 'Bibek Gurung', email: 'bibek@vidyasetu.com', avgScore: 87, quizzesTaken: 14, bestScore: 94, avatar: 'https://i.pravatar.cc/150?img=56' },
  { id: '5', name: 'Anisha KC', email: 'anisha@vidyasetu.com', avgScore: 85, quizzesTaken: 12, bestScore: 92, avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: '6', name: 'Nirajan Pokharel', email: 'nirajan@vidyasetu.com', avgScore: 82, quizzesTaken: 11, bestScore: 90, avatar: 'https://i.pravatar.cc/150?img=59' },
  { id: '7', name: 'Suman Gautam', email: 'suman@vidyasetu.com', avgScore: 80, quizzesTaken: 9, bestScore: 88, avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: '8', name: 'Kripa Sharma', email: 'kripa@vidyasetu.com', avgScore: 78, quizzesTaken: 8, bestScore: 85, avatar: 'https://i.pravatar.cc/150?img=49' },
]

async function getLeaderboard() {
  const supabase = await createClient()

  // Top scorers by average score (users with at least 1 quiz result)
  const { data: topScorers } = await supabase
    .from('results')
    .select('user_id, score, users(full_name, avatar_url, email)')
    .order('score', { ascending: false })
    .limit(50)

  // Aggregate per user
  const userMap: Record<string, { name: string; email: string; scores: number[]; avatar?: string }> = {}
  ;(topScorers ?? []).forEach((r: any) => {
    const u = r.users as any
    if (!userMap[r.user_id]) {
      userMap[r.user_id] = {
        name: u?.full_name || u?.email?.split('@')[0] || 'Anonymous',
        email: u?.email || '',
        avatar: u?.avatar_url,
        scores: [],
      }
    }
    userMap[r.user_id].scores.push(r.score)
  })

  let leaderboard = Object.entries(userMap)
    .map(([id, d]) => ({
      id,
      name: d.name,
      email: d.email,
      avatar: d.avatar,
      avgScore: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
      quizzesTaken: d.scores.length,
      bestScore: Math.max(...d.scores),
    }))
    .sort((a, b) => b.avgScore - a.avgScore || b.quizzesTaken - a.quizzesTaken)
    .slice(0, 20)

  if (leaderboard.length === 0) {
    leaderboard = DEMO_LEADERBOARD
  }

  // Platform stats
  const [{ count: totalUsers }, { count: totalResults }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('results').select('*', { count: 'exact', head: true }),
  ])

  // Current user (to highlight their row)
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id ?? null

  return { leaderboard, totalUsers: totalUsers ?? 0, totalResults: totalResults ?? 0, currentUserId }
}

export default async function LeaderboardPage() {
  const { leaderboard, totalUsers, totalResults, currentUserId } = await getLeaderboard()

  const top3 = leaderboard.slice(0, 3)
  const myEntryIndex = leaderboard.findIndex(e => e.id === currentUserId)
  const myEntry = myEntryIndex !== -1 ? leaderboard[myEntryIndex] : null

  const renderAvatar = (entry: { avatar?: string; name: string }, cls: string, color: string) =>
    entry.avatar ? (
      <img src={entry.avatar} alt={entry.name} className={`${cls} object-cover`} />
    ) : (
      <div className={`${cls} flex items-center justify-center text-white font-bold`} style={{ background: color }}>
        {entry.name.slice(0, 2).toUpperCase()}
      </div>
    )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-amber-500/30 border border-amber-300/40 dark:border-amber-700/50 mb-3.5 shadow-xs">
          <Trophy size={28} className="text-amber-500" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Community Leaderboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
          Nepal&apos;s top-performing students on VidyaSetu quizzes and practice sets.
        </p>

        {/* Platform Stat Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <Star size={14} className="text-amber-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{totalUsers.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Enrolled Learners</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <Brain size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{totalResults.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Quizzes Solved</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Daily Updates</span>
          </div>
        </div>
      </div>

      {/* ── Personal Standing Banner (If user is in list) ──── */}
      {myEntry && (
        <div className="card p-4 mb-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              #{myEntryIndex + 1}
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Your Standing</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{myEntry.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-[11px] text-slate-400">Average Score</p>
              <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{myEntry.avgScore}%</p>
            </div>
            <Link href="/browse?type=quiz" className="btn-primary text-xs px-3 py-1.5 rounded-xl">
              Climb Rank
            </Link>
          </div>
        </div>
      )}

      {/* ── Gamified 3D Podium (Top 3) ───────────────────────── */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-10 items-end pt-4">
          
          {/* 2nd Place (Silver) */}
          {top3[1] ? (
            <div className="card p-3 sm:p-5 text-center border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/70 dark:to-slate-900/70 rounded-2xl shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-2 text-sm shadow-2xs font-extrabold text-slate-700 dark:text-slate-200">
                🥈
              </div>
              {renderAvatar(top3[1], 'w-11 h-11 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 text-sm ring-2 ring-slate-300 dark:ring-slate-600 shadow-xs', '#64748b')}
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate px-1">{top3[1].name}</p>
              <p className="text-base sm:text-xl font-black text-slate-600 dark:text-slate-300 mt-1">{top3[1].avgScore}%</p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {top3[1].quizzesTaken} quizzes
              </span>
            </div>
          ) : <div />}

          {/* 1st Place (Gold, Crown, Tallest) */}
          <div className="card p-4 sm:p-6 text-center border-amber-300 dark:border-amber-500/60 bg-gradient-to-b from-amber-50/90 via-amber-50/40 to-white dark:from-amber-950/40 dark:via-slate-900/80 dark:to-slate-900/80 rounded-2xl shadow-lg relative -mt-6 sm:-mt-8 ring-2 ring-amber-400/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                <Crown size={12} className="fill-white" /> #1 CHAMPION
              </span>
            </div>
            
            <div className="mt-2 mb-2">
              {renderAvatar(top3[0], 'w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto text-base sm:text-lg ring-4 ring-amber-400/50 shadow-md', '#b45309')}
            </div>
            <p className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate px-1">{top3[0].name}</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{top3[0].avgScore}%</p>
            <span className="inline-block mt-1 text-[10px] sm:text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              {top3[0].quizzesTaken} quizzes taken
            </span>
          </div>

          {/* 3rd Place (Bronze) */}
          {top3[2] ? (
            <div className="card p-3 sm:p-5 text-center border-amber-200 dark:border-amber-900/60 bg-gradient-to-b from-orange-50/50 to-white dark:from-slate-800/70 dark:to-slate-900/70 rounded-2xl shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mx-auto mb-2 text-sm shadow-2xs font-extrabold text-orange-700 dark:text-orange-300">
                🥉
              </div>
              {renderAvatar(top3[2], 'w-11 h-11 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 text-sm ring-2 ring-orange-300 dark:ring-orange-800 shadow-xs', '#d97706')}
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate px-1">{top3[2].name}</p>
              <p className="text-base sm:text-xl font-black text-orange-600 dark:text-orange-400 mt-1">{top3[2].avgScore}%</p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {top3[2].quizzesTaken} quizzes
              </span>
            </div>
          ) : <div />}
        </div>
      )}

      {/* ── Full Rankings List ──────────────────────────────── */}
      <div className="card overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp size={18} className="text-indigo-600" /> Full Leaderboard Rankings
          </h2>
          <span className="text-xs text-slate-400 font-medium">Ranked by Average Accuracy</span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Brain size={40} className="mx-auto mb-3 opacity-25" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No quiz records yet!</p>
            <p className="text-xs sm:text-sm mt-1">Complete your first quiz to earn a spot on the leaderboard.</p>
            <Link href="/browse?type=quiz" className="btn-primary mt-5 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold" id="leaderboard-cta">
              Take a Quiz <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {leaderboard.map((entry, idx) => {
              const isTop3 = idx < 3
              const isMe = entry.id === currentUserId
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                    isMe ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-l-indigo-600 font-medium' : ''
                  }`}
                >
                  {/* Left: Rank + Avatar + Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 text-center flex-shrink-0">
                      {isTop3 ? (
                        <span className="text-lg">{['🥇','🥈','🥉'][idx]}</span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                      )}
                    </div>

                    {renderAvatar(entry, 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 shadow-2xs', AVATAR_COLORS[idx % AVATAR_COLORS.length])}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                          {entry.name}
                        </p>
                        {isMe && (
                          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/80 px-1.5 py-0.2 rounded-full">
                            You
                          </span>
                        )}
                        {idx < 3 && (
                          <Flame size={13} className="text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {entry.quizzesTaken} quizzes completed
                      </p>
                    </div>
                  </div>

                  {/* Right: Best & Avg Score Badges */}
                  <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Best</p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{entry.bestScore}%</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg</p>
                      <span className={`inline-block px-2 sm:px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black ${
                        entry.avgScore >= 85
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                          : entry.avgScore >= 70
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                      }`}>
                        {entry.avgScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Gamified Action Banner ──────────────────────────── */}
      <div className="mt-8 card p-6 text-center bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 border-indigo-600 text-white rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
            <Zap size={14} className="text-amber-300" /> Daily Quiz Challenge
          </div>
          <h2 className="font-extrabold text-xl sm:text-2xl mb-1.5 tracking-tight">Ready to claim the #1 spot?</h2>
          <p className="text-indigo-200 text-xs sm:text-sm mb-5 max-w-md mx-auto">
            Solve chapter-wise MCQ practice sets and timed quizzes to increase your ranking on the board.
          </p>
          <Link href="/browse?type=quiz" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-md hover:scale-105" id="leaderboard-start-quiz">
            Start A Quiz Now <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
