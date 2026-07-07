export const notificationTypeConfig: Record<
	string,
	{ iconBg: string; iconColor: string; icon: string }
> = {
	NEW_ORDER: {
		iconBg: "bg-primary/5",
		iconColor: "var(--primary)",
		icon: "local_shipping",
	},
	ORDER_OFFER_EXPIRED: {
		iconBg: "bg-red-50",
		iconColor: "#DC2626",
		icon: "schedule",
	},
}

const FALLBACK_TYPE_CONFIG = {
	iconBg: "bg-gray-100",
	iconColor: "var(--muted-foreground)",
	icon: "notifications",
}

export function getNotificationTypeConfig(type: string) {
	return notificationTypeConfig[type] ?? FALLBACK_TYPE_CONFIG
}

export function formatNotificationTime(iso: string): string {
	const date = new Date(iso)
	const diffMs = Date.now() - date.getTime()
	const diffMin = Math.floor(diffMs / 60000)

	if (diffMin < 1) return "Just now"
	if (diffMin < 60) return `${diffMin}m ago`
	const diffHr = Math.floor(diffMin / 60)
	if (diffHr < 24) return `${diffHr}h ago`
	const diffDay = Math.floor(diffHr / 24)
	if (diffDay < 7) return `${diffDay}d ago`

	return date.toLocaleDateString("en-NG", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	})
}
