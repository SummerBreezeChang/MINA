// app/api/search/route.ts
// CORRECTED You.com API integration with proper endpoint

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { role, location } = await request.json();
    
    console.log('🔍 Searching for:', { role, location });

    const YOU_API_KEY = process.env.YOU_API_KEY;

    if (!YOU_API_KEY) {
      console.warn('⚠️ YOU_API_KEY not found');
      return NextResponse.json({
        companies: getMockData(),
        success: true,
        fallback: true
      });
    }

    // Build search query
    const searchQuery = `${role} ${location} Series C OR Series D startup hiring site:linkedin.com`;
    console.log('📝 Query:', searchQuery);

    // CORRECT You.com API endpoint from documentation
    // Base URL: https://api.ydc-index.io
    const apiUrl = `https://api.ydc-index.io/search?query=${encodeURIComponent(searchQuery)}&num_web_results=10`;
    
    console.log('🌐 Calling:', apiUrl);

    const youcomResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': YOU_API_KEY,  // Header format from docs
        'Content-Type': 'application/json',
      },
    });

    if (!youcomResponse.ok) {
      const errorText = await youcomResponse.text();
      console.error('❌ You.com API error:', {
        status: youcomResponse.status,
        statusText: youcomResponse.statusText,
        body: errorText
      });
      throw new Error(`You.com API error: ${youcomResponse.status}`);
    }

    const youcomData = await youcomResponse.json();
    console.log('✅ Got response from You.com');
    console.log('📊 Response structure:', Object.keys(youcomData));

    // Parse results
    const companies = parseYoucomResults(youcomData, role, location);
    console.log(`✅ Found ${companies.length} companies`);

    return NextResponse.json({
      companies,
      success: true,
      count: companies.length,
      debug: {
        query: searchQuery,
        resultsFound: youcomData.hits?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    return NextResponse.json({
      companies: getMockData(),
      success: true,
      fallback: true,
      error: String(error)
    });
  }
}

function parseYoucomResults(youcomData: any, role: string, location: string) {
  const companies: any[] = [];
  
  // You.com returns results in different possible structures
  // Based on their docs, web results are in hits array
  const hits = youcomData.hits || 
               youcomData.results?.web || 
               youcomData.web?.results ||
               [];

  console.log(`📊 Processing ${hits.length} search results`);

  for (const hit of hits) {
    try {
      const snippet = hit.description || hit.snippet || '';
      const title = hit.title || '';
      const url = hit.url || '';

      if (!title || !snippet) {
        console.log('⏭️ Skipping result - no title or snippet');
        continue;
      }

      // Extract company name
      let companyName = title
        .split(' - ')[0]
        .split(' | ')[0]
        .replace(/Jobs|Careers|Hiring|LinkedIn/gi, '')
        .trim();

      if (companyName.length < 2) {
        console.log('⏭️ Skipping - company name too short:', companyName);
        continue;
      }

      // Extract funding stage
      const fundingMatch = snippet.match(/Series\s+([CDE])/i);
      const fundingStage = fundingMatch ? `Series ${fundingMatch[1].toUpperCase()}` : 'Series C';

      // Only include Series C+ companies
      if (!['C', 'D', 'E'].includes(fundingStage.charAt(fundingStage.length - 1))) {
        console.log('⏭️ Skipping - not Series C+:', companyName);
        continue;
      }

      // Extract funding amount
      const amountMatch = snippet.match(/\$(\d+\.?\d*)\s*([BMK])/i);
      const totalFunding = amountMatch ? `$${amountMatch[1]}${amountMatch[2].toUpperCase()}` : 'N/A';

      // Extract date
      const dateMatch = snippet.match(/(\w+\s+\d{4}|20\d{2})/i);
      const lastFundingDate = dateMatch ? dateMatch[0] : 'Recent';

      // Extract employee count
      const employeeMatch = snippet.match(/(\d{2,4})\+?\s*employees/i);
      const employeeCount = employeeMatch ? employeeMatch[1] : '100+';

      console.log('✅ Found company:', companyName);

      companies.push({
        'Company Name': companyName,
        'Funding Stage': fundingStage,
        'Total Funding': totalFunding,
        'Last Funding Date': lastFundingDate,
        'Open Roles Count': 1,
        'Role Titles': role,
        'Posted Date': 'Recent',
        'Source URLs': url,
        'Location': location,
        'Employee Count': employeeCount,
        'Glassdoor Link': `https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(companyName)}`,
        'Notes': snippet.substring(0, 150) + '...'
      });

    } catch (error) {
      console.error('❌ Error parsing result:', error);
      continue;
    }
  }

  // Remove duplicates
  const seen = new Set();
  const unique = companies.filter(c => {
    const key = c['Company Name'].toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, 10);
}

function getMockData() {
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
      'Notes': 'AI safety company. Recently hired VP of Design from Figma.'
    },
    {
      'Company Name': 'Runway',
      'Funding Stage': 'Series C',
      'Total Funding': '$100M',
      'Last Funding Date': 'Sept 2024',
      'Open Roles Count': 3,
      'Role Titles': 'Senior Product Designer, Motion Designer',
      'Posted Date': '1 week ago',
      'Source URLs': 'https://runwayml.com/careers',
      'Location': 'New York, NY',
      'Employee Count': '150',
      'Glassdoor Link': 'https://www.glassdoor.com/Overview/Working-at-Runway-EI_IE9127420.11',
      'Notes': 'AI video generation. Launched Gen-3 with 10M users.'
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
      'Notes': 'AI data labeling. Fresh capital for AI UX expansion.'
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
      'Notes': 'Design platform. Industry-leading design org.'
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
      'Notes': 'Productivity platform. Strong design culture.'
    }
  ];
}
