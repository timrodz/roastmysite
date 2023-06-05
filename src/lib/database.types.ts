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
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          twitter_profile: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          twitter_profile?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          twitter_profile?: string | null
          updated_at?: string | null
          username?: string | null
        }
      }
      roast: {
        Row: {
          content: string
          created_at: string
          id: number
          site_id: number
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          site_id: number
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          site_id?: number
          user_id?: string | null
        }
      }
      site: {
        Row: {
          created_at: string
          id: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          url: string
        }
        Update: {
          created_at?: string
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
