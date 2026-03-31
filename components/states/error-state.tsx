"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-destructive/20 bg-destructive/5",
      className
    )}>
      <div className="p-3 rounded-full bg-destructive/10 mb-3">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm">
        {description}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-3 gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      )}
    </div>
  )
}
