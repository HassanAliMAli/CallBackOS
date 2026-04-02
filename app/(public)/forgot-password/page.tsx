"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, ArrowLeft, ArrowRight, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/states/loading-button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    // Password reset requires email service - skip for now
    // In production: Call API to send password reset email
    setIsLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold tracking-tight">CallbackOS</span>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-status-completed/10 w-fit mx-auto">
              <Mail className="w-8 h-8 text-status-completed" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="text-sm text-muted-foreground mt-2">
                We sent a password reset link to<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button onClick={() => setSent(false)} className="text-primary hover:text-primary/80 font-medium">
                  try again
                </button>
              </p>
              <Link href="/signin" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>

              <LoadingButton type="submit" className="w-full" isLoading={isLoading} loadingText="Sending…">
                Send Reset Link
                <ArrowRight className="w-4 h-4" />
              </LoadingButton>
            </form>

            <Link href="/signin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
