import { requireAdmin } from '@/lib/auth'
import { createSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminRegistrationsPage() {
  await requireAdmin()
  const supabase = await createSupabaseClient()

  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      profiles (nom, prenom),
      events (titre, date, lieu)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Toutes les inscriptions
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date inscription
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations && registrations.length > 0 ? (
              registrations.map((registration) => (
                <tr key={registration.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {registration.profiles?.prenom} {registration.profiles?.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.events?.titre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.events?.date
                      ? new Date(registration.events.date).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Aucune inscription trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
