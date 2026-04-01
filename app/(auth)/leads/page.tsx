"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Download, Eye, X, CheckSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useBusinesses } from "@/lib/stores/business-context"
import type { Lead, LeadStatus, LeadOutcome, Urgency } from "@/lib/types"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://callbackos-api.hassanali205031.workers.dev"

import { LeadDetailPanel } from "@/components/lead-detail-panel"
import { EscalateModal } from "@/components/modals/escalate-modal"
import { MarkResolvedModal } from "@/components/modals/mark-resolved-modal"
import { toast } from "sonner"

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffMs / 86400000)}d ago`
}

function formatDuration(s: number): string { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}` }

function getStatusStyles(status: LeadStatus): string {
  const m: Record<LeadStatus, string> = { Queued: "bg-status-queued/15 text-status-queued border-status-queued/30", Calling: "bg-status-calling/15 text-status-calling border-status-calling/30", Completed: "bg-status-completed/15 text-status-completed border-status-completed/30", Escalate: "bg-status-escalate/15 text-status-escalate border-status-escalate/30", Failed: "bg-status-failed/15 text-status-failed border-status-failed/30" }
  return m[status]
}
function getOutcomeStyles(o: LeadOutcome): string {
  if (!o) return ""
  const m: Record<NonNullable<LeadOutcome>, string> = { Booked: "bg-status-completed/10 text-status-completed", Qualified: "bg-status-calling/10 text-status-calling", "Wrong Number": "bg-muted text-muted-foreground", "Not Interested": "bg-muted text-muted-foreground", "No Answer": "bg-status-failed/10 text-status-failed", "Needs Human": "bg-status-escalate/10 text-status-escalate", Voicemail: "bg-muted text-muted-foreground" }
  return m[o]
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, selectLead] = useState<Lead | null>(null)
  
  const escalateLead = (id: string) => { setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "Escalate", outcome: "Needs Human" } : l)); selectLead(null) }
  const markResolved = (id: string) => { setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "Completed", outcome: "Booked" } : l)); selectLead(null) }

  useEffect(() => {
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
  const { businesses } = useBusinesses()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [businessFilter, setBusinessFilter] = useState("all")
  const [outcomeFilter, setOutcomeFilter] = useState("all")

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal States
  const [escalateInfo, setEscalateInfo] = useState<{ id: string, caller: string } | null>(null)
  const [resolveInfo, setResolveInfo] = useState<{ id: string, caller: string } | null>(null)

  const filtered = useMemo(() => {
    let result = [...leads]
    if (search) { const t = search.toLowerCase(); result = result.filter(l => l.callerNumber.toLowerCase().includes(t) || (l.callerName?.toLowerCase().includes(t) ?? false) || l.businessName.toLowerCase().includes(t)) }
    if (statusFilter !== "all") result = result.filter(l => l.status === statusFilter)
    if (businessFilter !== "all") result = result.filter(l => l.businessId === businessFilter)
    if (outcomeFilter !== "all") result = result.filter(l => l.outcome === outcomeFilter)
    return result
  }, [leads, search, statusFilter, businessFilter, outcomeFilter])

  const hasFilters = statusFilter !== "all" || businessFilter !== "all" || outcomeFilter !== "all" || search
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setBusinessFilter("all"); setOutcomeFilter("all") }

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map(l => l.id))
    }
  }

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedIds.length} lead(s)...`)
    setSelectedIds([])
  }

  return (
    <div className="space-y-4 pb-20 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by phone, name, business…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Queued">Queued</SelectItem><SelectItem value="Calling">Calling</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Escalate">Escalate</SelectItem><SelectItem value="Failed">Failed</SelectItem></SelectContent></Select>
          <Select value={businessFilter} onValueChange={setBusinessFilter}><SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Business" /></SelectTrigger><SelectContent><SelectItem value="all">All Businesses</SelectItem>{businesses.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select>
          <Select value={outcomeFilter} onValueChange={setOutcomeFilter}><SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Outcome" /></SelectTrigger><SelectContent><SelectItem value="all">All Outcomes</SelectItem><SelectItem value="Booked">Booked</SelectItem><SelectItem value="Qualified">Qualified</SelectItem><SelectItem value="No Answer">No Answer</SelectItem><SelectItem value="Needs Human">Needs Human</SelectItem><SelectItem value="Wrong Number">Wrong Number</SelectItem><SelectItem value="Not Interested">Not Interested</SelectItem><SelectItem value="Voicemail">Voicemail</SelectItem></SelectContent></Select>
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs text-muted-foreground"><X className="w-3.5 h-3.5" />Clear</Button>}
          <Button variant="outline" size="sm" className="gap-1.5 ml-auto"><Download className="w-3.5 h-3.5" />Export All</Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} lead{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border shadow-xl rounded-full px-4 py-2 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
          <span className="text-sm font-medium whitespace-nowrap"><Badge variant="secondary" className="mr-2">{selectedIds.length}</Badge> selected</span>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleBulkExport} className="h-8 text-xs"><Download className="w-3.5 h-3.5 mr-1" /> Export CSV</Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-status-completed hover:text-status-completed hover:bg-status-completed/10"><CheckSquare className="w-3.5 h-3.5 mr-1" /> Mark Resolved</Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete</Button>
            <div className="h-4 w-px bg-border my-auto mx-1"></div>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="h-8 text-xs text-muted-foreground"><X className="w-3 h-3 mr-1" /> Deselect</Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent border-border">
            <TableHead className="w-[40px] px-4"><Checkbox checked={selectedIds.length > 0 && selectedIds.length === filtered.length} onCheckedChange={toggleAll} /></TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Caller</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Business</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outcome</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attempts</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-[80px]"><span className="sr-only">Actions</span></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-12 text-sm text-muted-foreground">No leads match your filters</TableCell></TableRow>
            ) : filtered.map(lead => (
              <TableRow key={lead.id} className="border-border hover:bg-muted/30 cursor-pointer" onClick={() => selectLead(lead)}>
                <TableCell className="px-4" onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedIds.includes(lead.id)} onCheckedChange={() => toggleOne(lead.id)} /></TableCell>
                <TableCell><span className="font-mono text-sm">{lead.callerNumber}</span>{lead.callerName && <p className="text-xs text-muted-foreground">{lead.callerName}</p>}</TableCell>
                <TableCell className="text-sm">{lead.businessName}</TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">{formatRelativeTime(lead.missedAt)}</TableCell>
                <TableCell><Badge variant="outline" className={cn("text-xs font-medium", getStatusStyles(lead.status))}>{lead.status}</Badge></TableCell>
                <TableCell>{lead.outcome ? <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", getOutcomeStyles(lead.outcome))}>{lead.outcome}</span> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">{lead.duration ? formatDuration(lead.duration) : "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground tabular-nums">{lead.callbackAttempt}/{lead.maxAttempts}</TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={e => { e.stopPropagation(); selectLead(lead) }}><Eye className="w-3.5 h-3.5 mr-1" />View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeadDetailPanel 
        lead={selectedLead} 
        open={!!selectedLead} 
        onClose={() => selectLead(null)} 
        onEscalate={(id) => setEscalateInfo({ id, caller: selectedLead!.callerNumber })}
        onMarkResolved={(id) => setResolveInfo({ id, caller: selectedLead!.callerNumber })}
      />

      {escalateInfo && (
        <EscalateModal 
          open={!!escalateInfo} 
          onClose={() => setEscalateInfo(null)}
          leadId={escalateInfo.id}
          callerNumber={escalateInfo.caller}
        />
      )}

      {resolveInfo && (
        <MarkResolvedModal 
          open={!!resolveInfo} 
          onClose={() => setResolveInfo(null)}
          leadId={resolveInfo.id}
          callerNumber={resolveInfo.caller}
        />
      )}
    </div>
  )
}
