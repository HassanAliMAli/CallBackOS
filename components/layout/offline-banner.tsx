"use client"

import { WifiOff } from "lucide-react"
import { useState, useEffect } from "react"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    // Check initial state
    setIsOffline(!navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-status-escalate/90 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium animate-slide-up-fade">
      <WifiOff className="w-4 h-4" />
      You&apos;re offline — changes will sync when reconnected
    </div>
  )
}
