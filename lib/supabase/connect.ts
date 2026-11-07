import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://faxixhokyiouwrgekpek.supabase.co"
export const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGl4aG9reWlvdXdyZ2VrcGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNDg1MjIsImV4cCI6MjEwMjgyNDUyMn0.KsHst2V4E7Xqd1iawYNc63ejJCnMfuVlbqQGi2izOTI"

const normalizedUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '')

export const supabase = createClient(normalizedUrl, SUPABASE_PUBLIC_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export default supabase
