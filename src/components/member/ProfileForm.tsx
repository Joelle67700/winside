'use client'

import { useState } from 'react'

interface ProfileFormProps {
  profile: {
    nom: string
    prenom: string
    role: string
    created_at: string
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    nom: profile.nom,
    prenom: profile.prenom,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // In production, this would call an API endpoint
    // For now we'll use Supabase directly
    // This is a client-side example - in production you should use server actions
    setMessage('Fonctionnalité de mise à jour du profil en cours de développement')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="nom"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nom
        </label>
        <input
          type="text"
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="prenom"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Prénom
        </label>
        <input
          type="text"
          id="prenom"
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rôle
        </label>
        <p className="text-gray-500 capitalize">{profile.role}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Membre depuis
        </label>
        <p className="text-gray-500">
          {new Date(profile.created_at).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : 'Mettre à jour'}
      </button>

      {message && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-md">
          {message}
        </div>
      )}
    </form>
  )
}
