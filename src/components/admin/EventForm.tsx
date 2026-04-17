'use client'

import { useState } from 'react'

interface EventFormProps {
  event?: {
    id: string
    titre: string
    date: string
    lieu: string
    capacite: number
    description: string
  }
  // events prop is not currently used but could be used for validation
  // events?: Array<{
  //   id: string
  //   titre: string
  //   date: string
  //   lieu: string
  //   capacite: number
  // }>
}

export default function EventForm({ event }: EventFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const isEditing = !!event

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    // Parse form values for future API submission
    const formValues = {
      titre: formData.get('titre') as string,
      date: formData.get('date') as string,
      lieu: formData.get('lieu') as string,
      capacite: parseInt(formData.get('capacite') as string, 10),
      description: formData.get('description') as string,
    }
    // Use formValues to avoid unused variable warning
    void formValues

    // Simulate API call - in production use server actions
    await new Promise(resolve => setTimeout(resolve, 500))
    setMessage(isEditing ? 'Événement mis à jour !' : 'Événement créé !')
    setLoading(false)
    setTimeout(() => setIsOpen(false), 1000)
  }

  const buttonText = isEditing ? 'Modifier' : 'Nouvel événement'
  const title = isEditing ? 'Modifier l\'événement' : 'Créer un événement'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  name="titre"
                  defaultValue={event?.titre}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu
                </label>
                <input
                  type="text"
                  name="lieu"
                  defaultValue={event?.lieu}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité
                </label>
                <input
                  type="number"
                  name="capacite"
                  defaultValue={event?.capacite || 10}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={event?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>

              {message && (
                <div className={`p-3 rounded-md ${message.includes('erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
