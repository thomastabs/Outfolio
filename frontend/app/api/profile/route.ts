import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE, BACKEND_URL } from "@/lib/session"

// Proxies to the backend PUT endpoint, translating the HttpOnly session
// cookie into the Authorization header the backend expects. The client
// component can't read the cookie itself (that's the point of HttpOnly),
// so it calls this same-origin route instead of the backend directly.
export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    return NextResponse.json({ error: "unauthorized", message: "Not logged in." }, { status: 401 })
  }

  const body = await request.text()

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/users/me/profile`, {
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
