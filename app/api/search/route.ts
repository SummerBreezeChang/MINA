// app/api/you-search/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const res = await fetch("https://api.you.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.YOU_API_KEY}`,
      },
      body: JSON.stringify({
        q: query,              // your search term
        num_results: 10,       // how many results to return
        include_snippets: true // gives back text content
      }),
    });

    if (!res.ok) {
      throw new Error(`You.com API error: ${res.statusText}`);
    }

    const data = await res.json();

    // Simplify response: just send titles, urls, snippets
    const results = (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
      source: new URL(r.url).hostname,
    }));

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("Search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
