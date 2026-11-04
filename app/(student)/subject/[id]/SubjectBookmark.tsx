'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bookmark, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubjectBookmarkProps {
  subjectId: string
}

export function SubjectBookmark({ subjectId }: SubjectBookmarkProps) {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (cancelled) return
      if (!user) {
        setChecking(false)
        return
      }
      setUserId(user.id)
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .limit(1)
      if (cancelled) return
      setSaved(Boolean(data && (Array.isArray(data) ? data.length > 0 : data)))
      setChecking(false)
    })
    return () => { cancelled = true }
  }, [supabase, subjectId])

  const toggle = async () => {
    if (!userId) {
      router.push(`/login?returnUrl=/subject/${subjectId}`)
      return
    }
    if (busy) return
    setBusy(true)
    if (saved) {
      const { error } = await supabase.from('bookmarks').delete().eq('user_id', userId).eq('subject_id', subjectId)
      if (!error) setSaved(false)
    } else {
      const { error } = await supabase.from('bookmarks').insert({ user_id: userId, subject_id: subjectId })
      if (!error) setSaved(true)
    }
    setBusy(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={checking || busy}
      aria-label={saved ? 'Remove bookmark' : 'Bookmark subject'}
      aria-pressed={saved}
      title={saved ? 'Remove bookmark' : 'Bookmark subject'}
      className={`btn-ghost p-2.5 border rounded-xl transition-colors disabled:opacity-50 ${
        saved
          ? 'border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {checking ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Bookmark size={18} className={saved ? 'fill-current' : ''} />}
    </button>
  )
}