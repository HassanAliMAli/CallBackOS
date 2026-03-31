// @MOCK_DATA - Remove when connecting real backend
// All notification mock data

import type { Notification } from "../types"

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001" /* @MOCK */,
    type: "escalation" /* @MOCK */,
    title: "Lead needs human follow-up" /* @MOCK */,
    description: "+92 300 456 7890 called City Dental — caller requested to speak with a real dentist" /* @MOCK */,
    timestamp: new Date(Date.now() - 5 * 60 * 1000) /* @MOCK */,
    read: false /* @MOCK */,
    leadId: "lead_006" /* @MOCK */,
    businessId: "biz_001" /* @MOCK */,
  },
  {
    id: "notif_002" /* @MOCK */,
    type: "lead" /* @MOCK */,
    title: "New lead booked appointment" /* @MOCK */,
    description: "+92 321 234 5678 booked a brake inspection at Metro Auto Repair" /* @MOCK */,
    timestamp: new Date(Date.now() - 15 * 60 * 1000) /* @MOCK */,
    read: false /* @MOCK */,
    leadId: "lead_003" /* @MOCK */,
    businessId: "biz_002" /* @MOCK */,
  },
  {
    id: "notif_003" /* @MOCK */,
    type: "lead" /* @MOCK */,
    title: "Callback completed" /* @MOCK */,
    description: "+92 300 123 4567 — teeth whitening inquiry handled successfully" /* @MOCK */,
    timestamp: new Date(Date.now() - 30 * 60 * 1000) /* @MOCK */,
    read: true /* @MOCK */,
    leadId: "lead_001" /* @MOCK */,
    businessId: "biz_001" /* @MOCK */,
  },
  {
    id: "notif_004" /* @MOCK */,
    type: "system" /* @MOCK */,
    title: "Daily summary ready" /* @MOCK */,
    description: "8 leads processed today. 5 completed, 1 escalated, 2 queued." /* @MOCK */,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) /* @MOCK */,
    read: true /* @MOCK */,
  },
  {
    id: "notif_005" /* @MOCK */,
    type: "escalation" /* @MOCK */,
    title: "Emergency lead flagged" /* @MOCK */,
    description: "+92 333 555 6677 — basement water leak at Elite Plumbing. Technician dispatched." /* @MOCK */,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) /* @MOCK */,
    read: true /* @MOCK */,
    leadId: "lead_004" /* @MOCK */,
    businessId: "biz_001" /* @MOCK */,
  },
  {
    id: "notif_006" /* @MOCK */,
    type: "system" /* @MOCK */,
    title: "Agent paused — Sunrise Yoga Studio" /* @MOCK */,
    description: "The AI agent for Sunrise Yoga Studio has been paused. Leads will still be logged." /* @MOCK */,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) /* @MOCK */,
    read: true /* @MOCK */,
    businessId: "biz_003" /* @MOCK */,
  },
  {
    id: "notif_007" /* @MOCK */,
    type: "lead" /* @MOCK */,
    title: "3 callback attempts failed" /* @MOCK */,
    description: "+92 300 789 0123 did not answer after 3 attempts for City Dental" /* @MOCK */,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) /* @MOCK */,
    read: true /* @MOCK */,
    leadId: "lead_007" /* @MOCK */,
    businessId: "biz_001" /* @MOCK */,
  },
]
