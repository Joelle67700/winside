import { createSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import StatsCards from '@/components/admin/StatsCards'
import RecentRegistrations from '@/components/admin/RecentRegistrations'

export default async function AdminDashboard() {
  await requireAdmin()
  const supabase = await createSupabaseClient()

  // Fetch stats
  const { count: totalEvents } = await supabase
    .from('evenements')
    .select('*', { count: 'exact', head: true })

  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: totalRegistrations } = await supabase
    .from('inscriptions')
    .select('*', { count: 'exact', head: true })

  // Get upcoming events count
  const { count: upcomingEvents } = await supabase
    .from('evenements')
    .select('*', { count: 'exact', head: true })
    .gte('date', new Date().toISOString())

  // Get recent registrations
  const { data: recentRegistrations } = await supabase
    .from('inscriptions')
    .select(`
      *,
      users (name),
      evenements (titre, date)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard Admin
      </h1>

      <StatsCards
        stats={{
          totalEvents: totalEvents || 0,
          totalMembers: totalMembers || 0,
          totalRegistrations: totalRegistrations || 0,
          upcomingEvents: upcomingEvents || 0,
        }}
      />

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Inscriptions récentes
            </h2>
            <a
              href="/admin/inscriptions"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Voir tout
            </a>
          </div>
          <RecentRegistrations registrations={recentRegistrations || []} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Actions rapides
            </h2>
          </div>
          <div className="space-y-3">
            <a
              href="/admin/evenements"
              className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">
                Gérer les événements
              </div>
              <div className="text-sm text-gray-500">
                Créer, modifier ou supprimer des événements
              </div>
            </a>
            <a
              href="/admin/membres"
              className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">
                Gérer les membres
              </div>
              <div className="text-sm text-gray-500">
                Voir la liste des membres et exporter les données
              </div>
            </a>
            <a
              href="/admin/inscriptions"
              className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">
                Voir les inscriptions
              </div>
              <div className="text-sm text-gray-500">
                Consulter toutes les inscriptions aux événements
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
