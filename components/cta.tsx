import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card/30 backdrop-blur-xl shadow-[0_0_50px_rgba(96,165,250,0.15)]">
          <div className="relative z-10 px-8 py-16 text-center lg:px-16 lg:py-24">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Ready to transform your procurement?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
              Join scaling founders, operations managers, and design consultants who trust Mina to make smart purchasing
              decisions.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group relative overflow-hidden shadow-[0_0_30px_rgba(96,165,250,0.3)] hover:shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all"
              >
                <span className="relative z-10">Get Started with Mina</span>
                <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all bg-transparent"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>

          <div className="absolute inset-0 -z-0">
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/20 glow-orb" />
            <div
              className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent/15 glow-orb"
              style={{ animationDelay: "3s" }}
            />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>
        </div>

        <footer className="mt-16 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Mina. Your intelligent shopping agent.</p>
        </footer>
      </div>
    </section>
  )
}
