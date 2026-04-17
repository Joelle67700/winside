import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createSupabaseClient()

  // Get upcoming events for homepage
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(3)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenue à Winside
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            L&apos;association culturelle qui vibre au rythme de l&apos;art
          </p>
          <Link
            href="/evenements"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Découvrir nos événements
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Notre mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Winside est une association culturelle passionnée qui organise des
              événements artistiques, des ateliers créatifs et des rencontres
              culturelles pour promouvoir l&apos;accès à l&apos;art pour tous.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Prochains événements
            </h2>
            <Link
              href="/evenements"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Voir tout
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/evenements/${event.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.titre}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-500 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.lieu}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">Aucun événement à venir pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez notre communauté
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Devenez membre et participez à nos événements exclusifs
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}
