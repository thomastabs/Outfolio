import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getFeaturedProjects, developers } from "@/lib/mock-data"
import { ArrowRight, FileCode2, LayoutTemplate, ShieldCheck, Sparkles, Users } from "lucide-react"

export default function HomePage() {
  const featured = getFeaturedProjects()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-normal">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Portfolios for low-code builders
              </Badge>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Show the world what you built with OutSystems.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                Turn your apps into rich case studies with screenshots, architecture notes, and real outcomes. Outfolio
                is the portfolio platform where low-code developers get discovered and recruiters find proven talent.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/new">
                    Build your portfolio
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/discover">Explore projects</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Free to start. No credit card needed.</p>
            </div>

            <div className="relative mx-auto mt-16 max-w-5xl">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <Image
                  src="/projects/loanflow.png"
                  alt="Example project case study shown inside Outfolio"
                  width={1280}
                  height={800}
                  className="w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border/70">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
            {[
              { value: "6,200+", label: "Projects published" },
              { value: "3,800+", label: "Low-code developers" },
              { value: "540+", label: "Hiring companies" },
              { value: "42", label: "Countries" },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="text-3xl font-semibold tracking-tight">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              A portfolio that speaks the low-code language
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              Generic portfolio sites don&apos;t get OutSystems. Outfolio is built around how you actually deliver
              apps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon={LayoutTemplate}
              title="Structured case studies"
              body="Problem, approach, architecture, and outcomes with a format designed for solution delivery, not blog posts."
            />
            <Feature
              icon={FileCode2}
              title="Real artifacts"
              body="Attach screenshots, .oml / .oap modules, demo videos, and architecture PDFs so your work is easy to verify."
            />
            <Feature
              icon={ShieldCheck}
              title="Skills that map to the platform"
              body="Tag reactive web, integrations, BPT, ODC and more, so recruiters can filter for exactly what they need."
            />
            <Feature
              icon={Users}
              title="Get discovered"
              body="A public developer profile that aggregates your best work and shows your availability at a glance."
            />
            <Feature
              icon={Sparkles}
              title="Guided authoring"
              body="Prompts and templates help you describe each project clearly, even if writing isn't your favorite part."
            />
            <Feature
              icon={ArrowRight}
              title="Share anywhere"
              body="Send a single link that works in job applications, LinkedIn, and proposals to prospective clients."
            />
          </div>
        </section>

        {/* Featured projects */}
        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-balance">Featured projects</h2>
                <p className="mt-2 text-muted-foreground">Real case studies from the community.</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/discover">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Developer spotlight */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-balance">Developers to follow</h2>
              <p className="mt-2 text-muted-foreground">Proven low-code builders open to new work.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {developers.map((dev) => (
              <Link
                key={dev.username}
                href={`/developer/${dev.username}`}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="text-base" style={{ backgroundColor: dev.avatarColor }}>
                      {dev.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold transition-colors group-hover:text-primary">{dev.name}</h3>
                      {dev.available && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Open
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{dev.title}</p>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{dev.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {dev.skills.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-primary px-6 py-14 text-center text-primary-foreground">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Your next role starts with your best work.
              </h2>
              <p className="max-w-xl text-lg leading-relaxed opacity-90 text-pretty">
                Publish your first case study today and start building a portfolio recruiters trust.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/new">
                  Create your first project
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}
