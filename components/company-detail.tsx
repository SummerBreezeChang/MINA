import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StageBadge } from "@/components/stage-badge"
import { MapPin, Users, TrendingUp, ExternalLink, Star, Lightbulb } from "lucide-react"

interface CompanyDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: {
    name: string
    stage: "Series C" | "Series D" | "Series E+" | "Series E"
    location: string
    employees: number
    roles: Array<{
      title: string
      postedDays: number
      linkedinUrl: string
      greenhouseUrl?: string
    }>
    signals: Array<{
      type: "funding" | "hire" | "growth" | "product" | "team"
      text: string
    }>
    externalLinks: {
      website: string
      linkedin: string
      glassdoor: string
      glassdoorRating: number
    }
    whySurfaced: string[]
  }
}

export function CompanyDetail({ open, onOpenChange, company }: CompanyDetailProps) {
  const getSignalIcon = (type: string) => {
    switch (type) {
      case "funding":
        return "🚀"
      case "hire":
      case "team":
        return "👔"
      case "growth":
        return "📈"
      case "product":
        return "🎯"
      default:
        return "✨"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-[#2a2a2a] text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{company.name}</DialogTitle>
          <div className="flex items-center gap-3 flex-wrap mt-2">
            <StageBadge stage={company.stage} />
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {company.location}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {company.employees} employees
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Growth Signals */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4" />
              Growth Signals
            </h3>
            <div className="space-y-2">
              {company.signals.map((signal, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <span className="text-base">{getSignalIcon(signal.type)}</span>
                  <span className="text-gray-300">{signal.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#2a2a2a] hover:bg-[#2a2a2a] text-xs h-8 bg-transparent"
              >
                <a href={company.externalLinks.website} target="_blank" rel="noopener noreferrer">
                  Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#2a2a2a] hover:bg-[#2a2a2a] text-xs h-8 bg-transparent"
              >
                <a href={company.externalLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#2a2a2a] hover:bg-[#2a2a2a] text-xs h-8 gap-1 bg-transparent"
              >
                <a href={company.externalLinks.glassdoor} target="_blank" rel="noopener noreferrer">
                  Glassdoor
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{company.externalLinks.glassdoorRating}</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Open Design Roles */}
          <div>
            
            <div className="space-y-3">
              {company.roles.map((role, index) => (
                null
              ))}
            </div>
          </div>

          {/* Why Mina Surfaced This */}
          
        </div>
      </DialogContent>
    </Dialog>
  )
}
