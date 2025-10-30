"use server"

export async function searchStartups(mode: string, topic: string, offset = 0) {
  const apiKey = process.env.YOU_API_KEY

  if (!apiKey) {
    throw new Error("YOU_API_KEY is not configured")
  }

  try {
    let queries: string[] = []

    if (mode === "trend") {
      queries = [
        `${topic} trends 2025`,
        `emerging ${topic} startups`,
        `${topic} industry trends`,
        `what's trending in ${topic}`,
        `${topic} market insights`,
      ]
    } else if (mode === "startup") {
      queries = [
        `${topic} startup launches`,
        `new ${topic} companies`,
        `${topic} startup news`,
        `${topic} company traction`,
        `${topic} startup media coverage`,
      ]
    } else if (mode === "funding") {
      queries = [
        `${topic} startup funding`,
        `${topic} venture capital`,
        `${topic} investment rounds`,
        `${topic} Series A B C funding`,
        `${topic} startup raised money`,
      ]
    }

    let allHits: any[] = []

    for (const query of queries) {
      const url = new URL("https://api.ydc-index.io/search")
      url.searchParams.append("query", query)
      url.searchParams.append("num_web_results", "10")
      url.searchParams.append("safesearch", "moderate")

      console.log("[v0] Calling You.com API with query:", query)

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
        },
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error("[v0] You.com API error:", response.status, errorBody)
        continue
      }

      const data = await response.json()
      console.log("[v0] You.com API response - hits:", data.hits?.length || 0)

      if (data.hits && data.hits.length > 0) {
        allHits = [...allHits, ...data.hits]
        console.log("[v0] Total hits collected:", allHits.length)
        if (allHits.length >= 30) break
      }
    }

    if (allHits.length === 0) {
      console.log("[v0] No results from You.com API, returning empty array")
    }

    const insights = parseStartupInsights(allHits, mode, topic, offset)

    return {
      success: true,
      insights,
      hasMore: insights.length >= 12,
    }
  } catch (error) {
    console.error("[v0] Error searching startups:", error)
    return {
      success: false,
      insights: [],
      hasMore: false,
      error: error instanceof Error ? error.message : "Failed to search startups",
    }
  }
}

function parseStartupInsights(hits: any[], mode: string, topic: string, offset: number) {
  if (hits.length === 0) {
    console.log("[v0] No hits to parse, returning empty array")
    return []
  }

  console.log("[v0] Parsing", hits.length, "hits for mode:", mode)

  const uniqueInsights = new Map<string, any>()

  hits.forEach((hit, index) => {
    const title = hit.title || ""
    const description = hit.description || ""
    const url = hit.url || ""

    if (index < 3) {
      console.log("[v0] Raw hit #" + index + ":")
      console.log("  Title:", title)
      console.log("  Description:", description.substring(0, 150))
      console.log("  URL:", url)
    }

    const companyName = extractCompanyName(title, description, url)

    if (!companyName || companyName.length < 2) {
      console.log("[v0] Could not extract company name, skipping")
      return
    }

    const headline = cleanTitle(title, description)
    const summary = createSummary(description)
    const source = extractSource(url)
    const companyLinks = extractCompanyLinks(companyName, url, description)
    const category = determineCategory(title + " " + description, mode)
    const publishedDate = extractDate(description, title)

    const fundingStage = extractFundingStage(title + " " + description)
    const location = extractLocation(title + " " + description)
    const companySize = extractCompanySize(title + " " + description)
    const fundingAmount = extractFundingAmount(title + " " + description)

    const insight = {
      companyName,
      headline,
      summary,
      source,
      sourceUrl: url,
      companyWebsite: companyLinks.website,
      companyLinkedIn: companyLinks.linkedin,
      category,
      mode,
      publishedDate,
      topic,
      fundingStage,
      location,
      companySize,
      fundingAmount,
    }

    const key = headline.toLowerCase().substring(0, 50)
    if (!uniqueInsights.has(key)) {
      uniqueInsights.set(key, insight)
      console.log("[v0] Added insight:", companyName, "-", headline.substring(0, 50))
    }
  })

  const insightsArray = Array.from(uniqueInsights.values())
  console.log("[v0] Parsed insights:", insightsArray.length, "unique insights")

  return insightsArray.slice(offset, offset + 12)
}

