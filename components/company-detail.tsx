import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StageBadge } from "@/components/stage-badge"
import { MapPin, Users, TrendingUp, Briefcase, ExternalLink, Star, Lightbulb } from "lucide-react"

interface CompanyDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: {
    name: string
    stage: "Series C" | "Series D" | "Series E"
    location: string
    employees: number
    roles: Array<{
      title: string
      postedDays: number
      linkedinUrl: string
      greenhouseUrl?: string
    }>
    signals: Array<{
      type: "funding" | "hire" | "growth" | "product"
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
        return "💰"
      case "hire":
        return "👔"
      case "growth":
        return "📈"
      case "product":
        return "🚀"
      default:
        return "✨"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{company.name}</DialogTitle>
          <div className="flex items-center gap-3 flex-wrap mt-2">
            <StageBadge stage={company.stage} />
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {company.location}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {company.employees} employees
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Growth Signals */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Growth Signals
            </h3>
            <div className="space-y-2">
              {company.signals.map((signal, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <span className="text-lg">{getSignalIcon(signal.type)}</span>
                  <span className="text-muted-foreground">{signal.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-primary/10" />

          {/* Open Design Roles */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Open Design Roles ({company.roles.length})
            </h3>
            <div className="space-y-3">
              {company.roles.map((role, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div>
                    <div className="font-medium text-foreground">{role.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">Posted {role.postedDays} days ago</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild className="border-primary/20 bg-transparent">
                      <a href={role.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                    {role.greenhouseUrl && (
                      <Button size="sm" variant="outline" asChild className="border-primary/20 bg-transparent">
                        <a href={role.greenhouseUrl} target="_blank" rel="noopener noreferrer">
                          Apply
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-primary/10" />

          {/* External Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">External Links</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild className="border-primary/20 bg-transparent">
                <a href={company.externalLinks.website} target="_blank" rel="noopener noreferrer">
                  Website
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-primary/20 bg-transparent">
                <a href={company.externalLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-primary/20 bg-transparent">
                <a href={company.externalLinks.glassdoor} target="_blank" rel="noopener noreferrer">
                  Glassdoor
                  <Star className="ml-1 h-3 w-3 fill-primary text-primary" />
                  {company.externalLinks.glassdoorRating}
                </a>
              </Button>
            </div>
          </div>

          <div className="border-t border-primary/10" />

          {/* Why Mina Surfaced This */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
              <Lightbulb className="h-5 w-5" />
              Why Mina Surfaced This
            </h3>
            <ul className="space-y-2">
              {company.whySurfaced.map((reason, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
