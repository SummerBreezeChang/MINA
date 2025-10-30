"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CompanyDetail } from "@/components/company-detail"
import { TrendingUp, ExternalLink, Globe, Linkedin } from "lucide-react"

interface CompanyCardProps {
  insight: {
    companyName: string
    headline: string
    summary: string
    source: string
    sourceUrl: string
    companyWebsite?: string
    companyLinkedIn?: string
    category: string
    mode: string
    publishedDate: string
    topic: string
    fundingStage?: string
    location?: string
    companySize?: string
    fundingAmount?: string
  }
}

export function CompanyCard({ insight }: CompanyCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <>
      <div
        className="group rounded-xl border border-primary/20 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:-translate-y-1 bg-card h-full flex flex-col cursor-pointer"
        onClick={() => setDetailOpen(true)}
      >
        {/* Company Name */}
        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{insight.companyName}</h3>

        {/* Company Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div>
            <span className="text-muted-foreground">Stage:</span>
            <p className="font-medium text-foreground">{insight.fundingStage || "Early Stage"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Location:</span>
            <p className="font-medium text-foreground">{insight.location || "Remote"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Size:</span>
            <p className="font-medium text-foreground">{insight.companySize || "11-50"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Category:</span>
            <p className="font-medium text-foreground">{insight.topic}</p>
          </div>
        </div>

        {/* Key Signal */}
        <div className="mb-3 rounded-lg bg-primary/5 border border-primary/10 p-3 flex-1">
          <div className="flex items-center gap-2 mb-1 text-primary font-semibold text-xs">
            <TrendingUp className="h-3 w-3" />
            {insight.fundingAmount ? `Raised ${insight.fundingAmount}` : insight.category}
          </div>
          <p className="text-xs text-foreground line-clamp-2">{insight.headline}</p>
        </div>

        {/* Category Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-medium border border-yellow-500/20">
            {insight.category}
          </span>
        </div>

        {/* Source Attribution */}
        <div className="text-xs text-muted-foreground mb-3 pb-3 border-b border-primary/10">
          Source: {insight.source}
        </div>

        {/* Links Section */}
        <div className="flex gap-2 mt-auto">
          {insight.companyWebsite && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-8 bg-transparent hover:bg-transparent hover:text-foreground hover:scale-[1.2] transition-transform duration-200"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={insight.companyWebsite} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
          )}
          {insight.companyLinkedIn && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-8 bg-transparent hover:bg-transparent hover:text-foreground hover:scale-[1.2] transition-transform duration-200"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={insight.companyLinkedIn} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-3 w-3 mr-1" />
                LinkedIn
              </a>
            </Button>
          )}
          {insight.sourceUrl && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-8 bg-transparent hover:bg-transparent hover:text-foreground hover:scale-[1.2] transition-transform duration-200"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={insight.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Source
              </a>
            </Button>
          )}
        </div>
      </div>

      <CompanyDetail open={detailOpen} onOpenChange={setDetailOpen} insight={insight} />
    </>
  )
}
