import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase environment variables in Vite frontend')
}

export const supabase = createClient(
  SUPABASE_URL || 'https://fktasrpefkesugzalwyg.supabase.co',
  SUPABASE_ANON_KEY || 'sb_publishable_rw7H4zn8FQwN2vXYfbfA0g_b_fBwAPl'
)

export default supabase
