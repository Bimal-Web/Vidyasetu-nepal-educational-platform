'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, FileText, ChevronRight, ExternalLink,
  GraduationCap, Laptop, TrendingUp, Compass, Calculator,
  Globe, Languages, Eye, Sparkles
} from 'lucide-react'

// ─── Class 10 SEE Model Papers ──────────────────────────────────────────────
const FOLDER_ID = '1e5tEEJOLEO0souY6DHjsE-4IIqGJi53o'

interface Class10Subject {
  id: string
  name: string
  shortName: string
  category: 'compulsory' | 'optional'
  fileName: string
  fileId: string
  fileSize: string
  color: string
  lightBg: string
  border: string
  badge: string
  Icon: string
  label: string
  description: string
}

const CLASS10_SUBJECTS: Class10Subject[] = [
  {
    id: 'science',
    name: 'Science & Technology',
    shortName: 'Science',
    category: 'compulsory',
    fileName: 'Class10_Science_Model_Paper.pdf',
    fileId: '1Pl_u2hI5G2TWG880RArIqotPymqv9Gj_',
    fileSize: '129 KB',
    color: 'from-blue-500 to-cyan-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    Icon: 'Compass',
    label: 'Compulsory',
    description: 'Physics, Chemistry, Biology, Astronomy, and Geology according to latest SEE CDC specifications.',
  },
  {
    id: 'c-math',
    name: 'Compulsory Mathematics',
    shortName: 'C. Math',
    category: 'compulsory',
    fileName: 'Class10_SEE_Compulsory_Mathematics_Model_Paper.pdf',
    fileId: '1pYrTbz5J2tAqgUt_q8JEFZsB9yCh0xmY',
    fileSize: '1.1 MB',
    color: 'from-orange-500 to-amber-600',
    lightBg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    Icon: 'Calculator',
    label: 'Compulsory',
    description: 'Arithmetic, Mensuration, Algebra, Geometry, Trigonometry, Statistics, and Probability.',
  },
  {
    id: 'english',
    name: 'Compulsory English',
    shortName: 'English',
    category: 'compulsory',
    fileName: 'Class10_SEE_Compulsory_English_Model_Paper.pdf',
    fileId: '1ndnri7cJhMKr-mbmnlaUaBQZ-D80KXQC',
    fileSize: '30 KB',
    color: 'from-indigo-500 to-blue-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800',
    badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
    Icon: 'Languages',
    label: 'Compulsory',
    description: 'Reading comprehension, guided writing, grammar drills, free writing, and literature.',
  },
  {
    id: 'nepali',
    name: 'Compulsory Nepali',
    shortName: 'Nepali',
    category: 'compulsory',
    fileName: 'Class10_SEE_Compulsory_Nepali_Model_Paper.pdf',
    fileId: '1mVuO5xeE5w9gPmqP1hxXFCtVwh-D1Veh',
    fileSize: '53 KB',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    Icon: 'BookOpen',
    label: 'Compulsory',
    description: 'Byakaran (grammar), bodh (comprehension), rachana (essay/letter), and textbook literature.',
  },
  {
    id: 'social',
    name: 'Social Studies & Life Skills',
    shortName: 'Social Studies',
    category: 'compulsory',
    fileName: 'Class10_Social_Studies_Model_Paper.pdf',
    fileId: '1-Byk2Pej9l_5eGdDuZZ9-KdkVOi06ZNm',
    fileSize: '291 KB',
    color: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    Icon: 'Globe',
    label: 'Compulsory',
    description: 'We and Our Society, Constitution & Democracy, History, Geography, International Relations, and Life Skills.',
  },
  {
    id: 'opt-math',
    name: 'Optional Mathematics',
    shortName: 'Opt. Math',
    category: 'optional',
    fileName: 'Class10_OptMath_SEE_Model_Paper.pdf',
    fileId: '1QfnXaE8OcY8ax4be9w3bYWonHo0e3umd',
    fileSize: '193 KB',
    color: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    Icon: 'Calculator',
    label: 'Optional I',
    description: 'Advanced Algebra, Coordinate Geometry, Trigonometry, Vectors, Transformation, and Statistics.',
  },
  {
    id: 'computer',
    name: 'Computer Science',
    shortName: 'Computer',
    category: 'optional',
    fileName: 'Class10_Computer_Science_SEE_Model_Paper.pdf',
    fileId: '1u428PoNV9KWXYp0TQLlqllQ_iy-0G18h',
    fileSize: '70 KB',
    color: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800',
    badge: 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300',
    Icon: 'Laptop',
    label: 'Optional II',
    description: 'Computer System, Networking, Cyber Law, MS-Access Database, and QBASIC Programming.',
  },
  {
    id: 'economics',
    name: 'Economics',
    shortName: 'Economics',
    category: 'optional',
    fileName: 'Class10_Economics_SEE_Model_Paper.pdf',
    fileId: '1QOnGDFc1WlGUme2kELJd4Sepmp5A4rO0',
    fileSize: '80 KB',
    color: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
    Icon: 'TrendingUp',
    label: 'Optional II',
    description: 'Microeconomics fundamentals, national income, monetary policy, foreign trade, and economic planning in Nepal.',
  },
]

