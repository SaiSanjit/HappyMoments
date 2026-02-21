// Centralized API configuration
// In production, set VITE_API_BASE_URL to your deployed backend URL (e.g. https://your-backend.vercel.app)
// In development, it falls back to localhost:3001

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
