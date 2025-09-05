-- KnowYourRightsCard Database Schema for Supabase
-- This file contains the complete database schema for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('free', 'premium');
CREATE TYPE language AS ENUM ('en', 'es');
CREATE TYPE guide_type AS ENUM ('basic', 'traffic', 'search', 'arrest');
CREATE TYPE subscription_stripe_status AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid');

-- Users table
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    wallet_address TEXT,
    subscription_status subscription_status DEFAULT 'free',
    preferred_language language DEFAULT 'en',
    saved_state_laws TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Encounters table
CREATE TABLE encounters (
    encounter_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location JSONB NOT NULL,
    recording_url TEXT,
    summary TEXT,
    alert_sent BOOLEAN DEFAULT FALSE,
    duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal guides table
CREATE TABLE legal_guides (
    guide_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    state TEXT NOT NULL,
    language language DEFAULT 'en',
    type guide_type NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert contacts table
CREATE TABLE alert_contacts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (for Stripe integration)
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    status subscription_stripe_status NOT NULL,
    price_id TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_encounters_user_id ON encounters(user_id);
CREATE INDEX idx_encounters_timestamp ON encounters(timestamp DESC);
CREATE INDEX idx_legal_guides_state ON legal_guides(state);
CREATE INDEX idx_legal_guides_type ON legal_guides(type);
CREATE INDEX idx_legal_guides_language ON legal_guides(language);
CREATE INDEX idx_alert_contacts_user_id ON alert_contacts(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

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

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Encounters policies
CREATE POLICY "Users can view own encounters" ON encounters
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own encounters" ON encounters
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own encounters" ON encounters
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own encounters" ON encounters
    FOR DELETE USING (auth.uid()::text = user_id);

-- Alert contacts policies
CREATE POLICY "Users can view own alert contacts" ON alert_contacts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own alert contacts" ON alert_contacts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own alert contacts" ON alert_contacts
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own alert contacts" ON alert_contacts
    FOR DELETE USING (auth.uid()::text = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Legal guides are public (read-only for users)
CREATE POLICY "Anyone can view legal guides" ON legal_guides
    FOR SELECT USING (true);

-- Insert sample legal guides
INSERT INTO legal_guides (guide_id, title, content, state, language, type, is_premium) VALUES
('ca-basic-en', 'Basic Rights in California', 
'You have the right to remain silent. You have the right to refuse searches of your person, belongings, car, or home. You have the right to leave if you are not under arrest. You have the right to a lawyer if you are arrested. You have the right to make a local phone call. The police cannot arrest you just for refusing to answer questions or refusing to consent to a search.', 
'CA', 'en', 'basic', false),

('ca-traffic-en', 'Traffic Stop Rights in California', 
'During a traffic stop in California: 1) Keep your hands visible and remain calm. 2) You must provide your driver''s license, registration, and insurance if requested. 3) You have the right to remain silent beyond providing these documents. 4) You can refuse consent to search your vehicle. 5) If asked to step out of the car, comply but state "I do not consent to any searches." 6) You can ask "Am I free to leave?" 7) Record the interaction if possible.', 
'CA', 'en', 'traffic', true),

('ny-basic-en', 'Basic Rights in New York', 
'In New York, you have constitutional rights during police encounters. You have the right to remain silent and do not have to answer questions. You have the right to refuse consent to searches. You have the right to leave if not under arrest. If arrested, you have the right to an attorney and a phone call. Police cannot arrest you solely for refusing to answer questions or consent to searches.', 
'NY', 'en', 'basic', false),

('tx-basic-en', 'Basic Rights in Texas', 
'Texas residents have important constitutional rights during police encounters. You have the right to remain silent and are not required to answer questions beyond identifying yourself if lawfully detained. You have the right to refuse consent to searches of your person, belongings, or vehicle. You have the right to leave if you are not under arrest. If arrested, you have the right to an attorney and to make a phone call.', 
'TX', 'en', 'basic', false),

('fl-basic-en', 'Basic Rights in Florida', 
'In Florida, you have fundamental rights during police interactions. You have the right to remain silent and do not need to answer questions. You have the right to refuse searches of your person, belongings, car, or home. You have the right to leave if not under arrest. If arrested, you have the right to an attorney and a local phone call. Police cannot arrest you just for exercising these rights.', 
'FL', 'en', 'basic', false);

-- Insert sample Spanish translations
INSERT INTO legal_guides (guide_id, title, content, state, language, type, is_premium) VALUES
('ca-basic-es', 'Derechos Básicos en California', 
'Tienes el derecho de permanecer en silencio. Tienes el derecho de rechazar registros de tu persona, pertenencias, carro, o casa. Tienes el derecho de irte si no estás arrestado. Tienes el derecho a un abogado si eres arrestado. Tienes el derecho de hacer una llamada telefónica local. La policía no puede arrestarte solo por negarte a responder preguntas o por negarte a consentir a un registro.', 
'CA', 'es', 'basic', false);

-- Create a function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_id_param TEXT)
RETURNS subscription_status AS $$
DECLARE
    user_status subscription_status;
BEGIN
    SELECT subscription_status INTO user_status
    FROM users
    WHERE user_id = user_id_param;
    
    RETURN COALESCE(user_status, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has premium access
CREATE OR REPLACE FUNCTION user_has_premium_access(user_id_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_subscription_status(user_id_param) = 'premium';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for user encounter statistics
CREATE VIEW user_encounter_stats AS
SELECT 
    user_id,
    COUNT(*) as total_encounters,
    COUNT(CASE WHEN alert_sent THEN 1 END) as alerts_sent,
    AVG(duration) as avg_duration,
    MAX(timestamp) as last_encounter,
    COUNT(CASE WHEN summary IS NOT NULL THEN 1 END) as encounters_with_summary
FROM encounters
GROUP BY user_id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles and subscription information';
COMMENT ON TABLE encounters IS 'Police encounter records with location and metadata';
COMMENT ON TABLE legal_guides IS 'Legal guidance content organized by state and type';
COMMENT ON TABLE alert_contacts IS 'Emergency contacts for each user';
COMMENT ON TABLE subscriptions IS 'Stripe subscription tracking';

COMMENT ON COLUMN encounters.location IS 'JSON object containing latitude, longitude, city, state';
COMMENT ON COLUMN encounters.duration IS 'Duration of encounter in seconds';
COMMENT ON COLUMN legal_guides.is_premium IS 'Whether this guide requires premium subscription';
COMMENT ON COLUMN users.saved_state_laws IS 'Array of state codes user has saved';

-- Create a function to clean up old data (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_encounters()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete encounters older than 2 years for free users
    DELETE FROM encounters 
    WHERE timestamp < NOW() - INTERVAL '2 years'
    AND user_id IN (
        SELECT user_id FROM users WHERE subscription_status = 'free'
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This completes the database schema for KnowYourRightsCard
-- To apply this schema:
-- 1. Create a new Supabase project
-- 2. Go to the SQL Editor in your Supabase dashboard
-- 3. Copy and paste this entire file
-- 4. Run the query
-- 5. Update your .env file with the Supabase URL and anon key
