// @MOCK_DATA - Remove when connecting real backend
// Billing and invoice mock data

import type { Invoice, Plan } from "../types"

export const MOCK_CURRENT_PLAN: Plan = {
  name: "Growth" /* @MOCK */,
  price: 49 /* @MOCK */,
  renewalDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) /* @MOCK */,
  features: [
    "3 businesses",
    "500 callbacks/month",
    "AI call summaries & intent detection",
    "Knowledge base (upload files + FAQs)",
    "Priority escalation alerts",
    "Analytics dashboard",
    "Team members (up to 3)",
  ] /* @MOCK */,
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv_001" /* @MOCK */,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) /* @MOCK */,
    amount: 49 /* @MOCK */,
    status: "Paid" /* @MOCK */,
    downloadUrl: "#" /* @MOCK */,
  },
  {
    id: "inv_002" /* @MOCK */,
    date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000) /* @MOCK */,
    amount: 49 /* @MOCK */,
    status: "Paid" /* @MOCK */,
    downloadUrl: "#" /* @MOCK */,
  },
  {
    id: "inv_003" /* @MOCK */,
    date: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000) /* @MOCK */,
    amount: 49 /* @MOCK */,
    status: "Paid" /* @MOCK */,
    downloadUrl: "#" /* @MOCK */,
  },
  {
    id: "inv_004" /* @MOCK */,
    date: new Date(Date.now() - 102 * 24 * 60 * 60 * 1000) /* @MOCK */,
    amount: 0 /* @MOCK */,
    status: "Paid" /* @MOCK */,
    downloadUrl: "#" /* @MOCK */,
  },
]

export const MOCK_API_KEYS = [
  {
    id: "key_001" /* @MOCK */,
    name: "Twilio Webhook" /* @MOCK */,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) /* @MOCK */,
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000) /* @MOCK */,
    key: "sk_live_x8F2a9kQ" /* @MOCK */,
  },
  {
    id: "key_002" /* @MOCK */,
    name: "ElevenLabs Voice" /* @MOCK */,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) /* @MOCK */,
    lastUsed: new Date(Date.now() - 30 * 60 * 1000) /* @MOCK */,
    key: "sk_live_v9L1b7xM" /* @MOCK */,
  },
]

export const MOCK_WEBHOOK_URL = "https://api.callbackos.com/v1/webhook/missed-call/biz_001" /* @MOCK */
