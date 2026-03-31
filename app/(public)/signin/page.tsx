"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, Activity, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/states/loading-button"
import { useAuth } from "@/lib/stores/auth-context"
import { cn } from "@/lib/utils"

export default function SignInPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password") /* @MOCK */
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-chart-2/5 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--primary)_0%,transparent_50%)] opacity-[0.07]" />
        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <div className="relative">
                <Phone className="w-6 h-6 text-primary" />
                <Activity className="w-4 h-4 text-primary absolute -right-2 -top-1.5" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">CallbackOS</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Never miss a lead again
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            AI-powered missed call management that automatically calls back your customers, handles conversations, and delivers qualified leads.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">CallbackOS</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your CallbackOS account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <LoadingButton type="submit" className="w-full" isLoading={isLoading} loadingText="Signing in…">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </LoadingButton>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
