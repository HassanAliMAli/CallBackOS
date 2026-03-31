"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, Phone, Info, Check } from "lucide-react"
import { useNotifications } from "@/lib/stores/notification-context"
import type { NotificationType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NotificationDropdownProps {
  onClose: () => void
}

function getNotifIcon(type: NotificationType) {
  switch (type) {
    case "escalation":
      return <AlertTriangle className="w-4 h-4 text-status-escalate" />
    case "lead":
      return <Phone className="w-4 h-4 text-status-completed" />
    case "system":
      return <Info className="w-4 h-4 text-primary" />
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] rounded-lg border border-border bg-popover shadow-lg animate-slide-up-fade overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto max-h-[360px] scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Check className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id)
                onClose()
              }}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 border-b border-border last:border-b-0",
                !notif.read && "bg-primary/5"
              )}
            >
              <div className="mt-0.5 shrink-0">
                {getNotifIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "text-sm truncate",
                    !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                  )}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {notif.description}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  {formatRelativeTime(notif.timestamp)}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border text-center">
        <button
          onClick={onClose}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}
