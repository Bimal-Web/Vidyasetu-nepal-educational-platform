import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Calendar, User, Tag, ArrowRight, BookOpen, Share2 } from 'lucide-react'
import { getBlogPost, blogPosts, categoryColorMap, AUTHOR_AVATARS, AUTHOR_POSITIONS } from '../blogData'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Not Found — VidyaSetu' }
  return {
    title: `${post.title} — VidyaSetu Blog`,
    description: post.excerpt,
  }
}

// ── Proper markdown renderer (handles tables, nested lists, etc.) ────────────
function mdToHtml(raw: string): string {
  const lines = raw.trim().split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // H2
    if (line.startsWith('## ')) {
      out.push(`<h2>${inline(line.slice(3))}</h2>`)
      i++; continue
    }
    // H3
    if (line.startsWith('### ')) {
      out.push(`<h3>${inline(line.slice(4))}</h3>`)
      i++; continue
    }

    // Table: collect rows
    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      out.push(buildTable(tableLines))
      continue
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(`<li>${inline(lines[i].replace(/^[-*] /, ''))}</li>`)
        i++
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\. /, ''))}</li>`)
        i++
      }
      out.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    // Empty line → skip
    if (line.trim() === '') {
      i++; continue
    }

    // Default: paragraph
    out.push(`<p>${inline(line)}</p>`)
    i++
  }

  return out.join('\n')
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}

function buildTable(rows: string[]): string {
  // A separator row looks like |---|---| or |:--|:--:|
  const isSep = (r: string) => /^\|[\s|:\-]+\|$/.test(r.trim())
  const dataRows = rows.filter(r => !isSep(r))

  const parse = (row: string) =>
    row.split('|').map(c => c.trim()).filter((_, i, a) => i !== 0 && i !== a.length - 1)

  if (dataRows.length === 0) return ''
  const [head, ...body] = dataRows

  const ths = parse(head).map(c => `<th>${inline(c)}</th>`).join('')
  const trs = body.map(r => `<tr>${parse(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')

  return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const colors = categoryColorMap[post.categoryColor] ?? categoryColorMap.indigo
  const related = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3)
  const html = mdToHtml(post.content)
  const initials = post.author.split(' ').map(n => n[0]).join('')

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* ── Breadcrumb bar ─────────────────────────────── */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-12 items-start">

          {/* ── Main Article ──────────────────────────────── */}
          <article className="flex-1 min-w-0">

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Blog
            </Link>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                <Clock size={11} /> {post.readTime}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                <Calendar size={11} /> {post.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-5 tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt / Lead */}
            <p className="text-[1.1rem] text-slate-500 dark:text-slate-400 leading-relaxed mb-8 border-l-4 border-indigo-500 pl-5 italic">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex items-center gap-3.5 pb-8 mb-8 border-b border-slate-200 dark:border-slate-700">
              {AUTHOR_AVATARS[post.author] ? (
                <img
                  src={AUTHOR_AVATARS[post.author]}
                  alt={post.author}
                  style={{ objectPosition: AUTHOR_POSITIONS[post.author] || 'center 25%' }}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{post.author}</p>
                <p className="text-xs text-slate-400">{post.authorRole}</p>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg border border-slate-200/80 dark:border-slate-800">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            )}

            {/* Article body */}
            <div
              className="blog-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <Tag size={13} className="text-slate-400" />
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* ── Sidebar ───────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-5 w-72 shrink-0 sticky top-24">

            {/* Author card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Written by</p>
              <div className="flex items-center gap-3 mb-4">
                {AUTHOR_AVATARS[post.author] ? (
                  <img
                    src={AUTHOR_AVATARS[post.author]}
                    alt={post.author}
                    style={{ objectPosition: AUTHOR_POSITIONS[post.author] || 'center 25%' }}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-50">{post.author}</p>
                  <p className="text-xs text-slate-400">{post.authorRole}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Co-founder of VidyaSetu — building Nepal's most comprehensive free education platform for students across every level.
              </p>
            </div>

            {/* Article info */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Article Info</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <Clock size={14} className="text-indigo-500 shrink-0" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar size={14} className="text-indigo-500 shrink-0" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <BookOpen size={14} className="text-indigo-500 shrink-0" />
                  <span>{post.category}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Share Article</p>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://vidyasetu.vercel.app/blog/' + post.slug)}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
                >
                  <Share2 size={12} /> Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://vidyasetu.vercel.app/blog/' + post.slug)}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
                >
                  <Share2 size={12} /> Facebook
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#3730a3,#4f46e5)' }}>
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-indigo-200 mb-2">Free Study Resources</p>
                <p className="text-white font-bold text-sm mb-4 leading-snug">
                  Access 50,000+ notes, past papers & MCQs
                </p>
                <Link
                  href="/browse"
                  className="block w-full py-2.5 bg-white text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors text-center"
                >
                  Browse Subjects →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related Posts ──────────────────────────────── */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-7">More Articles You'll Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map(rp => {
              const rc = categoryColorMap[rp.categoryColor] ?? categoryColorMap.indigo
              return (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>
                      {rp.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={10} /> {rp.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm flex-1">
                    {rp.title}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 mt-4 group-hover:gap-1.5 transition-all">
                    Read more <ArrowRight size={12} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
