"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Lead, LeadStatus, LeadOutcome } from "@/lib/types"

interface LeadTableProps {
  leads: Lead[]
  onSelectLead: (lead: Lead) => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function getStatusStyles(status: LeadStatus): string {
  const styles: Record<LeadStatus, string> = {
    Queued: "bg-status-queued/15 text-status-queued border-status-queued/30",
    Calling: "bg-status-calling/15 text-status-calling border-status-calling/30 animate-pulse",
    Completed: "bg-status-completed/15 text-status-completed border-status-completed/30",
    Escalate: "bg-status-escalate/15 text-status-escalate border-status-escalate/30",
    Failed: "bg-status-failed/15 text-status-failed border-status-failed/30"
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
    "Voicemail": "bg-muted text-muted-foreground",
  }
  return styles[outcome]
}

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-border bg-card">
        <div className="p-3 rounded-full bg-secondary mb-3">
          <Eye className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No leads found</p>
        <p className="text-xs text-muted-foreground mt-1">
          Simulate a missed call to get started
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Caller
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Business
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Time
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Outcome
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-[80px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow 
              key={lead.id} 
              className="border-border hover:bg-muted/30 cursor-pointer"
              onClick={() => onSelectLead(lead)}
            >
              <TableCell className="font-mono text-sm text-foreground">
                {lead.callerNumber}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {lead.businessName}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {formatRelativeTime(lead.missedAt)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getStatusStyles(lead.status)}`}
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                {lead.outcome ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getOutcomeStyles(lead.outcome)}`}>
                    {lead.outcome}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectLead(lead)
                  }}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
