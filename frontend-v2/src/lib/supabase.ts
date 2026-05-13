import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Vendor {
  vendor_id: string;
  slug: string;
  brand_name: string;
  spoc_name: string;
  category: string | string[];
  categories?: string[];
  subcategory?: string;
  phone_number: string;
  whatsapp_number?: string;
  email?: string;
  instagram?: string;
  address?: string;
  google_maps_link?: string;
  experience?: string;
  quick_intro?: string;
  caption?: string;
  detailed_intro?: string;
  highlight_features?: string[];
  events_completed?: number;
  rating?: number;
  review_count?: number;
  verified?: boolean;
  currently_available?: boolean;
  starting_price?: number;
  avatar_url?: string;
  cover_image_url?: string;
  brand_logo_url?: string;
  services?: Array<{ name: string; description?: string; price?: number }>;
  packages?: Array<{ name: string; description?: string; price?: number; inclusions?: string[] }>;
  specialties?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  mobile_number: string;
  location?: string;
  status: 'unverified' | 'verified';
  created_at: string;
}
