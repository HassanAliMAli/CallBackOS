"use client"

import Link from "next/link"
import { FileQuestion, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <span className="text-[120px] font-bold text-border leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-secondary">
              <FileQuestion className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-1.5"><ArrowLeft className="w-4 h-4" />Go Back</Button>
          <Button asChild className="gap-1.5"><Link href="/dashboard"><Home className="w-4 h-4" />Dashboard</Link></Button>
        </div>
      </div>
    </div>
  )
}
