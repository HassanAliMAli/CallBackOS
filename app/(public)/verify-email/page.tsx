"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/states/loading-button"
import { cn } from "@/lib/utils"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError("")

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(""))
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")
    if (fullCode.length < 6) {
      setError("Please enter the full 6-digit code")
      return
    }
    setIsLoading(true)
    // TODO: Call API to verify email code
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    router.push("/onboarding")
  }

  const handleResend = async () => {
    setResendCooldown(30)
    // TODO: Call API to resend verification email
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold tracking-tight">CallbackOS</span>
        </div>

        <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a 6-digit verification code to<br />
            <span className="font-medium text-foreground">your email address</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "w-11 h-13 text-center text-lg font-semibold rounded-lg border bg-background outline-none transition-all",
                  digit ? "border-primary ring-1 ring-primary/20" : "border-border",
                  "focus:border-primary focus:ring-2 focus:ring-primary/30"
                )}
              />
            ))}
          </div>

          <LoadingButton type="submit" className="w-full" isLoading={isLoading} loadingText="Verifying…">
            Verify Email
            <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </form>

        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          {resendCooldown > 0 ? (
            <span className="text-muted-foreground/60">Resend in {resendCooldown}s</span>
          ) : (
            <button onClick={handleResend} className="text-primary hover:text-primary/80 font-medium">
              Resend
            </button>
          )}
        </p>
      </div>
    </div>
  )
}
