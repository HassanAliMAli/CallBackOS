// @MOCK_DATA - Remove when connecting real backend
// All knowledge base mock data

import type { KBFile, FAQ } from "../types"

export const MOCK_KB_FILES: Record<string, KBFile[]> = {
  "biz_001": [
    {
      id: "file_001" /* @MOCK */,
      name: "dental-services-catalog.pdf" /* @MOCK */,
      type: "application/pdf" /* @MOCK */,
      size: 245760 /* @MOCK */,
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) /* @MOCK */,
      status: "Ready" /* @MOCK */,
    },
    {
      id: "file_002" /* @MOCK */,
      name: "insurance-accepted-list.txt" /* @MOCK */,
      type: "text/plain" /* @MOCK */,
      size: 4096 /* @MOCK */,
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) /* @MOCK */,
      status: "Ready" /* @MOCK */,
    },
    {
      id: "file_003" /* @MOCK */,
      name: "pricing-sheet-2025.docx" /* @MOCK */,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" /* @MOCK */,
      size: 102400 /* @MOCK */,
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) /* @MOCK */,
      status: "Processing" /* @MOCK */,
    },
  ],
  "biz_002": [
    {
      id: "file_004" /* @MOCK */,
      name: "service-menu-auto.pdf" /* @MOCK */,
      type: "application/pdf" /* @MOCK */,
      size: 512000 /* @MOCK */,
      uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) /* @MOCK */,
      status: "Ready" /* @MOCK */,
    },
  ],
  "biz_003": [],
}

export const MOCK_FAQS: Record<string, FAQ[]> = {
  "biz_001": [
    {
      id: "faq_001" /* @MOCK */,
      question: "What are your opening hours?" /* @MOCK */,
      answer: "We're open Monday to Friday 9 AM – 6 PM, Saturday 10 AM – 4 PM, and closed on Sundays." /* @MOCK */,
      businessId: "biz_001" /* @MOCK */,
    },
    {
      id: "faq_002" /* @MOCK */,
      question: "Do you accept walk-ins?" /* @MOCK */,
      answer: "We accept walk-ins based on availability, but we recommend booking an appointment to guarantee your slot." /* @MOCK */,
      businessId: "biz_001" /* @MOCK */,
    },
    {
      id: "faq_003" /* @MOCK */,
      question: "What insurance plans do you accept?" /* @MOCK */,
      answer: "We accept EFU, Jubilee, Adamjee, and most major dental insurance providers. Please call to verify your specific plan." /* @MOCK */,
      businessId: "biz_001" /* @MOCK */,
    },
    {
      id: "faq_004" /* @MOCK */,
      question: "How much does a dental cleaning cost?" /* @MOCK */,
      answer: "A standard dental cleaning starts at PKR 3,000. Deep cleaning starts at PKR 5,000. Exact pricing depends on the case." /* @MOCK */,
      businessId: "biz_001" /* @MOCK */,
    },
  ],
  "biz_002": [
    {
      id: "faq_005" /* @MOCK */,
      question: "Do you provide towing services?" /* @MOCK */,
      answer: "Yes, we offer towing within a 25km radius of our Karachi shop. Call our emergency line for immediate assistance." /* @MOCK */,
      businessId: "biz_002" /* @MOCK */,
    },
    {
      id: "faq_006" /* @MOCK */,
      question: "How long does a basic oil change take?" /* @MOCK */,
      answer: "A standard oil change takes approximately 30–45 minutes. No appointment needed for oil changes." /* @MOCK */,
      businessId: "biz_002" /* @MOCK */,
    },
  ],
  "biz_003": [],
}

export const MOCK_CUSTOM_INSTRUCTIONS: Record<string, string> = {
  "biz_001": "Always ask patients if they have any allergies before booking. If a patient mentions severe pain, immediately offer to book an emergency appointment the same day. Never discuss pricing for cosmetic procedures — direct them to schedule a consultation instead." /* @MOCK */,
  "biz_002": "If a customer mentions an accident, collect the vehicle make, model, and year. Always offer a free diagnostic assessment for new customers. Mention our 6-month warranty on all repairs." /* @MOCK */,
  "biz_003": "" /* @MOCK */,
}
