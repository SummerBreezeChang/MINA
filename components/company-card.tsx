"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StageBadge } from "@/components/stage-badge"
import { TrendingUp, Calendar, ExternalLink } from "lucide-react"

interface CompanyCardProps {
  company: {
    companyName: string
    category: "Funding" | "Team Growth" | "Product Launch"
    description: string
    fundingDate: string
    fundingAmount?: string
    fundingStage?: string
    context?: string
    sourceUrl: string
    companyWebsite?: string
    glassdoor?: string
  }
}

export function CompanyCard({ company }: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getCategoryIcon = () => {
    switch (company.category) {
      case "Funding":
        return "💰"
      case "Team Growth":
        return "👥"
      case "Product Launch":
        return "🚀"
    }
  }

  const getCategoryColor = () => {
    switch (company.category) {
      case "Funding":
        return "text-green-500"
      case "Team Growth":
        return "text-blue-500"
      case "Product Launch":
        return "text-purple-500"
    }
  }

  return (
    <div className="group rounded-xl border border-primary/20 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1 bg-card">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-2xl">
          {getCategoryIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{company.companyName}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium ${getCategoryColor()}`}>{company.category}</span>
                {company.fundingStage && <StageBadge stage={company.fundingStage as any} />}
              </div>
            </div>
          </div>

          <div className="mb-3 text-sm text-muted-foreground line-clamp-2">{company.description}</div>

          <div className="mb-3 rounded-lg bg-primary/5 border border-primary/10 p-3">
            <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              Signal Detected
            </div>
            <p className="text-sm text-foreground">
              {company.fundingAmount && `Raised ${company.fundingAmount}`}
              {company.context && company.context}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            {company.fundingDate}
          </div>

          <div className="flex flex-wrap gap-2">
            {company.companyWebsite && (
              <Button size="sm" variant="outline" asChild className="border-primary/20 bg-transparent">
                <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                  Website <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            {company.glassdoor && (
              <Button size="sm" variant="outline" asChild className="border-primary/20 bg-transparent">
                <a href={company.glassdoor} target="_blank" rel="noopener noreferrer">
                  Glassdoor <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            <Button size="sm" variant="outline" asChild className="border-primary/20 bg-transparent">
              <a href={company.sourceUrl} target="_blank" rel="noopener noreferrer">
                Source <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-primary/10 space-y-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
              <p>
                <strong className="text-foreground">About:</strong> {company.description}
              </p>
              <p>
                <strong className="text-foreground">Why Tracked:</strong> This company shows strong{" "}
                {company.category.toLowerCase()} signals indicating potential hiring opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
