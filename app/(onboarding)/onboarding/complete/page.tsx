"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, Building2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OnboardingCompletePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-status-completed/20 animate-ping shadow-[0_0_20px_var(--status-completed)] opacity-50 duration-1000" />
          <div className="relative w-20 h-20 bg-status-completed text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
            <Check className="w-10 h-10" strokeWidth={3} />
          </div>
          {mounted && (
            <>
              <div className="absolute -top-4 -right-4 text-primary animate-bounce delay-100"><Sparkles className="w-6 h-6" /></div>
              <div className="absolute bottom-0 -left-6 text-blue-500 animate-bounce delay-300"><Sparkles className="w-5 h-5" /></div>
            </>
          )}
        </div>

        <div className="space-y-3 px-4">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">You&apos;re all set!</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Your AI voice agent is fully provisioned and ready to handle missed calls. Let CallbackOS do the heavy lifting.
          </p>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-6 border border-border shadow-sm mx-auto max-w-sm flex flex-col gap-4">
          <Button 
            size="lg" 
            className="w-full h-12 text-base font-semibold shadow-md group"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-12 text-base text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/onboarding?step=1")}
          >
            <Building2 className="mr-2 w-4 h-4" />
            Add Another Business
          </Button>
        </div>
      </div>
    </div>
  )
}
