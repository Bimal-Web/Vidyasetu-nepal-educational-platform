import type { SupabaseClient } from '@supabase/supabase-js'

export const SUPABASE_URL: string
export const SUPABASE_PUBLIC_KEY: string
export const supabase: SupabaseClient & {
  auth: SupabaseClient['auth']
  from: SupabaseClient['from']
}
export default supabase
