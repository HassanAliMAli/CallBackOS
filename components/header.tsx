"use client"

import Link from "next/link"
import { Phone, Activity, Sun, Moon, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onSimulateCall: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({ onSimulateCall, isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <div className="relative">
              <Phone className="w-4 h-4 text-primary" />
              <Activity className="w-3 h-3 text-primary absolute -right-1.5 -top-1" />
            </div>
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            CallbackOS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onSimulateCall}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Simulate Missed Call</span>
            <span className="sm:hidden">Simulate</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/onboarding">
              <Settings className="w-4 h-4" />
              <span className="sr-only">Business Settings</span>
            </Link>
          </Button>
          
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
        </div>
      </div>
    </header>
  )
}
