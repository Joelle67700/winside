'use client'

interface RecentRegistrationsProps {
  registrations: Array<{
    id: string
    profiles: { nom: string; prenom: string } | null
    events: { titre: string; date: string } | null
    created_at: string
  }>
}

export default function RecentRegistrations({ registrations }: RecentRegistrationsProps) {
  if (registrations.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        Aucune inscription récente
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {registrations.map((registration) => (
        <div
          key={registration.id}
          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">
              {registration.profiles?.prenom} {registration.profiles?.nom}
            </p>
            <p className="text-xs text-gray-500">
              {registration.events?.titre}
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(registration.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>
      ))}
    </div>
  )
}
