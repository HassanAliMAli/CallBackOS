"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Activity, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/lib/stores/sidebar-context"
import { useAuth } from "@/lib/stores/auth-context"
import { SIDEBAR_NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapsed } = useSidebar()
  const { user, logout } = useAuth()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center h-14 px-4 border-b border-sidebar-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
              <div className="relative">
                <Phone className="w-4 h-4 text-primary" />
                <Activity className="w-3 h-3 text-primary absolute -right-1.5 -top-1" />
              </div>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sidebar-foreground tracking-tight whitespace-nowrap">
                CallbackOS
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
          <ul className="space-y-0.5">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive && "text-primary")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )

              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="px-2 py-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn(
              "w-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              isCollapsed ? "justify-center px-2" : "justify-start gap-2"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>

        {/* User Section */}
        <div className={cn(
          "px-3 py-3 border-t border-sidebar-border shrink-0",
          isCollapsed && "px-2"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-full p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {user?.name?.charAt(0) ?? "U"}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                {user?.name?.charAt(0) ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/50 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                className="text-sidebar-foreground/40 hover:text-sidebar-foreground shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
