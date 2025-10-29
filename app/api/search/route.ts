// app/api/you-search/route.ts
// FIXED: Returns clean Series A/B/C startup data

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    console.log('🔍 Searching You.com for:', query);

    // Build startup-focused search query
    const startupQuery = `${query} Series A OR Series B OR Series C startup raised funding 2024 2025`;
    
    const res = await fetch("https://api.ydc-index.io/v1/search", {
      method: "GET",
      headers: {
        "X-API-Key": process.env.YOU_API_KEY || "",
      },
      // Note: You.com uses GET with query params, not POST
    });

    const url = `https://api.ydc-index.io/v1/search?query=${encodeURIComponent(startupQuery)}`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": process.env.YOU_API_KEY || "",
      },
    });

    if (!res.ok) {
      console.error('You.com API error:', res.status, res.statusText);
      throw new Error(`You.com API error: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('✅ You.com response received');

    // Extract web results
    const webResults = data.results?.web || data.hits || [];
    console.log(`📊 Found ${webResults.length} raw results`);

    // Parse into clean startup data
    const cleanResults = parseStartupResults(webResults);
    console.log(`✅ Parsed ${cleanResults.length} clean startups`);

    // If no results, return curated startups
    if (cleanResults.length === 0) {
      console.log('⚠️ No results from parsing, using fallback');
      return NextResponse.json({ 
        results: getCuratedStartups(),
        source: 'curated'
      });
    }

    return NextResponse.json({ 
      results: cleanResults,
      source: 'youcom'
    });

  } catch (err: any) {
    console.error("Search error:", err);
    
    // Return curated data on error
    return NextResponse.json({ 
      results: getCuratedStartups(),
      source: 'error-fallback',
      error: err.message 
    });
  }
}

// Parse You.com results into clean startup data
function parseStartupResults(results: any[]): any[] {
  const startups: any[] = [];
  const seen = new Set<string>();

  for (const r of results) {
    try {
      const title = r.title || '';
      const description = r.description || r.snippet || '';
      const url = r.url || '';

      // RULE 1: Must mention funding + series
      const hasFunding = /Series\s+[ABC]/i.test(title + description);
      const hasFundingKeyword = /(raised|funding|secures|closes)/i.test(title + description);
      
      if (!hasFunding || !hasFundingKeyword) {
        continue;
      }

      // RULE 2: Extract company name
      const companyName = extractCompanyName(title);
      if (!companyName || companyName.length < 2) {
        continue;
      }

      // RULE 3: Skip duplicates
      const key = companyName.toLowerCase();
      if (seen.has(key)) {
        continue;
      }

      // RULE 4: Skip big public companies
      if (isPublicCompany(companyName)) {
        continue;
      }

      // RULE 5: Extract funding details
      const funding = extractFunding(description);
      
      // RULE 6: Only Series A/B/C
      if (!['Series A', 'Series B', 'Series C'].includes(funding.series)) {
        continue;
      }

      seen.add(key);
      console.log(`✅ Found: ${companyName} - ${funding.series} - ${funding.amount}`);

      // Return clean object
      startups.push({
        company: companyName,
        title: companyName,
        url: url,
        snippet: description.substring(0, 150) + '...',
        source: extractDomain(url),
        fundingStage: funding.series,
        fundingAmount: funding.amount,
        fundingDate: funding.date,
        employeeCount: estimateSize(funding.series)
      });

    } catch (error) {
      console.error('Parse error:', error);
      continue;
    }
  }

  return startups;
}

// Extract company name from title
function extractCompanyName(title: string): string {
  // Pattern: "CompanyName raises..." or "CompanyName secures..."
  const patterns = [
    /^([A-Z][a-zA-Z0-9\s]{1,30}?)\s+(?:raises|secures|closes|lands)/i,
    /^([A-Z][a-zA-Z0-9\s]{1,30}?),/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1]
        .replace(/\s+(Inc|LLC|Corp|Ltd)\.?$/i, '')
        .trim();
    }
  }

  return '';
}

// Extract funding details
function extractFunding(text: string): { series: string; amount: string; date: string } {
  const result = {
    series: '',
    amount: 'N/A',
    date: 'Recent'
  };

  // Series
  const seriesMatch = text.match(/Series\s+([ABC])\b/i);
  if (seriesMatch) {
    result.series = `Series ${seriesMatch[1].toUpperCase()}`;
  }

  // Amount
  const amountMatch = text.match(/\$(\d+\.?\d*)\s*([BMK])\b/i);
  if (amountMatch) {
    result.amount = `$${amountMatch[1]}${amountMatch[2].toUpperCase()}`;
  }

  // Date
  const dateMatch = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|202[4-5]/i);
  if (dateMatch) {
    result.date = dateMatch[0];
  }

  return result;
}

// Check if public company (exclude)
function isPublicCompany(name: string): boolean {
  const publicCos = [
    'google', 'microsoft', 'apple', 'amazon', 'meta', 'facebook',
    'netflix', 'tesla', 'nvidia', 'salesforce', 'uber', 'airbnb'
  ];
  return publicCos.some(pub => name.toLowerCase().includes(pub));
}

// Extract domain from URL
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

// Estimate company size by series
function estimateSize(series: string): string {
  const map: { [key: string]: string } = {
    'Series A': '10-50 employees',
    'Series B': '50-150 employees',
    'Series C': '150-500 employees'
  };
  return map[series] || '50-200 employees';
}

// FALLBACK: Curated startups
function getCuratedStartups() {
  return [
    {
      company: 'Perplexity AI',
      title: 'Perplexity AI',
      url: 'https://www.perplexity.ai',
      snippet: 'AI-powered search engine. Raised Series B funding, growing team rapidly.',
      source: 'perplexity.ai',
      fundingStage: 'Series B',
      fundingAmount: '$73.6M',
      fundingDate: 'Jan 2024',
      employeeCount: '50-150 employees'
    },
    {
      company: 'Harvey AI',
      title: 'Harvey AI',
      url: 'https://www.harvey.ai',
      snippet: 'Legal AI assistant for law firms. Series B backed by Sequoia Capital.',
      source: 'harvey.ai',
      fundingStage: 'Series B',
      fundingAmount: '$80M',
      fundingDate: 'Dec 2023',
      employeeCount: '50-150 employees'
    },
    {
      company: 'Ramp',
      title: 'Ramp',
      url: 'https://ramp.com',
      snippet: 'Corporate card and expense management. Series C hypergrowth startup.',
      source: 'ramp.com',
      fundingStage: 'Series C',
      fundingAmount: '$750M',
      fundingDate: 'Aug 2023',
      employeeCount: '150-500 employees'
    },
    {
      company: 'Wiz',
      title: 'Wiz',
      url: 'https://www.wiz.io',
      snippet: 'Cloud security platform. Series C startup valued at $10B.',
      source: 'wiz.io',
      fundingStage: 'Series C',
      fundingAmount: '$300M',
      fundingDate: 'Feb 2023',
      employeeCount: '150-500 employees'
    },
    {
      company: 'Vanta',
      title: 'Vanta',
      url: 'https://www.vanta.com',
      snippet: 'Security compliance automation. Series B startup growing rapidly.',
      source: 'vanta.com',
      fundingStage: 'Series B',
      fundingAmount: '$203M',
      fundingDate: 'Mar 2023',
      employeeCount: '50-150 employees'
    }
  ];
}
