-- Flash Lane Logistics Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shipment status enum
DO $$ BEGIN
    CREATE TYPE shipment_status AS ENUM ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tracking_number TEXT UNIQUE NOT NULL,
    origin TEXT,
    destination TEXT,
    status shipment_status DEFAULT 'pending',
    shipper_details JSONB,
    receiver_details JSONB,
    package_details JSONB,
    cost_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking events table
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT,
    description TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON tracking_events(shipment_id);

-- Enable Row Level Security
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments
-- Allow authenticated users to view all shipments (admin access)
CREATE POLICY "Allow authenticated users to view shipments"
    ON shipments FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert shipments
CREATE POLICY "Allow authenticated users to insert shipments"
    ON shipments FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update shipments
CREATE POLICY "Allow authenticated users to update shipments"
    ON shipments FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete shipments
CREATE POLICY "Allow authenticated users to delete shipments"
    ON shipments FOR DELETE
    TO authenticated
    USING (true);

-- Allow anyone to view shipments by tracking number (for public tracking)
CREATE POLICY "Allow public to view shipments by tracking number"
    ON shipments FOR SELECT
    TO anon
    USING (true);

-- RLS Policies for tracking_events
-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users to manage tracking events"
    ON tracking_events FOR ALL
    TO authenticated
    USING (true);

-- Allow public read access for tracking
CREATE POLICY "Allow public to view tracking events"
    ON tracking_events FOR SELECT
    TO anon
    USING (true);

-- RLS Policies for contact_messages
-- Allow anyone to insert contact messages
CREATE POLICY "Allow anyone to submit contact messages"
    ON contact_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated users to view contact messages
CREATE POLICY "Allow authenticated users to view contact messages"
    ON contact_messages FOR SELECT
    TO authenticated
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating updated_at on shipments
DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
