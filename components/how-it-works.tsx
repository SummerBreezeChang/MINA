import { Button } from "@/components/ui/button"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative lg:py-20">
      <div className="container mx-auto px-6 lg:px-0">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight lg:text-6xl bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent mb-6">
            About Mina
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-4">
            <p className="text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Built with <span className="text-primary font-medium">V0</span> and{" "}
              <span className="text-primary font-medium">You.com API</span>, Mina turns web research into clear,
              actionable startup insights. A{" "}
              <span className="font-medium text-muted-foreground">hackathon project</span> by Summer Chang showcasing
              how AI can simplify startup discovery.
            </p>

            <div className="pt-8 space-y-2">
              <Button
                asChild
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all hover:scale-105"
              >
                <a
                  href="https://www.linkedin.com/in/summerchang/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Connect on LinkedIn
                </a>
              </Button>
              <p className="text-muted-foreground text-base italic">I'd love your feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
