import { MessageSquare, Target, TrendingUp, Award, Briefcase, Sparkles } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Share Your Career Goals",
    description: "Tell Mina about your design aspirations, skills, experience level, and what you're looking for next.",
  },
  {
    icon: Target,
    title: "AI-Powered Career Analysis",
    description: "Mina analyzes market trends, salary data, and skill demands to map your optimal career path.",
  },
  {
    icon: TrendingUp,
    title: "Personalized Recommendations",
    description: "Get tailored advice on roles, companies, skills to learn, and portfolio improvements.",
  },
  {
    icon: Award,
    title: "Skill Gap Assessment",
    description: "Identify exactly what skills you need to reach your next career milestone with actionable steps.",
  },
  {
    icon: Briefcase,
    title: "Job Market Insights",
    description: "Access real-time data on hiring trends, salary ranges, and company culture for design roles.",
  },
  {
    icon: Sparkles,
    title: "Continuous Career Tracking",
    description: "Monitor your progress, get alerts on relevant opportunities, and refine your strategy over time.",
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
            A seamless journey from career exploration to landing your dream design role.
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
