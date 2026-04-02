"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Upload, FileText, Trash2, Plus, X, Save, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingButton } from "@/components/states/loading-button"
import { useBusinesses } from "@/lib/stores/business-context"
import type { KBFile, FAQ } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Ready": return <CheckCircle2 className="w-3.5 h-3.5 text-status-completed" />
    case "Processing": return <Loader2 className="w-3.5 h-3.5 text-status-processing animate-spin" />
    case "Error": return <AlertCircle className="w-3.5 h-3.5 text-destructive" />
    default: return null
  }
}

export default function KnowledgeBasePage() {
  const params = useParams()
  const router = useRouter()
  const { businesses } = useBusinesses()
  const biz = businesses.find(b => b.id === params.id)
  const [saving, setSaving] = useState(false)

  // Empty arrays - no mock data
  const files: KBFile[] = []
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [instructions, setInstructions] = useState("")

  const addFaq = () => setFaqs(prev => [...prev, { id: `faq_new_${Date.now()}`, question: "", answer: "", businessId: params.id as string }])
  const removeFaq = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id))
  const updateFaq = (id: string, field: "question" | "answer", value: string) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
  const save = async () => { 
    setSaving(true)
    // TODO: Call API to save FAQs and custom instructions to D1
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  if (!biz) return <div className="text-center py-20 text-muted-foreground">Business not found</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.push("/businesses")}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h1 className="text-lg font-semibold">{biz.name}</h1><p className="text-xs text-muted-foreground">Knowledge Base</p></div>
      </div>

      {/* File Upload */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Uploaded Files</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drag and drop files here, or <span className="text-primary font-medium">browse</span></p>
          <p className="text-xs text-muted-foreground/60 mt-1">PDF, TXT, DOCX — Max 10MB per file</p>
        </div>
        {files.length > 0 && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-xs">File</TableHead>
                <TableHead className="text-xs">Size</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Uploaded</TableHead>
                <TableHead className="text-xs w-[60px]"></TableHead>
              </TableRow></TableHeader>
              <TableBody>{files.map(file => (
                <TableRow key={file.id} className="border-border">
                  <TableCell className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground shrink-0" /><span className="text-sm truncate">{file.name}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatBytes(file.size)}</TableCell>
                  <TableCell><div className="flex items-center gap-1.5">{getStatusIcon(file.status)}<span className="text-xs">{file.status}</span></div></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{file.uploadedAt.toLocaleDateString()}</TableCell>
                  <TableCell><Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">FAQs ({faqs.length})</h2>
          <Button variant="outline" size="sm" onClick={addFaq} className="gap-1"><Plus className="w-3.5 h-3.5" />Add FAQ</Button>
        </div>
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="p-4 rounded-lg border border-border bg-card space-y-3 relative group">
              <button onClick={() => removeFaq(faq.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"><Trash2 className="w-4 h-4" /></button>
              <Input placeholder="Question" value={faq.question} onChange={e => updateFaq(faq.id, "question", e.target.value)} />
              <Textarea placeholder="Answer" value={faq.answer} onChange={e => updateFaq(faq.id, "answer", e.target.value)} rows={2} />
            </div>
          ))}
          {faqs.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No FAQs yet. Add one to train your agent.</p>}
        </div>
      </section>

      {/* Custom Instructions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Custom Instructions</h2>
        <Textarea placeholder="Add custom instructions..." value={instructions} onChange={e => setInstructions(e.target.value)} rows={5} />
        <p className="text-xs text-muted-foreground">Guide your agent&apos;s behavior during calls.</p>
      </section>

      <LoadingButton isLoading={saving} onClick={save} className="gap-1.5"><Save className="w-4 h-4" />Save Knowledge Base</LoadingButton>
    </div>
  )
}
