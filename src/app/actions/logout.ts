'use server'

import { createSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}
