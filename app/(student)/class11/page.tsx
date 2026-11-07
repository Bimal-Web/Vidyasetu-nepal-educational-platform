'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText, ChevronRight, ExternalLink,
  Atom, FlaskConical, Eye, Sparkles, GraduationCap, ArrowUpRight
} from 'lucide-react'

// ─── Class 11 (+2 NEB) Model Papers ─────────────────────────────────────────
const FOLDER_ID = '1rSZdrNrATwM8H_uPXmNRWDlNk_xtiVfe'

interface Class11Subject {
  id: string
  name: string
  shortName: string
  subjectPageId: string
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
  topics: string[]
}

const CLASS11_SUBJECTS: Class11Subject[] = [
  {
    id: 'physics',
    name: 'Physics (NEB)',
    shortName: 'Physics',
    subjectPageId: '33333333-0000-0000-0000-000000000001',
    fileName: 'Class11_Physics_NEB_Model_Paper.pdf',
    fileId: '1d5j-Evg6U82zfxYhX_ejTej8v6M6KEs7',
    fileSize: '208 KB',
    color: 'from-indigo-600 to-blue-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800',
    badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
    Icon: 'Atom',
    label: 'NEB Board Paper',
    description: 'National Examination Board (NEB) Grade 11 Physics model question paper — Mechanics, Thermodynamics, Waves & Optics, Electricity, and Modern Physics.',
    topics: ['Mechanics & Vectors', 'Thermal Physics', 'Optics & Waves', 'Electrostatics & Circuits', 'Modern Physics'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry (NEB)',
    shortName: 'Chemistry',
    subjectPageId: '33333333-0000-0000-0000-000000000002',
    fileName: 'Class11_Chemistry_NEB_Model_Paper.pdf',
    fileId: '1O9k2lfTyrfca-IJJxUYDXY7tRPkQCt05',
    fileSize: '245 KB',
    color: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    Icon: 'FlaskConical',
    label: 'NEB Board Paper',
    description: 'National Examination Board (NEB) Grade 11 Chemistry model question paper — Physical, Inorganic, and Organic Chemistry with CDC marking guidelines.',
    topics: ['Atomic Structure & Bonding', 'States of Matter & Energetics', 'Inorganic Reactions & Metals', 'Basic Organic Chemistry', 'Quantitative Chemistry'],
  },
]

const ICON_MAP: Record<string, React.ElementType> = {
  Atom,
  FlaskConical,
}

export default function Class11Page() {
  const [activeSubject, setActiveSubject] = useState<Class11Subject>(CLASS11_SUBJECTS[0])
  const [isFullscreen, setIsFullscreen] = useState(false)

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
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Class 11 (+2 NEB) — Model Question Papers</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                <Atom size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Class 11 (+2 NEB) Model Question Papers
                  </h1>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Science Stream
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Official National Examination Board (NEB) model practice question sets for Grade 11 Science students, embedded directly from Google Drive.
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

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {CLASS11_SUBJECTS.map((subject) => {
              const Icon = ICON_MAP[subject.Icon] || FileText
              const isActive = activeSubject.id === subject.id
              return (
                <div
                  key={subject.id}
                  onClick={() => setActiveSubject(subject)}
                  className={[
                    'text-left rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer',
                    subject.lightBg, subject.border,
                    isActive
                      ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 scale-[1.01] shadow-lg shadow-indigo-500/10'
                      : 'hover:scale-[1.005] hover:shadow-md opacity-90 hover:opacity-100',
                  ].join(' ')}
                >
                  {/* Top gradient highlight */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${subject.color}`} />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center flex-shrink-0 shadow-sm text-white`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${subject.badge}`}>
                              {subject.label}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {subject.fileSize}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                            {subject.name}
                          </h3>
                        </div>
                      </div>

                      <Link
                        href={`/subject/${subject.subjectPageId}`}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 transition-colors"
                        title="View Full Subject Hub (Notes, Quizzes, Past Papers)"
                      >
                        <span>Subject Hub</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                      {subject.description}
                    </p>

                    {/* Topics badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {subject.topics.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                    <button
                      onClick={() => setActiveSubject(subject)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Eye size={13} />
                      {isActive ? 'Currently Previewing' : 'Preview Paper'}
                    </button>

                    <a
                      href={`https://drive.google.com/file/d/${subject.fileId}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      Open in Drive
                    </a>
                  </div>
                </div>
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
              <span className="text-sm font-bold text-white truncate">
                {activeSubject ? activeSubject.name : 'Class 11 (+2 NEB) Model Papers'}
              </span>
            </div>

            {/* Quick Switch Pills */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              {CLASS11_SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSubject(s)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer ${
                    activeSubject.id === s.id
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
            <Link
              href={`/subject/${activeSubject.subjectPageId}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title="Go to Subject Details Hub"
            >
              <span>Subject Page</span>
              <ArrowUpRight size={12} />
            </Link>

            {activeSubject.fileId && (
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer'}
            >
              {isFullscreen ? 'Exit Fullscreen' : '⛶ Expand'}
            </button>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className={`relative w-full bg-slate-950 ${isFullscreen ? 'flex-1' : ''}`} style={!isFullscreen ? { height: 'clamp(420px, 75vh, 850px)' } : {}}>
          {activeSubject && activeSubject.fileId ? (
            <iframe
              key={activeSubject.fileId}
              src={`https://drive.google.com/file/d/${activeSubject.fileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay"
              title={`${activeSubject.name} - Class 11 NEB Model Paper PDF`}
            />
          ) : (
            <iframe
              src={folderEmbedUrl}
              className="w-full h-full border-0"
              title="Class 11 NEB Model Papers — Google Drive Folder"
            />
          )}
        </div>
      </div>

      {/* Footer Info & Drive Notice */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3 py-2 px-1">
          <p>
            Hosted securely via Google Drive. High-quality Class 11 (+2 NEB) model question papers aligned with the Curriculum Development Centre (CDC) specification grid.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
            <Link
              href="/class10"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <GraduationCap size={12} />
              Class 10 (SEE)
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/class8"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles size={12} />
              Class 8 (BLE)
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
