export const riderPayoutStatusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: string }
> = {
  posted: { label: "Posted", bg: "bg-secondary/10", text: "text-secondary-two", icon: "check_circle" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", icon: "schedule" },
  failed: { label: "Failed", bg: "bg-red-100", text: "text-red-600", icon: "error" },
  reversed: { label: "Reversed", bg: "bg-gray-100", text: "text-gray-500", icon: "undo" },
}

const FALLBACK_STATUS_CONFIG = { label: "Unknown", bg: "bg-gray-100", text: "text-gray-500", icon: "help" }

export function getRiderPayoutStatusConfig(status: string) {
  return riderPayoutStatusConfig[status] ?? FALLBACK_STATUS_CONFIG
}
