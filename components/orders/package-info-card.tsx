import { cn } from "@/lib/utils"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
  weight: string
  type: string
  quantity: number
  insurance: string
  specialInstructions: string
}

export function PackageInfoCard({ weight, type, quantity, insurance, specialInstructions }: Props) {
  const items = [
    { label: "Weight", value: weight },
    { label: "Type", value: type },
    { label: "Quantity", value: `${quantity} Unit${quantity > 1 ? "s" : ""}` },
    { label: "Insurance", value: insurance, highlight: insurance !== "Not Covered" },
  ]

  return (
    <div className="bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-primary">Package Information</h3>
        <MaterialIcon name="inventory_2" size={20} color="var(--muted-foreground)" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">{item.label}</p>
            <p className={cn("font-bold text-foreground", item.highlight && "text-secondary")}>{item.value}</p>
          </div>
        ))}
      </div>
      {specialInstructions && (
        <div className="pt-2">
          <div className="flex items-start space-x-2 bg-silver-two p-3 rounded-lg">
            <MaterialIcon name="warning" size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-muted-foreground">{specialInstructions}</p>
          </div>
        </div>
      )}
    </div>
  )
}
