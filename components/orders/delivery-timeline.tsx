import { cn } from "@/lib/utils"
import MaterialIcon from "@/components/ui/material-icon"
type TimelineStep = { label: string; time: string; description: string; completed?: boolean; active?: boolean; upcoming?: boolean }

type Props = {
  steps: TimelineStep[]
}

export function DeliveryTimeline({ steps }: Props) {
  return (
    <div className="bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all">
      <h3 className="font-bold text-lg text-primary mb-6">Delivery Timeline</h3>
      <div className="space-y-0 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
        {steps.map((step, i) => (
          <div key={i} className={cn("relative pl-10 pb-6 group last:pb-0", step.upcoming && "opacity-50")}>
            <div
              className={cn(
                "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                (step.completed || step.active) && "bg-secondary",
                step.upcoming && "bg-silver-two"
              )}
            >
              {step.completed && <MaterialIcon name="check" size={14} color="white" />}
              {step.active && <div className="w-2 h-2 rounded-full bg-white" />}
              {step.upcoming && <div className="w-2 h-2 rounded-full bg-border" />}
            </div>
            <div>
              <p className={cn("font-bold text-sm", step.active && "text-primary", !step.active && "text-foreground")}>{step.label}</p>
              <p className={cn("text-xs", step.active ? "text-secondary font-bold" : "text-muted-foreground")}>{step.time}</p>
              {step.description && <p className="text-xs mt-0.5 text-muted-foreground/70">{step.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
