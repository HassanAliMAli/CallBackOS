"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Phone, Building2, FileText, X } from "lucide-react"
import { useLeads } from "@/lib/stores/lead-context"
import { useBusinesses } from "@/lib/stores/business-context"
import { cn } from "@/lib/utils"

interface GlobalSearchOverlayProps {
  open: boolean
  onClose: () => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffMs / (1000 * 60 * 60 * 24))}d ago`
}

export function GlobalSearchOverlay({ open, onClose }: GlobalSearchOverlayProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { leads } = useLeads()
  const { businesses } = useBusinesses()

  // ⌘K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (open) onClose()
        else inputRef.current?.focus()
      }
      if (e.key === "Escape" && open) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const getResults = useCallback(() => {
    if (!query.trim()) return { leads: [], businesses: [], transcripts: [] }

    const term = query.toLowerCase()

    const matchedLeads = leads.filter(l =>
      l.callerNumber.toLowerCase().includes(term) ||
      (l.callerName?.toLowerCase().includes(term) ?? false)
    ).slice(0, 5)

    const matchedBusinesses = businesses.filter(b =>
      b.name.toLowerCase().includes(term)
    ).slice(0, 3)

    const matchedTranscripts = leads.filter(l =>
      l.transcript?.some(msg => msg.message.toLowerCase().includes(term))
    ).slice(0, 3)

    return { leads: matchedLeads, businesses: matchedBusinesses, transcripts: matchedTranscripts }
  }, [query, leads, businesses])

  if (!open) return null

  const results = getResults()
  const hasResults = results.leads.length > 0 || results.businesses.length > 0 || results.transcripts.length > 0

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 top-0 mx-auto max-w-2xl p-4 pt-[10vh]">
        <div className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads, callers, transcripts…"
              className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            {query.trim() && !hasResults && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try different keywords</p>
              </div>
            )}

            {!query.trim() && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">Start typing to search…</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Search by phone number, caller name, or transcript content
                </p>
              </div>
            )}

            {/* Leads Section */}
            {results.leads.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Leads
                </p>
                {results.leads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent/50 transition-colors text-left"
                  >
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lead.callerName ?? lead.callerNumber}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.businessName} · {lead.status}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">
                      {formatRelativeTime(lead.missedAt)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Businesses Section */}
            {results.businesses.length > 0 && (
              <div className="p-2 border-t border-border">
                <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Businesses
                </p>
                {results.businesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent/50 transition-colors text-left"
                  >
                    <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{biz.name}</p>
                      <p className="text-xs text-muted-foreground">{biz.city} · {biz.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Transcripts Section */}
            {results.transcripts.length > 0 && (
              <div className="p-2 border-t border-border">
                <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Transcripts
                </p>
                {results.transcripts.map((lead) => {
                  const matchingMsg = lead.transcript?.find(msg =>
                    msg.message.toLowerCase().includes(query.toLowerCase())
                  )
                  return (
                    <button
                      key={`transcript-${lead.id}`}
                      onClick={onClose}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent/50 transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {lead.callerName ?? lead.callerNumber}
                        </p>
                        <p className="text-xs text-muted-foreground truncate italic">
                          &ldquo;{matchingMsg?.message.slice(0, 80)}…&rdquo;
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
