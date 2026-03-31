"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { TopHeader } from "@/components/layout/top-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { OfflineBanner } from "@/components/layout/offline-banner"
import { useSidebar } from "@/lib/stores/sidebar-context"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/businesses": "Businesses",
  "/analytics": "Analytics",
  "/simulate": "Simulate Missed Call",
  "/settings": "Settings",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar()
  const pathname = usePathname()

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev
      document.documentElement.classList.toggle("dark", newMode)
      return newMode
    })
  }, [])

  // Derive page title from pathname
  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] ?? "CallbackOS"

  return (
    <div className="min-h-screen bg-background">
      <OfflineBanner />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-40 w-[240px] lg:hidden animate-slide-up-fade">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
      )}>
        <TopHeader
          title={pageTitle}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main className="px-4 py-6 md:px-6 lg:px-8 max-w-[1600px] mx-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  )
}
