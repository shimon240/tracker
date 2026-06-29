import { createClient } from '@supabase/supabase-js'
import type { Application } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DbApplication = Omit<Application, 'date_applied'> & {
  date_applied: string
}
