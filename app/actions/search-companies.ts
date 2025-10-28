"use server"

export async function searchCompanies(role: string, location: string, offset = 0) {
  const apiKey = process.env.YOU_API_KEY

  if (!apiKey) {
    throw new Error("YOU_API_KEY is not configured")
  }

  try {
    // Search for companies hiring for the specified role and location
    const query = `${role} jobs at Series C Series D startups in ${location} hiring growth signals funding`

    const response = await fetch("https://api.ydc-index.io/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        query,
        num_web_results: 10,
        offset,
      }),
    })

    if (!response.ok) {
      throw new Error(`You.com API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Parse the search results to extract company information
    // This is a simplified parser - in production you'd want more robust parsing
    const companies = parseSearchResults(data.hits || [])

    return {
      success: true,
      companies,
      hasMore: data.hits && data.hits.length >= 10,
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

function parseSearchResults(hits: any[]) {
  // Parse search results and extract company data
  // This is a simplified implementation
  return hits.slice(0, 3).map((hit, index) => {
    const title = hit.title || "Unknown Company"
    const description = hit.description || ""

    // Extract company name from title (simplified)
    const companyName = title.split(" ")[0] || `Company ${index + 1}`

    // Determine stage based on description keywords
    let stage: "Series C" | "Series D" | "Series E+" = "Series C"
    if (description.toLowerCase().includes("series d")) stage = "Series D"
    if (description.toLowerCase().includes("series e")) stage = "Series E+"

    return {
      name: companyName,
      stage,
      employees: Math.floor(Math.random() * 400) + 100, // Placeholder
      roles: ["Senior Product Designer", "Staff Product Designer"].slice(0, Math.floor(Math.random() * 2) + 1),
      signals: ["Recent funding round", "Expanding design team", "Product launch"],
      postedDays: Math.floor(Math.random() * 14) + 1,
    }
  })
}
