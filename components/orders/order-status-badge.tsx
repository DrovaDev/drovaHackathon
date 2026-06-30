import { cn } from "@/lib/utils"
type OrderStatus = "Pending" | "Assigned" | "In-Transit" | "Delivered" | "Cancelled"

const variantMap: Record<OrderStatus, string> = {
  Delivered: "bg-secondary/10 text-secondary",
  "In-Transit": "bg-primary/10 text-primary",
  Pending: "bg-chart-2/10 text-chart-2",
  Assigned: "bg-primary/5 text-primary",
  Cancelled: "bg-destructive/10 text-destructive",
}

type Props = {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
        variantMap[status],
        className
      )}
    >
      {status}
    </span>
  )
}
