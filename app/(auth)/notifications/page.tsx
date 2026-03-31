"use client"

import { useState } from "react"
import { Bell, Check, PhoneMissed, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react"
import { useNotifications } from "@/lib/stores/notification-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const displayedNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read) 
    : notifications

  const getIcon = (type: string) => {
    switch (type) {
      case "missed_call": return <PhoneMissed className="w-4 h-4 text-status-queued" />
      case "escalation": return <AlertTriangle className="w-4 h-4 text-status-escalate" />
      case "system": return <ShieldAlert className="w-4 h-4 text-muted-foreground" />
      case "completed": return <CheckCircle2 className="w-4 h-4 text-status-completed" />
      default: return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) + " · " + date.toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" /> 
            Notifications
            {unreadCount > 0 && <Badge variant="secondary" className="ml-2">{unreadCount} unread</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your alerts, escalations, and system updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border p-1 bg-secondary/50">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${filter === "all" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${filter === "unread" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Unread
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="gap-2 h-8 text-xs">
            <Check className="w-3.5 h-3.5" /> Mark all read
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 opacity-50" />
            </div>
            <p className="font-medium text-foreground">No notifications</p>
            <p className="text-sm mt-1">You&apos;re currently caught up on all alerts.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {displayedNotifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 flex gap-4 transition-colors ${!notif.read ? "bg-primary/5" : "hover:bg-muted/30"}`}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!notif.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                      {notif.title}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 leading-relaxed ${!notif.read ? "text-muted-foreground" : "text-muted-foreground/80"}`}>
                    {notif.description}
                  </p>
                  
                  {!notif.read && (
                    <div className="mt-3">
                      <Button variant="secondary" size="sm" onClick={() => markAsRead(notif.id)} className="h-7 text-xs">
                        Mark as read
                      </Button>
                    </div>
                  )}
                </div>
                {!notif.read && (
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
