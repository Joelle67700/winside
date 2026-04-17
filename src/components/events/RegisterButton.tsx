'use client'

import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface RegisterButtonProps {
  eventId: string
}

export default function RegisterButton({ eventId }: RegisterButtonProps) {
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Vous devez être connecté pour vous inscrire')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('inscriptions').insert({
      user_id: user.id,
      evenement_id: eventId,
    })

    if (error) {
      if (error.code === '23505') {
        setError('Vous êtes déjà inscrit à cet événement')
      } else {
        setError('Erreur lors de l\'inscription')
      }
    } else {
      setRegistered(true)
      router.refresh()
    }

    setLoading(false)
  }

  if (registered) {
    return (
      <div className="bg-green-100 text-green-700 p-4 rounded-md">
        Inscription confirmée !
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>

      {error && (
        <div className="mt-3 text-red-600 text-sm text-center">{error}</div>
      )}
    </div>
  )
}
