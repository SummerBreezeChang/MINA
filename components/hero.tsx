import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/design-mode/Screenshot%202025-10-18%20at%203.28.10%E2%80%AFPM.png"
          alt=""
          className="h-full w-full object-cover animate-gradient-flow"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight mb-2.5 tracking-tight line-through lg:text-6xl text-center leading-3 mr-0">
            Track design roles at startups that are actually growing
          </h1>

          <p className="mb-12 text-xl text-foreground tracking-tight lg:text-xl">
            Series C+ companies with real hiring signals. No ghost jobs.
          </p>

          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select>
                <SelectTrigger className="w-full sm:w-[280px] bg-background/80 backdrop-blur-sm border-primary/20 !h-[56px] text-base">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior-product-designer">Senior Product Designer</SelectItem>
                  <SelectItem value="staff-product-designer">Staff Product Designer</SelectItem>
                  <SelectItem value="design-systems-designer">Design Systems Designer</SelectItem>
                  <SelectItem value="lead-product-designer">Lead Product Designer</SelectItem>
                  <SelectItem value="head-of-design">Head of Design</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-[280px] bg-background/80 backdrop-blur-sm border-primary/20 !h-[56px] text-base">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="lg"
                className="px-8 whitespace-nowrap shadow-[0_0_30px_rgba(96,165,250,0.3)] hover:shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all h-[56px] text-base"
              >
                Search Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">This is real-time search powered by You.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}
