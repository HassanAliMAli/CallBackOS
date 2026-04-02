"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/states/loading-button"
import type { LeadOutcome } from "@/lib/types"

interface MarkResolvedModalProps {
  open: boolean
  onClose: () => void
  leadId: string
  callerNumber: string
}

export function MarkResolvedModal({ open, onClose, leadId, callerNumber }: MarkResolvedModalProps) {
  const [outcome, setOutcome] = useState<LeadOutcome | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

  const handleResolve = async () => {
    if (!outcome) return
    setIsSubmitting(true)
    try {
      await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", outcome })
      })
    } catch (error) {
      console.error("Failed to resolve lead", error)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2 text-status-completed mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <DialogTitle>Mark as Resolved</DialogTitle>
          </div>
          <DialogDescription>
            Select the final outcome for lead <span className="font-mono font-medium text-foreground">{callerNumber}</span> to close this ticket.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Final Outcome <span className="text-destructive">*</span></Label>
            <Select value={outcome || undefined} onValueChange={(val) => setOutcome(val as LeadOutcome)}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Booked">Booked Appointment</SelectItem>
                <SelectItem value="Qualified">Qualified Lead</SelectItem>
                <SelectItem value="Wrong Number">Wrong Number</SelectItem>
                <SelectItem value="Not Interested">Not Interested</SelectItem>
                <SelectItem value="No Answer">No Answer</SelectItem>
                <SelectItem value="Voicemail">Left Voicemail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton 
            onClick={handleResolve} 
            isLoading={isSubmitting}
            disabled={!outcome}
          >
            Mark Resolved
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
