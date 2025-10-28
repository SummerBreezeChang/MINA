"use server"

export interface Company {
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

export async function searchCompanies(fundingStage: string, location: string, offset = 0) {
  const apiKey = "5d50e01f5ac48ca7d4f14d35c15c69fe781e030b99f02ac2af13869aabc0fe75"

  try {
    console.log("[v0] Starting SerpApi search for:", { fundingStage, location, offset })

    const allCompanies: Company[] = []

    // Search for funding announcements
    const fundingCompanies = await searchSerpApi(
      `${location.replace("-", " ")} startup ${fundingStage.replace("-", " ")} funding raised`,
      "Funding",
      apiKey,
      fundingStage,
    )

    // Search for team growth/hiring
    const teamCompanies = await searchSerpApi(
      `${location.replace("-", " ")} tech company hired VP Head Chief design product`,
      "Team Growth",
      apiKey,
    )

    // Search for product launches
    const productCompanies = await searchSerpApi(
      `${location.replace("-", " ")} startup launches unveils new product`,
      "Product Launch",
      apiKey,
    )

    allCompanies.push(...fundingCompanies, ...teamCompanies, ...productCompanies)

    console.log("[v0] Total companies found:", allCompanies.length)
    console.log(
      "[v0] By category - Funding:",
      fundingCompanies.length,
      "Team:",
      teamCompanies.length,
      "Product:",
      productCompanies.length,
    )

    return {
      success: true,
      companies: allCompanies.slice(offset, offset + 24),
      hasMore: allCompanies.length > offset + 24,
    }
  } catch (error) {
    console.error("[v0] Error searching companies:", error)
    return {
      success: false,
      companies: [],
      hasMore: false,
      error: error instanceof Error ? error.message : "Failed to search companies",
    }
  }
}

async function searchSerpApi(
  query: string,
  category: "Funding" | "Team Growth" | "Product Launch",
  apiKey: string,
  fundingStage?: string,
): Promise<Company[]> {
  try {
    const url = new URL("https://serpapi.com/search")
    url.searchParams.append("engine", "google_news")
    url.searchParams.append("q", query)
    url.searchParams.append("api_key", apiKey)
    url.searchParams.append("gl", "us")
    url.searchParams.append("hl", "en")
    url.searchParams.append("num", "20")

    console.log(`[v0] SerpApi ${category} query:`, query)

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.error(`[v0] SerpApi error for ${category}:`, response.status, await response.text())
      return []
    }

    const data = await response.json()
    const newsResults = data.news_results || []

    console.log(`[v0] SerpApi ${category} results:`, newsResults.length, "articles")

    return parseCompaniesFromNews(newsResults, category, fundingStage)
  } catch (error) {
    console.error(`[v0] Error searching ${category}:`, error)
    return []
  }
}

function parseCompaniesFromNews(
  newsResults: any[],
  category: "Funding" | "Team Growth" | "Product Launch",
  fundingStage?: string,
): Company[] {
  const companies: Company[] = []
  const seenCompanies = new Set<string>()

  for (const article of newsResults) {
    try {
      const title = article.title || ""
      const snippet = article.snippet || ""
      const link = article.link || ""
      const date = article.date || ""
      const content = `${title} ${snippet}`.toLowerCase()

      let companyName = ""

      // Extract company name from title
      const patterns = [
        /^([A-Z][a-zA-Z0-9\s&.]+?)(?:\s+(?:raises|raised|secures|secured|hires|hired|launches|launched|announces|announced|appoints|names))/i,
        /([A-Z][a-zA-Z0-9\s&.]{2,40})\s+(?:raises|raised|secures|secured)\s+\$\d+/i,
        /([A-Z][a-zA-Z0-9\s&.]{2,40})\s+(?:hires|hired|appoints|names)\s+/i,
        /([A-Z][a-zA-Z0-9\s&.]{2,40})\s+(?:launches|launched|unveils|announces)\s+/i,
      ]

      for (const pattern of patterns) {
        const match = title.match(pattern)
        if (match) {
          companyName = match[1].trim()
          break
        }
      }

      // Skip invalid company names
      if (!companyName || companyName.length < 2 || companyName.length > 50) continue
      if (
        ["TechCrunch", "Reuters", "Bloomberg", "Forbes", "CNBC", "Business", "News", "Press"].some((word) =>
          companyName.includes(word),
        )
      )
        continue
      if (seenCompanies.has(companyName.toLowerCase())) continue

      // Extract funding amount
      let fundingAmount: string | undefined
      if (category === "Funding") {
        const amountMatch = content.match(/\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)/i)
        if (amountMatch) {
          const amount = amountMatch[1]
          const unit = amountMatch[2].toLowerCase().startsWith("b") ? "B" : "M"
          fundingAmount = `$${amount}${unit}`
        }
      }

      // Extract context
      let context: string | undefined
      if (category === "Team Growth") {
        const roleMatch = content.match(/(vp|head|chief|director|cto|ceo|cfo|lead)\s+(?:of\s+)?(\w+)/i)
        if (roleMatch) {
          context = `Hired ${roleMatch[1].toUpperCase()} of ${roleMatch[2]}`
        } else {
          context = "Team expansion and hiring"
        }
      } else if (category === "Product Launch") {
        const productMatch = title.match(/launches?\s+([^,.]+)/i)
        if (productMatch) {
          context = `Launched ${productMatch[1].trim()}`
        } else {
          context = "New product announcement"
        }
      }

      // Parse date
      const fundingDate = parseDate(date)

      // Generate company links
      const companySlug = companyName
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "")
      const companyWebsite = `https://${companySlug}.com`
      const glassdoor = `https://www.glassdoor.com/Overview/Working-at-${companyName.replace(/\s+/g, "-")}-EI_IE.htm`

      companies.push({
        companyName,
        category,
        description: snippet || `${companyName} - ${category} signal detected`,
        fundingDate,
        fundingAmount,
        fundingStage,
        context,
        sourceUrl: link,
        companyWebsite,
        glassdoor,
      })

      seenCompanies.add(companyName.toLowerCase())
      console.log(`[v0] Added ${category}:`, companyName, fundingAmount || context || "")
    } catch (error) {
      console.error("[v0] Error parsing article:", error)
    }
  }

  return companies
}

function parseDate(dateString: string): string {
  try {
    // SerpApi returns dates like "2 days ago", "1 week ago", etc.
    const now = new Date()

    if (dateString.includes("hour") || dateString.includes("hours")) {
      return now.toISOString().split("T")[0]
    }

    if (dateString.includes("day") || dateString.includes("days")) {
      const days = Number.parseInt(dateString.match(/\d+/)?.[0] || "1")
      now.setDate(now.getDate() - days)
      return now.toISOString().split("T")[0]
    }

    if (dateString.includes("week") || dateString.includes("weeks")) {
      const weeks = Number.parseInt(dateString.match(/\d+/)?.[0] || "1")
      now.setDate(now.getDate() - weeks * 7)
      return now.toISOString().split("T")[0]
    }

    if (dateString.includes("month") || dateString.includes("months")) {
      const months = Number.parseInt(dateString.match(/\d+/)?.[0] || "1")
      now.setMonth(now.getMonth() - months)
      return now.toISOString().split("T")[0]
    }

    // Try to parse as regular date
    const parsed = new Date(dateString)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0]
    }
  } catch (e) {
    // Fall through to default
  }

  // Default to today
  return new Date().toISOString().split("T")[0]
}
