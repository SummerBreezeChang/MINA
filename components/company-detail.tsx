import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrendingUp, Rocket, Building2, Globe, Linkedin } from "lucide-react"

interface CompanyDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  insight?: {
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
  company?: any // For backward compatibility
}

function getPublisherLinkedIn(publisherName: string): string | null {
  const publisherMap: Record<string, string> = {
    techcrunch: "https://www.linkedin.com/company/techcrunch/",
    mckinsey: "https://www.linkedin.com/company/mckinsey/",
    forbes: "https://www.linkedin.com/company/forbes-magazine/",
    bloomberg: "https://www.linkedin.com/company/bloomberg/",
    venturebeat: "https://www.linkedin.com/company/venturebeat/",
    crunchbase: "https://www.linkedin.com/company/crunchbase/",
    reuters: "https://www.linkedin.com/company/thomson-reuters/",
    wsj: "https://www.linkedin.com/company/the-wall-street-journal/",
    nytimes: "https://www.linkedin.com/company/the-new-york-times/",
    cnbc: "https://www.linkedin.com/company/cnbc/",
    wired: "https://www.linkedin.com/company/wired/",
    theverge: "https://www.linkedin.com/company/the-verge/",
    techradar: "https://www.linkedin.com/company/techradar/",
    mashable: "https://www.linkedin.com/company/mashable/",
    engadget: "https://www.linkedin.com/company/engadget/",
    arstechnica: "https://www.linkedin.com/company/ars-technica/",
    businessinsider: "https://www.linkedin.com/company/businessinsider/",
    fastcompany: "https://www.linkedin.com/company/fast-company/",
    inc: "https://www.linkedin.com/company/inc-magazine/",
    entrepreneur: "https://www.linkedin.com/company/entrepreneur-media/",
    fortune: "https://www.linkedin.com/company/fortune-magazine/",
    axios: "https://www.linkedin.com/company/axios/",
    theinformation: "https://www.linkedin.com/company/the-information/",
    protocol: "https://www.linkedin.com/company/protocol/",
    sifted: "https://www.linkedin.com/company/sifted/",
    techeu: "https://www.linkedin.com/company/tech-eu/",
  }

  const normalizedName = publisherName.toLowerCase().replace(/\s+/g, "")
  return publisherMap[normalizedName] || null
}

export function CompanyDetail({ open, onOpenChange, insight, company }: CompanyDetailProps) {
  const data = insight || company

  if (!data) return null

  const publisherLinkedIn = getPublisherLinkedIn(data.source)

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "trend":
        return <TrendingUp className="h-5 w-5 text-blue-400" />
      case "startup":
        return <Rocket className="h-5 w-5 text-green-400" />
      case "funding":
        return <Building2 className="h-5 w-5 text-yellow-400" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "trend":
        return "Trend Research"
      case "startup":
        return "Startup Radar"
      case "funding":
        return "Funding Research"
      default:
        return mode
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-[#2a2a2a] text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white pr-8">{data.companyName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {data.headline || data.summary || "Article details and insights"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-yellow-400">Key Signal</h3>
            </div>
            <p className="text-base font-medium text-white mb-1">
              {data.fundingAmount ? `Raised ${data.fundingAmount}` : data.headline}
            </p>
            <p className="text-sm text-gray-300">{data.publishedDate}</p>
          </div>

          {/* Links Section */}
          <div className="pt-4 border-t border-[#2a2a2a] border-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.companyWebsite && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#2a2a2a] hover:bg-transparent hover:text-foreground hover:border-[#2a2a2a] bg-transparent hover:scale-[1.2] transition-transform duration-200"
                >
                  <a href={data.companyWebsite} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              {publisherLinkedIn && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#2a2a2a] hover:bg-transparent hover:text-foreground hover:border-[#2a2a2a] bg-transparent hover:scale-[1.2] transition-transform duration-200"
                >
                  <a href={publisherLinkedIn} target="_blank" rel="noopener noreferrer">
                    
                    LinkedIn
                  </a>
                </Button>
              )}
              {data.sourceUrl && (
                <Button
                  asChild
                  className="w-full bg-yellow-400 hover:bg-yellow-400 hover:text-black text-black font-semibold hover:scale-[1.2] transition-transform duration-200"
                >
                  <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Category Tags */}

          {/* Summary */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-white">Summary</h3>
            <p className="text-gray-300 leading-relaxed">{data.summary}</p>
          </div>

          {/* Source Information */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-white">Source</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Published by</span>
              <span className="font-medium text-gray-300">{data.source}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
