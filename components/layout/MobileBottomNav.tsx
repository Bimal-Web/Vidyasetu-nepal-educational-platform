'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Brain, GraduationCap, LayoutDashboard } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/', icon: Home, matchExact: true },
  { label: 'Library', href: '/browse', icon: BookOpen },
  { label: 'Quizzes', href: '/quizzes', icon: Brain },
  { label: 'Classes', href: '/class10', icon: GraduationCap, matchPrefixes: ['/class10', '/class11', '/class8', '/programs'] },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, matchPrefixes: ['/dashboard', '/profile', '/bookmarks'] },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  // Hide on authentication screens to keep auth focused
  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') {
    return null
  }

  const isActive = (item: typeof navItems[number]) => {
    if (item.matchExact) {
      return pathname === item.href
    }
    if (item.matchPrefixes) {
      return item.matchPrefixes.some(p => pathname.startsWith(p))
    }
    return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-black/40 transition-colors"
      aria-label="Mobile Bottom Navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 items-center h-15 max-w-lg mx-auto px-1">
        {navItems.map(item => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition-all relative ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active top subtle indicator bar */}
              {active && (
                <span className="absolute top-0 w-8 h-[2.5px] rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
              
              <div className={`p-1 rounded-xl transition-transform ${active ? 'scale-110' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-0.5 font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
