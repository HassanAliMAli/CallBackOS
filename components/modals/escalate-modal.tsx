"use client"

import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/states/loading-button"

interface EscalateModalProps {
  open: boolean
  onClose: () => void
  leadId: string
  callerNumber: string
}

export function EscalateModal({ open, onClose, leadId, callerNumber }: EscalateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

  const handleEscalate = async () => {
    setIsSubmitting(true)
    try {
      await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "escalate", outcome: "Needs Human" })
      })
    } catch (error) {
      console.error("Failed to escalate lead", error)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-status-escalate mb-1">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle>Escalate to Human</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to escalate lead <span className="font-mono font-medium text-foreground">{callerNumber}</span>? 
            This will trigger immediate notifications to your designated escalation contacts.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton 
            onClick={handleEscalate} 
            isLoading={isSubmitting}
            className="bg-status-escalate text-white hover:bg-status-escalate/90"
          >
            Confirm Escalation
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
