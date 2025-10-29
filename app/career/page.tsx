// app/career/page.tsx
'use client';

import { useState } from 'react';

export default function CareerSearchPage() {
  const [location, setLocation] = useState('San Francisco, CA');
  const [role, setRole] = useState('Senior Product Designer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/you-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: role, 
          location: location 
        })
      });

      const data = await response.json();
      setResults(data.companies || []);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            MINA - Startup Career Scout
          </h1>
          <p className="text-white/60 text-sm">Powered by You.com</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Find Startups with Hiring Signals
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="Senior Product Designer">Senior Product Designer</option>
                  <option value="Staff Designer">Staff Designer</option>
                  <option value="Design Director">Design Director</option>
                  <option value="Head of Design">Head of Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="San Francisco, CA">San Francisco, CA</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="Los Angeles, CA">Los Angeles, CA</option>
                  <option value="Seattle, WA">Seattle, WA</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Opportunities →'}
              </button>
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Found {results.length} Startups with Hiring Signals
            </h3>
            
            <div className="grid gap-6">
              {results.map((company, idx) => (
                <div 
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {company.company}
                      </h4>
                      <div className="flex gap-3 text-sm text-white/60">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                          {company.fundingStage}
                        </span>
                        <span>{company.fundingAmount}</span>
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-4">
                    {company.description}
                  </p>

                  <div className="flex gap-3">
                    
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
                    >
                      Visit Website →
                    </a>
                    
                      href={`https://www.google.com/search?q=${encodeURIComponent(company.company + ' careers')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition"
                    >
                      Find Jobs
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
