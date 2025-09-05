-- KnowYourRightsCard Database Schema
-- This file contains the complete database schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE,
    subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
    saved_state_laws TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Encounters table
CREATE TABLE IF NOT EXISTS encounters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    location JSONB NOT NULL,
    recording_url TEXT,
    summary TEXT,
    alert_sent BOOLEAN DEFAULT FALSE,
    duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal guides table
CREATE TABLE IF NOT EXISTS legal_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    state TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es')),
    type TEXT NOT NULL CHECK (type IN ('basic', 'traffic', 'search', 'arrest')),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert contacts table
CREATE TABLE IF NOT EXISTS alert_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT contact_has_phone_or_email CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- Alert logs table (for tracking sent alerts)
CREATE TABLE IF NOT EXISTS alert_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    contact_id UUID NOT NULL REFERENCES alert_contacts(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('sms', 'email', 'push')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'delivered')),
    message TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription events table (for tracking Stripe events)
CREATE TABLE IF NOT EXISTS subscription_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    subscription_id TEXT,
    customer_id TEXT,
    status TEXT,
    metadata JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

CREATE INDEX IF NOT EXISTS idx_encounters_user_id ON encounters(user_id);
CREATE INDEX IF NOT EXISTS idx_encounters_timestamp ON encounters(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_encounters_location ON encounters USING GIN(location);

CREATE INDEX IF NOT EXISTS idx_legal_guides_state ON legal_guides(state);
CREATE INDEX IF NOT EXISTS idx_legal_guides_language ON legal_guides(language);
CREATE INDEX IF NOT EXISTS idx_legal_guides_type ON legal_guides(type);
CREATE INDEX IF NOT EXISTS idx_legal_guides_is_premium ON legal_guides(is_premium);

CREATE INDEX IF NOT EXISTS idx_alert_contacts_user_id ON alert_contacts(user_id);

CREATE INDEX IF NOT EXISTS idx_alert_logs_user_id ON alert_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_encounter_id ON alert_logs(encounter_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_created_at ON alert_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_subscription_events_stripe_event_id ON subscription_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_encounters_updated_at BEFORE UPDATE ON encounters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_guides_updated_at BEFORE UPDATE ON legal_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_contacts_updated_at BEFORE UPDATE ON alert_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid()::uuid);

-- Encounters policies
CREATE POLICY "Users can view own encounters" ON encounters
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own encounters" ON encounters
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own encounters" ON encounters
    FOR UPDATE USING (user_id = auth.uid()::uuid);

-- Alert contacts policies
CREATE POLICY "Users can view own contacts" ON alert_contacts
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own contacts" ON alert_contacts
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own contacts" ON alert_contacts
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own contacts" ON alert_contacts
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Alert logs policies
CREATE POLICY "Users can view own alert logs" ON alert_logs
    FOR SELECT USING (user_id = auth.uid()::uuid);

-- Legal guides are public (no RLS needed)
-- Subscription events are admin-only (no public access)

-- Insert sample legal guides data
INSERT INTO legal_guides (title, content, state, language, type, is_premium) VALUES
-- California guides
('Traffic Stop Rights - California', 
'During a traffic stop in California, you have the right to remain silent beyond providing your driver''s license, vehicle registration, and proof of insurance. You can refuse consent to search your vehicle unless the officer has probable cause or a warrant. Keep your hands visible and avoid sudden movements. You are not required to answer questions about where you''re going or coming from.', 
'CA', 'en', 'traffic', false),

('Search and Seizure Protection - California', 
'The Fourth Amendment protects you from unreasonable searches and seizures. In California, police need a warrant, probable cause, or your consent to search your property. You have the right to refuse consent to a search. If police claim to have a warrant, ask to see it. During a pat-down, officers can only search for weapons unless they feel something that could reasonably be contraband.', 
'CA', 'en', 'search', true),

('Arrest Procedures - California', 
'If you are arrested in California, you have the right to remain silent and the right to an attorney. Invoke these rights clearly by saying "I am invoking my right to remain silent and I want a lawyer." Do not answer questions without an attorney present. You have the right to a phone call. If you cannot afford an attorney, one will be appointed for you.', 
'CA', 'en', 'arrest', true),

-- Texas guides
('Traffic Stop Rights - Texas', 
'During a traffic stop in Texas, provide your driver''s license, registration, and insurance when requested. You have the right to remain silent beyond providing identification. You can refuse consent to search your vehicle. If you''re a passenger, you generally have the right to leave unless you''re being detained. Keep your hands visible and follow lawful orders.', 
'TX', 'en', 'traffic', false),

('Search and Seizure Protection - Texas', 
'Texas follows federal Fourth Amendment protections. Police need a warrant, probable cause, or consent to search. You can refuse consent to searches. In Texas, police can conduct a protective frisk if they have reasonable suspicion you''re armed and dangerous. Vehicle searches require probable cause or consent unless incident to arrest.', 
'TX', 'en', 'search', true),

-- New York guides
('Traffic Stop Rights - New York', 
'In New York, during a traffic stop, you must provide license, registration, and insurance. You have the right to remain silent. You can refuse consent to search your vehicle. If you''re stopped while walking, you have the right to ask if you''re free to leave. Police need reasonable suspicion to detain you for questioning.', 
'NY', 'en', 'traffic', false),

('Stop and Frisk - New York', 
'In New York, police can stop and question you if they have reasonable suspicion of criminal activity. They can frisk you for weapons if they reasonably believe you''re armed and dangerous. You have the right to ask "Am I free to leave?" If yes, you can walk away. You have the right to remain silent during the encounter.', 
'NY', 'en', 'search', true),

-- Spanish translations for California
('Derechos en Paradas de Tráfico - California', 
'Durante una parada de tráfico en California, tienes derecho a permanecer en silencio más allá de proporcionar tu licencia de conducir, registro del vehículo y prueba de seguro. Puedes negarte al consentimiento para registrar tu vehículo a menos que el oficial tenga causa probable o una orden judicial. Mantén las manos visibles y evita movimientos bruscos.', 
'CA', 'es', 'traffic', false),

('Protección contra Registro e Incautación - California', 
'La Cuarta Enmienda te protege de registros e incautaciones irrazonables. En California, la policía necesita una orden judicial, causa probable o tu consentimiento para registrar tu propiedad. Tienes derecho a negar el consentimiento a un registro. Si la policía dice tener una orden, pide verla.', 
'CA', 'es', 'search', true)

ON CONFLICT DO NOTHING;

-- Create a function to get state-specific information
CREATE OR REPLACE FUNCTION get_state_info(state_code TEXT)
RETURNS JSONB AS $$
DECLARE
    state_info JSONB;
BEGIN
    CASE state_code
        WHEN 'CA' THEN
            state_info := jsonb_build_object(
                'name', 'California',
                'recordingLaws', 'One-party consent state - you can record conversations you are part of',
                'policeRecordingRights', 'You have the right to record police in public spaces',
                'stopAndFrisk', 'Police need reasonable suspicion of criminal activity',
                'searchRights', 'Police need a warrant, probable cause, or consent to search',
                'emergencyNumber', '911',
                'civilRightsHotline', '1-800-884-1684'
            );
        WHEN 'TX' THEN
            state_info := jsonb_build_object(
                'name', 'Texas',
                'recordingLaws', 'One-party consent state - you can record conversations you are part of',
                'policeRecordingRights', 'You have the right to record police in public spaces',
                'stopAndFrisk', 'Police need reasonable suspicion of criminal activity',
                'searchRights', 'Police need a warrant, probable cause, or consent to search',
                'emergencyNumber', '911',
                'civilRightsHotline', '1-800-884-1684'
            );
        WHEN 'NY' THEN
            state_info := jsonb_build_object(
                'name', 'New York',
                'recordingLaws', 'One-party consent state - you can record conversations you are part of',
                'policeRecordingRights', 'You have the right to record police in public spaces',
                'stopAndFrisk', 'Police can stop and frisk with reasonable suspicion',
                'searchRights', 'Police need a warrant, probable cause, or consent to search',
                'emergencyNumber', '911',
                'civilRightsHotline', '1-800-884-1684'
            );
        ELSE
            state_info := jsonb_build_object(
                'name', state_code,
                'recordingLaws', 'Check your local laws regarding recording',
                'policeRecordingRights', 'Generally allowed in public spaces',
                'stopAndFrisk', 'Varies by jurisdiction',
                'searchRights', 'Fourth Amendment protections apply',
                'emergencyNumber', '911',
                'civilRightsHotline', '1-800-884-1684'
            );
    END CASE;
    
    RETURN state_info;
END;
$$ LANGUAGE plpgsql;
