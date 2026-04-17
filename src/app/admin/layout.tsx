import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <div className="flex space-x-4">
          <Link
            href="/admin"
            className="px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/evenements"
            className="px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Événements
          </Link>
          <Link
            href="/admin/membres"
            className="px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Membres
          </Link>
          <Link
            href="/admin/inscriptions"
            className="px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            Inscriptions
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
