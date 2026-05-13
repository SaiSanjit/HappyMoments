export type MessageType =
  | 'text'
  | 'amenities_card'
  | 'pricing_card'
  | 'counter_offer'
  | 'agreement';

export type SenderType = 'customer' | 'vendor';

// ── Amenities card (vendor → customer) ─────────────────────────
export interface AmenityItem {
  id: string;
  name: string;
  included: boolean;
  description?: string;
  customizable?: boolean;
}

export interface AmenitiesCardData {
  type: 'amenities_card';
  venue_name: string;
  event_types: string[];
  capacity: { indoor?: number; outdoor?: number };
  amenities: AmenityItem[];
  highlights: string[];
  notes?: string;
}

// ── Pricing card (vendor → customer) ───────────────────────────
export interface PricingLineItem {
  id: string;
  category: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  included: boolean;
}

export interface PricingCardData {
  type: 'pricing_card';
  variant_name: string;
  variant_number: number;
  valid_until?: string;
  event_date?: string;
  items: PricingLineItem[];
  subtotal: number;
  discount?: { amount: number; reason?: string };
  taxes: number;
  grand_total: number;
  notes?: string;
}

// ── Counter offer (customer → vendor) ──────────────────────────
export interface CounterOfferItem {
  id: string;
  name: string;
  accepted: boolean;
  original_price: number;
  counter_price?: number;
  note?: string;
}

export interface CounterOfferData {
  type: 'counter_offer';
  referencing_message_id: string;
  variant_name: string;
  items: CounterOfferItem[];
  proposed_total: number;
  comments: string;
}

// ── Agreement (finalised terms) ─────────────────────────────────
export interface AgreementLineItem {
  name: string;
  price: number;
}

export interface AgreementData {
  type: 'agreement';
  agreement_id: string;
  items: AgreementLineItem[];
  total: number;
  event_date?: string;
  terms: string;
  notes?: string;
  vendor_confirmed: boolean;
  customer_confirmed: boolean;
}

// ── Message (DB row shape) ──────────────────────────────────────
export interface DiscussionMessage {
  id: string;
  discussion_id: string;
  sender_type: SenderType;
  sender_name: string | null;
  message_type: MessageType;
  content: string | null;
  card_data: AmenitiesCardData | PricingCardData | CounterOfferData | AgreementData | null;
  is_read: boolean;
  created_at: string;
}

// ── Discussion thread ───────────────────────────────────────────
export interface Discussion {
  id: string;
  vendor_id: string;
  customer_id: number | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  subject: string;
  status: 'active' | 'agreed' | 'closed';
  last_message: string | null;
  last_message_at: string;
  created_at: string;
}

// ── Agreement (DB row) ──────────────────────────────────────────
export interface DiscussionAgreement {
  id: string;
  discussion_id: string;
  vendor_id: string;
  customer_id: number | null;
  agreed_items: AgreementLineItem[];
  total_amount: number;
  event_date: string | null;
  terms: string | null;
  notes: string | null;
  vendor_confirmed: boolean;
  customer_confirmed: boolean;
  created_at: string;
  finalized_at: string | null;
}
