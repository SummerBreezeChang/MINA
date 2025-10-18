"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, ExternalLink, Check } from "lucide-react"
import Link from "next/link"

type Category = "laptop" | "furniture" | "appliance"

interface SearchParams {
  category: Category
  budget: number
  priorities: string[]
  specificNeeds: string
}

interface Product {
  name: string
  price: number
  retailer: string
  url: string
  specs: Record<string, string>
  reviews_summary: string
  rating: number
}

interface Recommendation {
  product: Product
  confidence_score: number
  reasoning: string
  pros: string[]
  cons: string[]
}

interface SearchResult {
  success: boolean
  category: string
  recommendations: Recommendation[]
  error?: string
}

const CATEGORIES = [
  { value: "laptop", label: "Laptop", priorities: ["Performance", "Battery Life", "Display Quality", "Portability", "Build Quality"] },
  { value: "furniture", label: "Furniture", priorities: ["Durability", "Comfort", "Design/Aesthetics", "Material Quality", "Size/Space Efficiency"] },
  { value: "appliance", label: "Appliance", priorities: ["Energy Efficiency", "Capacity", "Smart Features", "Reliability", "Noise Level"] },
]

export default function SearchPage() {
  const [step, setStep] = useState<"category" | "details" | "results">("category")
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    category: "laptop",
    budget: 1000,
    priorities: [],
    specificNeeds: "",
  })
  const [results, setResults] = useState<SearchResult | null>(null)

  const selectedCategory = CATEGORIES.find(c => c.value === searchParams.category)!

  const handleCategorySelect = (category: Category) => {
    setSearchParams({ ...searchParams, category, priorities: [] })
    setStep("details")
  }

  const togglePriority = (priority: string) => {
    setSearchParams(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }))
  }

  const handleSearch = async () => {
    if (searchParams.priorities.length === 0) {
      alert("Please select at least one priority")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Search failed")
      }

      setResults(data)
      setStep("results")
    } catch (error) {
      console.error("Search error:", error)
      alert(error instanceof Error ? error.message : "Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {step === "category" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                What are you looking for?
              </h1>
              <p className="text-muted-foreground text-lg">
                Select a product category to get started
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {CATEGORIES.map((category) => (
                <Card
                  key={category.value}
                  className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] hover:bg-card/80"
                  onClick={() => handleCategorySelect(category.value as Category)}
                >
                  <h3 className="text-2xl font-semibold mb-2">{category.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    Find the perfect {category.label.toLowerCase()} for your needs
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setStep("category")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Category
              </Button>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                {selectedCategory.label} Search
              </h1>
              <p className="text-muted-foreground">
                Tell us what you're looking for
              </p>
            </div>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="budget" className="text-base font-semibold mb-2 block">
                    Maximum Budget ($)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="500"
                    step="100"
                    value={searchParams.budget}
                    onChange={(e) => setSearchParams({ ...searchParams, budget: Number(e.target.value) })}
                    className="bg-background/50"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimum budget: $500
                  </p>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Priorities (select at least one)
                  </Label>
                  <div className="space-y-2">
                    {selectedCategory.priorities.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => togglePriority(priority)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          searchParams.priorities.includes(priority)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 bg-background/50 hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          searchParams.priorities.includes(priority)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        }`}>
                          {searchParams.priorities.includes(priority) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{priority}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="needs" className="text-base font-semibold mb-2 block">
                    Specific Requirements (Optional)
                  </Label>
                  <Input
                    id="needs"
                    placeholder="e.g., Must have USB-C charging, need by next week..."
                    value={searchParams.specificNeeds}
                    onChange={(e) => setSearchParams({ ...searchParams, specificNeeds: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={loading || searchParams.priorities.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Find Products"
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "results" && results && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setStep("details")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Search
              </Button>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                Recommendations
              </h1>
              <p className="text-muted-foreground">
                Found {results.recommendations.length} products matching your criteria
              </p>
            </div>

            {results.error && (
              <Card className="p-6 mb-6 border-destructive/50 bg-destructive/10">
                <p className="text-destructive">Error: {results.error}</p>
              </Card>
            )}

            <div className="space-y-6">
              {results.recommendations.map((rec, index) => (
                <Card key={index} className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{rec.product.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="font-medium">{rec.product.retailer}</span>
                        <span>⭐ {rec.product.rating}/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${rec.product.price.toLocaleString()}
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {Math.round(rec.confidence_score)}% Confidence
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-4 rounded-lg bg-background/50">
                    <p className="text-sm leading-relaxed">{rec.reasoning}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-2 text-green-500">Pros</h3>
                      <ul className="space-y-1">
                        {rec.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-2 text-yellow-500">Cons</h3>
                      <ul className="space-y-1">
                        {rec.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-yellow-500">−</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {Object.keys(rec.product.specs).length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-sm mb-2">Specifications</h3>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        {Object.entries(rec.product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 rounded bg-background/50">
                            <span className="text-muted-foreground capitalize">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button asChild className="w-full">
                    <a href={rec.product.url} target="_blank" rel="noopener noreferrer">
                      View at {rec.product.retailer}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
