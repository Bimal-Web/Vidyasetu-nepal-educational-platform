import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ProfileClient } from './ProfileClient'

export const metadata: Metadata = {
  title: 'My Profile | VidyaSetu',
  description: 'Manage your VidyaSetu account settings and preferences.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/profile')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const [
    { count: totalDownloads },
    { count: totalBookmarks },
    { count: quizzesTaken },
    { count: totalContributions },
    { count: approvedContributions },
  ] = await Promise.all([
    supabase.from('downloads_log').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('results').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('content').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id),
    supabase.from('content').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id).eq('status', 'approved'),
  ])

  return (
    <ProfileClient
      user={user}
      profile={profile}
      stats={{
        downloads: totalDownloads ?? 0,
        bookmarks: totalBookmarks ?? 0,
        quizzes: quizzesTaken ?? 0,
        contributions: totalContributions ?? 0,
        approvedContributions: approvedContributions ?? 0,
      }}
    />
  )
}
