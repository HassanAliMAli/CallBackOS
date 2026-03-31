// @MOCK_STORE - Replace with real API when connecting backend
"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Business } from "../types"
import { MOCK_BUSINESSES } from "../mock" // @MOCK_IMPORT

interface BusinessContextType {
  businesses: Business[]
  selectedBusinessId: string | null
  selectedBusiness: Business | null
  selectBusiness: (id: string | null) => void
  addBusiness: (business: Business) => void
  updateBusiness: (id: string, updates: Partial<Business>) => void
  deleteBusiness: (id: string) => void
  toggleBusinessStatus: (id: string) => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES) // @MOCK_IMPORT
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId) ?? null

  const selectBusiness = useCallback((id: string | null) => {
    setSelectedBusinessId(id)
  }, [])

  const addBusiness = useCallback((business: Business) => {
    setBusinesses(prev => [...prev, business])
  }, [])

  const updateBusiness = useCallback((id: string, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }, [])

  const deleteBusiness = useCallback((id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id))
    if (selectedBusinessId === id) setSelectedBusinessId(null)
  }, [selectedBusinessId])

  const toggleBusinessStatus = useCallback((id: string) => {
    setBusinesses(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === "Active" ? "Paused" : "Active" } : b
    ))
  }, [])

  return (
    <BusinessContext.Provider value={{
      businesses,
      selectedBusinessId,
      selectedBusiness,
      selectBusiness,
      addBusiness,
      updateBusiness,
      deleteBusiness,
      toggleBusinessStatus,
    }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusinesses() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error("useBusinesses must be used within a BusinessProvider")
  }
  return context
}
