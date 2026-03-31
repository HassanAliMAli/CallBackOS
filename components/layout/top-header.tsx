"use client"

import { useState } from "react"
import { Search, Bell, Sun, Moon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationDropdown } from "./notification-dropdown"
import { UserMenu } from "./user-menu"
import { GlobalSearchOverlay } from "./global-search-overlay"
import { useSidebar } from "@/lib/stores/sidebar-context"
import { useNotifications } from "@/lib/stores/notification-context"

interface TopHeaderProps {
  title: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function TopHeader({ title, isDarkMode, onToggleDarkMode }: TopHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { toggleMobileOpen } = useSidebar()
  const { unreadCount } = useNotifications()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleMobileOpen}
              className="lg:hidden text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 h-9 bg-secondary/50 border border-border rounded-md"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Search leads, callers, transcripts…</span>
              <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden text-muted-foreground"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="text-muted-foreground hover:text-foreground relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
              {isNotifOpen && (
                <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
              )}
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleDarkMode}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>

            {/* User avatar menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <GlobalSearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
