"use client"

import { useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projects, categories, platforms } from "@/lib/mock-data"
import { Search } from "lucide-react"

export default function DiscoverPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [platform, setPlatform] = useState("All platforms")
  const [sort, setSort] = useState("popular")

  const results = useMemo(() => {
    const filtered = projects.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        `${p.title} ${p.tagline} ${p.stack.join(" ")} ${p.integrations.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      const matchesCategory = category === "All" || p.category === category
      const matchesPlatform = platform === "All platforms" || p.platform === platform
      return matchesQuery && matchesCategory && matchesPlatform
    })
    return [...filtered].sort((a, b) => {
      if (sort === "popular") return b.likes - a.likes
      if (sort === "views") return b.views - a.views
      return b.year.localeCompare(a.year)
    })
  }, [query, category, platform, sort])

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/70 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">Discover projects</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Browse case studies from OutSystems and low-code developers around the world.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by tech, integration, or keyword"
                className="pl-9"
                aria-label="Search projects"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most liked</SelectItem>
                  <SelectItem value="views">Most viewed</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "project" : "projects"}
          </p>

          {results.length > 0 ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
              <p className="text-muted-foreground">No projects match your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                  setPlatform("All platforms")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
