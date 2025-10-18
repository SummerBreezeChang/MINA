import { MessageSquare, Search, LayoutGrid, CheckCircle2, ShoppingBag, Package } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Describe What You Need",
    description: "Chat with Mina about your requirements — budget, color, material, purpose, and style preferences.",
  },
  {
    icon: Search,
    title: "Mina Searches Trusted Vendors",
    description: "Our AI extracts details and searches across trusted vendors to find the best matches.",
  },
  {
    icon: LayoutGrid,
    title: "Review Visual Comparisons",
    description: "Get clean, visual comparison cards ranked by fit — price, quality, delivery, and style.",
  },
  {
    icon: CheckCircle2,
    title: "Approve Your Choice",
    description: "You or your team reviews and approves the preferred option with confidence.",
  },
  {
    icon: ShoppingBag,
    title: "Purchase-Ready Carts",
    description: "Mina prepares purchase-ready carts or vendor quotes for seamless checkout.",
  },
  {
    icon: Package,
    title: "Track & Follow Up",
    description: "Monitor order status and get notified of follow-ups or discounts automatically.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
            How Mina works
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            A seamless journey from request to delivery, designed for busy teams.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%+1rem)] w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_rgba(96,165,250,0.3)] group-hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all group-hover:scale-110 duration-300">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-mono font-medium text-primary">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute left-1/3 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent/10 glow-orb"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </section>
  )
}
