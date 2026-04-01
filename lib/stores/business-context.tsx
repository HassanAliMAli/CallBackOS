// @MOCK_STORE - Replace with real API when connecting backend
"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Business } from "../types"
import { MOCK_BUSINESSES } from "../mock"

interface BusinessContextType {
  businesses: Business[]
  selectedBusinessId: string | null
  selectedBusiness: Business | null
  selectBusiness: (id: string | null) => void
  addBusiness: (business: Business) => void
  updateBusiness: (id: string, updates: Partial<Business>) => void
  deleteBusiness: (id: string) => void
  toggleBusinessStatus: (id: string) => void
  isLoading: boolean
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev";

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch from the real API
  useEffect(() => {
    async function loadBusinesses() {
      try {
        const response = await fetch(`${WORKER_URL}/api/businesses`);
        if (!response.ok) throw new Error("Failed to fetch businesses");
        
        const data = await response.json() as any[];
        const template = MOCK_BUSINESSES[0]; // Used to fill missing frontend fields

        const realBusinesses = data.map(dbBiz => ({
          ...template, // Provide mock config for hours, agentConfig, etc.
          id: dbBiz.id,
          name: dbBiz.name,
          timezone: dbBiz.timezone,
          // Store raw prompt in agentConfig.greeting temporarily for demo
          agentConfig: {
             ...template.agentConfig,
             greeting: dbBiz.prompt || template.agentConfig.greeting
          }
        }));

        setBusinesses(realBusinesses);
        
        if (realBusinesses.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(realBusinesses[0].id)
        }
      } catch (err) {
        console.error("Failed to load businesses from API, falling back to mock", err);
        setBusinesses(MOCK_BUSINESSES);
        if (MOCK_BUSINESSES.length > 0) {
          setSelectedBusinessId(MOCK_BUSINESSES[0].id)
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBusinesses();
  }, []) // Empty dependency array to run once on mount

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId) ?? null

  const selectBusiness = useCallback((id: string | null) => {
    setSelectedBusinessId(id)
  }, [])

  const addBusiness = useCallback(async (business: Business) => {
    // Optimistic UI update
    setBusinesses(prev => [...prev, business])
    try {
      await fetch(`${WORKER_URL}/api/businesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: business.id,
          name: business.name,
          timezone: "UTC", // Defaulting to UTC, since the UI might not collect timezone right away
          prompt: business.agentConfig.greeting
        })
      });
    } catch (e) {
      console.error("Failed to POST new business to worker", e);
    }
  }, [])

  const updateBusiness = useCallback((id: string, updates: Partial<Business>) => {
    // Frontend-only update for now
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
      isLoading
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
