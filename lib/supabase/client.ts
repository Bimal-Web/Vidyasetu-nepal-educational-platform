import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isDemoMode } from './demo-db'
import { createDemoBrowserClient } from './demo-client'
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from './connect'

import { getAuthCookieOptions } from './cookie-options'

export function createClient(): SupabaseClient {
  if (isDemoMode()) {
    return createDemoBrowserClient() as unknown as SupabaseClient
  }
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL).replace(/\/rest\/v1\/?$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC_KEY

  return createBrowserClient(url, key, {
    cookieOptions: getAuthCookieOptions(),
  })
}