export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roast: {
        Row: {
          content: string
          created_at: string | null
          id: number
          site_id: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          site_id: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          site_id?: number
        }
      }
      site: {
        Row: {
          created_at: string | null
          id: number
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          url: string
        }
        Update: {
          created_at?: string | null
          id?: number
          url?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
