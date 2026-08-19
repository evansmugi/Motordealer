import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://fktasrpefkesugzalwyg.supabase.co'
const SUPABASE_ANON_KEY = (import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) || 'sb_publishable_rw7H4zn8FQwN2vXYfbfA0g_b_fBwAPl'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export default supabase