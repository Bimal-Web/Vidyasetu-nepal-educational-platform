import { createClient } from '@/lib/supabase/client'
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@/lib/supabase/connect'

export { SUPABASE_URL, SUPABASE_PUBLIC_KEY }

let clientInstance = null

function getClient() {
  if (typeof window === 'undefined') {
    return createClient()
  }
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}

export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = getClient()
    const val = client[prop]
    if (typeof val === 'function') {
      return val.bind(client)
    }
    return val
  }
})

export default supabase
