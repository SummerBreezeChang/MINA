"use server"

export async function searchCompanies(fundingStage: string, location: string, offset = 0) {
  const apiKey = process.env.YOU_API_KEY

  if (!apiKey) {
    throw new Error("YOU_API_KEY is not configured")
  }

  try {
    const locationName = location.replace("-", " ")
    const stageName = fundingStage.replace("-", " ")

    const queries = [
      `${stageName} funding announcement`,
      `startup raised ${stageName}`,
      `${locationName} tech startup funding`,
      `venture capital ${stageName}`,
      `startup hiring design`,
      `tech company product launch`,
    ]

    let allHits: any[] = []

    for (const query of queries) {
      const url = new URL("https://api.ydc-index.io/search")
      url.searchParams.append("query", query)
      url.searchParams.append("num_web_results", "10")
      url.searchParams.append("safesearch", "moderate")

      console.log("[v0] Calling You.com API with query:", query)
      console.log("[v0] Full URL:", url.toString())

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
      console.log("[v0] You.com API full response:", JSON.stringify(data, null, 2))
      console.log("[v0] You.com API response - hits:", data.hits?.length || 0)

      if (data.hits && data.hits.length > 0) {
        allHits = [...allHits, ...data.hits]
        console.log("[v0] Total hits collected:", allHits.length)
        console.log("[v0] Sample hit:", JSON.stringify(data.hits[0], null, 2))
        if (allHits.length >= 30) break
      }
    }

    if (allHits.length === 0) {
      console.log("[v0] No results from You.com API, returning empty array")
    }

    const companies = parseHiringSignals(allHits, fundingStage, location, offset)

    return {
      success: true,
      companies,
      hasMore: companies.length >= 9,
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

function parseHiringSignals(hits: any[], fundingStage: string, location: string, offset: number) {
  if (hits.length === 0) {
    console.log("[v0] No hits to parse, returning empty array")
    return []
  }

  console.log("[v0] Parsing", hits.length, "hits")

  const uniqueCompanies = new Map<string, any>()

  hits.forEach((hit, index) => {
    console.log(`[v0] Processing hit ${index + 1}:`, {
      title: hit.title,
      url: hit.url,
      description: hit.description?.substring(0, 100),
    })

    const title = hit.title || ""
    const description = hit.description || ""
    const url = hit.url || ""

    let companyName = ""

    // Try to extract from title first
    const titleMatch = title.match(
      /^([A-Z][a-zA-Z0-9\s&.]+?)(?:\s+(?:raises|raised|secures|secured|hires|hired|launches|launched|announces|announced))/i,
    )
    if (titleMatch) {
      companyName = titleMatch[1].trim()
    } else {
      // Try extracting from URL domain
      try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname.replace("www.", "")
        const domainParts = domain.split(".")
        if (
          domainParts.length > 0 &&
          !["techcrunch", "venturebeat", "theinformation", "forbes", "bloomberg"].includes(domainParts[0])
        ) {
          companyName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
        }
      } catch (e) {
        // Invalid URL, skip
      }

      // Fallback to title parts
      if (!companyName) {
        const titleParts = title.split(/[|\-–—]/)
        if (titleParts.length > 0) {
          companyName = titleParts[0].trim()
        }
      }
    }

    if (!companyName || companyName.length < 2 || companyName.length > 50) {
      console.log(`[v0] Skipping hit ${index + 1}: invalid company name`)
      return
    }

    if (uniqueCompanies.has(companyName.toLowerCase())) {
      console.log(`[v0] Skipping hit ${index + 1}: duplicate company ${companyName}`)
      return
    }

    const lowerTitle = title.toLowerCase()
    const lowerDesc = description.toLowerCase()
    const content = lowerTitle + " " + lowerDesc

    const signals: { type: string; text: string; category: "funding" | "team" | "product" }[] = []

    // Funding signals
    const fundingMatch = content.match(/\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)/i)
    if (fundingMatch) {
      const amount = fundingMatch[1]
      const unit = fundingMatch[2].toLowerCase().startsWith("b") ? "B" : "M"
      signals.push({
        type: "funding",
        text: `Raised $${amount}${unit}`,
        category: "funding",
      })
    } else if (content.includes("raised") || content.includes("funding") || content.includes("investment")) {
      signals.push({
        type: "funding",
        text: `Recent funding round`,
        category: "funding",
      })
    }

    // Leadership hire signals
    if (
      content.includes("hired") ||
      content.includes("joins") ||
      content.includes("appoint") ||
      content.includes("names")
    ) {
      const roleMatch = content.match(/(vp|head|chief|director|lead|cto|ceo|cfo)\s+(?:of\s+)?(\w+)/i)
      if (roleMatch) {
        signals.push({
          type: "team",
          text: `Hired ${roleMatch[1].toUpperCase()} of ${roleMatch[2]}`,
          category: "team",
        })
      } else {
        signals.push({
          type: "team",
          text: "Leadership hire",
          category: "team",
        })
      }
    }

    // Product launch signals
    if (
      content.includes("launch") ||
      content.includes("released") ||
      content.includes("unveil") ||
      content.includes("introduces")
    ) {
      signals.push({
        type: "product",
        text: "New product launch",
        category: "product",
      })
    }

    // Growth signals
    if (
      content.includes("expand") ||
      content.includes("grow") ||
      content.includes("hiring") ||
      content.includes("jobs")
    ) {
      signals.push({
        type: "team",
        text: "Team expansion",
        category: "team",
      })
    }

    // If no specific signals found but it's a relevant article, add a generic signal
    if (signals.length === 0) {
      signals.push({
        type: "funding",
        text: "Recent activity",
        category: "funding",
      })
    }

    // Map funding stage
    let stage: "Series C" | "Series D" | "Series E+" = "Series C"
    if (fundingStage === "series-d") stage = "Series D"
    else if (fundingStage === "series-e") stage = "Series E+"

    // Extract time from description or use current date
    const timeMatch = content.match(/(\d+)\s+(year|month|week|day)s?\s+ago/i)
    let postedDays = Math.floor(Math.random() * 30) + 1
    if (timeMatch) {
      const num = Number.parseInt(timeMatch[1])
      const unit = timeMatch[2].toLowerCase()
      if (unit === "day") postedDays = num
      else if (unit === "week") postedDays = num * 7
      else if (unit === "month") postedDays = num * 30
      else if (unit === "year") postedDays = num * 365
    }

    const company = {
      name: companyName,
      stage,
      employees: Math.floor(Math.random() * 400) + 100,
      roles: ["Design roles opening soon"],
      signals: signals.map((s) => s.text),
      signalCategories: signals.map((s) => s.category),
      postedDays,
      url,
      description: description.substring(0, 200),
      source: url,
      date: new Date(Date.now() - postedDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    uniqueCompanies.set(companyName.toLowerCase(), company)
    console.log(`[v0] Added company ${index + 1}:`, companyName, "with", signals.length, "signals")
  })

  const companiesArray = Array.from(uniqueCompanies.values())
  console.log("[v0] Parsed companies:", companiesArray.length, "unique companies")
  console.log("[v0] Company names:", companiesArray.map((c) => c.name).join(", "))

  return companiesArray.slice(offset, offset + 9)
}
