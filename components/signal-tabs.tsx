"use client"

import { useState } from "react"
import { CompanyDetail } from "./company-detail"

interface SignalCompany {
  name: string
  fundingInfo: string
  description: string
  timeAgo: string
  date?: string
  industry?: string
}

interface SignalTabsProps {
  insights: any[]
}

function categorizeIndustry(companyName: string, description: string): string {
  const text = (companyName + " " + description).toLowerCase()

  // AI & Machine Learning
  if (
    text.includes("ai ") ||
    text.includes("artificial intelligence") ||
    text.includes("machine learning") ||
    text.includes("ml ") ||
    text.includes("neural") ||
    text.includes("llm") ||
    text.includes("gpt") ||
    text.includes("generative")
  ) {
    return "AI"
  }

  // SaaS
  if (
    text.includes("saas") ||
    text.includes("software as a service") ||
    text.includes("cloud platform") ||
    text.includes("subscription software")
  ) {
    return "SaaS"
  }

  // Fintech
  if (
    text.includes("fintech") ||
    text.includes("financial") ||
    text.includes("payment") ||
    text.includes("banking") ||
    text.includes("crypto") ||
    text.includes("blockchain") ||
    text.includes("lending") ||
    text.includes("insurance")
  ) {
    return "Fintech"
  }

  // Healthtech
  if (
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("healthcare") ||
    text.includes("biotech") ||
    text.includes("pharma") ||
    text.includes("telemedicine") ||
    text.includes("wellness")
  ) {
    return "Healthtech"
  }

  // E-commerce
  if (
    text.includes("ecommerce") ||
    text.includes("e-commerce") ||
    text.includes("marketplace") ||
    text.includes("retail") ||
    text.includes("shopping") ||
    text.includes("commerce")
  ) {
    return "E-commerce"
  }

  // Climate & CleanTech
  if (
    text.includes("climate") ||
    text.includes("cleantech") ||
    text.includes("clean tech") ||
    text.includes("renewable") ||
    text.includes("sustainability") ||
    text.includes("carbon") ||
    text.includes("solar") ||
    text.includes("energy") ||
    text.includes("environmental")
  ) {
    return "CleanTech"
  }

  // Developer Tools
  if (
    text.includes("developer") ||
    text.includes("devtools") ||
    text.includes("api") ||
    text.includes("infrastructure") ||
    text.includes("cloud") ||
    text.includes("deployment") ||
    text.includes("coding") ||
    text.includes("programming")
  ) {
    return "Developer Tools"
  }

  // Cyber Security
  if (
    text.includes("security") ||
    text.includes("cybersecurity") ||
    text.includes("cyber") ||
    text.includes("encryption") ||
    text.includes("privacy") ||
    text.includes("threat")
  ) {
    return "Cyber Security"
  }

  // Compliance
  if (
    text.includes("compliance") ||
    text.includes("regulatory") ||
    text.includes("legal tech") ||
    text.includes("governance") ||
    text.includes("audit")
  ) {
    return "Compliance"
  }

  // Enterprise
  if (
    text.includes("enterprise") ||
    text.includes("b2b") ||
    text.includes("business software") ||
    text.includes("workforce") ||
    text.includes("hr tech")
  ) {
    return "Enterprise"
  }

  // Consumer
  if (
    text.includes("consumer") ||
    text.includes("b2c") ||
    text.includes("social") ||
    text.includes("entertainment") ||
    text.includes("media") ||
    text.includes("gaming")
  ) {
    return "Consumer"
  }

  // Default to Enterprise if no clear category
  return "Enterprise"
}

export function SignalTabs({ insights }: SignalTabsProps) {
  const [activeTab, setActiveTab] = useState<"trend" | "startup" | "funding">("trend")
  const [selectedInsight, setSelectedInsight] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categorizedInsights = {
    trend: insights.filter((i) => i.mode === "trend"),
    startup: insights.filter((i) => i.mode === "startup"),
    funding: insights.filter((i) => i.mode === "funding"),
  }

  const tabs = [
    { id: "trend" as const, label: "Trend Research", count: categorizedInsights.trend.length },
    { id: "startup" as const, label: "Startup Radar", count: categorizedInsights.startup.length },
    { id: "funding" as const, label: "Funding Research", count: categorizedInsights.funding.length },
  ]

  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight)
    setIsModalOpen(true)
  }

  const currentInsights = categorizedInsights[activeTab]

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
      {currentInsights.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentInsights.slice(0, 18).map((insight, index) => (
            <div
              key={index}
              onClick={() => handleInsightClick(insight)}
              className="p-4 rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-all cursor-pointer hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start gap-2 mb-3">
                <h3 className="font-semibold text-foreground">{insight.companyName}</h3>
              </div>
              <p className="text-sm font-medium text-yellow-500 mb-2">{insight.category}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{insight.headline}</p>
              <p className="text-xs text-muted-foreground">{insight.source}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No {activeTab} insights found. Try different search criteria.</p>
        </div>
      )}

      {/* CompanyDetail modal */}
      {selectedInsight && <CompanyDetail open={isModalOpen} onOpenChange={setIsModalOpen} company={selectedInsight} />}
    </div>
  )
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return ""
  }
}
