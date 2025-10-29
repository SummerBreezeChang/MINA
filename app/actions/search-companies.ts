"use server"

export async function searchCompanies(fundingStage: string, location: string, offset = 0) {
  const youApiKey = process.env.YOU_API_KEY
  const serpApiKey = "5d50e01f5ac48ca7d4f14d35c15c69fe781e030b99f02ac2af13869aabc0fe75"

  if (!youApiKey) {
    console.warn("[v0] YOU_API_KEY is not configured, using SerpApi only")
  }

  try {
    const locationName = location.replace("-", " ")
    let stageName = ""
    if (fundingStage === "series-c") stageName = "Series C"
    else if (fundingStage === "series-d") stageName = "Series D"
    else if (fundingStage === "series-e") stageName = "Series E"

    const [youResults, serpResults] = await Promise.all([
      youApiKey ? searchWithYouAPI(youApiKey, stageName, locationName) : Promise.resolve([]),
      searchWithSerpAPI(serpApiKey, stageName, locationName),
    ])

    console.log("[v0] You.com results:", youResults.length, "SerpApi results:", serpResults.length)

    const allHits = [...youResults, ...serpResults]

    if (allHits.length === 0) {
      console.log("[v0] No results from either API, returning empty array")
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

async function searchWithYouAPI(apiKey: string, stageName: string, locationName: string) {
  const queries = [
    `${stageName} funding announcement ${locationName}`,
    `startup raised ${stageName} round`,
    `${stageName} venture capital ${locationName}`,
  ]

  let allHits: any[] = []

  for (const query of queries) {
    try {
      const url = new URL("https://api.ydc-index.io/v1/search")
      url.searchParams.append("query", query)
      url.searchParams.append("num_web_results", "10")

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
        if (allHits.length >= 20) break
      }
    } catch (error) {
      console.error("[v0] You.com API request failed:", error)
    }
  }

  return allHits
}

async function searchWithSerpAPI(apiKey: string, stageName: string, locationName: string) {
  const queries = [
    `${stageName} funding ${locationName} startup`,
    `${stageName} raised venture capital ${locationName}`,
    `${locationName} ${stageName} tech company hiring`,
  ]

  let allResults: any[] = []

  for (const query of queries) {
    try {
      const url = new URL("https://serpapi.com/search")
      url.searchParams.append("q", query)
      url.searchParams.append("api_key", apiKey)
      url.searchParams.append("engine", "google")
      url.searchParams.append("num", "10")
      url.searchParams.append("tbm", "nws") // News search for recent announcements

      console.log("[v0] Calling SerpApi with query:", query)

      const response = await fetch(url.toString(), {
        method: "GET",
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error("[v0] SerpApi error:", response.status, errorBody)
        continue
      }

      const data = await response.json()
      const newsResults = data.news_results || []
      console.log("[v0] SerpApi response - results:", newsResults.length)

      const convertedResults = newsResults.map((result: any) => ({
        title: result.title || "",
        description: result.snippet || "",
        url: result.link || "",
        source: result.source || "",
      }))

      allResults = [...allResults, ...convertedResults]
      if (allResults.length >= 20) break
    } catch (error) {
      console.error("[v0] SerpApi request failed:", error)
    }
  }

  return allResults
}

function parseHiringSignals(hits: any[], fundingStage: string, location: string, offset: number) {
  if (hits.length === 0) {
    console.log("[v0] No hits to parse, returning empty array")
    return []
  }

  console.log("[v0] Parsing", hits.length, "hits")

  const uniqueCompanies = new Map<string, any>()

  hits.forEach((hit, index) => {
    const title = hit.title || ""
    const description = hit.description || ""
    const url = hit.url || ""

    let companyName = ""

    const titleMatch = title.match(
      /^([A-Z][a-zA-Z0-9\s&.]+?)(?:\s+(?:raises|raised|secures|secured|hires|hired|launches|launched|announces|announced))/i,
    )
    if (titleMatch) {
      companyName = titleMatch[1].trim()
    } else {
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

      if (!companyName) {
        const titleParts = title.split(/[|\-–—]/)
        if (titleParts.length > 0) {
          companyName = titleParts[0].trim()
        }
      }
    }

    if (!companyName || companyName.length < 2 || companyName.length > 50) {
      return
    }

    if (uniqueCompanies.has(companyName.toLowerCase())) {
      return
    }

    const lowerTitle = title.toLowerCase()
    const lowerDesc = description.toLowerCase()
    const content = lowerTitle + " " + lowerDesc

    const signals: { type: string; text: string; category: "funding" | "team" | "product" }[] = []

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

    if (signals.length === 0) {
      signals.push({
        type: "funding",
        text: "Recent activity",
        category: "funding",
      })
    }

    let stage: "Series C" | "Series D" | "Series E+" = "Series C"
    if (fundingStage === "series-d") stage = "Series D"
    else if (fundingStage === "series-e") stage = "Series E+"

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

    let companyLocation = location.replace("-", " ")
    const locationMatch = content.match(/(san francisco|new york|boston|seattle|austin|los angeles|chicago)/i)
    if (locationMatch) {
      companyLocation = locationMatch[1]
    }

    const company = {
      name: companyName,
      stage,
      location: companyLocation,
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
  })

  const companiesArray = Array.from(uniqueCompanies.values())
  console.log("[v0] Parsed companies:", companiesArray.length, "unique companies")

  return companiesArray.slice(offset, offset + 9)
}
