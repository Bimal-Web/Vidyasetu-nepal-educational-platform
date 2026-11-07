'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, BarChart3, MessageSquare, Settings } from 'lucide-react'

const links = [
  { href: '/contribute',           label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contribute/upload',    label: 'Upload', icon: Upload },
  { href: '/contribute/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/contribute/messages',  label: 'Messages',  icon: MessageSquare },
  { href: '/contribute/settings',  label: 'Settings',  icon: Settings },
]

export function ContributorSidebar() {
  const pathname = usePathname()
  return (
    <>
      {/* Mobile / Tablet Horizontal Subnav Strip (< md) */}
      <div className="flex md:hidden w-full overflow-x-auto no-scrollbar gap-1.5 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        {links.map(l => {
          const active = pathname === l.href || (l.href !== '/contribute' && pathname.startsWith(l.href))
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <l.icon size={14} className="shrink-0" />
              <span>{l.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Desktop / Large Tablet Sidebar (>= md) */}
      <aside className="hidden md:flex flex-col w-16 lg:w-52 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 py-6">
        {links.map(l => {
          const active = pathname === l.href || (l.href !== '/contribute' && pathname.startsWith(l.href))
          return (
            <Link key={l.href} href={l.href}
              className={`sidebar-link mx-2 ${active ? 'active' : ''} flex-col lg:flex-row gap-1.5 lg:gap-2.5 justify-center lg:justify-start`}
              id={`sidebar-${l.label.toLowerCase().replace(' ', '-')}`}>
              <l.icon size={18} className="flex-shrink-0" />
              <span className="hidden lg:block text-sm">{l.label === 'Upload' ? 'Upload Content' : l.label}</span>
            </Link>
          )
        })}
      </aside>
    </>
  )
}
