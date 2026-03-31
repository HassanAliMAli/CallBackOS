"use client"

import { SkeletonBlock } from "./page-skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-8 w-32" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-40" />
          <SkeletonBlock className="h-9 w-36" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <SkeletonBlock className="w-10 h-10 rounded-md" />
            <div className="space-y-1.5 flex-1">
              <SkeletonBlock className="h-6 w-16" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-20 rounded-md" />
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="flex gap-4 px-4 py-3 border-b border-border">
          {["w-32", "w-28", "w-20", "w-16", "w-20", "w-12"].map((w, i) => (
            <SkeletonBlock key={i} className={`h-3 ${w}`} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0">
            <SkeletonBlock className="w-32 h-4" />
            <SkeletonBlock className="w-28 h-4" />
            <SkeletonBlock className="w-16 h-4" />
            <SkeletonBlock className="w-16 h-6 rounded-full" />
            <SkeletonBlock className="w-16 h-5 rounded" />
            <SkeletonBlock className="w-12 h-7 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
