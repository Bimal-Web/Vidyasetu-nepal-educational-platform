'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookmarkIcon, FileText, Trash2, ArrowRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { SubjectBadge } from '@/components/features/SubjectBadge'

interface BookmarkItem {
  id: string
  content_id?: string
  subject_id?: string
  created_at: string
  content?: { title: string; type: string; file_url?: string; subjects?: { name: string } }
  subjects?: { name: string; icon_key: string; color_key: string }
}

export function BookmarksClient({ bookmarks: initial }: { bookmarks: BookmarkItem[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState(initial)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const removeBookmark = async (id: string) => {
    setRemovingId(id)
    await supabase.from('bookmarks').delete().eq('id', id)
    setBookmarks(prev => prev.filter(b => b.id !== id))
    setRemovingId(null)
    router.refresh()
  }

  const contentBookmarks = bookmarks.filter(b => b.content)
  const subjectBookmarks = bookmarks.filter(b => b.subject_id && !b.content)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-700">Home</Link>
        <ArrowRight size={12} />
        <Link href="/dashboard" className="hover:text-indigo-700">Dashboard</Link>
        <ArrowRight size={12} />
        <span className="text-indigo-700 font-medium">Bookmarks</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-section text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <BookmarkIcon size={26} className="text-indigo-600" /> My Bookmarks
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {bookmarks.length} saved item{bookmarks.length === 1 ? '' : 's'} · Quick access to everything you have bookmarked.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center mx-auto mb-4">
            <Star size={26} className="text-indigo-600" />
          </div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">No bookmarks yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-6">Save resources or subjects while browsing to find them here.</p>
          <Link href="/browse" className="btn-primary px-6 py-2.5 inline-flex">
            Browse Subjects <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subject bookmarks */}
          {subjectBookmarks.length > 0 && (
            <section>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500">
                Subjects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjectBookmarks.map(b => (
                  <div key={b.id} className="card p-5 flex items-center gap-4">
                    <SubjectBadge iconKey={b.subjects?.icon_key ?? 'global'} colorKey={b.subjects?.color_key ?? 'indigo'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <Link href={`/subject/${b.subject_id}`} className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-700 truncate block">
                        {b.subjects?.name}
                      </Link>
                      <p className="text-caption text-slate-400">Saved {formatDate(b.created_at)}</p>
                    </div>
                    <button
                      onClick={() => removeBookmark(b.id)}
                      disabled={removingId === b.id}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Content bookmarks */}
          {contentBookmarks.length > 0 && (
            <section>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500">
                Resources
              </h2>
              <div className="card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {contentBookmarks.map(b => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                      <FileText size={15} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{b.content?.title}</p>
                      <p className="text-caption text-slate-400">
                        {b.content?.subjects?.name} · {b.content?.type?.replace('_', ' ')} · Saved {formatDate(b.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBookmark(b.id)}
                      disabled={removingId === b.id}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="mt-10 card p-6 text-center bg-gradient-to-br from-indigo-700 to-indigo-900 border-indigo-700 text-white">
        <p className="font-bold text-lg mb-1">Keep learning</p>
        <p className="text-indigo-200 text-sm mb-4">Discover new resources and quizzes across all faculties.</p>
        <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
          Explore Library <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}