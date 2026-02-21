-- Create table to store reasons when customers mark vendors as "Not Interested"
CREATE TABLE IF NOT EXISTS not_interested_reasons (
  id BIGSERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vendor_id TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one reason per customer-vendor combination (can update if they change their mind)
  UNIQUE(customer_id, vendor_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_not_interested_reasons_customer_vendor 
ON not_interested_reasons(customer_id, vendor_id);

CREATE INDEX IF NOT EXISTS idx_not_interested_reasons_vendor 
ON not_interested_reasons(vendor_id);

-- Add comment to table
COMMENT ON TABLE not_interested_reasons IS 'Stores reasons when customers mark vendors as Not Interested';
COMMENT ON COLUMN not_interested_reasons.reason IS 'Optional reason provided by customer for not being interested in the vendor';










