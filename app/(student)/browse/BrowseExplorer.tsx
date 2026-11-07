'use client'

import { useState, useMemo, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { SubjectBadge } from '@/components/features/SubjectBadge'
import { getSubjectCoverImage } from '@/lib/subject-covers'
import type { Subject, FacultyOrStream, Program } from '@/types'
import {
  Search, X, LayoutGrid, List, ArrowUpDown, Bookmark,
  ArrowRight, FileText, BookOpen, Brain, Sparkles, Filter
} from 'lucide-react'

interface BrowseExplorerProps {
  initialSubjects: Subject[]
  counts: Record<string, { notes: number; papers: number; mcqs: number; quizzes: number }>
  programs: Program[]
  faculties: FacultyOrStream[]
  heading: string
  currentQuery?: string
  currentType?: string
  currentFaculty?: string
  currentProgram?: string
}

type SortOption = 'recommended' | 'notes' | 'papers' | 'quizzes' | 'az'
type ViewMode = 'grid' | 'list'

export function BrowseExplorer({
  initialSubjects,
  counts,
  faculties,
  heading,
  currentQuery = '',
  currentType = '',
  currentFaculty = '',
  currentProgram = '',
}: BrowseExplorerProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  // Local state for instant client-side reactivity
  const [search, setSearch] = useState(currentQuery)
  const [debouncedSearch, setDebouncedSearch] = useState(currentQuery)
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  // Extract distinct grades from initialSubjects to allow quick level filtering
  const availableGrades = useMemo(() => {
    const map = new Map<string, number>()
    initialSubjects.forEach(s => {
      const g = s.grade_or_semester?.trim()
      if (g) {
        map.set(g, (map.get(g) ?? 0) + 1)
      }
    })
    return Array.from(map.entries()).map(([grade, count]) => ({ grade, count }))
  }, [initialSubjects])

  // Sync debounced search for live filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 150)
    return () => clearTimeout(timer)
  }, [search])

  // Load saved bookmarks and view preference from localStorage
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem('vs_bookmarks_subjects')
      if (savedBm) {
        setBookmarkedIds(new Set(JSON.parse(savedBm)))
      }
      const savedView = localStorage.getItem('vs_browse_view_mode') as ViewMode | null
      if (savedView === 'grid' || savedView === 'list') {
        setViewMode(savedView)
      }
    } catch {
      // safe fallback
    }
  }, [])

  // Toggle bookmark with instant local storage persistence
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      try {
        localStorage.setItem('vs_bookmarks_subjects', JSON.stringify(Array.from(next)))
      } catch {}
      return next
    })
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    try {
      localStorage.setItem('vs_browse_view_mode', mode)
    } catch {}
  }

  // Reactive filtering and sorting
  const filteredSubjects = useMemo(() => {
    let result = [...initialSubjects]

    // Live search query
    const q = debouncedSearch.trim().toLowerCase()
    if (q) {
      result = result.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(q)
        const descMatch = s.description?.toLowerCase().includes(q) ?? false
        const gradeMatch = s.grade_or_semester?.toLowerCase().includes(q) ?? false
        const faculty = faculties.find(f => f.id === s.faculty_id)
        const facultyMatch = faculty?.name.toLowerCase().includes(q) ?? false
        return nameMatch || descMatch || facultyMatch || gradeMatch
      })
    }

    // Filter by selected Grade if active
    if (selectedGrade !== 'all') {
      result = result.filter(s => s.grade_or_semester === selectedGrade)
    }

    // Sort order
    switch (sortBy) {
      case 'notes':
        result.sort((a, b) => (counts[b.id]?.notes ?? 0) - (counts[a.id]?.notes ?? 0))
        break
      case 'papers':
        result.sort((a, b) => (counts[b.id]?.papers ?? 0) - (counts[a.id]?.papers ?? 0))
        break
      case 'quizzes':
        result.sort((a, b) => (counts[b.id]?.quizzes ?? 0) - (counts[a.id]?.quizzes ?? 0))
        break
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // recommended: balance of content availability
        result.sort((a, b) => {
          const totalA = (counts[a.id]?.notes ?? 0) + (counts[a.id]?.papers ?? 0) + (counts[a.id]?.quizzes ?? 0)
          const totalB = (counts[b.id]?.notes ?? 0) + (counts[b.id]?.papers ?? 0) + (counts[b.id]?.quizzes ?? 0)
          return totalB - totalA
        })
        break
    }

    return result
  }, [initialSubjects, debouncedSearch, selectedGrade, sortBy, counts, faculties])

  // Clear all active filters
  const clearAllFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setSelectedGrade('all')
    startTransition(() => {
      router.push('/browse')
    })
  }

  const hasActiveFilters = Boolean(
    debouncedSearch || selectedGrade !== 'all' || currentType || currentFaculty || currentProgram
  )

  const activeFacultyName = currentFaculty
    ? faculties.find(f => f.id === currentFaculty)?.name
    : null

  return (
    <div className="flex-1 min-w-0">
      {/* ── Heading & Summary ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-section text-slate-800 dark:text-slate-100">{heading}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access curated notes, verified past papers, and interactive MCQs.
          </p>
        </div>

        {/* ── View Mode & Sort Controls ────────────────────────── */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="pl-8 pr-7 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 shadow-sm transition-colors"
              aria-label="Sort subjects by"
            >
              <option value="recommended">Recommended</option>
              <option value="notes">Most Notes</option>
              <option value="papers">Most Past Papers</option>
              <option value="quizzes">Most Quizzes</option>
              <option value="az">Alphabetical (A–Z)</option>
            </select>
            <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Grid / List switch */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 shadow-sm">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              aria-label="List view"
              title="Compact list view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Reactive Live Search Bar ─────────────────────────── */}
      <div className="relative mb-4 group">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 pointer-events-none transition-colors" />
        <input
          id="browse-instant-search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter subjects instantly by name, syllabus, or faculty…"
          className="w-full pl-10 pr-20 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 select-none">
              Live
            </span>
          )}
        </div>
      </div>

      {/* ── Level / Grade Pill Switcher (e.g. Grade 11 vs Grade 12) ─── */}
      {availableGrades.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 mr-1">
            Grade / Level:
          </span>
          <button
            type="button"
            onClick={() => setSelectedGrade('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 ${
              selectedGrade === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Levels ({initialSubjects.length})
          </button>
          {availableGrades.map(({ grade, count }) => (
            <button
              key={grade}
              type="button"
              onClick={() => setSelectedGrade(grade)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 ${
                selectedGrade === grade
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {grade} ({count})
            </button>
          ))}
        </div>
      )}

      {/* ── Active Filters & Match Counter Bar ────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'} found
          </span>

          {debouncedSearch && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 animate-fade-in">
              Query: &ldquo;{debouncedSearch}&rdquo;
              <button onClick={() => setSearch('')} className="hover:text-indigo-900" aria-label="Remove search query">
                <X size={12} />
              </button>
            </span>
          )}

          {activeFacultyName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800 animate-fade-in">
              Faculty: {activeFacultyName}
              <Link href="/browse" className="hover:text-amber-900" aria-label="Remove faculty filter">
                <X size={12} />
              </Link>
            </span>
          )}

          {selectedGrade !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 animate-fade-in">
              Grade: {selectedGrade}
              <button onClick={() => setSelectedGrade('all')} className="hover:text-emerald-900" aria-label="Remove grade filter">
                <X size={12} />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-1 cursor-pointer"
            >
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* ── Subjects Display ─────────────────────────────────── */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-20 px-4 card border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Filter size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No subjects matched your filter</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any subjects matching &ldquo;{debouncedSearch}&rdquo;. Try clearing filters or search for another subject.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              onClick={clearAllFilters}
              className="btn-primary text-sm px-4 py-2"
            >
              Show All Subjects
            </button>
            {['Mathematics', 'Physics', 'Loksewa', 'Computer'].map(suggested => (
              <button
                key={suggested}
                onClick={() => setSearch(suggested)}
                className="btn-ghost text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700"
              >
                Try &ldquo;{suggested}&rdquo;
              </button>
            ))}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── GRID VIEW ─────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubjects.map(subject => {
            const isBookmarked = bookmarkedIds.has(subject.id)
            const noteCount = counts[subject.id]?.notes ?? 0
            const paperCount = counts[subject.id]?.papers ?? 0
            const mcqCount = counts[subject.id]?.mcqs ?? 0
            const quizCount = counts[subject.id]?.quizzes ?? 0
            const faculty = faculties.find(f => f.id === subject.faculty_id)

            const coverImage = getSubjectCoverImage(subject)

            return (
              <div
                key={subject.id}
                className="double-bezel group p-1 flex flex-col"
              >
                <div className="double-bezel-inner h-full flex flex-col justify-between relative overflow-hidden rounded-[22px]">
                  <div>
                    {/* ── Subject Cover Image Header ── */}
                    <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
                      <Image
                        src={coverImage}
                        alt={subject.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Contrast gradient vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20 pointer-events-none" />

                      {/* Floating Subject Badge icon on bottom-left of cover */}
                      <div className="absolute bottom-3 left-3.5 transition-transform group-hover:scale-105 duration-300 drop-shadow-md">
                        <SubjectBadge iconKey={subject.icon_key} colorKey={subject.color_key} size="md" />
                      </div>

                      {/* Bookmark button on top-right of cover */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={e => toggleBookmark(subject.id, e)}
                          className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-125 ${
                            isBookmarked
                              ? 'text-red-400 bg-red-950/70 border border-red-500/40 shadow-xs'
                              : 'text-white/90 hover:text-white bg-black/40 hover:bg-black/60 border border-white/15'
                          }`}
                          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark subject'}
                          title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
                        >
                          <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Subject Details (padded) */}
                    <div className="p-4 sm:p-5 pb-2">
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {faculty && (
                          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                            {faculty.name}
                          </span>
                        )}
                        {subject.grade_or_semester && subject.grade_or_semester !== faculty?.name && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
                            {subject.grade_or_semester}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {subject.description || 'Verified course syllabus, lecture notes, solved past papers, and mock quizzes.'}
                      </p>
                    </div>
                  </div>

                  {/* Material Pills & Action Button (padded) */}
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    {/* Direct Jump Material Pills */}
                    <div className="flex flex-wrap gap-2 text-xs mb-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <Link
                        href={`/subject/${subject.id}?tab=notes`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold transition-all border border-indigo-200/50 dark:border-indigo-800/50"
                      >
                        <BookOpen size={12} className="text-indigo-500 shrink-0" />
                        <span>{noteCount} Notes</span>
                      </Link>

                      <Link
                        href={`/subject/${subject.id}?tab=past_papers`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold transition-all border border-emerald-200/50 dark:border-emerald-800/50"
                      >
                        <FileText size={12} className="text-emerald-500 shrink-0" />
                        <span>{paperCount} Papers</span>
                      </Link>

                      {mcqCount > 0 && (
                        <Link
                          href={`/subject/${subject.id}?tab=mcqs`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/80 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold transition-all border border-purple-200/50 dark:border-purple-800/50"
                        >
                          <Sparkles size={12} className="text-purple-500 shrink-0" />
                          <span>{mcqCount} MCQs</span>
                        </Link>
                      )}

                      {quizCount > 0 && (
                        <Link
                          href={`/subject/${subject.id}?tab=quizzes`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/80 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-semibold transition-all border border-amber-200/50 dark:border-amber-800/50"
                        >
                          <Brain size={12} className="text-amber-500 shrink-0" />
                          <span>{quizCount} Quizzes</span>
                        </Link>
                      )}
                    </div>

                    {/* Primary Action Button */}
                    <Link
                      href={`/subject/${subject.id}`}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-xs hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-colors group/btn"
                      id={`subject-card-view-${subject.id}`}
                    >
                      <span>Explore Subject</span>
                      <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-slate-900/10 flex items-center justify-center transition-transform group-hover/btn:translate-x-1">
                        <ArrowRight size={13} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── COMPACT LIST VIEW ─────────────────────────────── */
        <div className="space-y-3">
          {filteredSubjects.map(subject => {
            const isBookmarked = bookmarkedIds.has(subject.id)
            const noteCount = counts[subject.id]?.notes ?? 0
            const paperCount = counts[subject.id]?.papers ?? 0
            const mcqCount = counts[subject.id]?.mcqs ?? 0
            const quizCount = counts[subject.id]?.quizzes ?? 0
            const faculty = faculties.find(f => f.id === subject.faculty_id)

            return (
              <div
                key={subject.id}
                className="double-bezel p-1"
              >
                <div className="double-bezel-inner p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <SubjectBadge iconKey={subject.icon_key} colorKey={subject.color_key} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {subject.name}
                        </h3>
                        {faculty && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                            {faculty.name}
                          </span>
                        )}
                        {subject.grade_or_semester && subject.grade_or_semester !== faculty?.name && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                            {subject.grade_or_semester}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 max-w-md">
                        {subject.description || 'Verified course syllabus & study guides.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Counts pill */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span title="Available notes"><strong>{noteCount}</strong> notes</span>
                      <span>&bull;</span>
                      <span title="Past question papers"><strong>{paperCount}</strong> papers</span>
                      {mcqCount > 0 && (
                        <>
                          <span>&bull;</span>
                          <span title="MCQ question sets"><strong>{mcqCount}</strong> MCQs</span>
                        </>
                      )}
                      {quizCount > 0 && (
                        <>
                          <span>&bull;</span>
                          <span title="Interactive quizzes"><strong>{quizCount}</strong> quizzes</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={e => toggleBookmark(subject.id, e)}
                        className={`p-2 rounded-xl transition-all duration-200 active:scale-125 ${
                          isBookmarked
                            ? 'text-red-500 bg-red-50 dark:bg-red-950/50'
                            : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        aria-label="Bookmark subject"
                      >
                        <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>

                      <Link
                        href={`/subject/${subject.id}`}
                        className="btn-primary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <span>View</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
