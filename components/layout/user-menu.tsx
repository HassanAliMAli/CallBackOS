"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/stores/auth-context"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-colors"
      >
        {user?.name?.charAt(0) ?? "U"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg animate-slide-up-fade overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-md hover:bg-accent/50 transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-md hover:bg-accent/50 transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              Settings
            </Link>
          </div>

          <div className="p-1 border-t border-border">
            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
