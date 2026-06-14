-- Migration: Add coupon and discount fields to invoice_quotations table
ALTER TABLE invoice_quotations ADD COLUMN IF NOT EXISTS discount_rate NUMERIC DEFAULT 0;
ALTER TABLE invoice_quotations ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;
ALTER TABLE invoice_quotations ADD COLUMN IF NOT EXISTS coupon_name TEXT DEFAULT '';
