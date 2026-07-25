import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getDeveloper, getProjectsByDeveloper, developers } from "@/lib/mock-data"
import { MapPin, BadgeCheck, ExternalLink, UserPlus, Mail } from "lucide-react"

export function generateStaticParams() {
  return developers.map((d) => ({ username: d.username }))
}

export default async function DeveloperPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const dev = getDeveloper(username)
  if (!dev) notFound()

  const devProjects = getProjectsByDeveloper(username)
  const totalLikes = devProjects.reduce((sum, p) => sum + p.likes, 0)
  const totalViews = devProjects.reduce((sum, p) => sum + p.views, 0)

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
                  <AvatarFallback className="text-2xl" style={{ backgroundColor: dev.avatarColor }}>
                    {dev.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight">{dev.name}</h1>
                    {dev.available && (
                      <Badge className="gap-1.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        Open to work
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-lg text-muted-foreground">{dev.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {dev.location}
                    </span>
                    <span>{dev.experienceYears} years experience</span>
                    <span>{dev.followers.toLocaleString()} followers</span>
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
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">About</h2>
              <p className="mt-3 text-sm leading-relaxed">{dev.bio}</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {dev.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Certifications</h2>
              <ul className="mt-3 space-y-2">
                {dev.certifications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Links</h2>
              <ul className="mt-3 space-y-2">
                {dev.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {devProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
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
