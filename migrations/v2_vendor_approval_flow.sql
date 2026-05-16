-- =============================================================================
-- V2: Vendor Approval Flow Migrations
-- Applied via Supabase MCP during May 2026 development session
-- Run these in order on a fresh Supabase project to set up the approval flow.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Add review columns to vendor_applications
--    Needed by: backend/routes/admin.js (approve-vendor, decline-vendor)
-- -----------------------------------------------------------------------------
ALTER TABLE vendor_applications
  ADD COLUMN IF NOT EXISTS email_verified  boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS decline_reason  text,
  ADD COLUMN IF NOT EXISTS reviewed_by     text,
  ADD COLUMN IF NOT EXISTS reviewed_at     timestamptz;


-- -----------------------------------------------------------------------------
-- 2. Fix handle_new_user trigger (CRITICAL)
--    The default Supabase template trigger tried to INSERT into public.user_profiles
--    which does not exist in this project. This caused a 500 on every auth user
--    creation (supabase.auth.admin.createUser). Fixed by replacing with a no-op.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- No-op: this project does not use a user_profiles table.
  -- Vendor profile data lives in the vendors table (inserted by the admin approval flow).
  RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------------------
-- 3. Ensure vendor_applications has all required columns
--    (Full table definition for reference / fresh setup)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendor_applications (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name       text        NOT NULL,
  spoc_name        text        NOT NULL,
  email            text        NOT NULL,
  phone_number     text,
  city             text,
  state            text,
  description      text,
  instagram        text,
  website          text,
  categories       text[]      DEFAULT '{}',
  portfolio_urls   text[]      DEFAULT '{}',
  packages         jsonb[]     DEFAULT '{}',
  years_experience integer,
  events_completed integer     DEFAULT 0,
  status           text        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'approved', 'rejected')),
  email_verified   boolean     DEFAULT false,
  decline_reason   text,
  reviewed_by      text,
  reviewed_at      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Index for fast pending-applications query
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status
  ON vendor_applications (status, created_at DESC);


-- -----------------------------------------------------------------------------
-- 4. RLS for vendor_applications
--    Admin backend uses service role key (bypasses RLS), so RLS here is a
--    safety net — block anon reads entirely.
-- -----------------------------------------------------------------------------
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

-- Only service-role (backend) can read/write; anon and authenticated users cannot.
-- If you want authenticated admins to read via frontend directly in the future,
-- add a policy checking auth.jwt() ->> 'role' = 'admin'.
DROP POLICY IF EXISTS "block_anon_vendor_applications" ON vendor_applications;
CREATE POLICY "block_anon_vendor_applications"
  ON vendor_applications
  FOR ALL
  TO anon
  USING (false);


-- -----------------------------------------------------------------------------
-- 5. Vendors table — ensure additional_info column exists (for website storage)
--    The vendors table has NO website column. Website URL goes in additional_info JSONB.
--    e.g. additional_info = { "website": "https://example.com" }
-- -----------------------------------------------------------------------------
ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS additional_info jsonb DEFAULT '{}';
