import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsPageClient } from './SettingsPageClient'

export const metadata = {
  title: 'Settings | VidyaSetu',
  description: 'Manage your contributor profile and preferences.',
}

export default async function ContributeSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/contribute/settings')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  return <SettingsPageClient profile={profile} email={user.email ?? ''} />
}