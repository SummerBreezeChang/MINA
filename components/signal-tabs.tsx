"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"

interface SignalCompany {
  name: string
  fundingInfo: string
  description: string
  timeAgo: string
}

interface SignalTabsProps {
  companies: any[]
}

export function SignalTabs({ companies }: SignalTabsProps) {
  const [activeTab, setActiveTab] = useState<"funding" | "team" | "product">("funding")

  const categorizedCompanies = {
    funding: companies
      .filter((c) => c.signalCategories?.includes("funding"))
      .map((c) => ({
        name: c.name,
        fundingInfo: c.signals.find((s: string) => s.includes("$") || s.includes("funding")) || c.signals[0],
        description: c.description || `${c.name}, a leading tech company, secured significant funding...`,
        timeAgo: formatTimeAgo(c.postedDays),
      })),
    team: companies
      .filter((c) => c.signalCategories?.includes("team"))
      .map((c) => ({
        name: c.name,
        fundingInfo: c.signals.find((s: string) => s.includes("Hired") || s.includes("expansion")) || c.signals[0],
        description: c.description || `${c.name} is expanding their design team with key leadership hires...`,
        timeAgo: formatTimeAgo(c.postedDays),
      })),
    product: companies
      .filter((c) => c.signalCategories?.includes("product"))
      .map((c) => ({
        name: c.name,
        fundingInfo: c.signals.find((s: string) => s.includes("launch") || s.includes("product")) || c.signals[0],
        description: c.description || `${c.name} recently launched a new product, indicating growth...`,
        timeAgo: formatTimeAgo(c.postedDays),
      })),
  }

  const tabs = [
    { id: "funding" as const, label: "Funding Signals", count: categorizedCompanies.funding.length },
    { id: "team" as const, label: "Team Growth", count: categorizedCompanies.team.length },
    { id: "product" as const, label: "Product Launches", count: categorizedCompanies.product.length },
  ]

  const currentCompanies = categorizedCompanies[activeTab]

  return (
    <div className="mb-12">
      {/* Tabs */}
      <div className="border-b border-primary/20 mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative text-card-foreground ${
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Company Cards Grid */}
      {currentCompanies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {currentCompanies.slice(0, 16).map((company, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <h3 className="font-semibold text-foreground">{company.name}</h3>
              </div>
              <p className="text-sm font-medium text-yellow-500 mb-2">{company.fundingInfo}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{company.description}</p>
              <p className="text-xs text-muted-foreground">{company.timeAgo}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No {activeTab} signals found. Try different search criteria.</p>
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(days: number): string {
  if (days < 1) return "Today"
  if (days === 1) return "1 day ago"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}
