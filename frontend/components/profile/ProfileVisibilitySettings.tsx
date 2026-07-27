"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const FIELDS = [
  { key: "name", label: "Name" },
  { key: "bio", label: "Bio" },
  { key: "experienceYears", label: "OutSystems experience" },
  { key: "certifications", label: "Certifications" },
  { key: "links", label: "Links" },
] as const

export type VisibilitySettings = {
  visibility: string
  fieldVisibility: Record<string, string>
}

type ProfileVisibilitySettingsProps = {
  initialSettings: VisibilitySettings
}

export function ProfileVisibilitySettings({ initialSettings }: ProfileVisibilitySettingsProps) {
  const router = useRouter()
  const [visibility, setVisibility] = useState(initialSettings.visibility || "public")
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, string>>(
    initialSettings.fieldVisibility || {},
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function isFieldPublic(key: string) {
    return fieldVisibility[key] !== "private"
  }

  function toggleField(key: string) {
    setSuccess(false)
    setFieldVisibility((prev) => ({ ...prev, [key]: isFieldPublic(key) ? "private" : "public" }))
  }

  async function handleSave() {
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch("/api/profile/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility, fieldVisibility }),
      })
      const body = await res.json().catch(() => ({}))

      if (res.status === 200) {
        setSuccess(true)
        router.refresh()
        return
      }
      setError(body.message ?? "Something went wrong. Try again.")
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control whether your profile is public and which fields visitors can see.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-primary">
          Visibility settings saved.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="visibility">Profile visibility</Label>
        <Select
          value={visibility}
          onValueChange={(value) => {
            setSuccess(false)
            setVisibility(value ?? "public")
          }}
        >
          <SelectTrigger id="visibility" className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Visible fields</Label>
        <ul className="space-y-2">
          {FIELDS.map((field) => (
            <li
              key={field.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <span className="text-sm">{field.label}</span>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={isFieldPublic(field.key)}
                  onChange={() => toggleField(field.key)}
                  aria-label={`Show ${field.label} on public profile`}
                  className="h-4 w-4 rounded border-input"
                />
                Show on public profile
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={handleSave} disabled={submitting}>
        {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
        Save visibility settings
      </Button>
    </div>
  )
}
