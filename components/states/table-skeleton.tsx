"use client"

import { SkeletonBlock } from "./page-skeleton"

interface TableSkeletonProps {
  columns?: number
  rows?: number
}

export function TableSkeleton({ columns = 6, rows = 8 }: TableSkeletonProps) {
  const widths = ["w-32", "w-28", "w-24", "w-20", "w-20", "w-16", "w-12", "w-24"]

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-border bg-secondary/20">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBlock key={i} className={`h-3 ${widths[i % widths.length]}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonBlock key={colIdx} className={`h-4 ${widths[colIdx % widths.length]}`} />
          ))}
        </div>
      ))}
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <SkeletonBlock className="h-3 w-32" />
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
