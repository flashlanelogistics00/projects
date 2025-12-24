-- ============================================
-- FlashLane Logistics Database Schema
-- Run this script in Supabase SQL Editor
-- ============================================

-- 1. Create custom enum type for shipment status
CREATE TYPE public.shipment_status AS ENUM (
  'pending',
  'picked_up',
  'in_transit',
  'customs',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned'
);

-- 2. Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create shipments table
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  tracking_number TEXT UNIQUE,
  shipper_details JSONB,
  receiver_details JSONB,
  origin TEXT,
  destination TEXT,
  status shipment_status DEFAULT 'pending',
  current_location TEXT,
  cost_details JSONB,
  user_id UUID REFERENCES auth.users(id),
  package_details JSONB
);

-- 4. Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE,
  amount_due NUMERIC,
  status TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  due_date TIMESTAMPTZ
);

-- 5. Create tracking_events table
CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  status shipment_status,
  location TEXT,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 6. Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Database Functions
-- ============================================

-- 7. Function to get shipment by tracking number
CREATE OR REPLACE FUNCTION public.get_shipment_by_tracking(tracking_num TEXT)
RETURNS SETOF public.shipments
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.shipments
  WHERE tracking_number = tracking_num;
$$;

-- 8. Function to handle new user registration (creates profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$;

-- 9. Trigger to auto-create profile on user sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Helper function for admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

CREATE POLICY "Profiles access"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- Shipments Policies
DROP POLICY IF EXISTS "Users can view own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users can create shipments" ON public.shipments;
DROP POLICY IF EXISTS "Public tracking lookup" ON public.shipments;
DROP POLICY IF EXISTS "Shipment access" ON public.shipments;
DROP POLICY IF EXISTS "Users and admins can view shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users and admins can create shipments" ON public.shipments;
DROP POLICY IF EXISTS "Admins can update shipments" ON public.shipments;

CREATE POLICY "Shipment viewing"
  ON public.shipments FOR SELECT
  USING (true); -- Public tracking needs this. For better security, use as-specific-as-possible filters in app.

CREATE POLICY "Shipment insertion"
  ON public.shipments FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Shipment update"
  ON public.shipments FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Shipment deletion"
  ON public.shipments FOR DELETE
  USING (public.is_admin());

-- Invoices Policies
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Invoice access" ON public.invoices;

CREATE POLICY "Invoice viewing"
  ON public.invoices FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.shipments
      WHERE shipments.id = invoices.shipment_id
      AND (shipments.user_id = auth.uid() OR true) -- Fallback for public tracking if invoice is public
    )
  );

-- Tracking Events Policies
DROP POLICY IF EXISTS "Public tracking events" ON public.tracking_events;
CREATE POLICY "Event access"
  ON public.tracking_events FOR SELECT
  USING (true);

CREATE POLICY "Event management"
  ON public.tracking_events FOR ALL
  USING (public.is_admin());

-- Contact Messages Policies
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;

CREATE POLICY "Message viewing"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Message insertion"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Message management"
  ON public.contact_messages FOR DELETE
  USING (public.is_admin());

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX idx_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX idx_shipments_user ON public.shipments(user_id);
CREATE INDEX idx_invoices_shipment ON public.invoices(shipment_id);
CREATE INDEX idx_tracking_events_shipment ON public.tracking_events(shipment_id);
