// Name of the HttpOnly cookie holding the Supabase access token, set by
// POST /api/session (frontend/app/api/session/route.ts) after login.
export const SESSION_COOKIE = "outfolio_token"

export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"
