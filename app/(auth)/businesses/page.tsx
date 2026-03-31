"use client"

import Link from "next/link"
import { Plus, Building2, MapPin, Phone as PhoneIcon, TrendingUp, Users, Pause, Play, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBusinesses } from "@/lib/stores/business-context"
import { EmptyState } from "@/components/states/empty-state"
import { cn } from "@/lib/utils"

export default function BusinessesPage() {
  const { businesses, toggleBusinessStatus } = useBusinesses()

  if (businesses.length === 0) {
    return <EmptyState icon={Building2} title="No businesses yet" description="Add your first business to start capturing missed calls." actionLabel="Add Business" onAction={() => {}} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{businesses.length} business{businesses.length !== 1 ? "es" : ""}</p>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Add Business</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map(biz => (
          <div key={biz.id} className="rounded-xl border border-border bg-card p-5 space-y-4 hover:border-primary/30 transition-colors group">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{biz.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />{biz.city}
                </div>
              </div>
              <Badge variant="outline" className={cn("text-xs", biz.status === "Active" ? "bg-status-completed/10 text-status-completed border-status-completed/30" : "bg-status-paused/10 text-status-paused border-status-paused/30")}>
                {biz.status}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
              <div className="text-center">
                <p className="text-lg font-semibold tabular-nums">{biz.stats.leadsToday}</p>
                <p className="text-[10px] text-muted-foreground">Leads Today</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold tabular-nums">{biz.stats.callbacksMade}</p>
                <p className="text-[10px] text-muted-foreground">Callbacks</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold tabular-nums">{biz.stats.answerRate}%</p>
                <p className="text-[10px] text-muted-foreground">Answer Rate</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><PhoneIcon className="w-3 h-3" />{biz.phone}</div>
              <div className="flex items-center gap-1.5"><Users className="w-3 h-3" />Agent: <span className="text-foreground font-medium">{biz.agentConfig.name}</span></div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" asChild>
                <Link href={`/businesses/${biz.id}/settings`}><Settings className="w-3.5 h-3.5" />Settings</Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" asChild>
                <Link href={`/businesses/${biz.id}/knowledge-base`}><TrendingUp className="w-3.5 h-3.5" />Knowledge</Link>
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => toggleBusinessStatus(biz.id)} className={cn("shrink-0", biz.status === "Active" ? "text-status-paused hover:text-status-paused" : "text-status-completed hover:text-status-completed")}>
                {biz.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
