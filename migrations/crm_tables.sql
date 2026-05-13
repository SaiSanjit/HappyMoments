-- CRM Tables for Vendor CRM Tool
-- Run this migration in Supabase SQL editor

-- 1. CRM Resources (vendor team members)
CREATE TABLE IF NOT EXISTS crm_resources (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        TEXT NOT NULL,
  resource_name    TEXT NOT NULL,
  designation      TEXT,
  email            TEXT UNIQUE NOT NULL,
  phone            TEXT,
  password_hash    TEXT NOT NULL,
  crm_admin        CHAR(1) DEFAULT 'N' CHECK (crm_admin IN ('Y', 'N')),
  admin_access_type TEXT DEFAULT 'View' CHECK (admin_access_type IN ('Modify', 'View')),
  sales_team       CHAR(1) DEFAULT 'N' CHECK (sales_team IN ('Y', 'N')),
  manager_id       UUID REFERENCES crm_resources(id) ON DELETE SET NULL,
  user_groups      TEXT[] DEFAULT '{}',
  date_of_joining  DATE,
  is_active        BOOLEAN DEFAULT true,
  last_login       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_resources_vendor_id ON crm_resources(vendor_id);

-- 2. CRM Territories (country + city pairs)
CREATE TABLE IF NOT EXISTS crm_territories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   TEXT NOT NULL,
  country     TEXT NOT NULL,
  city        TEXT NOT NULL,
  alias       TEXT,
  active_flag CHAR(1) DEFAULT 'Y' CHECK (active_flag IN ('Y', 'N')),
  created_by  UUID REFERENCES crm_resources(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(vendor_id, country, city)
);

CREATE INDEX IF NOT EXISTS idx_crm_territories_vendor_id ON crm_territories(vendor_id);

-- 3. CRM Resource-Territory join table
CREATE TABLE IF NOT EXISTS crm_resource_territories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id  UUID NOT NULL REFERENCES crm_resources(id) ON DELETE CASCADE,
  territory_id UUID NOT NULL REFERENCES crm_territories(id) ON DELETE CASCADE,
  access_level TEXT DEFAULT 'Full',
  start_date   DATE,
  end_date     DATE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resource_id, territory_id)
);

-- 4. CRM Opportunities
CREATE TABLE IF NOT EXISTS crm_opportunities (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opty_number           TEXT UNIQUE,
  vendor_id             TEXT NOT NULL,
  lead_id               UUID,  -- FK vendor_leads(id), set on conversion
  assigned_resource_id  UUID REFERENCES crm_resources(id) ON DELETE SET NULL,
  creator_resource_id   UUID REFERENCES crm_resources(id) ON DELETE SET NULL,
  territory_id          UUID REFERENCES crm_territories(id) ON DELETE SET NULL,
  customer_name         TEXT NOT NULL,
  customer_phone        TEXT,
  customer_email        TEXT,
  event_type            TEXT CHECK (event_type IN ('Wedding', 'Engagement', 'Corporate', 'Birthday', 'Anniversary', 'Other')),
  event_date            DATE,
  deal_value            NUMERIC DEFAULT 0,
  win_probability       INTEGER DEFAULT 50 CHECK (win_probability BETWEEN 0 AND 100),
  opty_status           TEXT DEFAULT 'prospect' CHECK (opty_status IN ('prospect', 'proposal', 'negotiation', 'verbal_commit', 'closed_won', 'closed_lost')),
  opty_priority         TEXT DEFAULT 'medium' CHECK (opty_priority IN ('high', 'medium', 'low')),
  close_date            DATE,
  site_visit_date       DATE,
  proposal_due_date     DATE,
  decision_date         DATE,
  notes                 TEXT,
  status_remarks        TEXT,
  new_client            BOOLEAN DEFAULT true,
  services              JSONB DEFAULT '[]',
  contacts              JSONB DEFAULT '[]',
  team_resources        UUID[] DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_opportunities_vendor_id ON crm_opportunities(vendor_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_lead_id ON crm_opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_status ON crm_opportunities(opty_status);

-- 5. CRM Chat Rooms
CREATE TABLE IF NOT EXISTS crm_chat_rooms (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        TEXT NOT NULL,
  room_type        TEXT NOT NULL CHECK (room_type IN ('lead', 'opportunity', 'customer_negotiation')),
  reference_id     TEXT NOT NULL,
  reference_type   TEXT NOT NULL CHECK (reference_type IN ('Lead', 'Opportunity')),
  customer_name    TEXT,
  customer_id      INTEGER,
  last_message     TEXT,
  last_message_at  TIMESTAMPTZ,
  unread_count     INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reference_id, room_type)
);

CREATE INDEX IF NOT EXISTS idx_crm_chat_rooms_vendor_id ON crm_chat_rooms(vendor_id);
CREATE INDEX IF NOT EXISTS idx_crm_chat_rooms_reference ON crm_chat_rooms(reference_id, room_type);

-- 6. CRM Messages
CREATE TABLE IF NOT EXISTS crm_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      UUID NOT NULL REFERENCES crm_chat_rooms(id) ON DELETE CASCADE,
  sender_type  TEXT NOT NULL CHECK (sender_type IN ('resource', 'customer')),
  sender_id    TEXT NOT NULL,
  sender_name  TEXT NOT NULL,
  message      TEXT NOT NULL,
  read_by      JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_messages_room_id ON crm_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_crm_messages_created_at ON crm_messages(room_id, created_at);

-- 7. CRM Worklist (daily task list per resource)
CREATE TABLE IF NOT EXISTS crm_worklist (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id       TEXT NOT NULL,
  resource_id     UUID NOT NULL REFERENCES crm_resources(id) ON DELETE CASCADE,
  reference_type  TEXT CHECK (reference_type IN ('Lead', 'Opportunity', 'Task')),
  reference_id    TEXT,
  title           TEXT NOT NULL,
  due_date        DATE,
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'deferred')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_worklist_resource_id ON crm_worklist(resource_id);
CREATE INDEX IF NOT EXISTS idx_crm_worklist_due_date ON crm_worklist(resource_id, due_date);

-- 8. Alter vendor_leads to add CRM columns
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS resource_id UUID REFERENCES crm_resources(id) ON DELETE SET NULL;
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS territory_id UUID REFERENCES crm_territories(id) ON DELETE SET NULL;
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS opportunity_id UUID;
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS lead_number TEXT;
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS customer_id INTEGER;
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'Platform' CHECK (lead_source IN ('Platform', 'WhatsApp', 'Referral', 'Direct', 'Other'));
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS team_resources UUID[] DEFAULT '{}';
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]';
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]';
ALTER TABLE vendor_leads ADD COLUMN IF NOT EXISTS qualification JSONB DEFAULT '{}';

-- Enable realtime on crm_messages for chat
ALTER TABLE crm_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_messages;
