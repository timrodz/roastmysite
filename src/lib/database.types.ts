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
          id: string
          membership_status:
            | Database["public"]["Enums"]["membership_status"]
            | null
          twitter_profile: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          membership_status?:
            | Database["public"]["Enums"]["membership_status"]
            | null
          twitter_profile?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          membership_status?:
            | Database["public"]["Enums"]["membership_status"]
            | null
          twitter_profile?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "roasts_site_id_fkey"
            columns: ["site_id"]
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roasts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      websites: {
        Row: {
          created_at: string
          id: number
          owner_id: string | null
          url: string
          roast_count: unknown | null
        }
        Insert: {
          created_at?: string
          id?: number
          owner_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          owner_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_roasts_for_website: {
        Args: {
          url: string
        }
        Returns: {
          site_id: number
          site_url: string
          site_owner_id: string
          roast_id: number
          roast_created_at: string
          roast_author_id: string
          roast_content: string
          author_username: string
          author_twitter_profile: string
          author_membership_status: string
        }[]
      }
      roast_count: {
        Args: {
          "": unknown
        }
        Returns: number
      }
    }
    Enums: {
      membership_status: "subscribed" | "lifetime"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
