'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, BarChart3, MessageSquare, Settings } from 'lucide-react'

const links = [
  { href: '/contribute',           label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contribute/upload',    label: 'Upload Content', icon: Upload },
  { href: '/contribute/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/contribute/messages',  label: 'Messages',  icon: MessageSquare },
  { href: '/contribute/settings',  label: 'Settings',  icon: Settings },
]

export function ContributorSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-52 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 py-6">
      {links.map(l => {
        const active = pathname === l.href || (l.href !== '/contribute' && pathname.startsWith(l.href))
        return (
          <Link key={l.href} href={l.href}
            className={`sidebar-link mx-2 ${active ? 'active' : ''} flex-col lg:flex-row gap-1.5 lg:gap-2.5 justify-center lg:justify-start`}
            id={`sidebar-${l.label.toLowerCase().replace(' ', '-')}`}>
            <l.icon size={18} className="flex-shrink-0" />
            <span className="hidden lg:block text-sm">{l.label}</span>
          </Link>
        )
      })}
    </aside>
  )
}
