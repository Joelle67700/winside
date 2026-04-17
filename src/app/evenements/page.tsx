import { createSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const supabase = await createSupabaseClient()

  const { data: events, error } = await supabase
    .from('evenements')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Nos événements
      </h1>

      {error ? (
        <div className="text-red-600">
          Erreur lors du chargement des événements.
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <a
              key={event.id}
              href={`/evenements/${event.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.titre}
                </h2>
                <div className="text-gray-600 mb-2">
                  <div className="flex items-center mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.lieu}
                  </div>
                </div>
                <p className="text-gray-500 line-clamp-3 mb-4">
                  {event.desc}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-medium">
                    Voir détails
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucun événement à venir pour le moment.</p>
        </div>
      )}
    </div>
  )
}
