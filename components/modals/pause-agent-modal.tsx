"use client"

import { useState } from "react"
import { PauseCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/states/loading-button"

interface PauseAgentModalProps {
  open: boolean
  onClose: () => void
  businessId: string
  businessName: string
}

export function PauseAgentModal({ open, onClose, businessId, businessName }: PauseAgentModalProps) {
  const [duration, setDuration] = useState("until-manual")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

  const handlePause = async () => {
    setIsSubmitting(true)
    try {
      await fetch(`${API_URL}/api/businesses/${businessId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paused", duration })
      })
    } catch (error) {
      console.error("Failed to pause business", error)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-status-calling mb-1">
            <PauseCircle className="w-5 h-5" />
            <DialogTitle>Pause AI Agent</DialogTitle>
          </div>
          <DialogDescription>
            You are pausing automated callbacks for <span className="font-medium text-foreground">{businessName}</span>.
            New missed calls will be queued but not dialed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Pause Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-hour">For 1 Hour</SelectItem>
                <SelectItem value="24-hours">For 24 Hours</SelectItem>
                <SelectItem value="weekend">Until Monday Morning</SelectItem>
                <SelectItem value="until-manual">Indefinitely (Until manually resumed)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton 
            onClick={handlePause} 
            isLoading={isSubmitting}
            className="bg-status-calling text-status-calling-foreground hover:bg-status-calling/90"
          >
            Pause Agent
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
