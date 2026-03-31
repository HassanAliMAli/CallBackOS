import Link from "next/link"
import { ArrowLeft, Check, PhoneOutgoing } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <Link className="flex items-center gap-2 group" href="/">
          <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
          <PhoneOutgoing className="h-5 w-5 text-primary ml-2" />
          <span className="font-bold font-mono tracking-tight shadow-sm">CallbackOS</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-20 md:py-32">
        <div className="container px-4 md:px-6 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple, transparent pricing.</h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              Pay only for the minutes you actually use. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="flex flex-col p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative">
              <h3 className="text-2xl font-semibold">Starter</h3>
              <p className="text-sm text-muted-foreground mt-2">Perfect for single location businesses.</p>
              <div className="mt-6 mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">$49</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 flex-1">
                {[
                  "1 Business Location",
                  "100 Included Call Minutes",
                  "$0.15 per additional minute",
                  "AI Call Summaries",
                  "Escalation SMS Alerts",
                  "Email Support"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-border">
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-12 text-base" variant="outline">Start Free Trial</Button>
                </Link>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="flex flex-col p-8 rounded-3xl border-2 border-primary bg-card shadow-lg relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-blue-500" />
              <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-semibold">Growth</h3>
              <p className="text-sm text-muted-foreground mt-2">For high-volume operations and agencies.</p>
              <div className="mt-6 mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">$149</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 flex-1">
                {[
                  "Up to 5 Business Locations",
                  "500 Included Call Minutes",
                  "$0.08 per additional minute",
                  "Advanced Analytics Dashboard",
                  "Custom Knowledge Base Training",
                  "Priority Email & Slack Support",
                  "Custom Webhook Integrations"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-border">
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-12 text-base shadow-md shadow-primary/20">Get Started Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
