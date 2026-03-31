"use client"

import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground mt-2">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 mt-2 font-mono">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline" className="gap-1.5"><RotateCcw className="w-4 h-4" />Try Again</Button>
          <Button onClick={() => window.location.href = "/dashboard"} className="gap-1.5"><Home className="w-4 h-4" />Dashboard</Button>
        </div>
      </div>
    </div>
  )
}
