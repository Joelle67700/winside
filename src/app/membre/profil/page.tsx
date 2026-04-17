import { createSupabaseClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/member/ProfileForm'

export default async function MemberProfilePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mon profil
      </h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
