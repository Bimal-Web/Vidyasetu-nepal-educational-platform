import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { isDemoMode } from './demo-db'
import { createDemoServerClient } from './demo-client'
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from './connect'

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()

  if (isDemoMode()) {
    return createDemoServerClient(name => cookieStore.get(name)?.value) as unknown as SupabaseClient
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL).replace(/\/rest\/v1\/?$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC_KEY

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

export async function createRealServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL).replace(/\/rest\/v1\/?$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC_KEY

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server component setAll fallback
        }
      },
    },
  })
}