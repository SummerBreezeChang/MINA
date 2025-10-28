"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CompanyCard } from "@/components/company-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { searchCompanies } from "../actions/search-companies"

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

export default function ResultsPage() {
  const [companies, setCompanies] = useState(initialCompanies)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLoadMore = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await searchCompanies("Senior Product Designer", "San Francisco", companies.length)

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
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 lg:px-8 pt-24 pb-16">
        {/* Results Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              Found {companies.length}+ companies hiring Senior Product Designers in San Francisco
            </h1>

            <div className="flex items-center gap-3">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur-sm border-primary/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="funding">Funding Stage</SelectItem>
                  <SelectItem value="size">Company Size</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-primary/20 gap-2 bg-transparent">
                <FileSpreadsheet className="h-4 w-4" />→ Google Sheets
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Real-time results powered by You.com • Updated 2 hours ago</p>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <CompanyCard key={index} company={company} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          {hasMore && (
            <Button
              variant="outline"
              size="lg"
              className="border-primary/20 bg-transparent"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? (
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
      </main>
    </div>
  )
}
