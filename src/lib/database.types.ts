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
          lifetime_deal: boolean
          twitter_profile: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          lifetime_deal?: boolean
          twitter_profile?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          lifetime_deal?: boolean
          twitter_profile?: string | null
          updated_at?: string | null
          username?: string | null
        }
      }
      roasts: {
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
      websites: {
        Row: {
          created_at: string
          id: number
          url: string
          roast_count: unknown | null
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
      roast_count:
        | {
            Args: Record<PropertyKey, never>
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
