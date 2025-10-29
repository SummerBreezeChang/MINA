// app/api/you-search/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    
    console.log('🔍 Career Scout Search:', { query, location });

    const YOU_API_KEY = process.env.YOU_API_KEY;

    if (!YOU_API_KEY) {
      console.log('⚠️ No API key, using curated data');
      return NextResponse.json({
        companies: getCuratedStartups(location),
        source: 'curated'
      });
    }

    try {
      const searchQuery = `${location} Series A B C startup funding 2024 2025`;
      const url = `https://api.ydc-index.io/v1/search?query=${encodeURIComponent(searchQuery)}&num_web_results=10`;

      const response = await fetch(url, {
        headers: { 'X-API-Key': YOU_API_KEY },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results?.web || [];
      
      console.log(`✅ Found ${results.length} results from You.com`);

      const companies = parseResults(results, location);

      if (companies.length > 0) {
        return NextResponse.json({
          companies: companies,
          source: 'youcom'
        });
      }

      return NextResponse.json({
        companies: getCuratedStartups(location),
        source: 'curated-fallback'
      });

    } catch (apiError) {
      console.error('You.com API error:', apiError);
      return NextResponse.json({
        companies: getCuratedStartups(location),
        source: 'curated-error'
      });
    }

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      companies: getCuratedStartups('San Francisco'),
      source: 'error'
    });
  }
}

function parseResults(results: any[], location: string): any[] {
  const companies: any[] = [];

  for (const result of results) {
    try {
      const title = result.title || '';
      const description = result.description || '';
      
      if (!/Series\s+[ABC]/i.test(title + description)) continue;
      
      const match = title.match(/^([A-Z][a-zA-Z0-9\s]{2,30}?)\s+(?:raises|secures)/i);
      if (!match) continue;
      
      const companyName = match[1].trim();
      
      const seriesMatch = description.match(/Series\s+([ABC])/i);
      const amountMatch = description.match(/\$(\d+\.?\d*)\s*([BMK])/i);
      
      companies.push({
        company: companyName,
        fundingStage: seriesMatch ? `Series ${seriesMatch[1]}` : 'Series C',
        fundingAmount: amountMatch ? `$${amountMatch[1]}${amountMatch[2]}` : 'N/A',
        description: description.substring(0, 150) + '...',
        url: result.url || '',
        location: location
      });

    } catch (e) {
      continue;
    }
  }

  return companies.slice(0, 5);
}

function getCuratedStartups(location?: string): any[] {
  const startups = [
    {
      company: 'Perplexity AI',
      fundingStage: 'Series B',
      fundingAmount: '$73.6M',
      fundingDate: 'Jan 2024',
      description: 'AI-powered search engine. Recently raised Series B funding.',
      url: 'https://www.perplexity.ai',
      location: 'San Francisco, CA'
    },
    {
      company: 'Harvey AI',
      fundingStage: 'Series B',
      fundingAmount: '$80M',
      fundingDate: 'Dec 2023',
      description: 'Legal AI assistant for law firms. Series B backed by Sequoia.',
      url: 'https://www.harvey.ai',
      location: 'San Francisco, CA'
    },
    {
      company: 'Ramp',
      fundingStage: 'Series C',
      fundingAmount: '$750M',
      fundingDate: 'Aug 2023',
      description: 'Corporate card and expense management. Hypergrowth startup.',
      url: 'https://ramp.com',
      location: 'New York, NY'
    },
    {
      company: 'Wiz',
      fundingStage: 'Series C',
      fundingAmount: '$300M',
      fundingDate: 'Feb 2023',
      description: 'Cloud security platform. $10B valuation.',
      url: 'https://www.wiz.io',
      location: 'New York, NY'
    },
    {
      company: 'Vanta',
      fundingStage: 'Series B',
      fundingAmount: '$203M',
      fundingDate: 'Mar 2023',
      description: 'Security compliance automation. Growing rapidly.',
      url: 'https://www.vanta.com',
      location: 'San Francisco, CA'
    }
  ];

  if (location && location !== 'Remote') {
    const city = location.split(',')[0];
    return startups.filter(s => s.location.includes(city));
  }

  return startups;
}
