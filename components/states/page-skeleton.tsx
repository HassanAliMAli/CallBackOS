"use client"

import { cn } from "@/lib/utils"

interface SkeletonBlockProps {
  className?: string
}

function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-1">
      {/* Title skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-8 w-48" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-32" />
          <SkeletonBlock className="h-9 w-36" />
        </div>
      </div>
      {/* KPI row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      {/* Content area skeleton */}
      <SkeletonBlock className="h-10 w-80" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 space-y-3", className)}>
      <SkeletonBlock className="h-5 w-3/4" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-4 w-2/3" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-md">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      ))}
      <SkeletonBlock className="h-10 w-full rounded-md" />
    </div>
  )
}

export { SkeletonBlock }
