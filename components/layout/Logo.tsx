'use client'

import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const heights = { sm: 28, md: 36, lg: 48 }
  const h = heights[size]
  const scale = h / 48

  return (
    <Link href="/" className={`flex items-center gap-2 group logo-hover ${className}`}>
      {/* Book + cap icon — fully transparent, adaptive colours */}
      <svg
        width={Math.round(44 * scale)}
        height={h}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-opacity group-hover:opacity-85 flex-shrink-0"
      >
        {/* Open book — left half */}
        <path
          d="M4 34 Q4 14 22 12 L22 38 Q14 38 4 34Z"
          className="fill-indigo-600 dark:fill-indigo-400"
        />
        {/* Open book — right half (amber accent) */}
        <path
          d="M22 12 Q40 14 40 34 L22 38Z"
          fill="#f59e0b"
          opacity="0.85"
        />
        {/* Left arc (book cover) */}
        <path
          d="M3 34 Q5 11 22 10"
          className="stroke-indigo-700 dark:stroke-indigo-300"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right arc (book cover) */}
        <path
          d="M22 10 Q39 11 41 34"
          className="stroke-indigo-700 dark:stroke-indigo-300"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Base line */}
        <line
          x1="3" y1="34" x2="41" y2="34"
          className="stroke-indigo-700 dark:stroke-indigo-300"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Spine */}
        <line
          x1="22" y1="10" x2="22" y2="38"
          className="stroke-indigo-900 dark:stroke-indigo-200"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Grad cap board */}
        <path
          d="M24 14 L33 10 L42 14 L33 18Z"
          className="fill-indigo-700 dark:fill-indigo-300"
        />
        {/* Cap head */}
        <path
          d="M28.5 15.5 L28.5 22 Q33 24 37.5 22 L37.5 15.5"
          className="fill-indigo-700 dark:fill-indigo-400"
        />
        {/* Tassel cord */}
        <line x1="42" y1="14" x2="42" y2="21" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        {/* Tassel bob */}
        <circle cx="42" cy="22.5" r="1.8" fill="#f59e0b" />
      </svg>

      {/* Wordmark — dark navy on light bg, white on dark bg */}
      <span
        style={{ fontSize: Math.round(16 * scale), lineHeight: 1 }}
        className="font-bold tracking-tight text-indigo-900 dark:text-white transition-colors"
      >
        VidyaSetu
      </span>
    </Link>
  )
}
