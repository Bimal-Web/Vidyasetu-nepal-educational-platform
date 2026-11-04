import Link from 'next/link'
import { BookOpen, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-slate-900">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-6">
          <BookOpen size={40} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        <p className="text-6xl font-black text-slate-200 dark:text-slate-800 mb-4 select-none">404</p>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-body mb-8">
          The page you&apos;re looking for doesn&apos;t exist, or may have been moved.
          Try searching for the subject you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/browse" className="btn-primary px-6 py-3 flex items-center gap-2 justify-center" id="notfound-browse-btn">
            <Search size={16} /> Browse Subjects
          </Link>
          <Link href="/" className="btn-secondary px-6 py-3 flex items-center gap-2 justify-center" id="notfound-home-btn">
            <ArrowLeft size={16} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