const ICON_MAP: Record<string, React.ElementType> = {
  Compass, Calculator, Languages, BookOpen, Globe, Laptop, TrendingUp, GraduationCap
}

export default function Class10Page() {
  const [activeSubject, setActiveSubject] = useState<Class10Subject>(CLASS10_SUBJECTS[0])
  const [filter, setFilter] = useState<'all' | 'compulsory' | 'optional'>('all')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const filteredSubjects = CLASS10_SUBJECTS.filter((s) => {
    if (filter === 'compulsory') return s.category === 'compulsory'
    if (filter === 'optional') return s.category === 'optional'
    return true
  })

  const folderEmbedUrl = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#list`

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all ${isFullscreen ? 'fixed inset-0 z-50 max-w-none bg-slate-950 p-0 sm:p-0 flex flex-col' : ''}`}>

      {/* Top Header & Breadcrumbs (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <>
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs sm:text-sm text-slate-500 mb-6 font-medium flex-wrap gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <Link href="/programs" className="hover:text-indigo-600 transition-colors">Programs</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Class 10 (SEE) — Model Question Papers</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                <GraduationCap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Class 10 (SEE) Model Question Papers
                  </h1>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    8 Subjects Embedded
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Secondary Education Examination (SEE) model practice question sets based on the National Examination Board (NEB/CDC) format.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <a
                href={`https://drive.google.com/drive/folders/${FOLDER_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-all shadow-xs"
              >
                <ExternalLink size={15} />
                <span>Open Drive Folder</span>
              </a>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Subjects (8)
            </button>
            <button
              onClick={() => setFilter('compulsory')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'compulsory'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Compulsory Subjects (5)
            </button>
            <button
              onClick={() => setFilter('optional')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'optional'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Optional Subjects (3)
            </button>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
            {filteredSubjects.map((subject) => {
              const Icon = ICON_MAP[subject.Icon] || FileText
              const isActive = activeSubject?.id === subject.id
              return (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubject(subject)}
                  className={[
                    'text-left rounded-2xl border p-4 transition-all duration-200 group relative overflow-hidden cursor-pointer',
                    subject.lightBg, subject.border,
                    isActive
                      ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 scale-[1.02] shadow-lg shadow-indigo-500/10'
                      : 'hover:scale-[1.01] hover:shadow-md opacity-90 hover:opacity-100',
                  ].join(' ')}
                >
                  {/* Top gradient highlight */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${subject.color}`} />

                  <div className="flex items-start gap-3 mt-1.5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center flex-shrink-0 shadow-sm text-white`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${subject.badge}`}>
                          {subject.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {subject.fileSize}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {subject.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                    {subject.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
                    <span className={`inline-flex items-center gap-1.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Eye size={13} />
                      {isActive ? 'Currently Viewing' : 'View PDF'}
                    </span>
                    <span className="text-[11px] text-slate-400">SEE Paper</span>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Embedded PDF Viewer Container */}
      <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl bg-slate-900 flex flex-col ${isFullscreen ? 'flex-1 rounded-none border-0' : 'mb-6'}`}>

        {/* Viewer Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900 text-slate-200 flex-wrap gap-2">
          
          {/* Active File Label & Quick Switch Pills */}
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-none">
                {activeSubject ? activeSubject.name : 'Class 10 (SEE) Model Papers'}
              </span>
            </div>

            {/* Quick Switch Pills for All 8 Subjects */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs overflow-x-auto max-w-xl">
              {CLASS10_SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSubject(s)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-[11px] ${
                    activeSubject?.id === s.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {s.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeSubject?.fileId && (
              <a
                href={`https://drive.google.com/file/d/${activeSubject.fileId}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                title="Open in Google Drive"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">Drive View</span>
              </a>
            )}

            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer'}
            >
              {isFullscreen ? 'Exit Fullscreen' : '⛶ Expand'}
            </button>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className={`relative w-full bg-slate-950 ${isFullscreen ? 'flex-1' : ''}`} style={!isFullscreen ? { height: '78vh', minHeight: 560 } : {}}>
          {activeSubject && activeSubject.fileId ? (
            <iframe
              key={activeSubject.fileId}
              src={`https://drive.google.com/file/d/${activeSubject.fileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay"
              title={`${activeSubject.name} - Class 10 SEE Model Paper PDF`}
            />
          ) : (
            <iframe
              src={folderEmbedUrl}
              className="w-full h-full border-0"
              title="Class 10 SEE Model Papers — Google Drive Folder"
            />
          )}
        </div>
      </div>

      {/* Footer Info & Drive Notice */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3 py-2 px-1">
          <p>
            Hosted securely via Google Drive. High-quality Class 10 SEE model question papers aligned with the latest National Examination Board (NEB) specification grid.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/class8"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles size={12} />
              View Class 8 BLE Papers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href={`https://drive.google.com/drive/folders/${FOLDER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <ExternalLink size={12} />
              Open Folder in Drive
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
