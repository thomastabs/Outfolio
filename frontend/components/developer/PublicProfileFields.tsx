import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { BadgeCheck, ExternalLink } from "lucide-react"

export type PublicLinkEntry = { label?: string; url: string }

type PublicProfileFieldsProps = {
  bio?: string
  certifications?: string[]
  links?: PublicLinkEntry[]
  fieldsVisible: Record<string, boolean>
}

// Renders the sidebar "fields" block of the public profile page (About,
// Certifications, Links), conditionally per fieldsVisible. name and
// experienceYears stay inline in page.tsx's header - they're tied to the
// avatar/badge layout there, not really part of this list-style block.
export function PublicProfileFields({ bio, certifications, links, fieldsVisible }: PublicProfileFieldsProps) {
  const showBio = fieldsVisible.bio !== false && !!bio
  const showCertifications = fieldsVisible.certifications !== false && !!certifications?.length
  const showLinks = fieldsVisible.links !== false && !!links?.length

  return (
    <>
      {showBio && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">About</h2>
          <p className="mt-3 text-sm leading-relaxed">{bio}</p>
        </div>
      )}
      {showCertifications && (
        <>
          <Separator />
          <CertificationsList certifications={certifications!} />
        </>
      )}
      {showLinks && (
        <>
          <Separator />
          <PublicLinks links={links!} />
        </>
      )}
    </>
  )
}

export function CertificationsList({ certifications }: { certifications: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground">Certifications</h2>
      <ul className="mt-3 space-y-2">
        {certifications.map((c) => (
          <li key={c} className="flex items-start gap-2 text-sm">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PublicLinks({ links }: { links: PublicLinkEntry[] }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground">Links</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.url}>
            <Link
              href={l.url}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {l.label || l.url}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
