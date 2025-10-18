import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/design-mode/Screenshot%202025-10-18%20at%203.28.10%E2%80%AFPM.png"
          alt=""
          className="h-full w-full object-cover animate-gradient-flow"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm shadow-[0_0_20px_rgba(96,165,250,0.15)]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="font-medium">Your intelligent shopping agent</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent leading-[4rem]">
            {"Your Shopping Concierge \n"}
          </h1>

          <p className="mb-10 text-2xl font-semibold text-foreground lg:text-3xl">
            Takes the stress out of big buying decisions.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group relative overflow-hidden shadow-[0_0_30px_rgba(96,165,250,0.3)] hover:shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all"
            >
              <span className="relative z-10">Start Shopping with Mina</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
