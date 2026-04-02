"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Building2, Bot, Clock, Bell, AlertTriangle, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { LoadingButton } from "@/components/states/loading-button"
import { PauseAgentModal } from "@/components/modals/pause-agent-modal"
import { DeleteBusinessModal } from "@/components/modals/delete-business-modal"
import { useBusinesses } from "@/lib/stores/business-context"
import { INDUSTRIES, TIME_OPTIONS, CALLBACK_DELAYS, DAYS_OF_WEEK } from "@/lib/constants"
import type { DaySchedule, OperatingHours, Industry, CallbackDelay } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function BusinessSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const { businesses, updateBusiness, deleteBusiness, toggleBusinessStatus } = useBusinesses()
  const biz = businesses.find(b => b.id === params.id)
  const [saving, setSaving] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [openPauseModal, setOpenPauseModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  if (!biz) return <div className="text-center py-20 text-muted-foreground">Business not found</div>

  const API_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

  const save = async () => {
    setSaving(true)
    try {
      await fetch(`${API_URL}/api/businesses/${biz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: biz.name,
          timezone: biz.timezone,
          prompt: biz.agentConfig?.greeting
        })
      })
    } catch (error) {
      console.error("Failed to save business", error)
    } finally {
      setSaving(false)
    }
  }

  const updateDay = (day: keyof OperatingHours, field: keyof DaySchedule, value: string | boolean) => {
    updateBusiness(biz.id, { hours: { ...biz.hours, [day]: { ...biz.hours[day], [field]: value } } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.push("/businesses")}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h1 className="text-lg font-semibold">{biz.name}</h1><p className="text-xs text-muted-foreground">Business Settings</p></div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-secondary/50 border border-border">
          <TabsTrigger value="general" className="gap-1.5 data-[state=active]:bg-background"><Building2 className="w-3.5 h-3.5" />General</TabsTrigger>
          <TabsTrigger value="agent" className="gap-1.5 data-[state=active]:bg-background"><Bot className="w-3.5 h-3.5" />Agent</TabsTrigger>
          <TabsTrigger value="hours" className="gap-1.5 data-[state=active]:bg-background"><Clock className="w-3.5 h-3.5" />Hours</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 data-[state=active]:bg-background"><Bell className="w-3.5 h-3.5" />Alerts</TabsTrigger>
          <TabsTrigger value="danger" className="gap-1.5 data-[state=active]:bg-background"><AlertTriangle className="w-3.5 h-3.5" />Danger</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-6 space-y-4 max-w-xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2"><Label>Business Name</Label><Input value={biz.name} onChange={e => updateBusiness(biz.id, { name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Industry</Label><Select value={biz.industry} onValueChange={v => updateBusiness(biz.id, { industry: v as Industry })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{INDUSTRIES.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={biz.phone} onChange={e => updateBusiness(biz.id, { phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Website</Label><Input value={biz.website} onChange={e => updateBusiness(biz.id, { website: e.target.value })} /></div>
            <div className="space-y-2"><Label>City</Label><Input value={biz.city} onChange={e => updateBusiness(biz.id, { city: e.target.value })} /></div>
          </div>
          <LoadingButton isLoading={saving} onClick={save} className="gap-1.5"><Save className="w-4 h-4" />Save Changes</LoadingButton>
        </TabsContent>

        {/* Agent */}
        <TabsContent value="agent" className="mt-6 space-y-4 max-w-xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Agent Name</Label><Input value={biz.agentConfig.name} onChange={e => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, name: e.target.value } })} /></div>
            <div className="space-y-2"><Label>Callback Delay</Label><Select value={biz.agentConfig.delay} onValueChange={v => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, delay: v as CallbackDelay } })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CALLBACK_DELAYS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label>Greeting</Label><Textarea value={biz.agentConfig.greeting} onChange={e => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, greeting: e.target.value } })} rows={3} /></div>
          <div className="space-y-2"><Label>Closing</Label><Textarea value={biz.agentConfig.closing} onChange={e => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, closing: e.target.value } })} rows={2} /></div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Max Attempts</Label><Select value={String(biz.agentConfig.maxAttempts)} onValueChange={v => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, maxAttempts: Number(v) } })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["1","2","3","4","5"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Earliest</Label><Select value={biz.agentConfig.earliestTime} onValueChange={v => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, earliestTime: v } })}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Latest</Label><Select value={biz.agentConfig.latestTime} onValueChange={v => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, latestTime: v } })}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border"><Label>Weekend callbacks</Label><Switch checked={biz.agentConfig.weekendCallbacks} onCheckedChange={v => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, weekendCallbacks: v } })} /></div>
          <div className="space-y-2"><Label>Escalation Keywords</Label><div className="flex flex-wrap gap-1.5 mb-2">{biz.agentConfig.escalationKeywords.map(kw => <Badge key={kw} variant="secondary" className="gap-1 text-xs">{kw}<button onClick={() => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, escalationKeywords: biz.agentConfig.escalationKeywords.filter(k => k !== kw) } })}><X className="w-3 h-3" /></button></Badge>)}</div>
          <div className="flex gap-2"><Input placeholder="Add keyword" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newKeyword.trim()) { updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, escalationKeywords: [...biz.agentConfig.escalationKeywords, newKeyword.trim().toLowerCase()] } }); setNewKeyword("") }}}} className="flex-1" /><Button variant="outline" size="sm" onClick={() => { if (newKeyword.trim()) { updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, escalationKeywords: [...biz.agentConfig.escalationKeywords, newKeyword.trim().toLowerCase()] } }); setNewKeyword("") }}}><Plus className="w-4 h-4" /></Button></div></div>
          <div className="space-y-3 pt-2 border-t border-border"><Label className="font-semibold">Escalation Contact</Label><div className="grid sm:grid-cols-3 gap-3"><Input placeholder="Name" value={biz.agentConfig.escalationContact.name} onChange={e => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, escalationContact: { ...biz.agentConfig.escalationContact, name: e.target.value } } })} /><Input placeholder="Phone" value={biz.agentConfig.escalationContact.phone} onChange={e => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, escalationContact: { ...biz.agentConfig.escalationContact, phone: e.target.value } } })} /><Input placeholder="Email" value={biz.agentConfig.escalationContact.email} onChange={e => updateBusiness(biz.id, { agentConfig: { ...biz.agentConfig, escalationContact: { ...biz.agentConfig.escalationContact, email: e.target.value } } })} /></div></div>
          <LoadingButton isLoading={saving} onClick={save} className="gap-1.5"><Save className="w-4 h-4" />Save Changes</LoadingButton>
        </TabsContent>

        {/* Hours */}
        <TabsContent value="hours" className="mt-6 space-y-3 max-w-xl">
          {DAYS_OF_WEEK.map(day => { const dh = biz.hours[day.key]; return (
            <div key={day.key} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
              <div className="w-12"><span className="text-sm font-medium">{day.shortLabel}</span></div>
              <Switch checked={!dh.isClosed} onCheckedChange={c => updateDay(day.key, "isClosed", !c)} />
              {!dh.isClosed ? <div className="flex items-center gap-2 flex-1">
                <Select value={dh.openTime} onValueChange={v => updateDay(day.key, "openTime", v)}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent></Select>
                <span className="text-xs text-muted-foreground">to</span>
                <Select value={dh.closeTime} onValueChange={v => updateDay(day.key, "closeTime", v)}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent></Select>
              </div> : <span className="text-xs text-muted-foreground">Closed</span>}
            </div>
          )})}
          <LoadingButton isLoading={saving} onClick={save} className="gap-1.5 mt-4"><Save className="w-4 h-4" />Save</LoadingButton>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6 space-y-4 max-w-xl">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border"><div><Label>Email on escalation</Label><p className="text-xs text-muted-foreground mt-0.5">Get notified via email when a lead is escalated</p></div><Switch checked={biz.notificationConfig.emailOnEscalation} onCheckedChange={v => updateBusiness(biz.id, { notificationConfig: { ...biz.notificationConfig, emailOnEscalation: v } })} /></div>
          {biz.notificationConfig.emailOnEscalation && <div className="space-y-2 pl-4"><Label>Email address</Label><Input value={biz.notificationConfig.emailAddress} onChange={e => updateBusiness(biz.id, { notificationConfig: { ...biz.notificationConfig, emailAddress: e.target.value } })} /></div>}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border"><div><Label>Daily summary</Label><p className="text-xs text-muted-foreground mt-0.5">Receive a daily email with all leads + stats</p></div><Switch checked={biz.notificationConfig.dailySummary} onCheckedChange={v => updateBusiness(biz.id, { notificationConfig: { ...biz.notificationConfig, dailySummary: v } })} /></div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border"><div><Label>SMS alerts</Label><p className="text-xs text-muted-foreground mt-0.5">Instant SMS for escalations and missed callbacks</p></div><Switch checked={biz.notificationConfig.smsAlerts} onCheckedChange={v => updateBusiness(biz.id, { notificationConfig: { ...biz.notificationConfig, smsAlerts: v } })} /></div>
          {biz.notificationConfig.smsAlerts && <div className="space-y-2 pl-4"><Label>SMS phone</Label><Input value={biz.notificationConfig.smsPhone} onChange={e => updateBusiness(biz.id, { notificationConfig: { ...biz.notificationConfig, smsPhone: e.target.value } })} /></div>}
          <LoadingButton isLoading={saving} onClick={save} className="gap-1.5"><Save className="w-4 h-4" />Save</LoadingButton>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger" className="mt-6 space-y-6 max-w-xl">
          <div className="p-5 rounded-lg border border-status-paused/30 bg-status-paused/5 space-y-3">
            <h3 className="font-semibold text-status-paused">Pause Agent</h3>
            <p className="text-sm text-muted-foreground">Pausing will stop callbacks. New leads will still be logged.</p>
            <Button variant="outline" size="sm" onClick={() => biz.status === "Active" ? setOpenPauseModal(true) : toggleBusinessStatus(biz.id)} className={cn("gap-1.5", biz.status === "Active" ? "border-status-paused/50 text-status-paused hover:bg-status-paused/10 hover:text-status-paused" : "border-status-completed/50 text-status-completed hover:bg-status-completed/10 hover:text-status-completed")}>
              {biz.status === "Active" ? "Pause Agent" : "Resume Agent"}
            </Button>
          </div>
          <div className="p-5 rounded-lg border border-destructive/30 bg-destructive/5 space-y-3">
            <h3 className="font-semibold text-destructive">Delete Business</h3>
            <p className="text-sm text-muted-foreground">This will permanently delete this business and all its data.</p>
            <Button variant="destructive" size="sm" onClick={() => setOpenDeleteModal(true)} className="gap-1.5"><Trash2 className="w-3.5 h-3.5" />Delete Business</Button>
          </div>
        </TabsContent>
      </Tabs>

      <PauseAgentModal
        open={openPauseModal}
        onClose={() => setOpenPauseModal(false)}
        businessId={biz.id}
        businessName={biz.name}
      />

      <DeleteBusinessModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        businessId={biz.id}
        businessName={biz.name}
      />
    </div>
  )
}
