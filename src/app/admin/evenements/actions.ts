'use server'

import { createSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteEvent(formData: FormData) {
  const supabase = await createSupabaseClient()
  const eventId = formData.get('eventId') as string

  await supabase.from('events').delete().eq('id', eventId)
  redirect('/admin/evenements')
}
