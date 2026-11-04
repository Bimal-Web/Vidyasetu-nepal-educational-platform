import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsPageClient } from './AnalyticsPageClient'

export const metadata = {
  title: 'Analytics | VidyaSetu',
  description: 'Track the reach and impact of your contributions on VidyaSetu.',
}

export default async function ContributeAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/contribute/analytics')

  // My content
  const { data: content } = await supabase
    .from('content')
    .select('*, subjects(name)')
    .eq('uploaded_by', user.id)
    .order('created_at', { ascending: false })

  // Downloads on my content
  const { data: downloadLogs } = await supabase
    .from('downloads_log')
    .select('content_id, content!inner(uploaded_by, title)')
    .eq('content.uploaded_by', user.id)

  const contentList = content ?? []

  // Per-content stats
  const perContent: Record<string, { downloads: number; views: number }> = {}
  contentList.forEach(c => { perContent[c.id] = { downloads: 0, views: c.views ?? 0 } })
  ;(downloadLogs ?? []).forEach(dl => {
    if (perContent[dl.content_id]) perContent[dl.content_id].downloads++
  })

  const totalViews = contentList.reduce((a, c) => a + (c.views ?? 0), 0)
  const totalDownloads = (downloadLogs ?? []).length
  const approvedCount = contentList.filter(c => c.status === 'approved').length
  const pendingCount = contentList.filter(c => c.status === 'pending').length

  return (
    <AnalyticsPageClient
      content={contentList}
      perContent={perContent}
      totalViews={totalViews}
      totalDownloads={totalDownloads}
      approvedCount={approvedCount}
      pendingCount={pendingCount}
    />
  )
}