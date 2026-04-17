'use client'

import { useState } from 'react'

interface Member {
  id: string
  nom: string
  prenom: string
  role: string
  created_at: string
  registrations?: Array<{
    id: string
    events: { titre: string } | null
  }>
}

interface ExportCSVButtonProps {
  members: Member[]
}

export default function ExportCSVButton({ members }: ExportCSVButtonProps) {
  const [loading, setLoading] = useState(false)

  const generateCSV = () => {
    setLoading(true)
    const headers = ['Nom', 'Prénom', 'Rôle', 'Email', 'Membre depuis', 'Événements inscrits']
    const rows = members.map((member) => [
      member.nom,
      member.prenom,
      member.role === 'admin' ? 'Admin' : 'Membre',
      `${member.id}@winside-asso.fr`, // Placeholder email since we don't have it
      new Date(member.created_at).toLocaleDateString('fr-FR'),
      member.registrations?.map(r => r.events?.titre).join('; ') || 'Aucun',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `membres-winside-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={generateCSV}
      disabled={loading || members.length === 0}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Génération...' : 'Exporter CSV'}
    </button>
  )
}
