import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isDemoMode } from './demo-db'
import { createDemoBrowserClient } from './demo-client'

export function createClient(): SupabaseClient {
  if (isDemoMode()) {
    return createDemoBrowserClient() as unknown as SupabaseClient
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}