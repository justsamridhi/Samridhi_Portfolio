/**
 * api.js
 * Centralised base URL for all backend fetch calls.
 *
 * In development, Vite's proxy rewrites /api/* → http://localhost:5000/api/*
 * so BASE_URL stays empty and relative paths work automatically.
 *
 * In production (static build on Vercel/Netlify/etc.), set:
 *   VITE_API_URL=https://your-backend.onrender.com
 * in your hosting environment's environment-variable settings.
 *
 * If VITE_API_URL is not set, the calls fall back to relative paths —
 * which works when the frontend and backend are served from the same origin
 * (e.g. both on Render as a single service).
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Prepend the base URL to an API path.
 * @param {string} path  e.g. '/api/guestbook'
 * @returns {string}
 */
export const apiUrl = (path) => `${BASE_URL}${path}`;
