import { createClient } from '@/lib/supabase/server'
import { ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { BrowseProgress } from './BrowseProgress'
import { BrowseExplorer } from './BrowseExplorer'
import type { FacultyOrStream } from '@/types'

interface BrowsePageProps {
  searchParams: Promise<{ program?: string; faculty?: string; q?: string; type?: string; sort?: string }>
}

// Map URL program slugs to program names from the DB
const PROGRAM_SLUGS: Record<string, string> = {
  school: 'Pre-School & Primary',
  ble: 'Pre-School & Primary',
  class8: 'Pre-School & Primary',
  secondary: 'Secondary School (SEE)',
  see: 'Secondary School (SEE)',
  class10: 'Secondary School (SEE)',
  plus2: 'Plus 2 (+2)',
  class11: 'Plus 2 (+2)',
  class12: 'Plus 2 (+2)',
  bachelor: "Bachelor's",
  entrance: 'Entrance Prep',
  loksewa: 'Loksewa & PSC',
  govt: 'Government Competitive',
}

// Map URL type slugs to content types / has-quizzes
const TYPE_FILTERS: Record<string, { type?: string; hasQuiz?: boolean }> = {
  note: { type: 'note' },
  past_paper: { type: 'past_paper' },
  mcq: { type: 'mcq_set' },
  quiz: { hasQuiz: true },
}

const TYPE_LABELS: Record<string, string> = {
  note: 'Subjects with Notes',
  past_paper: 'Subjects with Past Papers',
  mcq: 'Subjects with MCQ Sets',
  quiz: 'Subjects with Quizzes',
}

import { MOCK_PROGRAMS, MOCK_FACULTIES, MOCK_SUBJECTS, MOCK_COUNTS } from '@/lib/data/mock-data'

async function getData(searchParams: Awaited<BrowsePageProps['searchParams']>) {
  try {
    const supabase = await createClient()

    // Programs for sidebar
    const { data: programs } = await supabase
      .from('programs')
      .select('*')
      .order('level_order')

    // Faculties
    const { data: faculties } = await supabase
      .from('faculties_or_streams')
      .select('*, programs(name)')
      .order('name')

    // Subjects query
    let query = supabase
      .from('subjects')
      .select('*, faculties_or_streams(*, programs(*))')

    if (searchParams.q) {
      query = query.ilike('name', `%${searchParams.q}%`)
    }
    if (searchParams.faculty) {
      query = query.eq('faculty_id', searchParams.faculty)
    }
    if (searchParams.program) {
      const programName = PROGRAM_SLUGS[searchParams.program] ?? searchParams.program
      const facultyList = faculties && faculties.length > 0 ? faculties : MOCK_FACULTIES
      const facultyIds = facultyList
        .filter(f => (f.programs as any)?.name === programName)
        .map(f => f.id)
      if (facultyIds.length > 0) {
        query = query.in('faculty_id', facultyIds)
      }
    }

    const { data: subjects } = await query.order('name').limit(50)

    if (subjects && subjects.length > 0) {
      const subjectIds = subjects.map(s => s.id)

      // Per-subject content counts + which subjects have quizzes
      const [{ data: contentCounts }, { data: quizSubjects }] = await Promise.all([
        supabase
          .from('content')
          .select('subject_id, type')
          .eq('status', 'approved')
          .in('subject_id', subjectIds),
        supabase.from('quizzes').select('subject_id').in('subject_id', subjectIds),
      ])

      const counts: Record<string, { notes: number; papers: number; mcqs: number; quizzes: number }> = {}
      ;(contentCounts ?? []).forEach(c => {
        if (!counts[c.subject_id]) counts[c.subject_id] = { notes: 0, papers: 0, mcqs: 0, quizzes: 0 }
        if (c.type === 'note') counts[c.subject_id].notes++
        if (c.type === 'past_paper') counts[c.subject_id].papers++
        if (c.type === 'mcq_set') counts[c.subject_id].mcqs++
      })
      ;(quizSubjects ?? []).forEach(q => {
        if (!counts[q.subject_id]) counts[q.subject_id] = { notes: 0, papers: 0, mcqs: 0, quizzes: 0 }
        counts[q.subject_id].quizzes++
      })

      // Apply type filter after counts are computed
      const typeFilter = TYPE_FILTERS[searchParams.type ?? '']
      let filteredSubjects = subjects
      if (typeFilter?.type) {
        filteredSubjects = filteredSubjects.filter(s => (counts[s.id]?.[typeFilter.type as 'notes'] ?? 0) > 0)
      } else if (typeFilter?.hasQuiz) {
        filteredSubjects = filteredSubjects.filter(s => (counts[s.id]?.quizzes ?? 0) > 0)
      }

      return {
        programs: programs && programs.length > 0 ? programs : MOCK_PROGRAMS,
        faculties: faculties && faculties.length > 0 ? faculties : MOCK_FACULTIES,
        subjects: filteredSubjects,
        counts,
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to offline database:', err)
  }

  // Fallback to rich offline dataset
  let mockFiltered = [...MOCK_SUBJECTS]
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    mockFiltered = mockFiltered.filter(
      s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  }
  if (searchParams.faculty) {
    mockFiltered = mockFiltered.filter(s => s.faculty_id === searchParams.faculty)
  }
  if (searchParams.program) {
    const programName = PROGRAM_SLUGS[searchParams.program] ?? searchParams.program
    mockFiltered = mockFiltered.filter(s => s.faculties_or_streams?.programs?.name === programName)
  }

  const typeFilter = TYPE_FILTERS[searchParams.type ?? '']
  if (typeFilter?.type) {
    mockFiltered = mockFiltered.filter(s => (MOCK_COUNTS[s.id]?.[typeFilter.type as 'notes'] ?? 0) > 0)
  } else if (typeFilter?.hasQuiz) {
    mockFiltered = mockFiltered.filter(s => (MOCK_COUNTS[s.id]?.quizzes ?? 0) > 0)
  }

  return {
    programs: MOCK_PROGRAMS,
    faculties: MOCK_FACULTIES,
    subjects: mockFiltered,
    counts: MOCK_COUNTS,
  }
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const sp = await searchParams
  const { programs, faculties, subjects, counts } = await getData(sp)

  // Group faculties by program
  const facultyByProgram: Record<string, FacultyOrStream[]> = {}
  faculties.forEach(f => {
    if (!facultyByProgram[f.program_id]) facultyByProgram[f.program_id] = []
    facultyByProgram[f.program_id].push(f)
  })

  const heading = sp.q
    ? `Search results for "${sp.q}"`
    : sp.faculty
    ? (faculties.find(f => f.id === sp.faculty)?.name ?? 'Subjects')
    : sp.program
    ? (PROGRAM_SLUGS[sp.program] ?? 'Subjects')
    : sp.type
    ? TYPE_LABELS[sp.type] ?? 'Subjects'
    : 'Browse All Subjects'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Mobile filter (collapsible) ──────────────── */}
        <details className="md:hidden w-full mb-2 group" suppressHydrationWarning>
          <summary className="flex items-center justify-between cursor-pointer list-none rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-slate-400" />
              Filter Library
            </span>
            <ChevronDown size={15} className="text-slate-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 card p-4 space-y-3">
            {programs.map(prog => (
              <div key={prog.id}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">{prog.name}</p>
                <div className="flex flex-wrap gap-2">
                  {(facultyByProgram[prog.id] ?? []).map(fac => (
                    <Link
                      key={fac.id}
                      href={`/browse?faculty=${fac.id}`}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                        sp.faculty === fac.id
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {fac.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <BrowseProgress />
          </div>
        </details>

        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24 card p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
              <SlidersHorizontal size={15} className="text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Filter Library</span>
            </div>
            <div className="space-y-1">
              {programs.map((prog, pi) => {
                const isSelected = Boolean(
                  (sp.faculty && facultyByProgram[prog.id]?.some(f => f.id === sp.faculty)) ||
                  (sp.program && PROGRAM_SLUGS[sp.program] === prog.name)
                )
                const shouldOpen = isSelected || pi < 3

                return (
                  <details key={prog.id} open={shouldOpen} className="group" suppressHydrationWarning>
                    <summary className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 list-none">
                      <ChevronDown size={14} className="text-slate-400 transition-transform group-open:rotate-0 -rotate-90" />
                      <span className={`text-sm ${isSelected ? 'font-bold text-indigo-700 dark:text-indigo-400' : 'font-semibold text-slate-700 dark:text-slate-200'}`}>
                        {prog.name}
                      </span>
                      <span className="ml-auto text-xs text-slate-400 font-medium">
                        {facultyByProgram[prog.id]?.length ?? 0}
                      </span>
                    </summary>
                    <div className="ml-4 mt-0.5 space-y-0.5">
                      {facultyByProgram[prog.id]?.map(fac => (
                        <Link
                          key={fac.id}
                          href={`/browse?faculty=${fac.id}`}
                          className={`sidebar-link text-xs py-1 px-2 ${sp.faculty === fac.id ? 'active' : ''}`}
                        >
                          {fac.name}
                        </Link>
                      ))}

                      {/* Quick links to dedicated class model paper hubs */}
                      {prog.name === 'Pre-School & Primary' && (
                        <Link
                          href="/class8"
                          className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
                        >
                          <span>📄 BLE Model Papers</span>
                          <ChevronRight size={11} />
                        </Link>
                      )}
                      {prog.name === 'Secondary School (SEE)' && (
                        <Link
                          href="/class10"
                          className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline px-2 py-1"
                        >
                          <span>📄 SEE Model Papers</span>
                          <ChevronRight size={11} />
                        </Link>
                      )}
                      {prog.name === 'Plus 2 (+2)' && (
                        <Link
                          href="/class11"
                          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
                        >
                          <span>📄 Class 11 NEB Hub</span>
                          <ChevronRight size={11} />
                        </Link>
                      )}

                      {!facultyByProgram[prog.id]?.length && (
                        <p className="text-xs text-slate-400 px-2 py-1">No faculties yet</p>
                      )}
                    </div>
                  </details>
                )
              })}
            </div>

            {/* Progress widget */}
            <BrowseProgress />
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
            <Link href="/" className="hover:text-indigo-700">Home</Link>
            <ChevronRight size={14} />
            <Link href="/browse" className="hover:text-indigo-700">Browse</Link>
            {sp.faculty && (
              <>
                <ChevronRight size={14} />
                <span className="text-indigo-700 dark:text-indigo-400 font-medium">
                  {faculties.find(f => f.id === sp.faculty)?.name}
                </span>
              </>
            )}
          </div>

          {/* Resource type chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: 'All Resources', href: '/browse', active: !sp.type && !sp.faculty && !sp.program },
              { label: 'Notes', href: '/browse?type=note', active: sp.type === 'note' },
              { label: 'Past Papers', href: '/browse?type=past_paper', active: sp.type === 'past_paper' },
              { label: 'MCQ Sets', href: '/browse?type=mcq', active: sp.type === 'mcq' },
              { label: 'Quizzes', href: '/browse?type=quiz', active: sp.type === 'quiz' },
            ].map(chip => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all ${
                  chip.active
                    ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300'
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Interactive Reactive Explorer */}
          <BrowseExplorer
            initialSubjects={subjects}
            counts={counts}
            programs={programs}
            faculties={faculties}
            heading={heading}
            currentQuery={sp.q}
            currentType={sp.type}
            currentFaculty={sp.faculty}
            currentProgram={sp.program}
          />
        </div>
      </div>
    </div>
  )
}
