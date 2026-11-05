import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return `${SHORT_MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
  } catch {
    return dateString
  }
}

export function formatTimeSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getScoreGrade(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400' }
  if (score >= 60) return { label: 'Good', color: 'text-indigo-600 dark:text-indigo-400' }
  if (score >= 40) return { label: 'Average', color: 'text-amber-600 dark:text-amber-400' }
  return { label: 'Needs Work', color: 'text-red-600 dark:text-red-400' }
}

export const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  indigo:  { bg: 'bg-indigo-700',  text: 'text-white' },
  amber:   { bg: 'bg-amber-500',   text: 'text-white' },
  green:   { bg: 'bg-emerald-600', text: 'text-white' },
  orange:  { bg: 'bg-orange-500',  text: 'text-white' },
  blue:    { bg: 'bg-blue-500',    text: 'text-white' },
  red:     { bg: 'bg-red-500',     text: 'text-white' },
  purple:  { bg: 'bg-purple-600',  text: 'text-white' },
  teal:    { bg: 'bg-teal-600',    text: 'text-white' },
}

// Shared avatar palette — matches the brand indigo/amber/emerald tokens
export const AVATAR_COLORS = ['#6366f1', '#f59e0b', '#059669', '#8b5cf6', '#ec4899'] as const
