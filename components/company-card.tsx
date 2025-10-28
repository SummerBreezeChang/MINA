"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StageBadge } from "@/components/stage-badge"
import { CompanyDetail } from "@/components/company-detail"
import { Building2, Users, TrendingUp, Calendar } from "lucide-react"

interface CompanyCardProps {
  company: {
    name: string
    stage: "Series C" | "Series D" | "Series E"
    employees: number
    roles: string[]
    signals: string[]
    postedDays: number
    logo?: string
  }
}

export function CompanyCard({ company }: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

  const detailedCompany = {
    name: company.name,
    stage: company.stage,
    location: "San Francisco, CA",
    employees: company.employees,
    roles: company.roles.map((role, index) => ({
      title: role,
      postedDays: company.postedDays + index,
      linkedinUrl: "https://linkedin.com/jobs",
      greenhouseUrl: "https://greenhouse.io/apply",
    })),
    signals: company.signals.map((signal) => ({
      type: signal.includes("funding")
        ? ("funding" as const)
        : signal.includes("hire")
          ? ("hire" as const)
          : signal.includes("expansion")
            ? ("growth" as const)
            : ("product" as const),
      text: signal,
    })),
    externalLinks: {
      website: `https://${company.name.toLowerCase().replace(/\s+/g, "")}.com`,
      linkedin: `https://linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, "-")}`,
      glassdoor: `https://glassdoor.com/Overview/${company.name.replace(/\s+/g, "-")}`,
      glassdoorRating: 4.5,
    },
    whySurfaced: [
      `${company.stage} company with strong funding and growth trajectory`,
      `Recently expanded design team by ${Math.floor(Math.random() * 30 + 20)}%`,
      `Showing multiple hiring signals indicating team growth`,
      "High Glassdoor rating and positive employee reviews",
      "Active product development with recent launches",
    ],
  }

  return (
    <>
      <div className="group rounded-xl border border-primary/20 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1 bg-muted">
        <div className="flex items-start gap-4">
          

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{company.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <StageBadge stage={company.stage} />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {company.employees} emp
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4 rounded-lg bg-primary/5 border border-primary/10 p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                <TrendingUp className="h-4 w-4" />
                Hiring Signals Detected
              </div>
              <ul className="space-y-1">
                {company.signals.map((signal, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="mt-0.5">{signal.split(" ")[0]}</span>
                    <span>{signal.substring(signal.indexOf(" ") + 1)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
              <Calendar className="h-3 w-3" />
              Signal detected: {company.postedDays} day{company.postedDays > 1 ? "s" : ""} ago
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="shadow-[0_0_20px_rgba(96,165,250,0.2)]" onClick={() => setDetailOpen(true)}>
                View Details →
              </Button>
              <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                Track Company
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)} className="hover:text-primary">
                {expanded ? "Show Less" : "Learn More"}
              </Button>
            </div>

            {expanded && (
              <div className="mt-4 pt-4 border-t border-primary/10 space-y-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                <p>
                  <strong className="text-foreground">About:</strong> Leading company in their space with strong growth
                  trajectory and innovative products.
                </p>
                <p>
                  <strong className="text-foreground">Why Tracked:</strong> Multiple hiring signals indicate design team
                  expansion before roles hit job boards.
                </p>
                <p>
                  <strong className="text-foreground">Next Steps:</strong> Monitor for job postings, reach out to design
                  leadership, or set up alerts for new roles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CompanyDetail open={detailOpen} onOpenChange={setDetailOpen} company={detailedCompany} />
    </>
  )
}
