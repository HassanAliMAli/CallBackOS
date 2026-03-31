// @MOCK_STORE - Replace with real API when connecting backend
"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Lead, LeadStatus, LeadOutcome, LeadNote } from "../types"
import { MOCK_LEADS } from "../mock" // @MOCK_IMPORT

interface LeadContextType {
  leads: Lead[]
  selectedLead: Lead | null
  selectLead: (lead: Lead | null) => void
  addLead: (lead: Lead) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  escalateLead: (id: string) => void
  markResolved: (id: string, outcome?: LeadOutcome) => void
  addNote: (leadId: string, note: LeadNote) => void
  deleteNote: (leadId: string, noteId: string) => void
  getFilteredLeads: (filters: LeadFilters) => Lead[]
}

export interface LeadFilters {
  status?: LeadStatus | "all"
  businessId?: string | "all"
  search?: string
  dateRange?: "today" | "7d" | "30d" | "90d" | "custom"
  outcomes?: LeadOutcome[]
  urgency?: string[]
}

const LeadContext = createContext<LeadContextType | undefined>(undefined)

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS) // @MOCK_IMPORT
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const selectLead = useCallback((lead: Lead | null) => {
    setSelectedLead(lead)
  }, [])

  const addLead = useCallback((lead: Lead) => {
    setLeads(prev => [lead, ...prev])
  }, [])

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    setSelectedLead(prev => prev?.id === id ? { ...prev, ...updates } : prev)
  }, [])

  const escalateLead = useCallback((id: string) => {
    const updates: Partial<Lead> = {
      status: "Escalate" as LeadStatus,
      outcome: "Needs Human" as LeadOutcome,
    }
    updateLead(id, updates)
  }, [updateLead])

  const markResolved = useCallback((id: string, outcome?: LeadOutcome) => {
    const updates: Partial<Lead> = {
      status: "Completed" as LeadStatus,
      outcome: outcome ?? "Qualified",
    }
    updateLead(id, updates)
  }, [updateLead])

  const addNote = useCallback((leadId: string, note: LeadNote) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, notes: [...l.notes, note] } : l
    ))
    setSelectedLead(prev =>
      prev?.id === leadId ? { ...prev, notes: [...prev.notes, note] } : prev
    )
  }, [])

  const deleteNote = useCallback((leadId: string, noteId: string) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, notes: l.notes.filter(n => n.id !== noteId) } : l
    ))
    setSelectedLead(prev =>
      prev?.id === leadId
        ? { ...prev, notes: prev.notes.filter(n => n.id !== noteId) }
        : prev
    )
  }, [])

  const getFilteredLeads = useCallback((filters: LeadFilters): Lead[] => {
    let filtered = [...leads]

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(l => l.status === filters.status)
    }
    if (filters.businessId && filters.businessId !== "all") {
      filtered = filtered.filter(l => l.businessId === filters.businessId)
    }
    if (filters.search) {
      const term = filters.search.toLowerCase()
      filtered = filtered.filter(l =>
        l.callerNumber.toLowerCase().includes(term) ||
        (l.callerName?.toLowerCase().includes(term) ?? false) ||
        l.businessName.toLowerCase().includes(term)
      )
    }
    if (filters.dateRange && filters.dateRange !== "custom") {
      const now = Date.now()
      const ranges: Record<string, number> = {
        today: 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      }
      const ms = ranges[filters.dateRange]
      if (ms) {
        filtered = filtered.filter(l => now - l.missedAt.getTime() <= ms)
      }
    }

    return filtered
  }, [leads])

  return (
    <LeadContext.Provider value={{
      leads,
      selectedLead,
      selectLead,
      addLead,
      updateLead,
      escalateLead,
      markResolved,
      addNote,
      deleteNote,
      getFilteredLeads,
    }}>
      {children}
    </LeadContext.Provider>
  )
}

export function useLeads() {
  const context = useContext(LeadContext)
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider")
  }
  return context
}
