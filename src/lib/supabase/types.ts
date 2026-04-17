import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'member' | 'admin'
          created_at: string
          inscriptions?: {
            id: string
            evenement_id: string
            created_at: string
            evenements?: {
              id: string
              titre: string
              date: string
              lieu: string
              desc: string | null
            } | null
          }[] | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'member' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'member' | 'admin'
          created_at?: string
        }
      }
      evenements: {
        Row: {
          id: string
          titre: string
          date: string
          lieu: string
          desc: string | null
          created_at: string
          updated_at: string
          inscriptions?: {
            id: string
            user_id: string
            created_at: string
            users?: {
              id: string
              email: string
              name: string | null
              role: string
            } | null
          }[] | null
        }
        Insert: {
          id?: string
          titre: string
          date: string
          lieu: string
          desc?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titre?: string
          date?: string
          lieu?: string
          desc?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inscriptions: {
        Row: {
          id: string
          user_id: string
          evenement_id: string
          created_at: string
          users?: {
            id: string
            email: string
            name: string | null
            role: string
            created_at: string
          } | null
          evenements?: {
            id: string
            titre: string
            date: string
            lieu: string
            desc: string | null
          } | null
        }
        Insert: {
          id?: string
          user_id: string
          evenement_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          evenement_id?: string
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
       user_role: 'member' | 'admin'
     }
   }
 }

 export const supabaseAdmin = createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 )
