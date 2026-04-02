"use client"

import { useState } from "react"
import { AlertOctagon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/states/loading-button"

interface DeleteBusinessModalProps {
  open: boolean
  onClose: () => void
  businessName: string
}

export function DeleteBusinessModal({ open, onClose, businessName }: DeleteBusinessModalProps) {
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://callbackos-api.hassanali205031.workers.dev"

  const isMatch = confirmation === businessName

  const handleDelete = async () => {
    if (!isMatch) return
    setIsDeleting(true)
    try {
      // TODO: Get business ID from props and call DELETE /api/businesses/:id
      // For now, just close the modal
      await new Promise(r => setTimeout(r, 1000))
    } catch (error) {
      console.error("Failed to delete business", error)
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertOctagon className="w-5 h-5" />
            <DialogTitle>Delete Business</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the AI Agent configuration, call logs, and billing history for <span className="font-medium text-foreground">{businessName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-sm text-destructive-foreground">
            Please type <span className="font-bold select-none">{businessName}</span> to confirm.
          </div>
          <div className="space-y-2">
            <Label className="sr-only">Confirm Business Name</Label>
            <Input 
              placeholder={businessName}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className={isMatch ? "border-destructive ring-destructive" : ""}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <LoadingButton 
            onClick={handleDelete} 
            isLoading={isDeleting}
            disabled={!isMatch}
            variant="destructive"
          >
            Delete Permanently
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
