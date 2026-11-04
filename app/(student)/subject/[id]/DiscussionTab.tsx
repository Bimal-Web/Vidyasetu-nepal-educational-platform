'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, ThumbsUp, Send, Loader2, ChevronDown, ChevronUp, LogIn } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface DiscussionPost {
  id: string
  subject_id: string
  user_id: string
  content: string
  created_at: string
  users?: { full_name: string; avatar_url?: string } | null
  replies?: DiscussionReply[]
  reply_count?: number
}

interface DiscussionReply {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  users?: { full_name: string; avatar_url?: string } | null
}

interface DiscussionTabProps {
  subjectId: string
  subjectName: string
  initialPosts: DiscussionPost[]
}

const AVATAR_COLORS = ['#3730a3', '#059669', '#f59e0b', '#8b5cf6', '#ec4899']

export function DiscussionTab({ subjectId, subjectName, initialPosts }: DiscussionTabProps) {
  const supabase = useMemo(() => createClient(), [])
  const [posts, setPosts] = useState<DiscussionPost[]>(initialPosts)
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null)
  const [draft, setDraft] = useState('')
  const [posting, setPosting] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyPosting, setReplyPosting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? {
        id: user.id,
        email: user.email,
        full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0],
      } : null)
    })
  }, [supabase])

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from('discussion_posts')
      .select('*, users(full_name, avatar_url), replies:discussion_replies(count)')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false })
    if (data) {
      setPosts(data.map((p: any) => ({ ...p, reply_count: p.replies?.[0]?.count ?? 0, replies: [] })))
    }
  }, [supabase, subjectId])

  const handlePost = async () => {
    if (!user || !draft.trim()) return
    setPosting(true)
    const { data, error } = await supabase.from('discussion_posts').insert({
      subject_id: subjectId,
      user_id: user.id,
      content: draft.trim(),
    }).select().single()
    if (!error && data) {
      setDraft('')
      await loadPosts()
    }
    setPosting(false)
  }

  const toggleReplies = async (postId: string) => {
    const next = new Set(expanded)
    if (next.has(postId)) {
      next.delete(postId)
    } else {
      next.add(postId)
      const { data } = await supabase
        .from('discussion_replies')
        .select('*, users(full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (data) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: data as DiscussionReply[] } : p))
      }
    }
    setExpanded(next)
  }

  const handleReply = async (postId: string) => {
    if (!user || !(replyDrafts[postId] ?? '').trim()) return
    setReplyPosting(true)
    const { data } = await supabase.from('discussion_replies').insert({
      post_id: postId,
      user_id: user.id,
      content: replyDrafts[postId].trim(),
    }).select('*, users(full_name, avatar_url)').single()
    if (data) {
      setReplyDrafts(prev => ({ ...prev, [postId]: '' }))
      setReplyingTo(null)
      await toggleReplies(postId)
    }
    setReplyPosting(false)
  }

  const initialsOf = (name?: string | null) =>
    (name || 'Anon').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const hashColor = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997
    return AVATAR_COLORS[h % AVATAR_COLORS.length]
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card p-5 flex items-center gap-4 bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-700">
        <div className="w-10 h-10 rounded-xl bg-indigo-700 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-indigo-900 dark:text-indigo-100">{subjectName} Discussion Forum</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-0.5">
            Ask questions, share notes, and help fellow students.
          </p>
        </div>
        <span className="text-xs font-bold bg-indigo-700 text-white px-3 py-1 rounded-full whitespace-nowrap">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Post composer */}
      {user ? (
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Ask a question about {subjectName}…
          </p>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="e.g. Can anyone explain Gauss's law derivation?"
            className="input resize-none h-24 text-sm"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-caption text-slate-400">{draft.length}/1000</p>
            <button onClick={handlePost} disabled={posting || !draft.trim()} className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50">
              {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Post
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Join the discussion</p>
          <p className="text-caption text-slate-400 mb-4">Sign in to ask questions and reply to your classmates.</p>
          <Link href="/login" className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
            <LogIn size={15} /> Sign in to post
          </Link>
        </div>
      )}

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          <MessageSquare size={36} className="mx-auto mb-3 opacity-25" />
          <p className="font-medium text-slate-600 dark:text-slate-300">No discussions yet.</p>
          <p className="text-sm mt-1">Be the first to start a conversation about {subjectName}.</p>
        </div>
      ) : (
        posts.map(post => {
          const isExpanded = expanded.has(post.id)
          const replies = post.replies ?? []
          const replyDraft = replyDrafts[post.id] ?? ''
          return (
            <div key={post.id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: hashColor(post.user_id) }}>
                  {initialsOf(post.users?.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{post.users?.full_name || 'Anonymous'}</p>
                    <span className="text-caption text-slate-400">{formatDate(post.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => toggleReplies(post.id)}
                      className="flex items-center gap-1.5 text-caption text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <MessageSquare size={13} /> {post.reply_count ?? replies.length} {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {user && (
                      <button
                        onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyDrafts(prev => ({ ...prev, [post.id]: prev[post.id] ?? '' })) }}
                        className="text-caption text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Replies */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {replies.length === 0 && <p className="text-caption text-slate-400">No replies yet.</p>}
                      {replies.map(r => (
                        <div key={r.id} className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: hashColor(r.user_id) }}>
                            {initialsOf(r.users?.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{r.users?.full_name || 'Anonymous'}</p>
                              <span className="text-caption text-slate-400">{formatDate(r.created_at)}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{r.content}</p>
                          </div>
                        </div>
                      ))}

                      {replyingTo === post.id && user && (
                        <div className="flex gap-2">
                          <input
                            value={replyDraft}
                            onChange={e => setReplyDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a reply…"
                            className="input text-sm py-2"
                            onKeyDown={e => { if (e.key === 'Enter') handleReply(post.id) }}
                          />
                          <button onClick={() => handleReply(post.id)} disabled={replyPosting || !replyDraft.trim()} className="btn-primary text-sm px-4 py-2 flex-shrink-0 disabled:opacity-50">
                            <Send size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}

      <div className="flex items-center gap-1.5 text-caption text-slate-400">
        <ThumbsUp size={12} />
        Be kind and respectful. Report inappropriate content to moderators.
      </div>
    </div>
  )
}