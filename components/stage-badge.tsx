import { cn } from "@/lib/utils"

interface StageBadgeProps {
  stage: "Series C" | "Series D" | "Series E"
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const colors = {
    "Series C": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Series D": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Series E": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-card-foreground text-card-foreground",
        colors[stage],
        className,
      )}
    >
      {stage}
    </span>
  )
}
