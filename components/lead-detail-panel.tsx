"use client"

import { Phone, Clock, Timer, AlertTriangle, CheckCircle2, Bot, User, Sparkles, Target, Gauge, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState, useRef } from "react"
import type { Lead, LeadStatus, LeadOutcome, Urgency, TranscriptMessage } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://callbackos-api.hassanali205031.workers.dev"
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://callbackos-api.hassanali205031.workers.dev"

interface LeadDetailPanelProps {
  lead: Lead | null
  open: boolean
  onClose: () => void
  onEscalate?: (leadId: string) => void
  onMarkResolved?: (leadId: string) => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  })
}

function getStatusStyles(status: LeadStatus): string {
  const styles: Record<LeadStatus, string> = {
    Queued: "bg-status-queued/15 text-status-queued border-status-queued/30",
    Calling: "bg-status-calling/15 text-status-calling border-status-calling/30",
    Completed: "bg-status-completed/15 text-status-completed border-status-completed/30",
    Escalate: "bg-status-escalate/15 text-status-escalate border-status-escalate/30",
    Failed: "bg-status-failed/15 text-status-failed border-status-failed/30"
  }
  return styles[status]
}

function getOutcomeStyles(outcome: LeadOutcome): string {
  if (!outcome) return ""
  const styles: Record<NonNullable<LeadOutcome>, string> = {
    "Booked": "bg-status-completed/15 text-status-completed",
    "Qualified": "bg-status-calling/15 text-status-calling",
    "Wrong Number": "bg-muted text-muted-foreground",
    "Not Interested": "bg-muted text-muted-foreground",
    "No Answer": "bg-status-failed/15 text-status-failed",
    "Needs Human": "bg-status-escalate/15 text-status-escalate",
    "Voicemail": "bg-muted text-muted-foreground",
  }
  return styles[outcome]
}

function getUrgencyStyles(urgency: Urgency): string {
  const styles: Record<Urgency, string> = {
    Low: "bg-status-completed/15 text-status-completed",
    Medium: "bg-status-calling/15 text-status-calling",
    High: "bg-status-escalate/15 text-status-escalate"
  }
  return styles[urgency]
}

function TranscriptBubble({ message }: { message: TranscriptMessage }) {
  const isAgent = message.speaker === "Agent"
  
  return (
    <div className={`flex flex-col gap-1 ${isAgent ? "items-start" : "items-end"}`}>
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${isAgent ? "" : "flex-row-reverse"}`}>
        {isAgent ? (
          <Bot className="w-3 h-3" />
        ) : (
          <User className="w-3 h-3" />
        )}
        <span className="font-medium">{message.speaker}</span>
        <span>·</span>
        <span>{formatMessageTime(message.timestamp)}</span>
      </div>
      <div 
        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed
          ${isAgent 
            ? "bg-primary/10 text-foreground rounded-tl-sm" 
            : "bg-secondary text-foreground rounded-tr-sm"
          }`}
      >
        {message.message}
      </div>
    </div>
  )
}

