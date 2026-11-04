import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UploadPageClient } from './UploadPageClient'

export const metadata = {
  title: 'Upload Content | VidyaSetu',
  description: 'Share notes, past papers, and MCQ sets with Nepal\'s student community.',
}

export default async function ContributeUploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/contribute/upload')

  const { data: subjects } = await supabase.from('subjects').select('id, name').order('name').limit(100)

  return <UploadPageClient subjects={subjects ?? []} userId={user.id} />
}