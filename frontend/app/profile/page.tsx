import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfileEditForm } from "@/components/profile/ProfileEditForm"
import { ProfileVisibilitySettings } from "@/components/profile/ProfileVisibilitySettings"
import { SESSION_COOKIE, BACKEND_URL } from "@/lib/session"

type LinkEntry = { label?: string; url: string }

type VisibilitySettings = {
  visibility?: string
  fieldVisibility?: Record<string, string>
}

type Profile = {
  username: string
  name: string
  bio: string | null
  experienceYears: number | null
  certifications: string[]
  links: LinkEntry[]
  visibilitySettings: VisibilitySettings
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

          <div className="space-y-6">
            <ProfileEditForm
              initialValues={{
                name: profile.name,
                bio: profile.bio ?? "",
                experienceYears: profile.experienceYears,
                certifications: profile.certifications,
                links: profile.links.map((l) => ({ label: l.label ?? "", url: l.url })),
              }}
            />
            <ProfileVisibilitySettings
              initialSettings={{
                visibility: profile.visibilitySettings.visibility ?? "public",
                fieldVisibility: profile.visibilitySettings.fieldVisibility ?? {},
              }}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
