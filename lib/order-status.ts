import type { OrderStatus } from "@/services/types/order.types"

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", icon: "schedule" },
  quotation: { label: "Quotation", bg: "bg-slate-100", text: "text-slate-600", icon: "request_quote" },
  payment_confirmed: { label: "Payment Confirmed", bg: "bg-blue-100", text: "text-blue-700", icon: "payments" },
  offer_pending: { label: "Offer Pending", bg: "bg-amber-100", text: "text-amber-700", icon: "hourglass_top" },
  invoiced: { label: "Invoiced", bg: "bg-blue-100", text: "text-blue-700", icon: "receipt_long" },
  assigned: { label: "Assigned", bg: "bg-indigo-100", text: "text-indigo-700", icon: "assignment_ind" },
  en_route_pickup: { label: "En Route", bg: "bg-orange-100", text: "text-orange-700", icon: "directions_bike" },
  picked_up: { label: "Picked Up", bg: "bg-yellow-100", text: "text-yellow-700", icon: "inventory_2" },
  in_transit: { label: "In Transit", bg: "bg-primary/10", text: "text-primary", icon: "local_shipping" },
  arrived_at_delivery: { label: "Arrived", bg: "bg-secondary/10", text: "text-secondary-two", icon: "pin_drop" },
  completed: { label: "Completed", bg: "bg-secondary/10", text: "text-secondary-two", icon: "task_alt" },
  disputed: { label: "Disputed", bg: "bg-red-100", text: "text-red-600", icon: "flag" },
  cancelled: { label: "Cancelled", bg: "bg-gray-100", text: "text-gray-500", icon: "cancel" },
}

const FALLBACK_STATUS_CONFIG = { label: "Unknown", bg: "bg-gray-100", text: "text-gray-500", icon: "help" }

export function getOrderStatusConfig(status: string) {
  return orderStatusConfig[status as OrderStatus] ?? FALLBACK_STATUS_CONFIG
}
