import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  BarChart3,
  Phone,
  Settings,
  type LucideIcon,
} from "lucide-react"
import type { Industry } from "./types"

// ─── Sidebar Navigation ───

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Businesses", href: "/businesses", icon: Building2 },
  { label: "Knowledge Base", href: "/businesses", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Simulate", href: "/simulate", icon: Phone },
  { label: "Settings", href: "/settings", icon: Settings },
]

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Simulate", href: "/simulate", icon: Phone },
  { label: "Settings", href: "/settings", icon: Settings },
]

// ─── Industries ───

export interface IndustryOption {
  value: Industry
  label: string
}

export const INDUSTRIES: IndustryOption[] = [
  { value: "dental-clinic", label: "Dental Clinic" },
  { value: "medical-clinic", label: "Medical Clinic" },
  { value: "salon-spa", label: "Salon / Spa" },
  { value: "auto-repair", label: "Auto Repair" },
  { value: "restaurant", label: "Restaurant" },
  { value: "law-firm", label: "Law Firm" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
]

// ─── Time Options ───

export const TIME_OPTIONS: string[] = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM",
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
  "10:00 PM", "10:30 PM", "11:00 PM",
]

// ─── Callback Delays ───

export interface CallbackDelayOption {
  value: string
  label: string
}

export const CALLBACK_DELAYS: CallbackDelayOption[] = [
  { value: "immediately", label: "Immediately" },
  { value: "2-minutes", label: "2 minutes" },
  { value: "5-minutes", label: "5 minutes" },
  { value: "10-minutes", label: "10 minutes" },
  { value: "30-minutes", label: "30 minutes" },
]

// ─── Simulate Delays ───

export const SIMULATE_DELAYS: CallbackDelayOption[] = [
  { value: "immediately", label: "Immediately" },
  { value: "30-seconds", label: "30 seconds" },
  { value: "2-minutes", label: "2 minutes" },
  { value: "5-minutes", label: "5 minutes" },
]

// ─── Plan Tiers ───

export interface PlanOption {
  name: string
  price: number
  annualPrice: number
  features: string[]
  cta: string
  popular?: boolean
}

export const PLAN_TIERS: PlanOption[] = [
  {
    name: "Starter",
    price: 0,
    annualPrice: 0,
    features: [
      "1 business",
      "50 callbacks/month",
      "AI call summaries",
      "Basic transcript logs",
      "Email notifications",
    ],
    cta: "Start for Free",
  },
  {
    name: "Growth",
    price: 49,
    annualPrice: 39,
    features: [
      "3 businesses",
      "500 callbacks/month",
      "AI call summaries & intent detection",
      "Knowledge base (upload files + FAQs)",
      "Priority escalation alerts",
      "Analytics dashboard",
      "Team members (up to 3)",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: 149,
    annualPrice: 119,
    features: [
      "Unlimited businesses",
      "Unlimited callbacks",
      "Advanced AI with custom instructions",
      "Full knowledge base",
      "API access & webhooks",
      "Advanced analytics & exports",
      "Unlimited team members",
    ],
    cta: "Contact Sales",
  },
]

// ─── FAQ Items (Landing Page) ───

export interface FAQItem {
  question: string
  answer: string
}

export const LANDING_FAQ: FAQItem[] = [
  {
    question: "How does CallbackOS know when I miss a call?",
    answer: "CallbackOS integrates with your phone system. When a call goes unanswered, it automatically triggers our AI agent to call the customer back within your configured timeframe.",
  },
  {
    question: "Can the AI actually handle real conversations?",
    answer: "Yes. Our AI agent is powered by advanced language models and trained on your business knowledge base. It can book appointments, answer FAQs, qualify leads, and know when to escalate to a human.",
  },
  {
    question: "What happens if the AI can't help the caller?",
    answer: "If the AI detects escalation keywords or the caller requests a human, it immediately flags the lead as 'Needs Human' and sends you an alert via email, SMS, or push notification.",
  },
  {
    question: "How quickly does the AI call back?",
    answer: "You configure the callback delay — options range from immediately to 30 minutes after the missed call. Most businesses use 2–5 minutes for optimal pickup rates.",
  },
  {
    question: "Can I customize what the AI agent says?",
    answer: "Absolutely. You set the greeting message, closing message, agent name, knowledge base, FAQs, and custom instructions. The agent sounds and responds exactly how you want.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. The Starter plan is completely free and includes 1 business with up to 50 callbacks per month. No credit card required to get started.",
  },
  {
    question: "What phone systems does CallbackOS support?",
    answer: "CallbackOS works with most VoIP providers including Twilio, RingCentral, and Vonage. We also provide webhook endpoints and API keys for custom integrations.",
  },
  {
    question: "Can I use CallbackOS for multiple businesses?",
    answer: "Yes. The Growth plan supports up to 3 businesses, and the Business plan supports unlimited businesses — each with their own agent, knowledge base, and settings.",
  },
]

// ─── Days of Week ───

export const DAYS_OF_WEEK = [
  { key: "monday" as const, label: "Monday", shortLabel: "Mon" },
  { key: "tuesday" as const, label: "Tuesday", shortLabel: "Tue" },
  { key: "wednesday" as const, label: "Wednesday", shortLabel: "Wed" },
  { key: "thursday" as const, label: "Thursday", shortLabel: "Thu" },
  { key: "friday" as const, label: "Friday", shortLabel: "Fri" },
  { key: "saturday" as const, label: "Saturday", shortLabel: "Sat" },
  { key: "sunday" as const, label: "Sunday", shortLabel: "Sun" },
]

// ─── Default Escalation Keywords ───

export const DEFAULT_ESCALATION_KEYWORDS = [
  "emergency",
  "urgent",
  "surgery",
  "chest pain",
  "accident",
]

// ─── Timezone Options ───

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Karachi", label: "Asia/Karachi (PKT)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "America/Chicago", label: "America/Chicago (CST)" },
  { value: "America/Denver", label: "America/Denver (MST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
]

// ─── Date Range Presets ───

export const DATE_RANGE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Custom", value: "custom" },
]

// ─── Rows Per Page Options ───

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50]
