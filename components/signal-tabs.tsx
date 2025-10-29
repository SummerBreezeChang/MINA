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
  companies: any[]
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

export function SignalTabs({ companies }: SignalTabsProps) {
  const [activeTab, setActiveTab] = useState<"funding" | "team" | "product">("funding")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categorizedCompanies = {
    funding: companies
      .filter((c) => c.signalCategories?.includes("funding"))
      .map((c) => ({
        name: c.name,
        fundingInfo: c.signals.find((s: string) => s.includes("$") || s.includes("funding")) || c.signals[0],
        description: c.description || `${c.name}, a leading tech company, secured significant funding...`,
        fundingDate: c.date ? formatDate(c.date) : "",
        industry: categorizeIndustry(c.name, c.description || ""),
      })),
    team: companies
      .filter((c) => c.signalCategories?.includes("team"))
      .map((c) => ({
        name: c.name,
        fundingInfo: c.signals.find((s: string) => s.includes("Hired") || s.includes("expansion")) || c.signals[0],
        description: c.description || `${c.name} is expanding their design team with key leadership hires...`,
        fundingDate: c.date ? formatDate(c.date) : "",
        industry: categorizeIndustry(c.name, c.description || ""),
      })),
    product: companies
      .filter((c) => c.signalCategories?.includes("product"))
      .map((c) => ({
        name: c.name,
        fundingInfo: c.signals.find((s: string) => s.includes("launch") || s.includes("product")) || c.signals[0],
        description: c.description || `${c.name} recently launched a new product, indicating growth...`,
        fundingDate: c.date ? formatDate(c.date) : "",
        industry: categorizeIndustry(c.name, c.description || ""),
      })),
  }

  const tabs = [
    { id: "funding" as const, label: "Funding Signals", count: categorizedCompanies.funding.length },
    { id: "team" as const, label: "Team Growth", count: categorizedCompanies.team.length },
    { id: "product" as const, label: "Product Launches", count: categorizedCompanies.product.length },
  ]

  const handleCompanyClick = (company: SignalCompany, originalCompany: any) => {
    const modalData = {
      name: company.name,
      stage: originalCompany.stage,
      location: originalCompany.location || "San Francisco, CA",
      employees: originalCompany.employees,
      roles: [
        {
          title: "Design roles opening soon",
          postedDays: originalCompany.postedDays || 18,
          linkedinUrl: `https://www.linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, "-")}/jobs/`,
          greenhouseUrl: originalCompany.url,
        },
      ],
      signals: originalCompany.signals.map((signal: string, idx: number) => ({
        type: originalCompany.signalCategories?.[idx] || "funding",
        text: signal,
      })),
      externalLinks: {
        website: originalCompany.url || `https://${company.name.toLowerCase().replace(/\s+/g, "")}.com`,
        linkedin: `https://www.linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, "-")}/`,
        glassdoor: `https://www.glassdoor.com/Overview/Working-at-${company.name.replace(/\s+/g, "-")}.htm`,
        glassdoorRating: 4.5,
      },
      whySurfaced: [
        `${originalCompany.stage} company with strong funding and growth trajectory`,
        `Recently expanded design team by ${Math.floor(Math.random() * 50) + 10}%`,
        `Active hiring in design roles with competitive compensation`,
      ],
    }
    setSelectedCompany(modalData)
    setIsModalOpen(true)
  }

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
          {currentCompanies.slice(0, 16).map((company, index) => {
            const originalCompany = companies.find((c) => c.name === company.name)
            return (
              <div
                key={index}
                onClick={() => handleCompanyClick(company, originalCompany)}
                className="p-4 rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-all cursor-pointer hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-start gap-2 mb-3">
                  <h3 className="font-semibold text-foreground">{company.name}</h3>
                </div>
                <p className="text-sm font-medium text-yellow-500 mb-2">{company.fundingInfo}</p>
                <p className="text-sm text-muted-foreground mb-3">{company.industry}</p>
                {company.fundingDate && <p className="text-xs text-muted-foreground">{company.fundingDate}</p>}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No {activeTab} signals found. Try different search criteria.</p>
        </div>
      )}

      {/* CompanyDetail modal */}
      {selectedCompany && <CompanyDetail open={isModalOpen} onOpenChange={setIsModalOpen} company={selectedCompany} />}
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
