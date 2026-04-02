"use client"

import { useState, useEffect } from "react"
import { Phone, PhoneOutgoing, TrendingUp, TrendingDown, UserRound, Clock, BarChart3, PhoneOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useBusinesses } from "@/lib/stores/business-context"
import { useLeads } from "@/lib/stores/lead-context"
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const COLORS = [
  "oklch(0.65 0.2 250)", "oklch(0.7 0.18 160)", "oklch(0.7 0.2 40)",
  "oklch(0.7 0.15 300)", "oklch(0.6 0.15 200)", "oklch(0.6 0.2 25)"
]

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

interface AnalyticsOverview {
  totalToday: number
  callbacksMade: number
  answerRate: number
  needsHuman: number
}

export default function AnalyticsPage() {
  const { businesses } = useBusinesses()
  const { leads } = useLeads()
  const [timeRange, setTimeRange] = useState("7d")
  const [businessFilter, setBusinessFilter] = useState("all")
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch analytics overview from API
  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch(`${WORKER_URL}/api/analytics/overview`)
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const data = await response.json()
        setOverview(data)
      } catch (err) {
        console.error("Failed to load analytics", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  // Compute leads over time from real leads data
  const leadsOverTime = leads.slice(0, 7).map(lead => ({
    date: new Date(lead.missedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leads: 1,
    callbacks: lead.callbackInitiatedAt ? 1 : 0
  })).reverse()

  // Compute outcome distribution from real leads
  const outcomeCounts = leads.reduce((acc, lead) => {
    const outcome = lead.outcome || "No Answer"
    acc[outcome] = (acc[outcome] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const outcomeDistribution = Object.entries(outcomeCounts).map(([name, value]) => ({
    name,
    value
  }))

  // Compute callbacks by hour
  const hourCounts = leads.filter(l => l.callbackInitiatedAt).reduce((acc, lead) => {
    const hour = new Date(lead.callbackInitiatedAt!).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const callbacksByHour = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: hourCounts[i] || 0
  }))

  // Compute callbacks by day
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayCounts = leads.filter(l => l.callbackInitiatedAt).reduce((acc, lead) => {
    const day = new Date(lead.callbackInitiatedAt!).getDay()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const callbacksByDay = dayNames.map((day, i) => ({
    day,
    count: dayCounts[i] || 0
  }))

  // KPI values from real data
  const totalLeads = leads.length
  const totalCallbacks = leads.filter(l => l.callbackInitiatedAt).length
  const answerRate = totalCallbacks > 0 
    ? Math.round((leads.filter(l => l.status === "Completed").length / totalCallbacks) * 100) 
    : 0
  const avgDuration = leads.filter(l => l.duration).length > 0
    ? Math.round(leads.filter(l => l.duration).reduce((sum, l) => sum + (l.duration || 0), 0) / leads.filter(l => l.duration).length)
    : 0
  const booked = leads.filter(l => l.outcome === "Booked").length
  const escalations = leads.filter(l => l.status === "Escalate" || l.outcome === "Needs Human").length

  const kpis = [
    { label: "Total Leads", value: totalLeads, icon: Phone, change: "+0%", up: true },
    { label: "Callbacks Made", value: totalCallbacks, icon: PhoneOutgoing, change: "+0%", up: true },
    { label: "Answer Rate", value: `${answerRate}%`, icon: TrendingUp, change: "+0%", up: answerRate >= 50 },
    { label: "Avg Duration (s)", value: avgDuration, icon: Clock, change: "0s", up: true },
    { label: "Booked", value: booked, icon: UserRound, change: "+0%", up: true },
    { label: "Escalations", value: escalations, icon: PhoneOff, change: "+0%", up: escalations === 0 },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const hasData = leads.length > 0

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={businessFilter} onValueChange={setBusinessFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Businesses</SelectItem>
            {businesses.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(kpi => (
          <div key={kpi.label} className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="flex items-center justify-between">
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
              <div className={cn("flex items-center gap-0.5 text-[10px] font-medium", kpi.up ? "text-status-completed" : "text-status-escalate")}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-xl font-bold tabular-nums">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No analytics data yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Simulate a missed call to see real-time analytics. Data will appear here as leads are captured.
          </p>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Leads Over Time */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Leads Over Time</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={leadsOverTime.length > 0 ? leadsOverTime : [{ date: "No data", leads: 0, callbacks: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.15 0 0)", border: "1px solid oklch(0.25 0 0)", borderRadius: "8px", fontSize: 12 }} />
                  <Area type="monotone" dataKey="leads" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="callbacks" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Outcome Distribution */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Outcome Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={outcomeDistribution.length > 0 ? outcomeDistribution : [{ name: "No data", value: 1 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={2} stroke="none">
                    {outcomeDistribution.length > 0 ? outcomeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />) : <Cell fill="oklch(0.4 0 0)" />}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.15 0 0)", border: "1px solid oklch(0.25 0 0)", borderRadius: "8px", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Distribution */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Callbacks by Hour</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={callbacksByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "oklch(0.5 0 0)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.15 0 0)", border: "1px solid oklch(0.25 0 0)", borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="count" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Distribution */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Callbacks by Day</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={callbacksByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.15 0 0)", border: "1px solid oklch(0.25 0 0)", borderRadius: "8px", fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 3, fill: COLORS[2] }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Business Performance Table */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-4">Business Performance</h3>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs">Business Name</TableHead>
                  <TableHead className="text-xs">Total Leads</TableHead>
                  <TableHead className="text-xs">Callbacks</TableHead>
                  <TableHead className="text-xs">Answer Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((b) => {
                  const bizLeads = leads.filter(l => l.businessId === b.id)
                  const bizCallbacks = bizLeads.filter(l => l.callbackInitiatedAt).length
                  const bizAnswerRate = bizCallbacks > 0 
                    ? Math.round((bizLeads.filter(l => l.status === "Completed").length / bizCallbacks) * 100) 
                    : 0
                  return (
                    <TableRow key={b.id} className="border-border">
                      <TableCell><span className="font-medium text-sm">{b.name}</span></TableCell>
                      <TableCell className="text-sm tabular-nums">{bizLeads.length}</TableCell>
                      <TableCell className="text-sm tabular-nums">{bizCallbacks}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{bizAnswerRate}%</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
