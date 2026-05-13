-- ============================================================
-- Discussions: customer ↔ vendor negotiation threads
-- ============================================================

CREATE TABLE IF NOT EXISTS discussions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id       TEXT        NOT NULL,
  customer_id     INT,
  customer_name   TEXT,
  customer_email  TEXT,
  customer_phone  TEXT,
  subject         TEXT        NOT NULL DEFAULT 'Venue & Pricing Discussion',
  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'agreed', 'closed')),
  last_message    TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS discussions_vendor_idx   ON discussions (vendor_id);
CREATE INDEX IF NOT EXISTS discussions_customer_idx ON discussions (customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS discussions_pair_idx
  ON discussions (vendor_id, customer_id)
  WHERE customer_id IS NOT NULL;

-- ============================================================
-- Discussion messages — text OR template cards
-- ============================================================

CREATE TABLE IF NOT EXISTS discussion_messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id   UUID        NOT NULL REFERENCES discussions (id) ON DELETE CASCADE,
  sender_type     TEXT        NOT NULL CHECK (sender_type IN ('customer', 'vendor')),
  sender_name     TEXT,
  -- 'text' | 'amenities_card' | 'pricing_card' | 'counter_offer' | 'agreement'
  message_type    TEXT        NOT NULL DEFAULT 'text',
  content         TEXT,        -- plain text messages
  card_data       JSONB,       -- structured card payload
  is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS disc_messages_discussion_idx ON discussion_messages (discussion_id);
CREATE INDEX IF NOT EXISTS disc_messages_timeline_idx  ON discussion_messages (discussion_id, created_at);

-- Enable real-time for live chat updates
ALTER TABLE discussion_messages REPLICA IDENTITY FULL;

-- ============================================================
-- Discussion agreements — finalised terms
-- ============================================================

CREATE TABLE IF NOT EXISTS discussion_agreements (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id       UUID        NOT NULL REFERENCES discussions (id),
  vendor_id           TEXT        NOT NULL,
  customer_id         INT,
  agreed_items        JSONB       NOT NULL DEFAULT '[]',
  total_amount        NUMERIC     NOT NULL DEFAULT 0,
  event_date          DATE,
  terms               TEXT,
  notes               TEXT,
  vendor_confirmed    BOOLEAN     NOT NULL DEFAULT FALSE,
  customer_confirmed  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  finalized_at        TIMESTAMPTZ
);

-- ============================================================
-- Card data shapes (documented as SQL comments)
-- ============================================================
-- amenities_card card_data:
--   { type, venue_name, event_types[], capacity{indoor,outdoor},
--     amenities[{id,name,included,description,customizable}],
--     highlights[], notes }
--
-- pricing_card card_data:
--   { type, variant_name, variant_number, valid_until, event_date,
--     items[{id,category,name,description,quantity,unit,unit_price,total,included}],
--     subtotal, discount{amount,reason}, taxes, grand_total, notes }
--
-- counter_offer card_data:
--   { type, referencing_message_id, items[{id,name,accepted,counter_price,note}],
--     proposed_total, comments }
--
-- agreement card_data:
--   { type, items[{name,price}], total, event_date, terms, notes,
--     vendor_confirmed, customer_confirmed }
