import { MessageSquare, Target, TrendingUp, Award, Briefcase, Sparkles } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Tell Mina What You're After",
    description: "Share your preferred location and startup stage you're interested in — Mina will scout accordingly.",
  },
  {
    icon: Target,
    title: "Track Real-Time Hiring Signals",
    description: "Mina scans funding news, team growth, and product launches to spot companies expanding their design teams.",
  },
  {
    icon: TrendingUp,
    title: "Discover Companies Before Job Posts Go Live",
    description: "See which Series C+ startups are actively growing design teams — and act before roles hit job boards.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
            How Mina Works
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Mina tracks real startup movements — funding rounds, leadership hires, and product launches.
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
