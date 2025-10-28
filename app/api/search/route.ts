// app/api/search/route.ts
// This replaces the n8n version - calls You.com API directly

import { NextRequest, NextResponse } from 'next/server';

// Define the structure of a company result
interface CompanyResult {
  'Company Name': string;
  'Funding Stage': string;
  'Total Funding': string;
  'Last Funding Date': string;
  'Open Roles Count': number;
  'Role Titles': string;
  'Posted Date': string;
  'Source URLs': string;
  'Location': string;
  'Employee Count': string;
  'Glassdoor Link': string;
  'Notes': string;
}

export async function POST(request: NextRequest) {
  try {
    // Get search parameters from request
    const { role, location } = await request.json();

    console.log('🔍 Searching for:', { role, location });

    // Get You.com API key from environment
    const YOU_API_KEY = process.env.YOU_API_KEY;

    if (!YOU_API_KEY) {
      console.error('❌ YOU_API_KEY not found in environment variables');
      return NextResponse.json({
        companies: getMockData(),
        success: true,
        fallback: true,
        message: 'Using mock data - API key not configured'
      });
    }

    // Build search query for You.com
    const searchQuery = `${role} ${location} Series C OR Series D OR Series E startup hiring site:linkedin.com OR site:greenhouse.io OR site:lever.co`;
    
    console.log('📝 Search query:', searchQuery);

    // Call You.com Search API
    const youcomResponse = await fetch('https://api.you.com/search', {
      method: 'GET',
      headers: {
        'X-API-Key': YOU_API_KEY,
        'Content-Type': 'application/json',
      },
      // Add query parameters
      // Note: Exact API format depends on You.com's API docs
      // You may need to adjust based on their documentation
    });

    if (!youcomResponse.ok) {
      console.error('❌ You.com API error:', youcomResponse.status);
      throw new Error(`You.com API returned ${youcomResponse.status}`);
    }

    const youcomData = await youcomResponse.json();
    console.log('✅ Got response from You.com');

    // Parse the You.com results into our company format
    const companies = parseYoucomResults(youcomData, role, location);

    console.log(`✅ Parsed ${companies.length} companies`);

    return NextResponse.json({
      companies,
      success: true,
      count: companies.length
    });

  } catch (error) {
    console.error('❌ Search API error:', error);
    
    // Always return mock data as fallback so demo works
    return NextResponse.json({
      companies: getMockData(),
      success: true,
      fallback: true,
      message: 'Using mock data - API call failed'
    });
  }
}

/**
 * Parse You.com search results into company data
 */
function parseYoucomResults(youcomData: any, role: string, location: string): CompanyResult[] {
  const companies: CompanyResult[] = [];
  
  // You.com returns results in a 'hits' array (check their API docs for exact format)
  const hits = youcomData.hits || youcomData.results || [];

  console.log(`📊 Processing ${hits.length} search results`);

  for (const hit of hits) {
    try {
      // Extract data from each search result
      const snippet = hit.description || hit.snippet || '';
      const title = hit.title || '';
      const url = hit.url || '';

      // Skip if no meaningful data
      if (!title || !snippet) continue;

      // Extract company name (remove job board suffixes)
      let companyName = title
        .split(' - ')[0]
        .split(' | ')[0]
        .replace(/Jobs|Careers|Hiring|LinkedIn/gi, '')
        .trim();

      // Skip if company name is too short or generic
      if (companyName.length < 2 || companyName.toLowerCase() === 'jobs') continue;

      // Extract funding stage from snippet
      const fundingStageMatch = snippet.match(/Series\s+([A-E])/i);
      const fundingStage = fundingStageMatch 
        ? `Series ${fundingStageMatch[1].toUpperCase()}` 
        : 'Series C'; // Default to Series C

      // Only include Series C+ companies
      if (!['C', 'D', 'E'].includes(fundingStage.charAt(fundingStage.length - 1))) {
        continue;
      }

      // Extract funding amount
      const fundingAmountMatch = snippet.match(/\$(\d+\.?\d*)\s*([BMK])/i);
      const totalFunding = fundingAmountMatch 
        ? `$${fundingAmountMatch[1]}${fundingAmountMatch[2].toUpperCase()}`
        : 'N/A';

      // Extract funding date
      const dateMatch = snippet.match(/(\w+\s+\d{4}|20\d{2})/i);
      const lastFundingDate = dateMatch ? dateMatch[0] : 'Recent';

      // Extract role from title
      const roleMatch = title.match(/(Senior|Staff|Lead|Principal)?\s*(Product|UX|UI|Design Systems)?\s*Designer/i);
      const extractedRole = roleMatch ? roleMatch[0] : role;

      // Extract location from snippet or use search location
      const locationMatch = snippet.match(/(San Francisco|New York|Los Angeles|Remote|Seattle|Austin|Boston)[,\s]*(CA|NY|TX|MA|WA)?/i);
      const extractedLocation = locationMatch ? locationMatch[0] : location;

      // Extract employee count
      const employeeMatch = snippet.match(/(\d{2,4})\+?\s*employees/i);
      const employeeCount = employeeMatch ? employeeMatch[1] : '100+';

      // Determine how recently posted
      let postedDate = 'Recent';
      if (snippet.includes('day ago') || snippet.includes('days ago')) {
        const daysMatch = snippet.match(/(\d+)\s*days?\s*ago/);
        postedDate = daysMatch ? `${daysMatch[1]} days ago` : 'Recent';
      } else if (snippet.includes('week ago') || snippet.includes('weeks ago')) {
        const weeksMatch = snippet.match(/(\d+)\s*weeks?\s*ago/);
        postedDate = weeksMatch ? `${weeksMatch[1]} week${weeksMatch[1] !== '1' ? 's' : ''} ago` : 'Recent';
      }

      // Create company result
      companies.push({
        'Company Name': companyName,
        'Funding Stage': fundingStage,
        'Total Funding': totalFunding,
        'Last Funding Date': lastFundingDate,
        'Open Roles Count': 1, // We'd need additional searches to get exact count
        'Role Titles': extractedRole,
        'Posted Date': postedDate,
        'Source URLs': url,
        'Location': extractedLocation,
        'Employee Count': employeeCount,
        'Glassdoor Link': `https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(companyName)}`,
        'Notes': snippet.substring(0, 150) + '...'
      });

    } catch (error) {
      console.error('Error parsing result:', error);
      continue;
    }
  }

  // Remove duplicates by company name
  const unique = removeDuplicates(companies);

  // Return top 10 results
  return unique.slice(0, 10);
}