function cleanTitle(title: string, description: string): string {
  if (!title || title.length === 0) {
    const firstSentence = description.match(/^[^.!?]+[.!?]?/)?.[0] || description.substring(0, 100)
    return cleanTitleText(firstSentence)
  }

  const separatorPattern = /\s*(?:\||—|–|::|\/)\s*|\s+-\s+/g
  const parts = title.split(separatorPattern).filter((part) => part.trim().length > 0)

  const validParts = parts.filter((part) => {
    const trimmed = part.trim()
    // Skip if too short
    if (trimmed.length < 10) return false
    // Skip if it's just a website name (single word, all lowercase or capitalized)
    if (/^[A-Z][a-z]+$/.test(trimmed)) return false
    // Skip common website names
    const websiteNames = ["topstartups", "explodingtopics", "crunchbase", "techcrunch", "forbes", "bloomberg"]
    if (websiteNames.some((name) => trimmed.toLowerCase().includes(name))) return false
    return true
  })

  const bestPart =
    validParts.length > 0
      ? validParts.reduce((longest, current) => (current.length > longest.length ? current : longest), "")
      : parts.reduce((longest, current) => (current.length > longest.length ? current : longest), "")

  return cleanTitleText(bestPart || title)
}

function cleanTitleText(text: string): string {
  let cleaned = text.trim()

  cleaned = cleaned.replace(/[\s|:,;.!?]+$/g, "")

  cleaned = cleaned.replace(/^[\s|:,;.!?-]+/g, "")

  cleaned = cleaned.replace(/^(The|A|An)\s+/i, "")

  cleaned = cleaned.replace(/\s+(in|at|for|with|by|from|to|and|or)$/i, "")

  if (cleaned.length > 100) {
    const cutPoint = cleaned.lastIndexOf(" ", 97)
    if (cutPoint > 50) {
      cleaned = cleaned.substring(0, cutPoint) + "..."
    } else {
      cleaned = cleaned.substring(0, 97) + "..."
    }
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  return cleaned || "Startup Insight"
}

function extractCompanyName(title: string, description: string, url: string): string {
  const content = title + " " + description

  // Pattern 1: "CompanyName raises/raised/secures/secured $X"
  const pattern1 =
    /([A-Z][a-zA-Z0-9\s&.]{2,40}?)\s+(?:raises|raised|secures|secured|announces|announced|launches|launched)\s+/i
  const match1 = content.match(pattern1)
  if (match1) {
    const name = match1[1].trim()
    if (isValidCompanyName(name)) return name
  }

  // Pattern 2: Start of title if it's a proper noun
  const titleWords = title.split(/\s+/)
  if (titleWords.length > 0 && /^[A-Z]/.test(titleWords[0])) {
    const potentialName = titleWords.slice(0, Math.min(3, titleWords.length)).join(" ")
    if (isValidCompanyName(potentialName)) return potentialName
  }

  // Pattern 3: Extract from URL domain
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace("www.", "")
    const domainParts = domain.split(".")

    const newsSourceDomains = [
      "techcrunch",
      "venturebeat",
      "forbes",
      "bloomberg",
      "crunchbase",
      "reuters",
      "wsj",
      "nytimes",
      "cnbc",
    ]
    const isNewsSource = newsSourceDomains.some((news) => domainParts[0].includes(news))

    if (!isNewsSource && domainParts[0].length >= 3) {
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
    }
  } catch (e) {
    // Invalid URL
  }

  return ""
}

function isValidCompanyName(name: string): boolean {
  if (name.length < 2 || name.length > 50) return false

  const invalidPatterns = [
    /^(the|a|an|this|that|these|those|here|there)\s/i,
    /^(top|best|list|meet)\s/i,
    /\d+\s+(companies|startups)/i,
  ]

  if (invalidPatterns.some((pattern) => pattern.test(name))) return false

  const genericWords = ["startup", "company", "firm", "business", "companies", "startups", "list", "article"]
  if (genericWords.includes(name.toLowerCase())) return false

  return true
}

function createSummary(description: string): string {
  if (!description) return "No summary available"

  // Get first 1-2 sentences (up to 200 chars)
  const sentences = description.match(/[^.!?]+[.!?]+/g) || []
  let summary = sentences.slice(0, 2).join(" ")

  if (summary.length > 200) {
    summary = summary.substring(0, 197) + "..."
  }

  return summary || description.substring(0, 200)
}

function extractSource(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace("www.", "")
    const domainParts = domain.split(".")

    // Capitalize first letter
    return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
  } catch (e) {
    return "Unknown Source"
  }
}

function extractCompanyLinks(companyName: string, sourceUrl: string, description: string) {
  const links = {
    website: "",
    linkedin: "",
  }

  // Try to extract website from description
  const urlMatch = description.match(/https?:\/\/[^\s]+/i)
  if (urlMatch) {
    links.website = urlMatch[0]
  }

  // Generate LinkedIn profile URL
  const linkedinSlug = companyName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  links.linkedin = `https://www.linkedin.com/company/${linkedinSlug}`

  return links
}

