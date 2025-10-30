"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2 } from "lucide-react"
import { SignalTabs } from "@/components/signal-tabs"
import { searchStartups } from "@/app/actions/search-companies"

export function Hero() {
  const [mode, setMode] = useState("")
  const [topic, setTopic] = useState("")
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true)
      console.log("[v0] Hero: Loading initial startup insights from You.com API")

      const [trendData, startupData, fundingData] = await Promise.all([
        searchStartups("trend", "AI", 0),
        searchStartups("startup", "SaaS", 0),
        searchStartups("funding", "Fintech", 0),
      ])

      console.log("[v0] Hero: Trend data:", trendData.insights?.length || 0, "insights")
      console.log("[v0] Hero: Startup data:", startupData.insights?.length || 0, "insights")
      console.log("[v0] Hero: Funding data:", fundingData.insights?.length || 0, "insights")

      const allInsights = [
        ...(trendData.insights || []),
        ...(startupData.insights || []),
        ...(fundingData.insights || []),
      ]

      console.log("[v0] Hero: Total insights loaded:", allInsights.length)
      setInsights(allInsights)
      setLoading(false)
    }

    loadInitialData()
  }, [])

  const handleSearch = async () => {
    if (!mode || !topic) return

    setSearching(true)
    console.log("[v0] Hero: Searching for", mode, topic)

    try {
      const result = await searchStartups(mode as "trend" | "startup" | "funding", topic, 0)
      console.log("[v0] Hero: Search results:", result.insights?.length || 0, "insights")
      setInsights(result.insights || [])
    } catch (error) {
      console.error("[v0] Hero: Search error:", error)
    } finally {
      setSearching(false)
    }
  }

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
            Real-Time Intelligence via You.com API
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
            Discover Startup Insights in Real-Time
          </h1>

          <div className="mx-auto w-full max-w-3xl mb-16 min-h-[56px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center min-h-[56px] gap-4">
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="w-full sm:w-[280px] bg-background/80 backdrop-blur-sm border-primary/20 !h-[56px] text-base">
                  <SelectValue placeholder="Research mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend">Trend Research</SelectItem>
                  <SelectItem value="startup">Startup Radar</SelectItem>
                  <SelectItem value="funding">Funding Research</SelectItem>
                </SelectContent>
              </Select>

              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger className="w-full sm:w-[280px] bg-background/80 backdrop-blur-sm border-primary/20 !h-[56px] text-base">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI">AI & Machine Learning</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="Healthtech">Healthtech</SelectItem>
                  <SelectItem value="CleanTech">CleanTech</SelectItem>
                  <SelectItem value="DevTools">Developer Tools</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="lg"
                className="w-full sm:w-auto px-8 whitespace-nowrap shadow-[0_0_30px_rgba(96,165,250,0.3)] hover:shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all h-[56px] text-base"
                onClick={handleSearch}
                disabled={!mode || !topic || searching}
              >
                {searching ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    Discover Insights
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 pb-6">
        <div className="mb-8 text-left">
          <h2 className="text-3xl font-bold mb-2">Latest Startup Intelligence</h2>
          <p className="text-muted-foreground">
            {loading || searching
              ? "Loading real-time insights from You.com..."
              : `Showing ${insights.length} startup insights across trends, activity, and funding`}
          </p>
        </div>

        {loading || searching ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Fetching real-time startup intelligence from You.com API...
            </span>
          </div>
        ) : insights.length > 0 ? (
          <SignalTabs insights={insights} />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>No insights found. You.com API returned no results.</p>
            <p className="text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
