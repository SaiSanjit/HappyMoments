import { API_BASE_URL } from '@/lib/api-config';

const BASE = `${API_BASE_URL}/api/liked-vendors`;

export const saveLikeVendor = async (customerId: number, vendorId: string) => {
  const res = await fetch(`${BASE}/save-like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, vendor_id: vendorId }),
  });
  return res.json();
};

export const removeLikeVendor = async (customerId: number, vendorId: string) => {
  const res = await fetch(`${BASE}/remove-like`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, vendor_id: vendorId }),
  });
  return res.json();
};

export const getLikedVendors = async (customerId: number) => {
  const res = await fetch(`${BASE}/get-liked-vendors/${customerId}`);
  return res.json();
};

export const checkVendorLiked = async (customerId: number, vendorId: string) => {
  const res = await fetch(`${BASE}/check-like/${customerId}/${vendorId}`);
  return res.json();
};
