"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

type FieldErrors = {
  username?: string
  password?: string
  form?: string
}

export type LoginResult = {
  token: string
  userId: string
}

type LoginFormProps = {
  onSuccess?: (result: LoginResult) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!username.trim()) next.username = "Username is required."
    if (!password) next.password = "Password is required."
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const body = await res.json().catch(() => ({}))

      if (res.status === 200) {
        setErrors({})
        onSuccess?.({ token: body.token, userId: body.userId })
        // No dashboard/profile page exists yet (Profile Page {SCR-3} is story
        // 9431619, not built yet) - redirect home until it ships.
        router.push("/")
        return
      }
      if (res.status === 401) {
        setErrors({ form: body.message ?? "Incorrect username or password." })
        return
      }
      if (res.status === 404) {
        setErrors({ username: body.message ?? "We couldn't find an account with that username." })
        return
      }
      setErrors({ form: body.message ?? "Something went wrong. Try again." })
    } catch {
      setErrors({ form: "Something went wrong. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-border bg-card p-6">
      {errors.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <p id="username-error" role="alert" className="text-xs text-destructive">
            {errors.username}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-xs text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
        Log in
      </Button>
    </form>
  )
}
