import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm shadow-[0_0_20px_rgba(96,165,250,0.15)]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="font-medium">Your intelligent shopping agent</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Find the perfect products for your business
          </h1>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden shadow-[0_0_30px_rgba(96,165,250,0.3)] hover:shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all"
            >
              <Link href="/search">
                <span className="relative z-10">Start Shopping with Mina</span>
                <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 glow-orb" />
        <div
          className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/15 glow-orb"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute left-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-secondary/10 glow-orb"
          style={{ animationDelay: "4s" }}
        />
        {/* Grid overlay for tech aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>
    </section>
  )
}
