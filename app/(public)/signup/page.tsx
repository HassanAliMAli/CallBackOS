"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, Activity, Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/states/loading-button"
import { useAuth } from "@/lib/stores/auth-context"
import { cn } from "@/lib/utils"

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  
  if (score <= 1) return { score, label: "Weak", color: "bg-status-failed" }
  if (score === 2) return { score, label: "Fair", color: "bg-status-calling" }
  if (score === 3) return { score, label: "Good", color: "bg-status-completed" }
  return { score, label: "Strong", color: "bg-status-completed" }
}

export default function SignUpPage() {
  const router = useRouter()
  const { signup, setUser } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const requirements = [
    { met: password.length >= 8, label: "At least 8 characters" },
    { met: /[A-Z]/.test(password), label: "One uppercase letter" },
    { met: /\d/.test(password), label: "One number" },
    { met: /[^a-zA-Z0-9]/.test(password), label: "One special character" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }
    if (strength.score < 2) {
      setError("Password is too weak")
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Failed to create account")
        setIsLoading(false)
        return
      }
      
      // Set user in auth context and redirect to onboarding
      setUser(data.user)
      await signup(data.user.name, data.user.email, password)
      router.push("/onboarding")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
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
          <h2 className="text-2xl font-bold tracking-tight mb-3">Start capturing every lead</h2>
          <p className="text-muted-foreground leading-relaxed">
            Set up in 5 minutes. No credit card required on the free plan. Your AI agent handles calls while you focus on growing your business.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 lg:hidden mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">CallbackOS</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start your free plan today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength.score ? strength.color : "bg-border")} />
                      ))}
                    </div>
                    <span className={cn("text-xs font-medium", strength.score <= 1 ? "text-status-failed" : strength.score === 2 ? "text-status-calling" : "text-status-completed")}>
                      {strength.label}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {requirements.map((req) => (
                      <li key={req.label} className={cn("flex items-center gap-1.5 text-xs", req.met ? "text-status-completed" : "text-muted-foreground")}>
                        <Check className={cn("w-3 h-3", !req.met && "opacity-30")} />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <LoadingButton type="submit" className="w-full" isLoading={isLoading} loadingText="Creating account…">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </LoadingButton>

            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="#" className="underline hover:text-foreground">Terms</Link> and{" "}
              <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:text-primary/80 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
