"use client"

import { useState } from "react"
import { User, Shield, CreditCard, Users, Key, Eye, EyeOff, Save, Copy, Check, RefreshCw, Plus, Trash2, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingButton } from "@/components/states/loading-button"
import { useAuth } from "@/lib/stores/auth-context"
import { MOCK_TEAM_MEMBERS, MOCK_INVOICES, MOCK_API_KEYS } from "@/lib/mock" // @MOCK_IMPORT
import { PLAN_TIERS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")

  const save = async () => { setSaving(true); await new Promise(r => setTimeout(r, 1000)); setSaving(false) } // @MOCK_DELAY

  const copyKey = (key: string) => { navigator.clipboard.writeText(key); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000) }

  const team = MOCK_TEAM_MEMBERS // @MOCK
  const invoices = MOCK_INVOICES // @MOCK
  const apiKeys = MOCK_API_KEYS // @MOCK
  const currentPlan = PLAN_TIERS[1] // @MOCK — Growth plan

  return (
    <div>
      <Tabs defaultValue="profile">
        <TabsList className="bg-secondary/50 border border-border flex-wrap">
          <TabsTrigger value="profile" className="gap-1.5 data-[state=active]:bg-background"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="password" className="gap-1.5 data-[state=active]:bg-background"><Shield className="w-3.5 h-3.5" />Security</TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5 data-[state=active]:bg-background"><CreditCard className="w-3.5 h-3.5" />Billing</TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5 data-[state=active]:bg-background"><Users className="w-3.5 h-3.5" />Team</TabsTrigger>
          <TabsTrigger value="api" className="gap-1.5 data-[state=active]:bg-background"><Key className="w-3.5 h-3.5" />API Keys</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6 space-y-4 max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">{name.charAt(0)}</div>
            <div><h3 className="font-semibold">{name}</h3><p className="text-sm text-muted-foreground">{email}</p></div>
          </div>
          <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" /></div>
          <div className="space-y-2"><Label>Timezone</Label><Select defaultValue="asia-karachi"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="asia-karachi">Asia/Karachi (PKT)</SelectItem><SelectItem value="utc">UTC</SelectItem><SelectItem value="est">America/New_York (EST)</SelectItem><SelectItem value="pst">America/Los_Angeles (PST)</SelectItem></SelectContent></Select></div>
          <LoadingButton isLoading={saving} onClick={save} className="gap-1.5"><Save className="w-4 h-4" />Save Profile</LoadingButton>
        </TabsContent>

        {/* Security */}
        <TabsContent value="password" className="mt-6 space-y-6 max-w-lg">
          <div className="space-y-4">
            <h3 className="font-semibold">Change Password</h3>
            <div className="space-y-2"><Label>Current Password</Label><div className="relative"><Input type={showPwd ? "text" : "password"} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} className="pr-10" /><button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
            <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
            <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} /></div>
            <LoadingButton isLoading={saving} onClick={save} className="gap-1.5"><Save className="w-4 h-4" />Update Password</LoadingButton>
          </div>
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border"><Label>Enable 2FA</Label><Switch checked={twoFA} onCheckedChange={setTwoFA} /></div>
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold">Current Plan</h3><p className="text-sm text-muted-foreground mt-0.5">You&apos;re on the <span className="font-medium text-foreground">{currentPlan.name}</span> plan</p></div>
              <Badge variant="outline" className="bg-plan-growth/10 text-plan-growth border-plan-growth/30">{currentPlan.name}</Badge>
            </div>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-bold">${currentPlan.price}</span><span className="text-sm text-muted-foreground">/month</span></div>
            <ul className="space-y-1.5 text-sm">{currentPlan.features.map(f => <li key={f} className="flex items-center gap-2 text-muted-foreground"><Check className="w-3.5 h-3.5 text-status-completed" />{f}</li>)}</ul>
            <Button variant="outline" className="gap-1.5"><ArrowRight className="w-4 h-4" />Upgrade Plan</Button>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Invoices</h3>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table><TableHeader><TableRow className="hover:bg-transparent border-border"><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs">Amount</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs w-[80px]"></TableHead></TableRow></TableHeader>
              <TableBody>{invoices.map(inv => (
                <TableRow key={inv.id} className="border-border">
                  <TableCell className="text-sm">{inv.date.toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm font-medium tabular-nums">${inv.amount}</TableCell>
                  <TableCell><Badge variant="secondary" className={cn("text-xs", inv.status === "Paid" ? "bg-status-completed/10 text-status-completed" : "bg-status-calling/10 text-status-calling")}>{inv.status}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Download className="w-3 h-3" />PDF</Button></TableCell>
                </TableRow>
              ))}</TableBody></Table>
            </div>
          </div>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Team Members ({team.length})</h3>
          </div>
          <div className="flex items-center gap-2 max-w-md">
            <Input placeholder="Email address" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            <Button size="sm" className="gap-1 shrink-0"><Plus className="w-3.5 h-3.5" />Invite</Button>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table><TableHeader><TableRow className="hover:bg-transparent border-border"><TableHead className="text-xs">Member</TableHead><TableHead className="text-xs">Role</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs w-[60px]"></TableHead></TableRow></TableHeader>
            <TableBody>{team.map(member => (
              <TableRow key={member.id} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">{member.name.charAt(0)}</div><div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-muted-foreground">{member.email}</p></div></div>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{member.role}</Badge></TableCell>
                <TableCell><Badge variant="secondary" className={cn("text-xs", member.status === "Active" ? "bg-status-completed/10 text-status-completed" : "bg-status-calling/10 text-status-calling")}>{member.status}</Badge></TableCell>
                <TableCell>{member.role !== "Admin" && <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>}</TableCell>
              </TableRow>
            ))}</TableBody></Table>
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div><h3 className="font-semibold">API Keys</h3><p className="text-sm text-muted-foreground mt-0.5">Manage your API keys for integration</p></div>
            <Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" />Generate Key</Button>
          </div>
          <div className="space-y-3">
            {apiKeys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                <div className="space-y-1 min-w-0 flex-1 mr-4">
                  <div className="flex items-center gap-2"><p className="text-sm font-medium">{key.name}</p></div>
                  <p className="text-xs text-muted-foreground font-mono truncate">{key.key ?? "Hidden"}</p>
                  <p className="text-[10px] text-muted-foreground">Created {key.createdAt.toLocaleDateString()} · Last used {key.lastUsed?.toLocaleDateString() ?? "Never"}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => copyKey(key.key ?? "")} className="text-muted-foreground">
                    {copiedKey === key.key ? <Check className="w-3.5 h-3.5 text-status-completed" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground"><RefreshCw className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
