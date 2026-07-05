import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	total: number
	available: number
	onDelivery: number
	offline: number
}

export function FleetSummaryCards({ total, available, onDelivery, offline }: Props) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
			{[
				{ label: "Total Riders", value: total, icon: "group", bg: "bg-primary/5", color: "var(--primary)" },
				{ label: "Available", value: available, icon: "check_circle", bg: "bg-secondary/10", color: "var(--secondary)" },
				{ label: "On Delivery", value: onDelivery, icon: "local_shipping", bg: "bg-primary/5", color: "var(--primary)" },
				{ label: "Offline", value: offline, icon: "wifi_off", bg: "bg-gray-100", color: "#6B7280" },
			].map(s => (
				<div key={s.label} className="bg-popover rounded-2xl border border-border p-4 flex items-center gap-3">
					<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
						<MaterialIcon name={s.icon} size={20} color={s.color} />
					</div>
					<div>
						<div className="text-2xl font-extrabold text-primary">{s.value}</div>
						<div className="text-xs text-muted-foreground font-medium">{s.label}</div>
					</div>
				</div>
			))}
		</div>
	)
}
