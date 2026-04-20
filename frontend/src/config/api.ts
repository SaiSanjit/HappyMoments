// Centralized API configuration
// In production, set VITE_API_BASE_URL to your deployed backend URL (e.g. https://api.happymomentsindia.com)
// In development, it falls back to localhost:3001

const isProduction = 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1' && 
  window.location.hostname !== '[::1]' &&
  !window.location.hostname.startsWith('192.168.');
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isProduction ? 'https://api.happymomentsindia.com' : 'http://localhost:3001');
