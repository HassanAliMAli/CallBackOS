"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, PhoneOutgoing, Bot, User, Play, Square, RotateCcw, Check, Clock, Sparkles, AlertTriangle, Target, Gauge, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBusinesses } from "@/lib/stores/business-context"
import { cn } from "@/lib/utils"

type SimStep = "idle" | "initiating" | "ringing" | "connected" | "conversation" | "completed"

interface SimMessage {
  id: number
  speaker: "Agent" | "Caller"
  message: string
  timestamp: Date
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://callbackos-api.hassanali205031.workers.dev"

export default function SimulatePage() {
  const { businesses } = useBusinesses()
  const [selectedBiz, setSelectedBiz] = useState("")
  const [callerName, setCallerName] = useState("John Doe")
  const [callerNumber, setCallerNumber] = useState("+92 300 111 9999")
  const [callReason, setCallReason] = useState("Missed call regarding an appointment booking.")
  const [simStep, setSimStep] = useState<SimStep>("idle")
  const [messages, setMessages] = useState<SimMessage[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Update selectedBiz when businesses load
  useEffect(() => {
    if (businesses.length > 0 && !selectedBiz) {
      setSelectedBiz(businesses[0].id)
    }
  }, [businesses])

  const biz = businesses.find(b => b.id === selectedBiz)
  const isRunning = simStep !== "idle" && simStep !== "completed"

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning])

  const startSimulation = async () => {
    setMessages([])
    setMessageIndex(0)
    setElapsedTime(0)

    // Step through phases
    setSimStep("initiating")
    await new Promise(r => setTimeout(r, 1500))
    setSimStep("ringing")
    
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: selectedBiz,
          name: callerName || "Unknown Caller",
          phone: callerNumber || "+10000000000"
        })
      });
      
      if (!res.ok) throw new Error("Simulation call failed");
      
      setSimStep("connected")
      await new Promise(r => setTimeout(r, 1000))
      setSimStep("conversation")
      
      // Real call is happening via ElevenLabs natively on the phone. 
      // The transcript isn't simulated here locally anymore, it streams over WS to the Lead Panel instead!
      setMessages([{ id: 1, speaker: "Agent", message: "The outbound call has been dispatched via ElevenLabs. Answer your phone! View live transcript in the Leads dashboard.", timestamp: new Date() }])
      
      await new Promise(r => setTimeout(r, 5000))
      setSimStep("completed")
    } catch (e) {
      console.error(e)
      setSimStep("idle")
    }
  }

  const reset = () => {
    setSimStep("idle")
    setMessages([])
    setMessageIndex(0)
    setElapsedTime(0)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const formatTimer = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`

  const stepLabels: { step: SimStep; label: string }[] = [
    { step: "initiating", label: "Initiating callback" },
    { step: "ringing", label: "Ringing caller" },
    { step: "connected", label: "Connected" },
    { step: "conversation", label: "Conversation in progress" },
    { step: "completed", label: "Call completed" },
  ]

  const currentStepIndex = stepLabels.findIndex(s => s.step === simStep)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Config */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Simulate a Missed Call</h2>
        <p className="text-sm text-muted-foreground">Test your AI agent by simulating a missed call scenario. No real calls will be made.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business</Label>
            <Select value={selectedBiz} onValueChange={setSelectedBiz} disabled={isRunning}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{businesses.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label>Caller Number (Optional)</Label>
            <Input value={callerNumber} onChange={e => setCallerNumber(e.target.value)} disabled={isRunning} placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-2">
            <Label>Caller Name (Optional)</Label>
            <Input value={callerName} onChange={e => setCallerName(e.target.value)} disabled={isRunning} placeholder="e.g. John Doe" />
          </div>
          <div className="space-y-2">
            <Label>Reason for call context (Optional)</Label>
            <Textarea value={callReason} onChange={e => setCallReason(e.target.value)} disabled={isRunning} placeholder="Why is the agent calling them back?" className="resize-none h-10 min-h-[40px] py-2" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          {simStep === "idle" ? (
            <Button onClick={startSimulation} className="gap-1.5"><Play className="w-4 h-4" />Start Simulation</Button>
          ) : simStep === "completed" ? (
            <Button onClick={reset} variant="outline" className="gap-1.5"><RotateCcw className="w-4 h-4" />Run Again</Button>
          ) : (
            <Button onClick={reset} variant="destructive" className="gap-1.5"><Square className="w-4 h-4" />Stop</Button>
          )}
          {isRunning && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-status-live animate-live-pulse" />
              <span className="tabular-nums">{formatTimer(elapsedTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Tracker  */}
      {simStep !== "idle" && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Call Progress</h3>
          <div className="flex items-center gap-2">
            {stepLabels.map((s, i) => (
              <div key={s.step} className="flex items-center flex-1">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
                  i < currentStepIndex ? "bg-status-completed border-status-completed text-white" :
                  i === currentStepIndex ? "border-primary text-primary animate-pulse" :
                  "border-border text-muted-foreground"
                )}>
                  {i < currentStepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < stepLabels.length - 1 && <div className={cn("flex-1 h-0.5 mx-1 rounded-full", i < currentStepIndex ? "bg-status-completed" : "bg-border")} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">{stepLabels.map((s, i) => <span key={s.step} className={cn("text-[9px] font-medium", i === currentStepIndex ? "text-primary" : "text-muted-foreground")}>{s.label}</span>)}</div>
        </div>
      )}

      {/* Live Transcript */}
      {messages.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Phone className="w-3.5 h-3.5" />Live Transcript</h3>
            {biz && <Badge variant="outline" className="text-[10px]">{biz.name}</Badge>}
          </div>
          <div ref={chatRef} className="max-h-[400px] overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex flex-col gap-1", msg.speaker === "Agent" ? "items-start" : "items-end")}>
                <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", msg.speaker !== "Agent" && "flex-row-reverse")}>
                  {msg.speaker === "Agent" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  <span className="font-medium">{msg.speaker}</span>
                </div>
                <div className={cn("max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed animate-slide-up-fade", msg.speaker === "Agent" ? "bg-primary/10 rounded-tl-sm" : "bg-secondary rounded-tr-sm")}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary (shown after completion) */}
      {simStep === "completed" && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-4 animate-slide-up-fade">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />AI Summary</h3>
          <p className="text-sm text-muted-foreground">
            Call dispatched successfully. Check the <strong>Leads dashboard</strong> for the live transcript and AI-generated summary once the call completes.
          </p>
          <div className="grid sm:grid-cols-3 gap-2 pt-2">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Status</p><p className="text-sm font-medium">Dispatched</p></div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Business</p><p className="text-sm font-medium">{biz?.name || "—"}</p></div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Caller</p><p className="text-sm font-medium">{callerName || callerNumber}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
