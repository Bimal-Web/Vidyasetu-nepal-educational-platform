import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ContributorSidebar } from './ContributorSidebar'

export default function ContributorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <ContributorSidebar />
        <main className="flex-1 bg-slate-50 dark:bg-slate-950 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
