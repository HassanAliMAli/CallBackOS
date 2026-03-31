"use client"

import { Phone, PhoneOutgoing, TrendingUp, UserRound } from "lucide-react"

interface KpiCardsProps {
  totalToday: number
  callbacksMade: number
  answerRate: number
  needsHuman: number
}

export function KpiCards({ totalToday, callbacksMade, answerRate, needsHuman }: KpiCardsProps) {
  const kpis = [
    {
      label: "Total Today",
      value: totalToday,
      icon: Phone,
      color: "text-muted-foreground"
    },
    {
      label: "Callbacks Made",
      value: callbacksMade,
      icon: PhoneOutgoing,
      color: "text-muted-foreground"
    },
    {
      label: "Answer Rate",
      value: `${answerRate}%`,
      icon: TrendingUp,
      color: "text-status-completed"
    },
    {
      label: "Needs Human",
      value: needsHuman,
      icon: UserRound,
      color: "text-status-escalate"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
        >
          <div className={`p-2 rounded-md bg-secondary ${kpi.color}`}>
            <kpi.icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-semibold text-foreground tabular-nums">
              {kpi.value}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {kpi.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
