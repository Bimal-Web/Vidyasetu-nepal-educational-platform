'use client'

import { useEffect, useState, useRef } from 'react'

interface StatCounterProps {
  end: number
  suffix?: string
  label: string
  description: string
  duration?: number
}

function Counter({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress)
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
  }, [end, duration])

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(0)}k` : String(count)
  return <span ref={ref}>{count >= 1000 ? `${formatted}${suffix}` : `${count}${suffix}`}</span>
}

export function StatCard({ end, suffix, label, description }: StatCounterProps) {
  return (
    <div className="card p-6">
      <p className="text-caption text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="stat-number">
        <Counter end={end} suffix={suffix} />
      </p>
      <p className="text-caption text-slate-500 dark:text-slate-400 mt-2">{description}</p>
    </div>
  )
}
