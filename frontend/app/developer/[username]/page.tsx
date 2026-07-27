import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PublicProfileFields } from "@/components/developer/PublicProfileFields"
import { getDeveloper, getProjectsByDeveloper, developers } from "@/lib/mock-data"
import { BACKEND_URL } from "@/lib/session"
import { MapPin, UserPlus, Mail } from "lucide-react"

export function generateStaticParams() {
  return developers.map((d) => ({ username: d.username }))
}

type LinkEntry = { label?: string; url: string }

type PublicProfile = {
  username: string
  name?: string
  bio?: string
  experienceYears?: number
  certifications?: string[]
  links?: LinkEntry[]
  visibility: string
  fieldsVisible: Record<string, boolean>
}

// Fetches the real backend profile. Falls back (via the caller) to
// mock-data.ts when the user doesn't exist there yet - Projects/portfolio
// isn't a real feature (still story 9431636+), so the demo developers
// only ever exist in mock-data.ts, never in the real users table. See
// decisions.md (2026-07-27) for why this is a deliberate partial migration.
async function fetchPublicProfile(username: string): Promise<{ profile: PublicProfile | null; isPrivate: boolean }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/${encodeURIComponent(username)}/public-profile`, {
      cache: "no-store",
    })
    if (res.status === 403) return { profile: null, isPrivate: true }
    if (!res.ok) return { profile: null, isPrivate: false }
    return { profile: await res.json(), isPrivate: false }
  } catch {
    return { profile: null, isPrivate: false }
  }
}

function mockToPublicProfile(username: string): PublicProfile | null {
  const dev = getDeveloper(username)
  if (!dev) return null
  return {
    username: dev.username,
    name: dev.name,
    bio: dev.bio,
    experienceYears: dev.experienceYears,
    certifications: dev.certifications,
    links: dev.links.map((l) => ({ label: l.label, url: l.href })),
    visibility: "public",
    fieldsVisible: { name: true, bio: true, experienceYears: true, certifications: true, links: true },
  }
}

function initialsFrom(name?: string) {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

export default async function DeveloperPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const { profile: apiProfile, isPrivate } = await fetchPublicProfile(username)
  const profile = apiProfile ?? mockToPublicProfile(username)

  if (isPrivate) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-24 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">This profile is not available</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The developer you&apos;re looking for has set their profile to private.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!profile) notFound()

  // Skills/followers/"open to work"/avatar styling have no real backend
  // field yet - only ever present for the mock demo developers.
  const mockExtras = getDeveloper(username)
  const devProjects = getProjectsByDeveloper(username)
  const totalLikes = devProjects.reduce((sum, p) => sum + p.likes, 0)
  const totalViews = devProjects.reduce((sum, p) => sum + p.views, 0)
  const initials = mockExtras?.initials ?? initialsFrom(profile.name)
  const avatarColor = mockExtras?.avatarColor ?? "var(--chart-1)"
  const displayName = profile.fieldsVisible.name !== false && profile.name ? profile.name : `@${profile.username}`

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Profile header */}
        <section className="border-b border-border/70 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl" style={{ backgroundColor: avatarColor }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight">{displayName}</h1>
                    {mockExtras?.available && (
                      <Badge className="gap-1.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        Open to work
                      </Badge>
                    )}
                  </div>
                  {mockExtras?.title && <p className="mt-1 text-lg text-muted-foreground">{mockExtras.title}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {mockExtras?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {mockExtras.location}
                      </span>
                    )}
                    {profile.fieldsVisible.experienceYears !== false && profile.experienceYears != null && (
                      <span>{profile.experienceYears} years experience</span>
                    )}
                    {mockExtras?.followers != null && <span>{mockExtras.followers.toLocaleString()} followers</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>
                  <UserPlus className="mr-1 h-4 w-4" /> Follow
                </Button>
                <Button variant="outline">
                  <Mail className="mr-1 h-4 w-4" /> Contact
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8">
            <PublicProfileFields
              bio={profile.bio}
              certifications={profile.certifications}
              links={profile.links}
              fieldsVisible={profile.fieldsVisible}
            />
            {mockExtras && mockExtras.skills.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mockExtras.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Main */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Projects" value={String(devProjects.length)} />
              <Stat label="Total likes" value={totalLikes.toLocaleString()} />
              <Stat label="Total views" value={formatViews(totalViews)} />
            </div>

            <div className="mt-10 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
            </div>
            {devProjects.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {devProjects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">No published projects yet.</p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`
}
