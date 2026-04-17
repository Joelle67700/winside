'use client'

// This provider is no longer needed with the current Supabase setup
// Client components can use supabase client directly

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
