import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE, BACKEND_URL } from "@/lib/session"

// Same pattern as frontend/app/api/profile/route.ts: the client can't read
// the HttpOnly session cookie itself, so this proxies to the backend,
// translating the cookie into the Authorization header it expects.
export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    return NextResponse.json({ error: "unauthorized", message: "Not logged in." }, { status: 401 })
  }

  const body = await request.text()

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/users/me/profile/visibility`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
