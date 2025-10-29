"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SignalTabs } from "@/components/signal-tabs"
import { searchCompanies } from "@/app/actions/search-companies"

export function Hero() {
  const [fundingStage, setFundingStage] = useState("")
  const [location, setLocation] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true)
      console.log("[v0] Hero: Loading initial data from You.com API")

      // Load data for all three categories in parallel
      const [fundingData, teamData, productData] = await Promise.all([
        searchCompanies("series-c", "san-francisco", 0),
        searchCompanies("series-d", "seattle", 0),
        searchCompanies("series-e", "new-york", 0),
      ])

      console.log("[v0] Hero: Funding data:", fundingData.companies?.length || 0, "companies")
      console.log("[v0] Hero: Team data:", teamData.companies?.length || 0, "companies")
      console.log("[v0] Hero: Product data:", productData.companies?.length || 0, "companies")

      // Combine all companies
      const allCompanies = [
        ...(fundingData.companies || []),
        ...(teamData.companies || []),
        ...(productData.companies || []),
      ]

      console.log("[v0] Hero: Total companies loaded:", allCompanies.length)
      setCompanies(allCompanies)
      setLoading(false)
    }

    loadInitialData()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (fundingStage) params.set("fundingStage", fundingStage)
    if (location) params.set("location", location)
    router.push(`/results?${params.toString()}`)
  }

  const sampleCompanies = [
    {
      name: "Anthropic",
      signals: ["Series B - $580M from Google, Spark Capital"],
      description:
        "Anthropic, an AI safety and research company, raised significant funding to expand their Claude AI assistant...",
      postedDays: 730,
      signalCategories: ["funding"],
    },
    {
      name: "Scale AI",
      signals: ["Series E - $325M at $7.3B valuation"],
      description:
        "Scale AI, a data labeling platform for AI applications, closed a large funding round indicating strong growth...",
      postedDays: 365,
      signalCategories: ["funding"],
    },
    {
      name: "OpenAI",
      signals: ["Series C - $1B from Microsoft"],
      description:
        "OpenAI secured a substantial investment from Microsoft, significantly expanding their AI research capabilities...",
      postedDays: 1825,
      signalCategories: ["funding"],
    },
    {
      name: "Hugging Face",
      signals: ["Series C - $100M led by Lux Capital"],
      description:
        "Hugging Face, known for its open-source AI models and tools, secured funding to expand its platform...",
      postedDays: 365,
      signalCategories: ["funding"],
    },
    {
      name: "Cohere",
      signals: ["Series C - $270M from Inovia, NVIDIA"],
      description:
        "Cohere, an enterprise AI platform, raised substantial capital to expand its language model offerings...",
      postedDays: 240,
      signalCategories: ["funding"],
    },
    {
      name: "Inflection AI",
      signals: ["Series B - $1.3B from Microsoft, Reid Hoffman"],
      description: "Inflection AI, co-founded by Mustafa Suleyman, achieved a significant funding milestone...",
      postedDays: 180,
      signalCategories: ["funding"],
    },
    {
      name: "Mistral AI",
      signals: ["Seed Round - $113M from Lightspeed"],
      description:
        "Mistral AI, a new European AI startup, secured a large seed round, indicating strong investor interest...",
      postedDays: 30,
      signalCategories: ["funding"],
    },
    {
      name: "DeepMind",
      signals: ["Acquired by Google for $500M"],
      description:
        "DeepMind, a leading AI company, was acquired by Google, significantly expanding their AI capabilities...",
      postedDays: 3650,
      signalCategories: ["funding"],
    },
    {
      name: "Figma",
      signals: ["Hired VP of Design from Apple"],
      description: "Figma expanded their design leadership team with a key hire from Apple, indicating team growth...",
      postedDays: 60,
      signalCategories: ["team"],
    },
    {
      name: "Notion",
      signals: ["Design team expansion - 5 new roles"],
      description: "Notion is rapidly expanding their design team with multiple senior positions...",
      postedDays: 14,
      signalCategories: ["team"],
    },
    {
      name: "Linear",
      signals: ["Hired Head of Design from Stripe"],
      description: "Linear brought on senior design leadership from Stripe to scale their product design...",
      postedDays: 90,
      signalCategories: ["team"],
    },
    {
      name: "Vercel",
      signals: ["Design system team expansion"],
      description: "Vercel is building out their design system team with multiple new positions...",
      postedDays: 21,
      signalCategories: ["team"],
    },
    {
      name: "Stripe",
      signals: ["Launched new payment links product"],
      description: "Stripe launched a major new product feature, indicating active product development...",
      postedDays: 45,
      signalCategories: ["product"],
    },
    {
      name: "Shopify",
      signals: ["Released Shopify Editions - 100+ updates"],
      description: "Shopify announced a massive product update with over 100 new features...",
      postedDays: 30,
      signalCategories: ["product"],
    },
    {
      name: "Webflow",
      signals: ["Launched Webflow Apps marketplace"],
      description: "Webflow released a new apps marketplace, significantly expanding their platform...",
      postedDays: 120,
      signalCategories: ["product"],
    },
    {
      name: "Framer",
      signals: ["Released AI-powered design tools"],
      description: "Framer launched new AI features for automated design generation...",
      postedDays: 15,
      signalCategories: ["product"],
    },
  ]

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/design-mode/Screenshot%202025-10-18%20at%203.28.10%E2%80%AFPM.png"
          alt=""
          className="h-full w-full object-cover animate-gradient-flow"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-20 pb-2">
        <div className="mx-auto max-w-4xl text-center my-6 mt-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm shadow-[0_0_20px_rgba(96,165,250,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Real-Time data via You.com API
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
            Find Design Roles at Growing Startups
          </h1>

          <div className="mx-auto w-full max-w-3xl mb-16 min-h-[56px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center min-h-[56px]">
              <Select value={fundingStage} onValueChange={setFundingStage}>
                <SelectTrigger className="w-full sm:w-[280px] bg-background/80 backdrop-blur-sm border-primary/20 !h-[56px] text-base">
                  <SelectValue placeholder="Funding stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="series-c">Series C</SelectItem>
                  <SelectItem value="series-d">Series D</SelectItem>
                  <SelectItem value="series-e">Series E+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full sm:w-[280px] bg-background/80 backdrop-blur-sm border-primary/20 !h-[56px] text-base">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="lg"
                className="w-full sm:w-auto px-8 whitespace-nowrap shadow-[0_0_30px_rgba(96,165,250,0.3)] hover:shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all h-[56px] text-base"
                onClick={handleSearch}
                disabled={!fundingStage || !location}
              >
                Find Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 pb-6">
        <div className="mb-8 text-left">
          <h2 className="text-3xl font-bold mb-2">Latest Hiring Signals</h2>
          <p className="text-muted-foreground">
            {loading
              ? "Loading real-time data from You.com..."
              : `Showing ${companies.length} companies with recent signals`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Fetching real-time data from You.com API...</span>
          </div>
        ) : companies.length > 0 ? (
          <SignalTabs companies={companies} />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>No companies found. You.com API returned no results.</p>
            <p className="text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSearch}
            className="border-primary/20 hover:bg-primary/5 bg-transparent"
            disabled={!fundingStage || !location}
          >
            See More Companies
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
