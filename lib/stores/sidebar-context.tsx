"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
  toggleMobileOpen: () => void
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }, [])

  const toggleMobileOpen = useCallback(() => {
    setIsMobileOpen(prev => !prev)
  }, [])

  const setMobileOpen = useCallback((open: boolean) => {
    setIsMobileOpen(open)
  }, [])

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      isMobileOpen,
      toggleCollapsed,
      setCollapsed,
      toggleMobileOpen,
      setMobileOpen,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
