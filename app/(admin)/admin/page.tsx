import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminClient } from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/admin')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [
    { data: allUsers, count: userCount },
    { data: pendingSubmissions },
    { data: recentDownloads },
    { data: allContent },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(20),
    supabase.from('submissions')
      .select('*, content(title, type, file_url, subjects(name)), users(full_name, email)')
      .eq('status', 'under_review')
      .order('reviewed_at', { ascending: false })
      .limit(20),
    supabase.from('downloads_log')
      .select('downloaded_at, content(title), users(full_name)')
      .gte('downloaded_at', sevenDaysAgo)
      .order('downloaded_at', { ascending: false })
      .limit(200),
    supabase.from('content').select('id, type, status, downloads, views, created_at').limit(200),
  ])

  return (
    <AdminClient
      users={allUsers ?? []}
      userCount={userCount ?? 0}
      pendingSubmissions={pendingSubmissions ?? []}
      recentDownloads={recentDownloads ?? []}
      allContent={allContent ?? []}
    />
  )
}
