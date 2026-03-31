// ─── Lead Types ───

export type LeadStatus = "Queued" | "Calling" | "Completed" | "Escalate" | "Failed"
export type LeadOutcome = "Booked" | "Qualified" | "Wrong Number" | "Not Interested" | "No Answer" | "Needs Human" | "Voicemail" | null
export type Urgency = "Low" | "Medium" | "High"
export type Sentiment = "Positive" | "Neutral" | "Frustrated"

export interface TranscriptMessage {
  id: string
  speaker: "Agent" | "Caller"
  message: string
  timestamp: Date
}

export interface AISummary {
  keyPoints: string[]
  intentDetected: string
  urgency: Urgency
  recommendedAction: string
  sentiment: Sentiment
}

export interface ActivityEvent {
  id: string
  type: "missed_call" | "callback_queued" | "callback_initiated" | "call_connected" | "no_answer" | "voicemail" | "transcript_saved" | "summary_generated" | "escalation_triggered" | "manually_resolved"
  description: string
  timestamp: Date
}

export interface LeadNote {
  id: string
  text: string
  author: string
  timestamp: Date
}

export interface Lead {
  id: string
  callerNumber: string
  callerName: string | null
  businessId: string
  businessName: string
  missedAt: Date
  callbackInitiatedAt: Date | null
  status: LeadStatus
  outcome: LeadOutcome
  transcript: TranscriptMessage[] | null
  duration: number | null
  callbackAttempt: number
  maxAttempts: number
  callbackNumber: string | null
  notes: LeadNote[]
  aiSummary: AISummary | null
  activityLog: ActivityEvent[]
}

// ─── Business Types ───

export type BusinessStatus = "Active" | "Paused"
export type CallbackDelay = "immediately" | "2-minutes" | "5-minutes" | "10-minutes" | "30-minutes"
export type Industry = "dental-clinic" | "medical-clinic" | "salon-spa" | "auto-repair" | "restaurant" | "law-firm" | "real-estate" | "other"

export interface DaySchedule {
  isClosed: boolean
  openTime: string
  closeTime: string
}

export interface OperatingHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface EscalationContact {
  name: string
  phone: string
  email: string
}

export interface AgentConfig {
  name: string
  greeting: string
  closing: string
  maxAttempts: number
  delay: CallbackDelay
  earliestTime: string
  latestTime: string
  weekendCallbacks: boolean
  escalationKeywords: string[]
  escalationContact: EscalationContact
}

export interface NotificationConfig {
  emailOnEscalation: boolean
  emailAddress: string
  dailySummary: boolean
  smsAlerts: boolean
  smsPhone: string
  pushNotifications: boolean
}

export interface BusinessStats {
  leadsToday: number
  callbacksMade: number
  answerRate: number
}

export interface Business {
  id: string
  name: string
  industry: Industry
  phone: string
  website: string
  city: string
  status: BusinessStatus
  agentConfig: AgentConfig
  hours: OperatingHours
  notificationConfig: NotificationConfig
  stats: BusinessStats
}

// ─── User Types ───

export type UserRole = "Admin" | "Member"
export type TeamMemberStatus = "Active" | "Invited"
export type PlanTier = "Starter" | "Growth" | "Business"

export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  timezone: string
  role: UserRole
  plan: PlanTier
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  status: TeamMemberStatus
  avatar: string | null
}

// ─── Notification Types ───

export type NotificationType = "lead" | "escalation" | "system"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: Date
  read: boolean
  leadId?: string
  businessId?: string
}

// ─── Analytics Types ───

export interface KpiData {
  value: number
  previousValue: number
  label: string
  format: "number" | "percent" | "duration"
}

export interface TimeSeriesPoint {
  date: string
  leads: number
  callbacks: number
}

export interface OutcomeBreakdown {
  outcome: string
  count: number
  percentage: number
  avgDuration: number
  trend: "up" | "down" | "flat"
}

export interface BusinessPerformance {
  businessId: string
  businessName: string
  leads: number
  callbacks: number
  answerRate: number
  booked: number
  escalations: number
}

export interface HourlyData {
  hour: number
  count: number
}

export interface DailyData {
  day: string
  count: number
}

export interface AnalyticsData {
  kpis: {
    totalLeads: KpiData
    totalCallbacks: KpiData
    answerRate: KpiData
    avgDuration: KpiData
    booked: KpiData
    escalations: KpiData
  }
  leadsOverTime: TimeSeriesPoint[]
  outcomeDistribution: { name: string; value: number; color: string }[]
  callbacksByHour: HourlyData[]
  callbacksByDay: DailyData[]
  outcomeBreakdown: OutcomeBreakdown[]
  businessComparison: BusinessPerformance[]
}

// ─── Knowledge Base Types ───

export type KBFileStatus = "Processing" | "Ready" | "Error"

export interface KBFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  status: KBFileStatus
}

export interface FAQ {
  id: string
  question: string
  answer: string
  businessId: string
}

// ─── Billing Types ───

export type InvoiceStatus = "Paid" | "Pending" | "Failed"

export interface Invoice {
  id: string
  date: Date
  amount: number
  status: InvoiceStatus
  downloadUrl: string
}

export interface Plan {
  name: PlanTier
  price: number
  renewalDate: Date
  features: string[]
}

// ─── API Key Types ───

export interface ApiKey {
  id: string
  name: string
  createdAt: Date
  lastUsed: Date | null
  key?: string
}

// ─── Search Types ───

export interface SearchResult {
  id: string
  type: "lead" | "business" | "transcript"
  title: string
  subtitle: string
  timestamp: Date
}
