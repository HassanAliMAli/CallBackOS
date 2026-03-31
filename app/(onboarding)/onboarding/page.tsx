"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Activity, ArrowLeft, ArrowRight, Building2, Clock, Bot, BookOpen, Check, Sparkles, Plus, X, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { LoadingButton } from "@/components/states/loading-button"
import { INDUSTRIES, TIME_OPTIONS, CALLBACK_DELAYS, DAYS_OF_WEEK, DEFAULT_ESCALATION_KEYWORDS } from "@/lib/constants"
import type { OperatingHours, DaySchedule } from "@/lib/types"
import { cn } from "@/lib/utils"

const STEPS = [
  { label: "Business Info", icon: Building2 },
  { label: "Operating Hours", icon: Clock },
  { label: "AI Agent", icon: Bot },
  { label: "Knowledge Base", icon: BookOpen },
]

const defaultHours: OperatingHours = {
  monday: { isClosed: false, openTime: "9:00 AM", closeTime: "5:00 PM" },
  tuesday: { isClosed: false, openTime: "9:00 AM", closeTime: "5:00 PM" },
  wednesday: { isClosed: false, openTime: "9:00 AM", closeTime: "5:00 PM" },
  thursday: { isClosed: false, openTime: "9:00 AM", closeTime: "5:00 PM" },
  friday: { isClosed: false, openTime: "9:00 AM", closeTime: "5:00 PM" },
  saturday: { isClosed: true, openTime: "10:00 AM", closeTime: "4:00 PM" },
  sunday: { isClosed: true, openTime: "10:00 AM", closeTime: "4:00 PM" },
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1 - Business
  const [bizName, setBizName] = useState("")
  const [industry, setIndustry] = useState("")
  const [bizPhone, setBizPhone] = useState("")
  const [bizWebsite, setBizWebsite] = useState("")
  const [bizCity, setBizCity] = useState("")

  // Step 2 - Hours
  const [hours, setHours] = useState<OperatingHours>(defaultHours)

  // Step 3 - Agent
  const [agentName, setAgentName] = useState("Aria")
  const [greeting, setGreeting] = useState("")
  const [closing, setClosing] = useState("")
  const [maxAttempts, setMaxAttempts] = useState("3")
  const [callbackDelay, setCallbackDelay] = useState("2-minutes")
  const [earliestTime, setEarliestTime] = useState("9:00 AM")
  const [latestTime, setLatestTime] = useState("8:00 PM")
  const [weekendCallbacks, setWeekendCallbacks] = useState(false)
  const [escalationKeywords, setEscalationKeywords] = useState<string[]>(DEFAULT_ESCALATION_KEYWORDS)
  const [newKeyword, setNewKeyword] = useState("")
  const [escName, setEscName] = useState("")
  const [escPhone, setEscPhone] = useState("")
  const [escEmail, setEscEmail] = useState("")

  // Step 4 - Knowledge Base
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([{ question: "", answer: "" }])
  const [customInstructions, setCustomInstructions] = useState("")

  const updateDay = (day: keyof OperatingHours, field: keyof DaySchedule, value: string | boolean) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !escalationKeywords.includes(newKeyword.trim().toLowerCase())) {
      setEscalationKeywords(prev => [...prev, newKeyword.trim().toLowerCase()])
      setNewKeyword("")
    }
  }

  const addFaq = () => setFaqs(prev => [...prev, { question: "", answer: "" }])
  const removeFaq = (i: number) => setFaqs(prev => prev.filter((_, idx) => idx !== i))
  const updateFaq = (i: number, field: "question" | "answer", value: string) => {
    setFaqs(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f))
  }

  const handleFinish = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000)) // @MOCK_DELAY
    setIsLoading(false)
    setIsComplete(true)
  }

  // ─── Welcome Complete Screen ───
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full bg-status-completed/20 flex items-center justify-center animate-step-complete">
              <Check className="w-10 h-10 text-status-completed" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">You&apos;re all set!</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              <span className="font-semibold text-foreground">{bizName || "Your business"}</span> is ready to go. Your AI agent <span className="font-semibold text-foreground">{agentName}</span> will start handling missed calls right away.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button onClick={() => router.push("/dashboard")} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push("/businesses")}>
              Manage Business
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">CallbackOS</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-muted-foreground">
            Skip for now
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pt-8 pb-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-semibold transition-all",
                i < step ? "bg-primary border-primary text-primary-foreground" :
                i === step ? "border-primary text-primary" :
                "border-border text-muted-foreground"
              )}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-2 rounded-full", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          {STEPS.map((s, i) => (
            <span key={i} className={cn("text-xs font-medium", i === step ? "text-primary" : "text-muted-foreground")}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 pb-32">
        {/* Step 1: Business Info */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div><h2 className="text-xl font-bold">Tell us about your business</h2><p className="text-sm text-muted-foreground mt-1">This helps your AI agent represent your business accurately.</p></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2"><Label htmlFor="biz-name">Business Name *</Label><Input id="biz-name" placeholder="City Dental Clinic" value={bizName} onChange={e => setBizName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Industry *</Label><Select value={industry} onValueChange={setIndustry}><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger><SelectContent>{INDUSTRIES.map(ind => <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="biz-phone">Business Phone *</Label><Input id="biz-phone" placeholder="+92 300 111 2233" value={bizPhone} onChange={e => setBizPhone(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="biz-website">Website</Label><Input id="biz-website" placeholder="https://yourbusiness.com" value={bizWebsite} onChange={e => setBizWebsite(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="biz-city">City</Label><Input id="biz-city" placeholder="Lahore" value={bizCity} onChange={e => setBizCity(e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* Step 2: Operating Hours */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div><h2 className="text-xl font-bold">Set your operating hours</h2><p className="text-sm text-muted-foreground mt-1">Your agent will only call back during these hours.</p></div>
            <div className="space-y-3">
              {DAYS_OF_WEEK.map(day => {
                const dayHours = hours[day.key]
                return (
                  <div key={day.key} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <div className="w-12"><span className="text-sm font-medium">{day.shortLabel}</span></div>
                    <Switch checked={!dayHours.isClosed} onCheckedChange={(checked) => updateDay(day.key, "isClosed", !checked)} />
                    {!dayHours.isClosed ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Select value={dayHours.openTime} onValueChange={(val) => updateDay(day.key, "openTime", val)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground">to</span>
                        <Select value={dayHours.closeTime} onValueChange={(val) => updateDay(day.key, "closeTime", val)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Closed</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: AI Agent */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div><h2 className="text-xl font-bold">Configure your AI agent</h2><p className="text-sm text-muted-foreground mt-1">Customize how your agent sounds and behaves.</p></div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Agent Name</Label><Input placeholder="Aria" value={agentName} onChange={e => setAgentName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Callback Delay</Label><Select value={callbackDelay} onValueChange={setCallbackDelay}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CALLBACK_DELAYS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Greeting Message</Label><Textarea placeholder="Hi! I'm calling on behalf of your business..." value={greeting} onChange={e => setGreeting(e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Closing Message</Label><Textarea placeholder="Thank you for your time! Have a great day!" value={closing} onChange={e => setClosing(e.target.value)} rows={2} /></div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Max Attempts</Label><Select value={maxAttempts} onValueChange={setMaxAttempts}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["1","2","3","4","5"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Earliest Time</Label><Select value={earliestTime} onValueChange={setEarliestTime}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Latest Time</Label><Select value={latestTime} onValueChange={setLatestTime}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border"><Label>Allow weekend callbacks</Label><Switch checked={weekendCallbacks} onCheckedChange={setWeekendCallbacks} /></div>
              <div className="space-y-2">
                <Label>Escalation Keywords</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">{escalationKeywords.map(kw => <Badge key={kw} variant="secondary" className="gap-1 text-xs">{kw}<button onClick={() => setEscalationKeywords(prev => prev.filter(k => k !== kw))}><X className="w-3 h-3" /></button></Badge>)}</div>
                <div className="flex gap-2"><Input placeholder="Add keyword" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addKeyword())} className="flex-1" /><Button variant="outline" size="sm" onClick={addKeyword}><Plus className="w-4 h-4" /></Button></div>
              </div>
              <div className="space-y-3 pt-2 border-t border-border">
                <Label className="text-sm font-semibold">Escalation Contact</Label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input placeholder="Contact name" value={escName} onChange={e => setEscName(e.target.value)} />
                  <Input placeholder="Phone" value={escPhone} onChange={e => setEscPhone(e.target.value)} />
                  <Input placeholder="Email" value={escEmail} onChange={e => setEscEmail(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Knowledge Base */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div><h2 className="text-xl font-bold">Train your AI agent</h2><p className="text-sm text-muted-foreground mt-1">Upload files and add FAQs so your agent can answer questions accurately.</p></div>
            <div className="space-y-2">
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop files here, or <span className="text-primary font-medium">browse</span></p>
                <p className="text-xs text-muted-foreground/60 mt-1">PDF, TXT, DOCX — Max 10MB per file</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>FAQs</Label><Button variant="outline" size="sm" onClick={addFaq} className="gap-1"><Plus className="w-3.5 h-3.5" />Add FAQ</Button></div>
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-card space-y-3 relative">
                  {faqs.length > 1 && <button onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>}
                  <Input placeholder="Question — e.g., What are your opening hours?" value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)} />
                  <Textarea placeholder="Answer" value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)} rows={2} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Custom Instructions</Label>
              <Textarea placeholder="Add any custom instructions for your AI agent..." value={customInstructions} onChange={e => setCustomInstructions(e.target.value)} rows={4} />
              <p className="text-xs text-muted-foreground">These instructions will guide your agent's behavior during conversations.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setStep(step + 1)} className="gap-1.5">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <LoadingButton size="sm" isLoading={isLoading} loadingText="Setting up…" onClick={handleFinish} className="gap-1.5">
              Finish Setup
              <Check className="w-4 h-4" />
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  )
}
