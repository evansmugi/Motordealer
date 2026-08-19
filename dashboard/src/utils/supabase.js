import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fktasrpefkesugzalwyg.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rw7H4zn8FQwN2vXYfbfA0g_b_fBwAPl'

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