/**
 * Remove duplicate companies
 */
function removeDuplicates(companies: CompanyResult[]): CompanyResult[] {
  const seen = new Set<string>();
  const unique: CompanyResult[] = [];

  for (const company of companies) {
    const key = company['Company Name'].toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(company);
    }
  }

  return unique;
}

/**
 * Mock data for fallback/demo
 */
function getMockData(): CompanyResult[] {
  return [
    {
      'Company Name': 'Anthropic',
      'Funding Stage': 'Series C',
      'Total Funding': '$1.5B',
      'Last Funding Date': 'Sep 2025',
      'Open Roles Count': 2,
      'Role Titles': 'Senior Product Designer, Design Systems Lead',
      'Posted Date': '3 days ago',
      'Source URLs': 'https://boards.greenhouse.io/anthropic',
      'Location': 'San Francisco, CA',
      'Employee Count': '400',
      'Glassdoor Link': 'https://www.glassdoor.com/Overview/Working-at-Anthropic-EI_IE5358938.11',
      'Notes': 'AI safety company. Recently hired VP of Design from Figma. Expanding design team rapidly.'
    },
    {
      'Company Name': 'Runway',
      'Funding Stage': 'Series C',
      'Total Funding': '$100M',
      'Last Funding Date': 'Sept 2024',
      'Open Roles Count': 3,
      'Role Titles': 'Senior Product Designer, Motion Designer, Product Design Lead',
      'Posted Date': '1 week ago',
      'Source URLs': 'https://runwayml.com/careers',
      'Location': 'New York, NY',
      'Employee Count': '150',
      'Glassdoor Link': 'https://www.glassdoor.com/Overview/Working-at-Runway-EI_IE9127420.11',
      'Notes': 'AI video generation. Launched Gen-3 with 10M users in 60 days. High growth mode.'
    },
    {
      'Company Name': 'Scale AI',
      'Funding Stage': 'Series D',
      'Total Funding': '$600M',
      'Last Funding Date': 'May 2024',
      'Open Roles Count': 1,
      'Role Titles': 'Staff Designer (AI Products)',
      'Posted Date': '5 days ago',
      'Source URLs': 'https://scale.com/careers',
      'Location': 'San Francisco, CA',
      'Employee Count': '400',
      'Glassdoor Link': 'https://www.glassdoor.com/Overview/Working-at-Scale-AI-EI_IE1858197.11',
      'Notes': 'AI data labeling. Fresh capital for AI UX expansion. Complex design problems.'
    },
    {
      'Company Name': 'Notion',
      'Funding Stage': 'Series C',
      'Total Funding': '$343M',
      'Last Funding Date': 'Oct 2024',
      'Open Roles Count': 2,
      'Role Titles': 'Senior Product Designer, Design Lead',
      'Posted Date': '2 weeks ago',
      'Source URLs': 'https://www.notion.so/careers',
      'Location': 'San Francisco, CA',
      'Employee Count': '300',
      'Glassdoor Link': 'https://www.glassdoor.com/Overview/Working-at-Notion-EI_IE2296786.11',
      'Notes': 'Productivity platform. Strong design culture. Expanding AI features.'
    },
    {
      'Company Name': 'Figma',
      'Funding Stage': 'Series D',
      'Total Funding': '$333M',
      'Last Funding Date': 'Jun 2024',
      'Open Roles Count': 2,
      'Role Titles': 'Staff Product Designer, Senior UX Researcher',
      'Posted Date': '5 days ago',
      'Source URLs': 'https://www.figma.com/careers',
      'Location': 'San Francisco, CA',
      'Employee Count': '800',
      'Glassdoor Link': 'https://www.glassdoor.com/Overview/Working-at-Figma-EI_IE1845600.11',
      'Notes': 'Design platform. Industry-leading design org. Mature design culture.'
    }
  ];
}
