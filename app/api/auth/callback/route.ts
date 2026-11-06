import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const returnUrl = url.searchParams.get('returnUrl') ?? '/dashboard'

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const siteOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Ensure user profile row exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          full_name: user.user_metadata.full_name ?? user.user_metadata.name ?? '',
          email: user.email!,
          auth_provider: user.app_metadata.provider ?? 'email',
          role: 'student',
          avatar_url: user.user_metadata.avatar_url ?? null,
        }, { onConflict: 'id', ignoreDuplicates: true })
      }
      return NextResponse.redirect(`${siteOrigin}${returnUrl}`)
    }
  }

  return NextResponse.redirect(`${siteOrigin}/login?error=auth_error`)
}
