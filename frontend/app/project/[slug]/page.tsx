import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LikeButton } from "@/components/like-button"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getProject, getDeveloper, getProjectsByDeveloper, projects } from "@/lib/mock-data"
import {
  Eye,
  Share2,
  ArrowLeft,
  Download,
  FileImage,
  FileBox,
  FileText,
  Video,
  LinkIcon,
  CheckCircle2,
} from "lucide-react"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

const artifactIcon = {
  screenshot: FileImage,
  oml: FileBox,
  oap: FileBox,
  pdf: FileText,
  video: Video,
  link: LinkIcon,
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const dev = getDeveloper(project.developer)
  const more = getProjectsByDeveloper(project.developer).filter((p) => p.slug !== slug)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to discover
          </Link>

          {/* Header */}
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{project.platform}</Badge>
                <Badge variant="outline" className="rounded-full font-normal">
                  {project.category}
                </Badge>
                <span className="text-sm text-muted-foreground">{project.year}</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-2 max-w-2xl text-lg text-muted-foreground text-pretty">{project.tagline}</p>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton initial={project.likes} />
              <Button variant="outline">
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          {/* Author row */}
          <div className="mt-6 flex items-center justify-between border-y border-border/70 py-4">
            <Link href={`/developer/${project.developer}`} className="group flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback style={{ backgroundColor: dev?.avatarColor }}>{dev?.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium transition-colors group-hover:text-primary">{dev?.name}</div>
                <div className="text-xs text-muted-foreground">{project.role}</div>
              </div>
            </Link>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" /> {project.views.toLocaleString()} views
            </div>
          </div>

          {/* Cover */}
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={project.cover || "/placeholder.svg"}
              alt={`${project.title} main screenshot`}
              width={1280}
              height={800}
              className="w-full object-cover"
              priority
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
            {/* Body */}
            <article className="space-y-10">
              <Section title="Overview">
                <p className="leading-relaxed text-muted-foreground">{project.summary}</p>
              </Section>

              <Section title="The problem">
                <p className="leading-relaxed text-muted-foreground">{project.problem}</p>
              </Section>

              <Section title="Approach">
                <ul className="space-y-3">
                  {project.approach.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {project.gallery.length > 1 && (
                <Section title="Gallery">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="overflow-hidden rounded-lg border border-border bg-muted">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${project.title} screenshot ${i + 1}`}
                          width={640}
                          height={400}
                          className="w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Outcome">
                <p className="leading-relaxed text-muted-foreground">{project.outcome}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded-xl border border-border bg-card p-4">
                      <div className="text-2xl font-semibold tracking-tight text-primary">{m.value}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
              </Section>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              <SideBlock title="Project details">
                <DetailRow label="Role" value={project.role} />
                <DetailRow label="Duration" value={project.duration} />
                <DetailRow label="Team size" value={project.teamSize} />
                <DetailRow label="Platform" value={project.platform} />
              </SideBlock>

              <SideBlock title="Tech stack">
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </SideBlock>

              <SideBlock title="Integrations">
                <ul className="space-y-2">
                  {project.integrations.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
                    </li>
                  ))}
                </ul>
              </SideBlock>

              <SideBlock title="Artifacts">
                <ul className="space-y-2">
                  {project.artifacts.map((a) => {
                    const Icon = artifactIcon[a.kind]
                    return (
                      <li key={a.id}>
                        <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-accent">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{a.name}</span>
                            {a.size && <span className="text-xs text-muted-foreground">{a.size}</span>}
                          </span>
                          <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </SideBlock>
            </aside>
          </div>

          {more.length > 0 && (
            <>
              <Separator className="my-12" />
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">More from {dev?.name}</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/developer/${project.developer}`}>View profile</Link>
                </Button>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
