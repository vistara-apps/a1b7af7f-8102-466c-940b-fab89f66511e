import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string | null;
          subscription_status: 'free' | 'premium';
          preferred_language: 'en' | 'es';
          saved_state_laws: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address?: string | null;
          subscription_status?: 'free' | 'premium';
          preferred_language?: 'en' | 'es';
          saved_state_laws?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string | null;
          subscription_status?: 'free' | 'premium';
          preferred_language?: 'en' | 'es';
          saved_state_laws?: string[];
          updated_at?: string;
        };
      };
      encounters: {
        Row: {
          id: string;
          user_id: string;
          timestamp: string;
          location: {
            latitude: number;
            longitude: number;
            state?: string;
            city?: string;
          };
          recording_url: string | null;
          summary: string | null;
          alert_sent: boolean;
          duration: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timestamp: string;
          location: {
            latitude: number;
            longitude: number;
            state?: string;
            city?: string;
          };
          recording_url?: string | null;
          summary?: string | null;
          alert_sent?: boolean;
          duration?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timestamp?: string;
          location?: {
            latitude: number;
            longitude: number;
            state?: string;
            city?: string;
          };
          recording_url?: string | null;
          summary?: string | null;
          alert_sent?: boolean;
          duration?: number | null;
          updated_at?: string;
        };
      };
      legal_guides: {
        Row: {
          id: string;
          title: string;
          content: string;
          state: string;
          language: 'en' | 'es';
          type: 'basic' | 'traffic' | 'search' | 'arrest';
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          state: string;
          language?: 'en' | 'es';
          type: 'basic' | 'traffic' | 'search' | 'arrest';
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          state?: string;
          language?: 'en' | 'es';
          type?: 'basic' | 'traffic' | 'search' | 'arrest';
          is_premium?: boolean;
          updated_at?: string;
        };
      };
      alert_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          relationship: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          relationship: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          relationship?: string;
          updated_at?: string;
        };
      };
    };
  };
}