function determineCategory(content: string, mode: string): string {
  const lower = content.toLowerCase()

  if (mode === "funding") {
    if (lower.includes("series a")) return "Series A"
    if (lower.includes("series b")) return "Series B"
    if (lower.includes("series c")) return "Series C"
    if (lower.includes("seed")) return "Seed"
    return "Funding"
  }

  if (mode === "startup") {
    if (lower.includes("launch")) return "Launch"
    if (lower.includes("traction")) return "Traction"
    if (lower.includes("growth")) return "Growth"
    return "Activity"
  }

  if (mode === "trend") {
    if (lower.includes("ai") || lower.includes("artificial intelligence")) return "AI"
    if (lower.includes("saas")) return "SaaS"
    if (lower.includes("fintech")) return "Fintech"
    if (lower.includes("health")) return "Healthtech"
    return "Trend"
  }

  return "General"
}

function extractDate(description: string, title: string): string {
  const content = title + " " + description

  // Look for relative dates
  const relativeMatch = content.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i)
  if (relativeMatch) {
    const num = Number.parseInt(relativeMatch[1])
    const unit = relativeMatch[2].toLowerCase()

    let daysAgo = 0
    if (unit === "day") daysAgo = num
    else if (unit === "week") daysAgo = num * 7
    else if (unit === "month") daysAgo = num * 30
    else if (unit === "year") daysAgo = num * 365

    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Default to recent
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function extractFundingStage(content: string): string {
  const lower = content.toLowerCase()

  if (lower.includes("series d") || lower.includes("series-d")) return "Series D"
  if (lower.includes("series c") || lower.includes("series-c")) return "Series C"
  if (lower.includes("series b") || lower.includes("series-b")) return "Series B"
  if (lower.includes("series a") || lower.includes("series-a")) return "Series A"
  if (lower.includes("seed round") || lower.includes("seed funding") || lower.includes("seed stage")) return "Seed"
  if (lower.includes("pre-seed") || lower.includes("preseed")) return "Pre-Seed"

  return "Early Stage"
}

function extractLocation(content: string): string {
  // Common startup cities
  const cities = [
    "San Francisco",
    "SF",
    "New York",
    "NYC",
    "London",
    "Berlin",
    "Paris",
    "Singapore",
    "Tokyo",
    "Seattle",
    "Austin",
    "Boston",
    "Los Angeles",
    "LA",
    "Chicago",
    "Toronto",
    "Vancouver",
    "Tel Aviv",
    "Bangalore",
    "Mumbai",
    "Sydney",
    "Melbourne",
    "Amsterdam",
    "Stockholm",
    "Copenhagen",
    "Dublin",
    "Miami",
    "Denver",
    "Atlanta",
    "Portland",
    "Washington DC",
    "Philadelphia",
  ]

  for (const city of cities) {
    const regex = new RegExp(`\\b${city}\\b`, "i")
    if (regex.test(content)) {
      // Normalize city names
      if (city === "SF") return "San Francisco"
      if (city === "NYC") return "New York"
      if (city === "LA") return "Los Angeles"
      return city
    }
  }

  // Look for "based in X" pattern
  const basedInMatch = content.match(/based in ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i)
  if (basedInMatch) return basedInMatch[1]

  return "Remote"
}

function extractCompanySize(content: string): string {
  const lower = content.toLowerCase()

  // Look for explicit employee counts
  const employeeMatch = content.match(/(\d+)[\s-]*(employee|person|people|team member)/i)
  if (employeeMatch) {
    const count = Number.parseInt(employeeMatch[1])
    if (count < 10) return "1-10"
    if (count < 50) return "11-50"
    if (count < 200) return "51-200"
    if (count < 500) return "201-500"
    return "500+"
  }

  // Infer from funding stage
  if (lower.includes("series c") || lower.includes("series d")) return "201-500"
  if (lower.includes("series b")) return "51-200"
  if (lower.includes("series a")) return "11-50"
  if (lower.includes("seed")) return "1-10"

  return "11-50"
}

function extractFundingAmount(content: string): string {
  // Look for funding amounts like "$50M", "$5 million", "$1.2B"
  const amountMatch = content.match(/\$(\d+(?:\.\d+)?)\s*(million|billion|M|B)/i)
  if (amountMatch) {
    const amount = amountMatch[1]
    const unit = amountMatch[2].toLowerCase()

    if (unit.startsWith("b")) {
      return `$${amount}B`
    } else {
      return `$${amount}M`
    }
  }

  return ""
}
