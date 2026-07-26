import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "Log in — Outfolio",
  description: "Log in to your Outfolio account to manage your case studies.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back. Log in to manage your case studies.
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
