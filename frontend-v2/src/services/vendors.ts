import { supabase, Vendor } from '@/lib/supabase';

const normalizeCategories = (cats: unknown): string[] => {
  if (!cats) return [];
  if (Array.isArray(cats)) {
    return (cats as unknown[])
      .map((cat) => {
        if (typeof cat === 'string') {
          return cat.replace(/^\{+|\}+$/g, '').replace(/\\"/g, '"').replace(/^"+|"+$/g, '').trim();
        }
        return String(cat).trim();
      })
      .filter((c) => c !== '');
  }
  if (typeof cats === 'string') return [cats.trim()].filter(Boolean);
  return [];
};

const normalizeVendor = (v: Record<string, unknown>): Vendor => {
  if (v.categories !== undefined && v.categories !== null) {
    v.categories = normalizeCategories(v.categories);
  } else if (v.category !== undefined && v.category !== null) {
    v.categories = normalizeCategories(v.category);
  } else {
    v.categories = [];
  }

  ['services', 'packages', 'specialties', 'highlight_features', 'booking_policies', 'additional_info'].forEach((key) => {
    if (v[key] && typeof v[key] === 'string') {
      try { v[key] = JSON.parse(v[key] as string); } catch { /* keep as-is */ }
    }
  });

  return v as unknown as Vendor;
};

export interface VendorFilters {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  verified?: boolean;
  search?: string;
}

export const getAllVendors = async (filters?: VendorFilters): Promise<Vendor[]> => {
  try {
    let query = supabase.from('vendors').select('*').order('created_at', { ascending: false });

    if (filters?.verified) query = query.eq('verified', true);

    const { data, error } = await query;
    if (error || !data) return [];

    let vendors = data.map(normalizeVendor);

    if (filters?.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      vendors = vendors.filter((v) =>
        (v.categories || []).some((c) => c.toLowerCase().includes(cat)) ||
        (typeof v.category === 'string' && v.category.toLowerCase().includes(cat))
      );
    }

    if (filters?.city) {
      const city = filters.city.toLowerCase();
      vendors = vendors.filter((v) => v.address?.toLowerCase().includes(city));
    }

    if (filters?.minPrice) {
      vendors = vendors.filter((v) => (v.starting_price ?? 0) >= filters.minPrice!);
    }

    if (filters?.maxPrice) {
      vendors = vendors.filter((v) => (v.starting_price ?? Infinity) <= filters.maxPrice!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      vendors = vendors.filter(
        (v) =>
          v.brand_name?.toLowerCase().includes(q) ||
          v.quick_intro?.toLowerCase().includes(q) ||
          (v.categories || []).some((c) => c.toLowerCase().includes(q)) ||
          v.address?.toLowerCase().includes(q)
      );
    }

    return vendors;
  } catch {
    return [];
  }
};

export const getVendorBySlug = async (slug: string): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Try by vendor_id as fallback
      const { data: byId, error: idErr } = await supabase
        .from('vendors')
        .select('*')
        .eq('vendor_id', slug)
        .single();

      if (idErr || !byId) return null;
      return normalizeVendor(byId as Record<string, unknown>);
    }

    return normalizeVendor(data as Record<string, unknown>);
  } catch {
    return null;
  }
};

export const getVendorCatalogImages = async (vendorId: string): Promise<string[]> => {
  try {
    // Try vendor_media table first
    const { data, error } = await supabase
      .from('vendor_media')
      .select('media_url')
      .eq('vendor_id', vendorId)
      .eq('upload_status', 'completed')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((m: { media_url: string }) => m.media_url).filter(Boolean);
    }

    // Fallback: try Supabase Storage buckets directly
    const buckets = ['catalog-images', 'vendor-images'];
    for (const bucket of buckets) {
      const urls = await getVendorImagesFromBucket(vendorId, bucket);
      if (urls.length > 0) return urls;
    }

    return [];
  } catch {
    return [];
  }
};

const getVendorImagesFromBucket = async (vendorId: string, bucket: string): Promise<string[]> => {
  try {
    // Try {vendorId}/catalog/ subfolder first
    const { data: catalogFiles } = await supabase.storage
      .from(bucket)
      .list(`${vendorId}/catalog`, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    const files = catalogFiles && catalogFiles.length > 0
      ? catalogFiles.map((f) => {
          const { data } = supabase.storage.from(bucket).getPublicUrl(`${vendorId}/catalog/${f.name}`);
          return data.publicUrl;
        })
      : [];

    if (files.length > 0) return files;

    // Fallback: root vendor folder, skip logo/contact images
    const { data: rootFiles } = await supabase.storage
      .from(bucket)
      .list(vendorId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (!rootFiles || rootFiles.length === 0) return [];

    return rootFiles
      .filter((f) => {
        const name = f.name.toLowerCase();
        return !name.includes('logo') && !name.includes('brand') &&
               !name.includes('contact') && !name.includes('avatar') &&
               (name.endsWith('.jpg') || name.endsWith('.jpeg') ||
                name.endsWith('.png') || name.endsWith('.webp'));
      })
      .map((f) => {
        const { data } = supabase.storage.from(bucket).getPublicUrl(`${vendorId}/${f.name}`);
        return data.publicUrl;
      });
  } catch {
    return [];
  }
};

export const getFeaturedVendors = async (limit = 6): Promise<Vendor[]> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('verified', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map(normalizeVendor);
  } catch {
    return [];
  }
};
