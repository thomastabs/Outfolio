import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SESSION_COOKIE, BACKEND_URL } from "@/lib/session"

type LinkEntry = { label?: string; url: string }

type Profile = {
  username: string
  name: string
  bio: string | null
  experienceYears: number | null
  certifications: string[]
  links: LinkEntry[]
  visibilitySettings: Record<string, unknown>
}

async function fetchProfile(token: string): Promise<Profile | null> {
  const res = await fetch(`${BACKEND_URL}/api/v1/users/me/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (res.status === 401) return null
  if (!res.ok) throw new Error(`Failed to load profile (${res.status})`)
  return res.json()
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    redirect("/login")
  }

  const profile = await fetchProfile(token)

  if (!profile) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>
          </div>

          <div className="space-y-6 rounded-xl border border-border bg-card p-6">
            <Field label="Name" value={profile.name} />
            <Field label="Bio" value={profile.bio} />
            <Field
              label="OutSystems experience"
              value={profile.experienceYears != null ? `${profile.experienceYears} years` : null}
            />
            <div>
              <div className="text-xs text-muted-foreground">Certifications</div>
              {profile.certifications.length > 0 ? (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {profile.certifications.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm">—</p>
              )}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Links</div>
              {profile.links.length > 0 ? (
                <ul className="mt-1 space-y-1">
                  {profile.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline underline-offset-4"
                      >
                        {link.label ?? link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm">—</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <p className="mt-1 text-sm">{value || "—"}</p>
    </div>
  )
}
