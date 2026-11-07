'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, FileText, ChevronRight, ExternalLink,
  Heart, Globe, Wrench, Eye
} from 'lucide-react'

// ─── Class 8 BLE Model Papers ────────────────────────────────────────────────
// Google Drive folder ID
const FOLDER_ID = '1PcDnCuzMtSbQBtpJT4JDCH_-E4PxYtLB'

// Add each file's Google Drive file ID below.
// To get a file ID: open the file in Drive → copy the ID from the URL bar.
// URL format: https://drive.google.com/file/d/FILE_ID/view
const CLASS8_SUBJECTS = [
  {
    id: 'health',
    name: 'Health & Physical Education',
    fileName: 'class8_health_physical_education_ble_model_paper',
    fileId: '13zbFFVfvp7mGfUXwGwO5Zlhb2-UbhjCa',
    color: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
    Icon: 'Heart',
    label: 'BLE Model Paper',
    description: 'Class 8 Health & Physical Education BLE model paper — physical fitness, health, and sports.',
  },
  {
    id: 'moral',
    name: 'Moral Education',
    fileName: 'class8_moral_education_ble_model_paper',
    fileId: '1tSSX5LjELtrWpCRtOz1oyVj_vyX-K-mX',
    color: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800',
    badge: 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300',
    Icon: 'BookOpen',
    label: 'BLE Model Paper',
    description: 'Class 8 Moral Education BLE model paper covering ethics, values, and Nepali society.',
  },
  {
    id: 'social',
    name: 'Social Studies',
    fileName: 'class8_social_studies_ble_model_paper',
    fileId: '15gvlwXvRrxDWTMenSINZKvjf-A_v-ysb',
    color: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    Icon: 'Globe',
    label: 'BLE Model Paper',
    description: 'Class 8 Social Studies BLE model paper — geography, history, and civics.',
  },
  {
    id: 'vocational',
    name: 'Vocational & Technical Education',
    fileName: 'class8_vocational_technical_education_ble_model_paper',
    fileId: '1HaAqrLMirVbVcbfO-RmA4QR07o7ENZg9',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    Icon: 'Wrench',
    label: 'BLE Model Paper',
    description: 'Class 8 Vocational & Technical Education BLE model paper.',
  },
]

const ICON_MAP: Record<string, React.ElementType> = { Heart, BookOpen, Globe, Wrench }

export default function Class8Page() {
  const [activeSubject, setActiveSubject] = useState<typeof CLASS8_SUBJECTS[0] | null>(CLASS8_SUBJECTS[0])
  const [isFullscreen, setIsFullscreen] = useState(false)

  const folderEmbedUrl = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#list`

  const openViewer = (subject: typeof CLASS8_SUBJECTS[0]) => {
    setActiveSubject(subject)
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all ${isFullscreen ? 'fixed inset-0 z-50 max-w-none bg-slate-950 p-0 sm:p-0 flex flex-col' : ''}`}>

      {/* Header and Cards hidden in fullscreen */}
      {!isFullscreen && (
        <>
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs sm:text-sm text-slate-500 mb-6 font-medium flex-wrap gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <Link href="/programs" className="hover:text-indigo-600 transition-colors">Programs</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Class 8 — BLE Model Papers</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                <FileText size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Class 8 BLE Model Papers
                  </h1>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Verified PDFs
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Official Basic Level Examination (BLE) practice sets with questions and marking guidelines directly embedded from Google Drive.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {CLASS8_SUBJECTS.map((subject) => {
              const Icon = ICON_MAP[subject.Icon]
              const isActive = activeSubject?.id === subject.id
              return (
                <button
                  key={subject.id}
                  onClick={() => openViewer(subject)}
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${subject.badge}`}>
                        {subject.label}
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {subject.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-2">
                    {subject.description}
                  </p>

                  <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
                    <span className={`inline-flex items-center gap-1.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Eye size={13} />
                      {isActive ? 'Currently Viewing' : 'View PDF'}
                    </span>
                    <span className="text-[11px] text-slate-400">PDF Document</span>
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
          
          {/* Active File Label & Quick Pills */}
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-white truncate">
                {activeSubject ? activeSubject.name : 'All Class 8 BLE Papers'}
              </span>
            </div>

            {/* Quick Switch Pills */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs overflow-x-auto no-scrollbar max-w-full">
              {CLASS8_SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => openViewer(s)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                    activeSubject?.id === s.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {s.id === 'health' ? 'Health & PE' : s.id === 'moral' ? 'Moral Edu' : s.id === 'social' ? 'Social Studies' : 'Vocational'}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0">
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
              onClick={() => setIsFullscreen(prev => !prev)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
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
              title={`${activeSubject.name} - Class 8 BLE Model Paper PDF`}
            />
          ) : (
            <iframe
              src={folderEmbedUrl}
              className="w-full h-full border-0"
              title="Class 8 BLE Model Papers — Google Drive Folder"
            />
          )}
        </div>
      </div>

      {/* Footer Info & Drive Notice */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3 py-2 px-1">
          <p>
            Hosted securely via Google Drive. High-quality BLE model papers aligned with Nepal Curriculum Development Centre (CDC).
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
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
