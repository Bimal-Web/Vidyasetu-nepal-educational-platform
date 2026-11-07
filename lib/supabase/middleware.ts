import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isDemoMode, DEMO_SESSION_COOKIE } from './demo-db'
import { getUserById } from './demo-db'
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from './connect'

export async function updateSession(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/contribute', '/admin', '/quiz/', '/mcq', '/bookmarks']
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

  // ── Demo mode: no real Supabase, use the vs-demo-user cookie ──
  if (isDemoMode()) {
    const demoUser = getUserById(request.cookies.get(DEMO_SESSION_COOKIE)?.value)

    if (isProtected && !demoUser) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (demoUser && demoUser.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL).replace(/\/rest\/v1\/?$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC_KEY

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write any logic between createServerClient and auth.getUser()
  const { data: { user } } = await supabase.auth.getUser()

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return supabaseResponse
}
