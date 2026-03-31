import Link from "next/link"
import { ArrowRight, Bot, PhoneOutgoing, Clock, CheckCircle2, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <Link className="flex items-center justify-center gap-2" href="#">
          <PhoneOutgoing className="h-6 w-6 text-primary" />
          <span className="font-bold font-mono tracking-tight text-lg shadow-sm">CallbackOS</span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
          <Link className="text-muted-foreground hover:text-foreground transition-colors" href="#features">Features</Link>
          <Link className="text-muted-foreground hover:text-foreground transition-colors" href="#how-it-works">How it Works</Link>
          <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/pricing">Pricing</Link>
          <Link className="text-muted-foreground hover:text-foreground transition-colors" href="#faq">FAQ</Link>
        </nav>
        <div className="ml-6 flex items-center gap-3">
          <Link href="/signin">
            <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 relative overflow-hidden flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="container px-4 md:px-6 relative z-10 max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-primary/20">
              <SparklesIcon className="w-3.5 h-3.5 mr-1.5" /> Introducing v2.0 AI Voice Agents
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Never miss a lead. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Automate your callbacks.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
              CallbackOS instantly dials back missed calls, speaks naturally to your customers, answers FAQs, and books appointments while you sleep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-base group">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                  Listen to a Demo
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground font-medium pt-2">No credit card required · 14-day free trial</p>
          </div>
        </section>

        {/* Logo Ticker */}
        <section className="w-full py-12 border-y border-border/50 bg-secondary/30">
          <div className="container px-4 md:px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">Trusted by 1000+ local businesses</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              {/* @MOCK placeholders for logos */}
              {["Acme Corp", "GlobalTech", "Local Dental", "AutoFix", "Prime Plumbers", "Elite Legal"].map((logo) => (
                <div key={logo} className="font-bold text-xl md:text-2xl font-mono tracking-tighter text-foreground/80 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-foreground/20" /> {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Bento Grid */}
        <section id="how-it-works" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How CallbackOS Works</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">Set up your AI agent in minutes. Our system handles the rest securely and automatically.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl border border-border bg-secondary/50 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Phone</h3>
                <p className="text-muted-foreground">Link your existing business number via Twilio or direct SIP trunk. No need to change your provider.</p>
              </div>
              <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl border border-border bg-secondary/50 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Train the AI</h3>
                <p className="text-muted-foreground">Upload your PDFs, price lists, and FAQs. The agent learns your business instantly and follows your exact scripts.</p>
              </div>
              <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl border border-border bg-secondary/50 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Auto-Dial Back</h3>
                <p className="text-muted-foreground">When you miss a call, the AI calls them back immediately, answers questions, and logs the transcript directly in your dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full py-20 md:py-32 bg-secondary/20 border-y border-border/50">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Built for Scale</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">Everything you need to run a 24/7 reception desk without hiring extra staff.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <FeatureCard icon={<Bot />} title="Human-like Voice" desc="Sub-500ms latency with ElevenLabs voice cloning for completely natural, interruption-aware conversations." />
              <FeatureCard icon={<Shield />} title="Knowledge Base" desc="Upload PDFs, websites, and text. The agent rigidly follows instructions and never hallucinates answers." />
              <FeatureCard icon={<Clock />} title="Smart Scheduling" desc="Configure exact operating hours, weekend logic, and specific time delays before the agent calls back." />
              <FeatureCard icon={<Zap />} title="Instant Escalation" desc="If a caller is frustrated or asks for a human, the agent instantly pauses and SMS texts your manager." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container px-4 md:px-6 relative z-10 text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Stop leaving money on the table.</h2>
            <p className="text-muted-foreground md:text-xl">Every missed call is a missed customer. Install CallbackOS today and guarantee every lead is captured.</p>
            <div className="pt-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-lg w-full sm:w-auto shadow-lg shadow-primary/20">
                  Create Your Free Account
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-4">Takes 2 minutes to set up. Cancel anytime.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-background py-8 md:py-12">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
          <div className="flex items-center gap-2">
            <PhoneOutgoing className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold tracking-tight text-muted-foreground text-sm">CallbackOS Inc.</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CallbackOS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">Terms of Service</Link>
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a4.5 4.5 0 0 1 0-8.962L8.5 1.936A2 2 0 0 0 9.937.5l1.582-6.135a4.5 4.5 0 0 1 8.962 0L22.063.5a2 2 0 0 0 1.437 1.437l6.135 1.581a4.5 4.5 0 0 1 0 8.962l-6.135 1.582a2 2 0 0 0-1.437 1.437l-1.582 6.135a4.5 4.5 0 0 1-8.962 0z" />
    </svg>
  )
}
