import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { UseCases } from "@/components/use-cases"
import { CTA } from "@/components/cta"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <UseCases />
      <CTA />
    </main>
  )
}
