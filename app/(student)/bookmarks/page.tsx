import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { BookmarksClient } from './BookmarksClient'

export const metadata: Metadata = {
  title: 'My Bookmarks | VidyaSetu',
  description: 'Access all the resources and subjects you have saved on VidyaSetu.',
}

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnUrl=/bookmarks')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, content(title, type, file_url, subjects(name)), subjects(name, icon_key, color_key)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <BookmarksClient bookmarks={bookmarks ?? []} />
}