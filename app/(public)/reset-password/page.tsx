"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, Eye, EyeOff, ArrowRight, Check, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/states/loading-button"
import { cn } from "@/lib/utils"

function getPasswordStrength(password: string) {
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

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    if (strength.score < 2) { setError("Password is too weak"); return }
    setIsLoading(true)
    // TODO: Call API to reset password with token
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="p-4 rounded-full bg-status-completed/10 w-fit mx-auto">
            <ShieldCheck className="w-8 h-8 text-status-completed" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Password reset!</h1>
            <p className="text-sm text-muted-foreground mt-2">Your password has been successfully updated. You can now sign in with your new password.</p>
          </div>
          <LoadingButton className="w-full" onClick={() => router.push("/signin")}>
            Sign In
            <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>
    )
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

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength.score ? strength.color : "bg-border")} />
                  ))}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{strength.label}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <LoadingButton type="submit" className="w-full" isLoading={isLoading} loadingText="Resetting…">
            Reset Password
            <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </form>
      </div>
    </div>
  )
}
