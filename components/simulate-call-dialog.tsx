"use client"

import { useState, useEffect } from "react"
import { Phone, Check, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const DEMO_BUSINESSES = [
  { id: "apex-dental", name: "Apex Dental Care" },
  { id: "metro-auto", name: "Metro Auto Repair" },
  { id: "sunrise-yoga", name: "Sunrise Yoga Studio" },
]

type CallbackDelay = "immediately" | "30-seconds" | "2-minutes"

interface FormData {
  phoneNumber: string
  callerName: string
  business: string
  reason: string
  delay: CallbackDelay
}

interface SimulateCallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
}

export function SimulateCallDialog({
  open,
  onOpenChange,
  onSubmit,
}: SimulateCallDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    callerName: "",
    business: "",
    reason: "",
    delay: "immediately",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        phoneNumber: "",
        callerName: "",
        business: "",
        reason: "",
        delay: "immediately",
      })
      setIsSubmitting(false)
      setIsSuccess(false)
      setPhoneError("")
    }
  }, [open])

  const getDelayText = (delay: CallbackDelay): string => {
    switch (delay) {
      case "immediately":
        return "a few seconds"
      case "30-seconds":
        return "30 seconds"
      case "2-minutes":
        return "2 minutes"
    }
  }

  const validatePhone = (phone: string): boolean => {
    // Simple validation - must have at least 10 digits
    const digits = phone.replace(/\D/g, "")
    return digits.length >= 10
  }

  const handleSubmit = async () => {
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      setPhoneError("Phone number is required")
      return
    }
    if (!validatePhone(formData.phoneNumber)) {
      setPhoneError("Please enter a valid phone number")
      return
    }
    setPhoneError("")

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Call the onSubmit callback
    onSubmit(formData)

    // Close dialog after showing success state
    setTimeout(() => {
      onOpenChange(false)
    }, 2000)
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }))
    if (phoneError) setPhoneError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                Simulate Missed Call
              </DialogTitle>
              <DialogDescription>
                Trigger an AI callback for testing
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-foreground">
                  Caller Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={cn(phoneError && "border-destructive")}
                />
                {phoneError && (
                  <span className="text-xs text-destructive">{phoneError}</span>
                )}
              </div>

              {/* Caller Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-foreground">
                  Caller Name
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.callerName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, callerName: e.target.value }))
                  }
                />
              </div>

              {/* Business Select */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="business" className="text-foreground">
                  Business
                </Label>
                <Select
                  value={formData.business}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, business: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a business" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_BUSINESSES.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason for Call */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="reason" className="text-foreground">
                  Reason for call
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Wants to book appointment"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Callback Delay */}
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Callback delay</Label>
                <RadioGroup
                  value={formData.delay}
                  onValueChange={(value: CallbackDelay) =>
                    setFormData((prev) => ({ ...prev, delay: value }))
                  }
                  className="flex flex-col gap-2"
                >
                  <label
                    htmlFor="delay-immediately"
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer transition-colors hover:bg-accent/50",
                      formData.delay === "immediately" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="immediately" id="delay-immediately" />
                    <span className="text-sm font-medium">Immediately</span>
                  </label>
                  <label
                    htmlFor="delay-30-seconds"
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer transition-colors hover:bg-accent/50",
                      formData.delay === "30-seconds" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="30-seconds" id="delay-30-seconds" />
                    <span className="text-sm font-medium">30 seconds</span>
                  </label>
                  <label
                    htmlFor="delay-2-minutes"
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer transition-colors hover:bg-accent/50",
                      formData.delay === "2-minutes" && "border-2-minutes bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="2-minutes" id="delay-2-minutes" />
                    <span className="text-sm font-medium">2 minutes</span>
                  </label>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Triggering...
                  </>
                ) : (
                  "Trigger Callback"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogTitle className="sr-only">Callback Queued</DialogTitle>
            <DialogDescription className="sr-only">
              Your callback has been successfully queued
            </DialogDescription>
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center animate-in zoom-in-50 duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white animate-in zoom-in-0 duration-300 delay-150" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Callback queued
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  AI agent will call within {getDelayText(formData.delay)}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
