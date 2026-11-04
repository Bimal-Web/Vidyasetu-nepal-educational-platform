import Link from 'next/link'
import { Clock, ArrowRight, BookOpen, Flame, TrendingUp, Users, Star } from 'lucide-react'
import { blogPosts, categoryColorMap } from './blogData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — VidyaSetu',
  description: 'Study tips, exam strategies, Loksewa guides, and education insights for Nepali students.',
}

const stats = [
  { icon: BookOpen, label: 'Articles Published', value: '6' },
  { icon: Users,    label: 'Monthly Readers',    value: '10k+' },
  { icon: Star,     label: 'Avg. Rating',        value: '4.9★' },
  { icon: TrendingUp, label: 'Topics Covered',   value: '5' },
]

export default function BlogPage() {
  const [feat1, feat2, ...rest] = blogPosts

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(150deg,#1e1b4b 0%,#312e81 45%,#3730a3 100%)' }}>
        {/* background orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,#818cf8,transparent 70%)' }} />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,#c084fc,transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-300 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <BookOpen size={11} /> VidyaSetu Blog
          </span>
          <h1 className="text-hero text-white mb-5 leading-[1.1]">
            Knowledge That Gets<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#a5b4fc,#e879f9)' }}>
              You Ahead
            </span>
          </h1>
          <p className="text-indigo-200/90 text-[1.05rem] max-w-lg mx-auto leading-relaxed">
            Exam strategies, study science, Loksewa guides, and education insights — crafted for Nepal's most ambitious students.
          </p>

          {/* Stats bar */}
          <div className="mt-10 inline-flex flex-wrap justify-center gap-px bg-white/10 rounded-2xl border border-white/10 overflow-hidden">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 px-5 py-3 bg-white/5 hover:bg-white/10 transition-colors">
                <s.icon size={14} className="text-indigo-300" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-indigo-300 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        {/* ── Featured Articles ─────────────────────────── */}
        <section className="mb-16">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Flame size={14} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Featured Articles</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[feat1, feat2].filter(Boolean).map(post => {
              const c = categoryColorMap[post.categoryColor] ?? categoryColorMap.indigo
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Top accent stripe */}
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />

                  <div className="p-7 flex flex-col gap-4 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.bg} ${c.text} ${c.border} border`}>
                        {post.category}
                      </span>
                      <span className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
                        <Clock size={11} /> {post.readTime}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[1.15rem] font-bold text-slate-900 dark:text-slate-50 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{post.author}</p>
                          <p className="text-[11px] text-slate-400">{post.date}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
                        Read article <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── All Articles ──────────────────────────────── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">All Articles</h2>
            <span className="text-sm text-slate-400">{blogPosts.length} articles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(post => {
              const c = categoryColorMap[post.categoryColor] ?? categoryColorMap.indigo
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Mini accent line */}
                  <div className={`h-0.5 w-full ${c.bg.replace('bg-', 'bg-gradient-to-r from-')}`}
                    style={{ background: post.categoryColor === 'indigo' ? '#4f46e5' : post.categoryColor === 'green' ? '#059669' : post.categoryColor === 'violet' ? '#7c3aed' : '#d97706' }} />

                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text} ${c.border} border`}>
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={10} /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-slate-50 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-[0.95rem]">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                      <p className="text-[11px] text-slate-400 font-medium">{post.date}</p>
                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 group-hover:gap-1.5 transition-all">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden rounded-2xl px-8 py-14 text-center"
            style={{ background: 'linear-gradient(135deg,#3730a3 0%,#4f46e5 50%,#7c3aed 100%)' }}>
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle,#fff,transparent)' }} />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200 mb-3">Stay in the Loop</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Get Fresh Guides Every Week</h2>
              <p className="text-indigo-200 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Join thousands of Nepali students receiving exam tips, study strategies, and educational insights weekly.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-900/30"
              >
                Create Free Account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
