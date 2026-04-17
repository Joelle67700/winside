import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nom: string
          prenom: string
          role: 'member' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          prenom: string
          role?: 'member' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          prenom?: string
          role?: 'member' | 'admin'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          titre: string
          date: string
          lieu: string
          capacite: number
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titre: string
          date: string
          lieu: string
          capacite: number
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titre?: string
          date?: string
          lieu?: string
          capacite?: number
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      member_role: 'member' | 'admin'
    }
  }
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
