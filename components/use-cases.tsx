import { Card } from "@/components/ui/card"
import { Building2, Settings, Palette } from "lucide-react"

const useCases = [
  {
    icon: Building2,
    title: "Scaling Founders",
    description: "Expanding offices or upgrading equipment quickly without the procurement headache.",
    example: '"Find 20 ergonomic chairs under $900 in a minimalist style"',
  },
  {
    icon: Settings,
    title: "Operations Managers",
    description: "Handling procurement and vendor coordination with analytical precision and team collaboration.",
    example: '"Compare standing desks with warranty coverage and fast delivery"',
  },
  {
    icon: Palette,
    title: "Design Consultants",
    description: "Curating premium setups for client workspaces with style mode and sustainability scoring.",
    example: '"Modern executive office setup with eco-friendly materials"',
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
            Built for teams that move fast
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Whether you're scaling, managing operations, or curating premium spaces, Mina adapts to your workflow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="group relative border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] hover:bg-card/80"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(96,165,250,0.4)] transition-all duration-300 group-hover:scale-110">
                  <useCase.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{useCase.title}</h3>
                <p className="mb-4 text-muted-foreground">{useCase.description}</p>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 backdrop-blur-sm">
                  <p className="text-sm font-mono italic text-primary/90">{useCase.example}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
