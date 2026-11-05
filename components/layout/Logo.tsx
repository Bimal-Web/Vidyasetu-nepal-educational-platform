'use client'

import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'default' | 'white' | 'dark'
  href?: string | null
  showText?: boolean
  badge?: string
  id?: string
}

export function LogoIcon({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'dark'
  className?: string 
}) {
  const heights = { sm: 28, md: 36, lg: 44, xl: 52 }
  const h = heights[size] || 36
  const scale = h / 48
  const isWhite = variant === 'white'

  return (
    <svg
      width={Math.round(44 * scale)}
      height={h}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`transition-opacity group-hover:opacity-90 flex-shrink-0 ${className}`}
    >
      {/* Open book / bridge dome — left half */}
      <path
        d="M4 34 Q4 14 22 12 L22 38 Q14 38 4 34Z"
        className={isWhite ? 'fill-[#818cf8]' : 'fill-indigo-600 dark:fill-indigo-400'}
      />
      {/* Open book / bridge dome — right half (amber accent) */}
      <path
        d="M22 12 Q40 14 40 34 L22 38Z"
        fill="#f59e0b"
        opacity={isWhite ? '0.95' : '0.88'}
      />
      {/* Left arc (book cover) */}
      <path
        d="M3 34 Q5 11 22 10"
        className={isWhite ? 'stroke-[#c7d2fe]' : 'stroke-indigo-700 dark:stroke-indigo-300'}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right arc (book cover) */}
      <path
        d="M22 10 Q39 11 41 34"
        className={isWhite ? 'stroke-[#c7d2fe]' : 'stroke-indigo-700 dark:stroke-indigo-300'}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Base line */}
      <line
        x1="3" y1="34" x2="41" y2="34"
        className={isWhite ? 'stroke-[#c7d2fe]' : 'stroke-indigo-700 dark:stroke-indigo-300'}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Spine */}
      <line
        x1="22" y1="10" x2="22" y2="38"
        className={isWhite ? 'stroke-[#e0e7ff]' : 'stroke-indigo-900 dark:stroke-indigo-200'}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Grad cap board */}
      <path
        d="M24 14 L33 10 L42 14 L33 18Z"
        className={isWhite ? 'fill-[#c7d2fe]' : 'fill-indigo-700 dark:fill-indigo-300'}
      />
      {/* Cap head */}
      <path
        d="M28.5 15.5 L28.5 22 Q33 24 37.5 22 L37.5 15.5"
        className={isWhite ? 'fill-[#818cf8]' : 'fill-indigo-700 dark:fill-indigo-400'}
      />
      {/* Tassel cord */}
      <line x1="42" y1="14" x2="42" y2="21" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tassel bob */}
      <circle cx="42" cy="22.5" r="1.8" fill="#fbbf24" />
    </svg>
  )
}

export function Logo({
  size = 'md',
  className = '',
  variant = 'default',
  href = '/',
  showText = true,
  badge,
  id,
}: LogoProps) {
  const heights = { sm: 28, md: 36, lg: 44, xl: 52 }
  const h = heights[size] || 36
  const scale = h / 48
  const isWhite = variant === 'white'

  const content = (
    <>
      <LogoIcon size={size} variant={variant} />

      {showText && (
        <span
          style={{ fontSize: Math.round(18 * scale), lineHeight: 1 }}
          className={`font-extrabold tracking-tight transition-colors ${
            isWhite ? 'text-white' : 'text-indigo-900 dark:text-white'
          }`}
        >
          VidyaSetu
        </span>
      )}

      {badge && (
        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/10 ml-1.5">
          {badge}
        </span>
      )}
    </>
  )

  if (href === null) {
    return (
      <div id={id} className={`inline-flex items-center gap-2.5 group ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      id={id}
      className={`inline-flex items-center gap-2.5 group logo-hover ${className}`}
    >
      {content}
    </Link>
  )
}
