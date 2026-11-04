import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContributorDashboardClient } from './ContributorDashboardClient'

export default async function ContributePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/contribute')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  // Stats
  const [
    { count: totalContribs },
    { count: pendingCount },
    { data: submissions },
    { data: topContributors },
    { data: subjects },
    { count: approvedCount },
    { count: rejectedCount },
  ] = await Promise.all([
    supabase.from('content').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('contributor_id', user.id).eq('status', 'under_review'),
    supabase.from('submissions')
      .select('*, content(title, type, created_at, subjects(name, faculties_or_streams(name)))')
      .eq('contributor_id', user.id)
      .order('reviewed_at', { ascending: false })
      .limit(10),
    supabase.from('users')
      .select('id, full_name, avatar_url')
      .eq('role', 'contributor')
      .limit(5),
    supabase.from('subjects').select('id, name, faculty_id').order('name').limit(50),
    supabase.from('content').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id).eq('status', 'approved'),
    supabase.from('content').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id).eq('status', 'rejected'),
  ])

  // Download totals for this contributor
  const { data: dlData } = await supabase
    .from('downloads_log')
    .select('content!inner(uploaded_by)')
    .eq('content.uploaded_by', user.id)

  const totalDownloads = dlData?.length ?? 0

  return (
    <ContributorDashboardClient
      profile={profile}
      totalContribs={totalContribs ?? 0}
      pendingCount={pendingCount ?? 0}
      approvedCount={approvedCount ?? 0}
      rejectedCount={rejectedCount ?? 0}
      totalDownloads={totalDownloads}
      submissions={submissions ?? []}
      topContributors={topContributors ?? []}
      subjects={subjects ?? []}
      userId={user.id}
    />
  )
}
