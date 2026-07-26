import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/session"

// Matches Supabase Auth's default access-token TTL. No refresh-token
// handling yet - out of scope until a session-refresh story exists.
const SESSION_MAX_AGE_SECONDS = 60 * 60

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const token = typeof body.token === "string" ? body.token : null

  if (!token) {
    return NextResponse.json({ error: "invalid_input", message: "token is required." }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return NextResponse.json({ success: true })
}
