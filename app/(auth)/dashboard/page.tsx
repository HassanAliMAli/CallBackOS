"use client"

import { useState, useCallback, useEffect } from "react"
import { Plus, Phone, PhoneOutgoing, TrendingUp, UserRound, Eye, Bot, User, Clock, Timer, AlertTriangle, CheckCircle2, Sparkles, Target, Gauge, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LeadDetailPanel } from "@/components/lead-detail-panel"
import type { Lead, LeadStatus, LeadOutcome, Urgency } from "@/lib/types"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://callbackos-api.hassanali205031.workers.dev"

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffMs / (1000 * 60 * 60 * 24))}d ago`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function getStatusStyles(status: LeadStatus): string {
  const styles: Record<LeadStatus, string> = {
    Queued: "bg-status-queued/15 text-status-queued border-status-queued/30",
    Calling: "bg-status-calling/15 text-status-calling border-status-calling/30 animate-pulse",
    Completed: "bg-status-completed/15 text-status-completed border-status-completed/30",
    Escalate: "bg-status-escalate/15 text-status-escalate border-status-escalate/30",
    Failed: "bg-status-failed/15 text-status-failed border-status-failed/30",
  }
  return styles[status]
}

function getOutcomeStyles(outcome: LeadOutcome): string {
  if (!outcome) return ""
  const styles: Record<NonNullable<LeadOutcome>, string> = {
    Booked: "bg-status-completed/10 text-status-completed",
    Qualified: "bg-status-calling/10 text-status-calling",
    "Wrong Number": "bg-muted text-muted-foreground",
    "Not Interested": "bg-muted text-muted-foreground",
    "No Answer": "bg-status-failed/10 text-status-failed",
    "Needs Human": "bg-status-escalate/10 text-status-escalate",
    Voicemail: "bg-muted text-muted-foreground",
  }
  return styles[outcome]
}

function getUrgencyStyles(urgency: Urgency): string {
  const styles: Record<Urgency, string> = {
    Low: "bg-status-completed/15 text-status-completed",
    Medium: "bg-status-calling/15 text-status-calling",
    High: "bg-status-escalate/15 text-status-escalate",
  }
  return styles[urgency]
}

// ─── Dashboard Page ───

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, selectLead] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [kpis, setKpis] = useState({ totalToday: 0, callbacksMade: 0, answerRate: 0, needsHuman: 0 })

  const escalateLead = (id: string) => { setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "Escalate", outcome: "Needs Human" } : l)); selectLead(null) }
  const markResolved = (id: string) => { setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "Completed", outcome: "Booked" } : l)); selectLead(null) }

  useEffect(() => {
    // 1. Fetch Analytics Overview
    fetch(`${API_URL}/api/analytics/overview`)
      .then(res => res.json())
      .then(data => setKpis(data))
      .catch(e => console.error(e))

    // 2. Fetch all leads
    fetch(`${API_URL}/api/leads`)
      .then(res => res.json())
      .then((data: any[]) => {
        const mapped: Lead[] = data.map(d => ({
          id: d.id,
          businessId: d.businessId,
          businessName: "Acme Corp", // Derived from business ID ideally
          callerName: d.name,
          callerNumber: d.phone,
          status: (d.status.charAt(0).toUpperCase() + d.status.slice(1)) as LeadStatus,
          outcome: (d.status === 'completed' ? 'Booked' : (d.status === 'escalate' ? 'Needs Human' : 'Qualified')) as LeadOutcome,
          missedAt: new Date(d.createdAt),
          callbackInitiatedAt: null,
          transcript: null,
          duration: null,
          callbackAttempt: 1,
          maxAttempts: 3,
          callbackNumber: null,
          notes: [],
          aiSummary: null,
          activityLog: []
        }))
        setLeads(mapped.sort((a,b) => b.missedAt.getTime() - a.missedAt.getTime()))
      })
      .catch(e => console.error(e))
  }, [])

  const filteredLeads = leads.filter(lead => {
    if (activeTab === "all") return true
    if (activeTab === "queued") return lead.status === "Queued"
    if (activeTab === "completed") return lead.status === "Completed"
    if (activeTab === "escalate") return lead.status === "Escalate"
    return true
  })

  const kpiCards = [
    { label: "Total Today", value: kpis.totalToday, icon: Phone, color: "text-muted-foreground" },
    { label: "Callbacks Made", value: kpis.callbacksMade, icon: PhoneOutgoing, color: "text-muted-foreground" },
    { label: "Answer Rate", value: `${kpis.answerRate}%`, icon: TrendingUp, color: "text-status-completed" },
    { label: "Needs Human", value: kpis.needsHuman, icon: UserRound, color: "text-status-escalate" },
  ]

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className={`p-2 rounded-md bg-secondary ${kpi.color}`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold text-foreground tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Lead Table */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList className="bg-secondary/50 border border-border">
              {[
                { value: "all", label: "All", count: leads.length },
                { value: "queued", label: "Queued", count: leads.filter(l => l.status === "Queued").length },
                { value: "completed", label: "Completed", count: leads.filter(l => l.status === "Completed").length },
                { value: "escalate", label: "Escalate", count: leads.filter(l => l.status === "Escalate").length },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-background">
                  {tab.label}
                  <span className="ml-1.5 text-xs text-muted-foreground">{tab.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-status-live">
                <span className="w-2 h-2 rounded-full bg-status-live animate-live-pulse" />
                Live
              </div>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Caller</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Business</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outcome</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-[80px]"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-muted/30 cursor-pointer" onClick={() => selectLead(lead)}>
                      <TableCell>
                        <span className="font-mono text-sm text-foreground">{lead.callerNumber}</span>
                        {lead.callerName && <p className="text-xs text-muted-foreground">{lead.callerName}</p>}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{lead.businessName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground tabular-nums">{formatRelativeTime(lead.missedAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs font-medium", getStatusStyles(lead.status))}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {lead.outcome ? (
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", getOutcomeStyles(lead.outcome))}>{lead.outcome}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground tabular-nums">
                        {lead.duration ? formatDuration(lead.duration) : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); selectLead(lead) }}>
                          <Eye className="w-3.5 h-3.5 mr-1" />View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Detail Panel powered by WS */}
      <LeadDetailPanel 
        lead={selectedLead} 
        open={!!selectedLead} 
        onClose={() => selectLead(null)} 
        onEscalate={escalateLead}
        onMarkResolved={markResolved}
      />
    </div>
  )
}
