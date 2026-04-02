"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Business } from "../types"

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

        // Map API response to Business type without mock template
        const realBusinesses = data.map(dbBiz => ({
          id: dbBiz.id,
          name: dbBiz.name,
          timezone: dbBiz.timezone || "UTC",
          // Compute stats as zeros (will be computed from real leads later)
          stats: { leadsToday: 0, callbacksMade: 0, answerRate: 0 },
          // Default operating hours (9-5, Mon-Fri)
          hours: {
            monday: { isClosed: false, openTime: "09:00", closeTime: "17:00" },
            tuesday: { isClosed: false, openTime: "09:00", closeTime: "17:00" },
            wednesday: { isClosed: false, openTime: "09:00", closeTime: "17:00" },
            thursday: { isClosed: false, openTime: "09:00", closeTime: "17:00" },
            friday: { isClosed: false, openTime: "09:00", closeTime: "17:00" },
            saturday: { isClosed: true, openTime: "00:00", closeTime: "00:00" },
            sunday: { isClosed: true, openTime: "00:00", closeTime: "00:00" },
          },
          agentConfig: { 
            name: "Aria", 
            greeting: dbBiz.prompt || "Hello, I'm an AI assistant.",
            closing: "Thank you for your time!",
            maxAttempts: 3,
            delay: "immediately" as const,
            earliestTime: "09:00",
            latestTime: "17:00",
            weekendCallbacks: true,
            escalationKeywords: ["urgent", "emergency", "human", "representative"],
            escalationContact: { name: "", phone: "", email: "" }
          },
          notificationConfig: {
            emailOnEscalation: true,
            emailAddress: "",
            dailySummary: true,
            smsAlerts: false,
            smsPhone: "",
            pushNotifications: true
          },
          city: "Karachi",
          website: dbBiz.website || "",
          phone: "",
          industry: "other" as const,
          status: "Active" as const,
        }));

        setBusinesses(realBusinesses);

        if (realBusinesses.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(realBusinesses[0].id)
        }
      } catch (err) {
        console.error("Failed to load businesses from API", err);
        setBusinesses([]);
        setSelectedBusinessId(null);
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
