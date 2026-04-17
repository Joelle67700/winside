'use client'

import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
    // supabase is a stable constant, safe to include
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Winside</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Accueil
              </Link>
              <Link
                href="/evenements"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Événements
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/membre/profil"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Mon profil
                </Link>
                {user.user_metadata?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-900"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
