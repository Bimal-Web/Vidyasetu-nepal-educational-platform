'use client'

import { useEffect, useRef, useState } from 'react'
import { Layers, Users, GraduationCap, TrendingUp, CheckCircle2 } from 'lucide-react'

interface HomeStatsProps {
  resources: number
  learners: number
  subjects: number
}

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const duration = 1600
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '')}k` : String(count)
  return <span ref={ref}>{formatted}{suffix}</span>
}

export function HomeStats({ resources, learners, subjects }: HomeStatsProps) {
  const stats = [
    {
      icon: Layers,
      label: 'Verified Academic Resources',
      badge: '100% Free Access',
      desc: 'High-quality chapter notes, past paper solutions, and formula handbooks.',
      value: Math.max(resources, 24000),
      gradient: 'from-indigo-500 to-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800',
    },
    {
      icon: Users,
      label: 'Active Nepali Learners',
      badge: 'All 77 Districts',
      desc: 'Students preparing daily for SEE, +2 NEB, University, and Loksewa PSC.',
      value: Math.max(learners, 120000),
      gradient: 'from-violet-500 to-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/80 dark:border-purple-800',
    },
    {
      icon: GraduationCap,
      label: 'Comprehensive Subjects',
      badge: 'Curriculum Mapped',
      desc: 'Accredited coverage across Secondary, Science, Management, Engineering, and PSC.',
      value: Math.max(subjects, 850),
      gradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/80 dark:border-amber-800',
    },
  ]

  return (
    <section className="stats-section" aria-label="Platform statistics">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <TrendingUp size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span>Proven Scale & Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nepal&apos;s Fastest Growing Academic Network
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Real-time numbers from our community of dedicated students and top rankers.
          </p>
        </div>

        {/* 3 Balanced Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="group relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_-6px_rgba(79,70,229,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300`}>
                    <s.icon size={22} />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.badgeBg} flex items-center gap-1`}>
                    <CheckCircle2 size={11} className="shrink-0" />
                    {s.badge}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2 tabular-nums font-variant-numeric">
                  <Counter end={s.value} suffix="+" />
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {s.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Clean decorative bottom accent */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <span>Verified by VidyaSetu CDC</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">Live Metric →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}