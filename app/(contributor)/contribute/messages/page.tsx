import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessagesPageClient } from './MessagesPageClient'

export const metadata = {
  title: 'Messages | VidyaSetu',
  description: 'Moderator feedback and community messages for contributors.',
}

export default async function ContributeMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/contribute/messages')

  // Pull reviewer feedback from the user's submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, content(title, type, status), users!submissions_reviewed_by_fkey(full_name, avatar_url)')
    .eq('contributor_id', user.id)
    .not('reviewed_at', 'is', null)
    .order('reviewed_at', { ascending: false })
    .limit(50)

  return (
    <MessagesPageClient
      submissions={submissions ?? []}
    />
  )
}