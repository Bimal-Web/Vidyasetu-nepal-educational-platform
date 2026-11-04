'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Loader2, TrendingUp, LogIn } from 'lucide-react'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Module-level cache so the widget (rendered in both the sidebar and the
// mobile filter) only hits the DB once per user per page load.
const cache = new Map<string, Promise<{ weekly: number[]; total: number; lastWeek: number } | 'guest'>>()

export function BrowseProgress() {
  const supabase = useMemo(() => createClient(), [])
  const [status, setStatus] = useState<'loading' | 'guest' | 'user'>('loading')
  const [weekly, setWeekly] = useState<number[]>(new Array(7).fill(0))
  const [total, setTotal] = useState(0)
  const [lastWeek, setLastWeek] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setStatus('guest')
        return
      }
      const key = user.id
      if (!cache.has(key)) {
        cache.set(key, (async () => {
          const now = new Date()
          const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
          const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString()

          const [thisWeek, prevWeek] = await Promise.all([
            supabase.from('downloads_log')
              .select('downloaded_at')
              .eq('user_id', user.id)
              .gte('downloaded_at', sevenDaysAgo),
            supabase.from('downloads_log')
              .select('downloaded_at')
              .eq('user_id', user.id)
              .gte('downloaded_at', fourteenDaysAgo)
              .lt('downloaded_at', sevenDaysAgo),
          ])

          const dayCounts = new Array(7).fill(0)
          ;(thisWeek.data ?? []).forEach(r => {
            const d = new Date(r.downloaded_at)
            dayCounts[d.getDay()]++
          })

          // Rotate so the week starts on Sunday (index 0 = today - 6)
          const rotated = new Array(7).fill(0)
          for (let i = 0; i < 7; i++) {
            rotated[i] = dayCounts[(new Date().getDay() + i + 1) % 7]
          }

          return {
            weekly: rotated,
            total: (thisWeek.data ?? []).length,
            lastWeek: (prevWeek.data ?? []).length,
          }
        })())
      }
      cache.get(key)!.then(data => {
        if (data === 'guest') { setStatus('guest'); return }
        setWeekly(data.weekly)
        setTotal(data.total)
        setLastWeek(data.lastWeek)
        setStatus('user')
      })
    })
  }, [supabase])

  const max = Math.max(...weekly, 1)
  const delta = lastWeek > 0 ? Math.round(((total - lastWeek) / lastWeek) * 100) : (total > 0 ? 100 : 0)

  if (status === 'loading') {
    return (
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
          <BarChart3 size={13} /> Your Progress
        </p>
        <div className="h-14 flex items-center justify-center">
          <Loader2 size={16} className="animate-spin text-slate-300" />
        </div>
      </div>
    )
  }

  if (status === 'guest') {
    return (
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
          <BarChart3 size={13} /> Your Progress
        </p>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Sign in to track your downloads and study activity.
        </p>
        <Link
          href="/login?returnUrl=/browse"
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-600 rounded-lg px-3 py-2 transition-colors"
        >
          <LogIn size={13} /> Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
      <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
        <BarChart3 size={13} /> Your Progress
      </p>
      <div className="flex gap-0.5 items-end h-14">
        {weekly.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
            <div
              className={`w-full rounded-sm transition-all ${i === 0 ? 'bg-amber-500 dark:bg-amber-400' : 'bg-indigo-700 dark:bg-indigo-400'}`}
              style={{
                height: `${Math.max(v > 0 ? 4 : 2, Math.round((v / max) * 40))}px`,
                opacity: v > 0 ? 0.55 + (v / max) * 0.45 : 0.15,
              }}
            />
            <span className="text-[9px] text-slate-400">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>
      <p className="text-caption text-slate-400 mt-2">
        {total === 0 ? (
          'No downloads this week yet.'
        ) : (
          <>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={12} /> {delta}%
            </span>{' '}
            {delta >= 0 ? 'more active' : 'less active'} than last week · {total} download{total === 1 ? '' : 's'}
          </>
        )}
      </p>
    </div>
  )
}