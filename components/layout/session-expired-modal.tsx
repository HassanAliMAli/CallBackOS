"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SessionExpiredModalProps {
  open: boolean
  onSignIn: () => void
}

export function SessionExpiredModal({ open, onSignIn }: SessionExpiredModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader className="text-center items-center">
          <div className="p-3 rounded-full bg-status-escalate/10 mb-2">
            <AlertCircle className="w-8 h-8 text-status-escalate" />
          </div>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSignIn} className="w-full">
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