export function LeadDetailPanel({ 
  lead, 
  open, 
  onClose,
  onEscalate,
  onMarkResolved 
}: LeadDetailPanelProps) {
  const [liveTranscript, setLiveTranscript] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [aiSummary, setAiSummary] = useState<any>(null)
  const [isLive, setIsLive] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!open || !lead) return

    // 1. Fetch historical data (deep info)
    fetch(`${API_URL}/api/leads/${lead.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.transcripts) {
          // parse transcript content into array
          try {
            const parsed = typeof data.transcripts[0]?.content === 'string' 
                ? JSON.parse(data.transcripts[0].content) 
                : data.transcripts[0]?.content;
            setLiveTranscript(Array.isArray(parsed) ? parsed : []);
          } catch(e) { /* content might be raw text */ }
        }
        if (data.activityLogs) setActivityLogs(data.activityLogs)
        // Set default ai Summary if missing
        setAiSummary({
            keyPoints: [],
            intentDetected: "Pending",
            urgency: "Low",
            recommendedAction: "Wait for call to finish"
        })
      })
      .catch(e => console.error("Failed to fetch lead details", e))

    // 2. Open WebSocket for live transcripts
    const ws = new WebSocket(`${WS_URL}/api/calls/${lead.id}/live`)
    wsRef.current = ws

    ws.onopen = () => setIsLive(true)
    ws.onclose = () => setIsLive(false)
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        // If it's a transcript chunk from ElevenLabs
        if (payload.type === 'transcript_chunk') {
           setLiveTranscript(prev => [
             ...prev, 
             { id: Date.now(), speaker: payload.source === 'agent' ? 'Agent' : 'Caller', message: payload.text, timestamp: new Date() }
           ])
        }
      } catch (err) {
        console.error("WS Parse error", err)
      }
    }

    return () => {
      ws.close()
      setLiveTranscript([])
      setActivityLogs([])
      setIsLive(false)
    }
  }, [open, lead])

  if (!lead) return null

  const showEscalateButton = lead.status !== "Escalate" && lead.status !== "Completed"
  const showResolvedButton = lead.status !== "Completed"

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0 gap-0">
        {/* Top Section - Header */}
        <SheetHeader className="px-6 py-5 border-b border-border space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-semibold text-foreground font-mono tracking-tight">
                {lead.callerNumber}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                {lead.businessName}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                variant="outline" 
                className={`text-xs font-medium ${getStatusStyles(lead.status)}`}
              >
                {lead.status}
              </Badge>
              {lead.outcome && (
                <Badge 
                  variant="secondary"
                  className={`text-xs font-medium ${getOutcomeStyles(lead.outcome)}`}
                >
                  {lead.outcome}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Time and Duration */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(lead.missedAt)}</span>
            </div>
            {lead.duration && (
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatDuration(lead.duration)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {showEscalateButton && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-status-escalate/50 text-status-escalate hover:bg-status-escalate/10 hover:text-status-escalate"
                onClick={() => onEscalate?.(lead.id)}
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Escalate to Human
              </Button>
            )}
            {showResolvedButton && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-status-completed/50 text-status-completed hover:bg-status-completed/10 hover:text-status-completed"
                onClick={() => onMarkResolved?.(lead.id)}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Mark Resolved
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs defaultValue="transcript" className="flex-1 flex flex-col">
            <div className="px-6 border-b border-border">
              <TabsList className="bg-transparent border-none p-0 h-12 gap-6 w-full justify-start rounded-none">
                <TabsTrigger value="transcript" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-foreground relative">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Transcript
                    {isLive && (
                      <span className="ml-1 w-2 h-2 rounded-full bg-status-live animate-live-pulse" title="Live Connection" />
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-foreground relative">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" />Activity</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-foreground relative">
                  <span className="flex items-center gap-2 flex-1">Internal Notes <Badge variant="secondary" className="px-1.5 h-5 ml-1">{lead.notes?.length || 0}</Badge></span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Transcript Tab */}
            <TabsContent value="transcript" className="flex-1 overflow-hidden flex flex-col m-0 data-[state=active]:flex">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {liveTranscript && liveTranscript.length > 0 ? (
                  liveTranscript.map((msg) => (
                    <div key={msg.id || Math.random()} className="animate-slide-up-fade">
                      <TranscriptBubble message={msg} />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                    Waiting for transcript...
                  </div>
                )}
              </div>
              
              {/* AI Summary pinned at bottom of transcript tab */}
              {aiSummary && (
                <div className="border-t border-border bg-secondary/10 shrink-0">
                  <div className="px-6 py-4 space-y-4">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Summary
                    </h3>
                    <div className="space-y-3">
                      <ul className="space-y-1.5">
                        {aiSummary.keyPoints.map((point: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="grid gap-2 pt-2">
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/50">
                          <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Intent Detected</p>
                            <p className="text-sm text-foreground truncate">{aiSummary.intentDetected}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/50">
                          <Gauge className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Urgency</p>
                            <Badge variant="secondary" className={`text-xs font-medium mt-0.5 ${getUrgencyStyles(aiSummary.urgency)}`}>
                              {aiSummary.urgency}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/50">
                          <Lightbulb className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Recommended Action</p>
                            <p className="text-sm text-foreground">{aiSummary.recommendedAction}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 overflow-y-auto px-6 py-4 m-0">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {activityLogs && activityLogs.length > 0 ? (
                  activityLogs.map((activity, i) => (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-primary/20 bg-primary/10 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_0_4px_var(--background)]">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm capitalize">{activity.type.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] text-muted-foreground">{formatTime(new Date(activity.createdAt))}</span>
                        </div>
                        <div className="text-sm text-muted-foreground leading-snug">
                          {activity.details || 'System event triggered'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground pt-4 relative z-10">No activity recorded yet.</div>
                )}
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 overflow-y-auto px-6 py-4 m-0 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Add Internal Note</label>
                <textarea 
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px] resize-none" 
                  placeholder="Type a note about this lead..."
                />
                <div className="flex justify-end">
                  <Button size="sm">Save Note</Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                {lead.notes?.length > 0 ? (
                  lead.notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                            {note.author.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{note.author}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatMessageTime(note.timestamp)}</span>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">No notes have been added yet.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
