-- ==============================================
-- ADD VENDOR_NAME FIELD TO VENDOR_CREDENTIALS TABLE
-- ==============================================
-- This script adds a vendor_name column to the vendor_credentials table for administrative clarity.
-- Execute this script in the Supabase Dashboard SQL Editor.

-- STEP 1: Add vendor_name column if it doesn't exist
ALTER TABLE vendor_credentials 
ADD COLUMN IF NOT EXISTS vendor_name TEXT;

-- STEP 2: Add comment to document the field
COMMENT ON COLUMN vendor_credentials.vendor_name IS 'The brand name of the vendor, added for administrative clarity';

-- STEP 3: Verification Query to see table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'vendor_credentials' 
  AND column_name = 'vendor_name';
