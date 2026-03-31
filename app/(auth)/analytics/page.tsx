"use client"

import { useState } from "react"
import { Phone, PhoneOutgoing, TrendingUp, TrendingDown, UserRound, Clock, BarChart3, PhoneOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useBusinesses } from "@/lib/stores/business-context"
import { MOCK_ANALYTICS } from "@/lib/mock" // @MOCK_IMPORT
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const COLORS = [
  "oklch(0.65 0.2 250)", "oklch(0.7 0.18 160)", "oklch(0.7 0.2 40)",
  "oklch(0.7 0.15 300)", "oklch(0.6 0.15 200)", "oklch(0.6 0.2 25)"
]

export default function AnalyticsPage() {
  const { businesses } = useBusinesses()
  const analytics = MOCK_ANALYTICS // @MOCK
  const [timeRange, setTimeRange] = useState("7d")
  const [businessFilter, setBusinessFilter] = useState("all")

  const kpis = [
    { label: "Total Leads", value: analytics.kpis.totalLeads.value, icon: Phone, change: "+12%", up: true },
    { label: "Callbacks Made", value: analytics.kpis.totalCallbacks.value, icon: PhoneOutgoing, change: "+8%", up: true },
    { label: "Answer Rate", value: `${analytics.kpis.answerRate.value}%`, icon: TrendingUp, change: "+3%", up: true },
    { label: "Avg Duration (s)", value: analytics.kpis.avgDuration.value, icon: Clock, change: "-5s", up: false },
    { label: "Booked", value: analytics.kpis.booked.value, icon: UserRound, change: "+12%", up: true },
    { label: "Escalations", value: analytics.kpis.escalations.value, icon: PhoneOff, change: "-20%", up: true },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={timeRange} onValueChange={setTimeRange}><SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="24h">Last 24 hours</SelectItem><SelectItem value="7d">Last 7 days</SelectItem><SelectItem value="30d">Last 30 days</SelectItem><SelectItem value="90d">Last 90 days</SelectItem></SelectContent></Select>
        <Select value={businessFilter} onValueChange={setBusinessFilter}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Businesses</SelectItem>{businesses.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select>
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

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Calls Over Time */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">Leads Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analytics.leadsOverTime}>
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
              <Pie data={analytics.outcomeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={2} stroke="none">
                {analytics.outcomeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
            <BarChart data={analytics.callbacksByHour}>
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
            <LineChart data={analytics.callbacksByDay}>
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
          <TableHeader><TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-xs">Business Name</TableHead>
            <TableHead className="text-xs">Total Leads</TableHead>
            <TableHead className="text-xs">Callbacks</TableHead>
            <TableHead className="text-xs">Answer Rate</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {analytics.businessComparison.map((b, i: number) => (
              <TableRow key={i} className="border-border">
                <TableCell><span className="font-medium text-sm">{b.businessName}</span></TableCell>
                <TableCell className="text-sm tabular-nums">{b.leads}</TableCell>
                <TableCell className="text-sm tabular-nums">{b.callbacks}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{b.answerRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
