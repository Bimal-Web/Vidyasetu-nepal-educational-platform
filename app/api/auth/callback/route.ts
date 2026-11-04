import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const returnUrl = searchParams.get('returnUrl') ?? '/dashboard'

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
      return NextResponse.redirect(`${origin}${returnUrl}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
