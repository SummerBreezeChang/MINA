import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/70 backdrop-blur-xl shadow-[0_0_30px_rgba(96,165,250,0.05)]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Mina</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex hover:text-primary">
              Sign In
            </Button>
            <Button
              size="sm"
              className="shadow-[0_0_20px_rgba(96,165,250,0.2)] hover:shadow-[0_0_25px_rgba(96,165,250,0.4)] transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
