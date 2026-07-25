import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Eye } from "lucide-react"
import { type Project, getDeveloper } from "@/lib/mock-data"

export function ProjectCard({ project }: { project: Project }) {
  const dev = getDeveloper(project.developer)
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={project.cover || "/placeholder.svg"}
          alt={`${project.title} interface screenshot`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/85 backdrop-blur">
            {project.platform}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="rounded-full font-normal">
            {project.category}
          </Badge>
          <span>{project.year}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold leading-tight text-balance transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
        </div>
        <div className="flex items-center justify-between border-t border-border/70 pt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]" style={{ backgroundColor: dev?.avatarColor }}>
                {dev?.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{dev?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {project.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {formatViews(project.views)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`
}
