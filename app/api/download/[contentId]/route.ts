import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ contentId: string }> }
) {
  const { contentId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get content
  const { data: content, error } = await supabase
    .from('content')
    .select('file_url, drive_url, downloads')
    .eq('id', contentId)
    .eq('status', 'approved')
    .single()

  if (error || !content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  // Log download
  if (user) {
    await supabase.from('downloads_log').insert({ user_id: user.id, content_id: contentId })
  }

  // Increment downloads counter
  await supabase.from('content').update({ downloads: (content.downloads ?? 0) + 1 }).eq('id', contentId)

  return NextResponse.json({ url: content.file_url ?? content.drive_url })
}
