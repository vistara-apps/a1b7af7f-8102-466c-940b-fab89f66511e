import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database helper functions
export const dbHelpers = {
  // User operations
  async createUser(user: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Encounter operations
  async createEncounter(encounter: Database['public']['Tables']['encounters']['Insert']) {
    const { data, error } = await supabase
      .from('encounters')
      .insert(encounter)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getEncounters(userId: string) {
    const { data, error } = await supabase
      .from('encounters')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateEncounter(encounterId: string, updates: Database['public']['Tables']['encounters']['Update']) {
    const { data, error } = await supabase
      .from('encounters')
      .update(updates)
      .eq('encounter_id', encounterId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Legal guide operations
  async getLegalGuides(state?: string, language?: string) {
    let query = supabase
      .from('legal_guides')
      .select('*');
    
    if (state) {
      query = query.eq('state', state);
    }
    
    if (language) {
      query = query.eq('language', language);
    }
    
    const { data, error } = await query.order('title');
    
    if (error) throw error;
    return data;
  },

  async createLegalGuide(guide: Database['public']['Tables']['legal_guides']['Insert']) {
    const { data, error } = await supabase
      .from('legal_guides')
      .insert(guide)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Alert contact operations
  async getAlertContacts(userId: string) {
    const { data, error } = await supabase
      .from('alert_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createAlertContact(contact: Database['public']['Tables']['alert_contacts']['Insert']) {
    const { data, error } = await supabase
      .from('alert_contacts')
      .insert(contact)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAlertContact(contactId: string, updates: Database['public']['Tables']['alert_contacts']['Update']) {
    const { data, error } = await supabase
      .from('alert_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAlertContact(contactId: string) {
    const { error } = await supabase
      .from('alert_contacts')
      .delete()
      .eq('id', contactId);
    
    if (error) throw error;
  }
};
