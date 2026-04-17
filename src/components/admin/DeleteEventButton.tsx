'use client'

import { useState } from 'react'

interface DeleteEventButtonProps {
  eventId?: string
}

export default function DeleteEventButton(props: DeleteEventButtonProps) {
  // eventId could be used for actual deletion in production
  void props.eventId
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    // Simulate API call - in production use server actions
    await new Promise(resolve => setTimeout(resolve, 500))

    setLoading(false)
    setShowConfirm(false)
    window.location.reload()
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Confirmer'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-900"
    >
      Supprimer
    </button>
  )
}
