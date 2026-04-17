import { requireAdmin } from '@/lib/auth'
import { createSupabaseClient } from '@/lib/supabase/server'
import ExportCSVButton from '@/components/admin/ExportCSVButton'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage() {
  await requireAdmin()
  const supabase = await createSupabaseClient()

  const { data: members } = await supabase
    .from('users')
    .select(`
      *,
      inscriptions (
        id,
        evenements (titre)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des membres
        </h1>
        <ExportCSVButton members={members || []} />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom complet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscriptions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membre depuis
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members && members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {member.role === 'admin' ? 'Admin' : 'Membre'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.inscriptions?.length || 0} événement(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                   Aucun membre trouvé
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
