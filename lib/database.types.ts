export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string
          wallet_address: string | null
          subscription_status: 'free' | 'premium'
          preferred_language: 'en' | 'es'
          saved_state_laws: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          wallet_address?: string | null
          subscription_status?: 'free' | 'premium'
          preferred_language?: 'en' | 'es'
          saved_state_laws?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          wallet_address?: string | null
          subscription_status?: 'free' | 'premium'
          preferred_language?: 'en' | 'es'
          saved_state_laws?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      encounters: {
        Row: {
          encounter_id: string
          user_id: string
          timestamp: string
          location: Json
          recording_url: string | null
          summary: string | null
          alert_sent: boolean
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          encounter_id: string
          user_id: string
          timestamp: string
          location: Json
          recording_url?: string | null
          summary?: string | null
          alert_sent?: boolean
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          encounter_id?: string
          user_id?: string
          timestamp?: string
          location?: Json
          recording_url?: string | null
          summary?: string | null
          alert_sent?: boolean
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "encounters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      legal_guides: {
        Row: {
          guide_id: string
          title: string
          content: string
          state: string
          language: 'en' | 'es'
          type: 'basic' | 'traffic' | 'search' | 'arrest'
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          guide_id: string
          title: string
          content: string
          state: string
          language?: 'en' | 'es'
          type: 'basic' | 'traffic' | 'search' | 'arrest'
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          guide_id?: string
          title?: string
          content?: string
          state?: string
          language?: 'en' | 'es'
          type?: 'basic' | 'traffic' | 'search' | 'arrest'
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      alert_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          email: string | null
          relationship: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          name: string
          phone?: string | null
          email?: string | null
          relationship: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          relationship?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          price_id: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          price_id: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          status?: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          price_id?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_status: 'free' | 'premium'
      language: 'en' | 'es'
      guide_type: 'basic' | 'traffic' | 'search' | 'arrest'
      subscription_stripe_status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
