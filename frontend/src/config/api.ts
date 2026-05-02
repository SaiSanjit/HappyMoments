// Centralized API configuration
// IMPORTANT: Set VITE_API_BASE_URL in your Vercel/production environment variables
// to your Express backend deployment URL (e.g. https://happy-moments-backend.vercel.app)
// NOTE: api.happymomentsindia.com is the Supabase domain — do NOT use it here.

const hostname = window.location.hostname;
const isLocal = 
  hostname === 'localhost' || 
  hostname === '127.0.0.1' || 
  hostname === '[::1]' || 
  hostname.endsWith('.local') || 
  hostname.startsWith('192.168.') || 
  hostname.startsWith('10.') || 
  hostname.startsWith('172.');

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isLocal ? 'http://localhost:3001' : '');

if (!isLocal && !import.meta.env.VITE_API_BASE_URL) {
  console.error('⚠️ VITE_API_BASE_URL is not set in production! API calls will fail. Set it to your Express backend URL in Vercel environment variables.');
}
