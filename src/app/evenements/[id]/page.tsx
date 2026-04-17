import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/server'
import RegisterButton from '@/components/events/RegisterButton'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createSupabaseClient()

  const { data: event, error } = await supabase
    .from('evenements')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Get registration count
  const { count: registrationCount } = await supabase
    .from('inscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('evenement_id', id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/evenements"
        className="text-indigo-600 hover:text-indigo-700 mb-6 inline-block"
      >
        ← Retour aux événements
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {event.titre}
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Lieu</p>
                    <p className="text-sm">{event.lieu}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Inscriptions</p>
                    <p className="text-sm">
                      {registrationCount || 0} inscrits
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.desc}
                </p>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">
                  Réserver votre place
                </h3>

                <RegisterButton eventId={event.id} />

                <div className="mt-6 text-sm text-gray-500">
                  <p>
                    <strong>Note:</strong> Cette réservation est nominative et
                    non transférable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
