import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SubjectBadge } from '@/components/features/SubjectBadge'
import { getSubjectCoverImage } from '@/lib/subject-covers'
import { SubjectTabs } from './SubjectTabs'
import { SubjectBookmark } from './SubjectBookmark'
import { Star, Users, BookOpen, ChevronRight, Sparkles, FileText, CheckCircle2, Brain } from 'lucide-react'
import type { Metadata } from 'next'
import { MOCK_CONTENT } from '@/lib/data/mock-data'

interface SubjectPageProps {
  params: Promise<{ id: string }>
}

async function getData(id: string) {
  const supabase = await createClient()

  const [{ data: subject }, { data: content }, { data: quizzes }, { data: posts }] = await Promise.all([
    supabase.from('subjects').select('*, faculties_or_streams(*, programs(*))').eq('id', id).single(),
    supabase.from('content').select('*, users(full_name, avatar_url)').eq('subject_id', id).eq('status', 'approved').order('created_at', { ascending: false }),
    supabase.from('quizzes').select('*').eq('subject_id', id).order('created_at', { ascending: false }),
    supabase.from('discussion_posts').select('*, users(full_name, avatar_url), replies:discussion_replies(count)').eq('subject_id', id).order('created_at', { ascending: false }).limit(30),
  ])

  if (!subject) return null

  // Recommended: same-faculty subjects (excluding current), max 4
  const { data: related } = await supabase
    .from('subjects')
    .select('id, name, icon_key, color_key')
    .eq('faculty_id', subject.faculty_id)
    .neq('id', id)
    .order('name')
    .limit(4)

  // Merge any registered model papers with Google Drive links for this subject
  const fallbackItems = MOCK_CONTENT.filter(c => c.subject_id === id)
  const existingIds = new Set((content ?? []).map(c => c.id))
  const mergedContent = [
    ...fallbackItems.filter(c => !existingIds.has(c.id)),
    ...(content ?? [])
  ]

  const notes = mergedContent.filter(c => c.type === 'note')
  const pastPapers = mergedContent.filter(c => c.type === 'past_paper')
  const mcqSets = mergedContent.filter(c => c.type === 'mcq_set')

  // Normalize discussion posts: extract the reply_count aggregate from
  // replies:discussion_replies(count) and drop the raw count array.
  const normalizedPosts = (posts ?? []).map((p: any) => ({
    ...p,
    reply_count: p.replies?.[0]?.count ?? 0,
    replies: [],
  }))

  // Real learner + rating metrics: distinct students who downloaded this subject's content
  // or attempted this subject's quizzes, plus their average quiz score as a rating (0–5).
  const subjectContentIds = (content ?? []).map(c => c.id)
  const quizIds = (quizzes ?? []).map(q => q.id)

  const [{ data: dlLearners }, { data: results }] = await Promise.all([
    supabase
      .from('downloads_log')
      .select('user_id')
      .in('content_id', subjectContentIds),
    supabase
      .from('results')
      .select('user_id, score')
      .in('quiz_id', quizIds),
  ])

  const learnerSet = new Set<string>()
  ;(dlLearners ?? []).forEach(dl => learnerSet.add(dl.user_id))
  ;(results ?? []).forEach(r => learnerSet.add(r.user_id))

  const totalStudents = Math.max(learnerSet.size, notes.length + pastPapers.length > 0 ? 1 : 0)
  const avgScore = results?.length
    ? results.reduce((a, r) => a + r.score, 0) / results.length
    : 0
  const rating = avgScore > 0 ? Number((avgScore / 20).toFixed(1)) : null

  return { subject, notes, pastPapers, mcqSets, quizzes: quizzes ?? [], totalStudents, rating, posts: normalizedPosts, related: related ?? [] }
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getData(id)
  if (!data) return { title: 'Subject Not Found' }
  return {
    title: `${data.subject.name} | Study Resources`,
    description: `Access study notes, past papers, and practice quizzes for ${data.subject.name}.`
  }
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { id } = await params
  const data = await getData(id)
  if (!data) notFound()

  const { subject, notes, pastPapers, mcqSets, quizzes, totalStudents, rating, posts, related } = data

  const totalContent = notes.length + pastPapers.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Responsive Breadcrumb */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-500 mb-4 font-medium flex-wrap gap-1" aria-label="Breadcrumb">
        <Link href="/programs" className="hover:text-indigo-600 transition-colors">Programs</Link>
        <ChevronRight size={14} className="text-slate-400" />
        <Link href={`/programs/${subject.faculties_or_streams?.programs?.id}`} className="hover:text-indigo-600 transition-colors truncate max-w-xs">
          {subject.faculties_or_streams?.programs?.name}
        </Link>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-900 dark:text-white font-semibold truncate">{subject.name}</span>
      </nav>

      {/* Subject Cover Hero Banner */}
      <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-200/80 dark:border-slate-800 bg-slate-900">
        <Image
          src={getSubjectCoverImage(subject)}
          alt={subject.name}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Main Subject Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <SubjectBadge iconKey={subject.icon_key} colorKey={subject.color_key} size="lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{subject.name}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-xs font-medium">
                <BookOpen size={13} className="text-indigo-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">{totalContent}</span>
                <span className="text-slate-500">Resources</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-xs font-medium">
                <Users size={13} className="text-indigo-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">{totalStudents >= 1000 ? `${(totalStudents / 1000).toFixed(1)}k` : totalStudents}</span>
                <span className="text-slate-500">Learners</span>
              </span>
              <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-200/50 dark:border-amber-900/50">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span className="font-bold text-amber-700 dark:text-amber-400">{rating ?? '5.0'}</span>
                <span className="text-slate-500">Rating</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons with minimum 44px touch targets */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <SubjectBookmark subjectId={id} />
          {quizzes.length > 0 ? (
            <Link href={`/mcq/${id}`} className="flex-1 sm:flex-initial btn-primary px-5 py-2.5 rounded-xl font-semibold shadow-xs hover:shadow-indigo-500/20 text-center" id="subject-practice-mcq-btn">
              Practice MCQs
            </Link>
          ) : (
            <span
              title="No quizzes available for this subject yet"
              className="flex-1 sm:flex-initial btn-primary px-5 py-2.5 rounded-xl font-semibold opacity-60 cursor-not-allowed text-center"
              aria-disabled="true"
              id="subject-practice-mcq-btn"
            >
              Practice MCQs
            </span>
          )}
        </div>
      </div>

      {/* ── SYLLABUS & CURRICULUM COVERAGE TRACKER ──────────── */}
      <div className="card p-4 sm:p-5 mb-8 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50/70 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-slate-900/40 border border-indigo-100/80 dark:border-indigo-900/50 shadow-xs rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" /> Syllabus Progress & Exam Ready
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                100% Curriculum Aligned
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Complete chapter notes, verified past questions, and MCQ sets are ready for your revision.
            </p>
          </div>

          {/* Metric Breakdown Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
              <FileText size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{notes.length} Chapter Notes</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pastPapers.length} Solved Papers</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
              <Brain size={15} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{quizzes.length} Quizzes</span>
            </div>
          </div>
        </div>
      </div>

      <SubjectTabs
        subjectId={id}
        notes={notes}
        pastPapers={pastPapers}
        mcqSets={mcqSets}
        quizzes={quizzes}
        subject={subject}
        initialPosts={posts}
        related={related}
      />

      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-section text-slate-800 dark:text-slate-100">Related Subjects</h2>
            <Link
              href={`/browse?faculty=${subject.faculty_id}`}
              className="flex items-center gap-1 text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:gap-2 transition-all"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(r => (
              <Link key={r.id} href={`/subject/${r.id}`} className="card p-4 flex items-center gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                <SubjectBadge iconKey={r.icon_key} colorKey={r.color_key} size="md" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{r.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
