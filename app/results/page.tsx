"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { CompanyCard } from "@/components/company-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { searchCompanies } from "../actions/search-companies"
import { SignalTabs } from "@/components/signal-tabs"

const initialCompanies = [
  {
    name: "Anthropic",
    stage: "Series C" as const,
    employees: 400,
    roles: ["Senior Product Designer", "Design Systems Designer"],
    signals: ["Raised $1.5B (Sep 2025)", "Hired VP of Design (Sarah Chen, ex-Figma)", "Launched Claude 3 (10M users)"],
    postedDays: 3,
  },
  {
    name: "Runway",
    stage: "Series C" as const,
    employees: 150,
    roles: ["Senior Product Designer", "Staff Product Designer", "Lead Product Designer"],
    signals: ["Raised $100M (Sept 2024)", "Hired Head of Design (Alex Kim, ex-Adobe)", "Launched Gen-2 (5M users)"],
    postedDays: 5,
  },
  {
    name: "Scale AI",
    stage: "Series D" as const,
    employees: 400,
    roles: ["Staff Product Designer"],
    signals: [
      "Raised $600M (May 2024)",
      "Hired Design Director (Jordan Lee, ex-Google)",
      "Expanded to enterprise (500+ clients)",
    ],
    postedDays: 7,
  },
]

const formatFundingStage = (stage: string) => {
  return stage
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const formatLocation = (location: string) => {
  return location
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const fundingStage = searchParams.get("fundingStage") || "series-c"
  const location = searchParams.get("location") || "san-francisco"

  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadInitialResults = async () => {
      console.log("[v0] Loading initial results for:", { fundingStage, location })
      setLoading(true)
      setError(null)

      try {
        const result = await searchCompanies(fundingStage, location, 0)

        if (result.success) {
          console.log("[v0] Initial results loaded:", result.companies.length, "companies")
          setCompanies(result.companies)
          setHasMore(result.hasMore)

          if (result.companies.length === 0) {
            setError("No companies found. Try different search criteria or check back later.")
          }
        } else {
          setError(result.error || "Failed to load companies")
        }
      } catch (err) {
        console.error("[v0] Error loading initial results:", err)
        setError("Failed to load companies")
      } finally {
        setLoading(false)
      }
    }

    loadInitialResults()
  }, [fundingStage, location])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    setError(null)

    try {
      const result = await searchCompanies(fundingStage, location, companies.length)

      if (result.success && result.companies.length > 0) {
        setCompanies([...companies, ...result.companies])
        setHasMore(result.hasMore)
      } else {
        setError(result.error || "No more companies found")
        setHasMore(false)
      }
    } catch (err) {
      console.error("[v0] Error loading more companies:", err)
      setError("Failed to load more companies")
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Searching for hiring signals via You.com API...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 lg:px-8 pt-24 pb-16">
        {/* Results Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-foreground">Results</h1>

            <div className="flex items-center gap-3">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur-sm border-primary/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Signals</SelectItem>
                  <SelectItem value="oldest">Oldest Signals</SelectItem>
                  <SelectItem value="funding">Funding Stage</SelectItem>
                  <SelectItem value="size">Company Size</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-primary/20 gap-2 bg-transparent">
                <FileSpreadsheet className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Real-time hiring signals powered by You.com API • Tracking funding, leadership hires, and product launches
          </p>
        </div>

        {/* Signal Tabs Section */}
        {companies.length > 0 && <SignalTabs companies={companies} />}

        {/* Company Cards */}
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <CompanyCard key={`${company.name}-${index}`} company={company} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No companies found. Try different search criteria.</p>
          </div>
        )}

        {/* Load More */}
        {companies.length > 0 && (
          <div className="mt-8 text-center">
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            {hasMore && (
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 bg-transparent"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Companies"
                )}
              </Button>
            )}
            {!hasMore && !error && <p className="text-sm text-muted-foreground">No more companies to load</p>}
          </div>
        )}
      </main>
    </div>
  )
}
