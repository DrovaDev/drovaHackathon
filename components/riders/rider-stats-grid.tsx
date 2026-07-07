import { RiderProfile } from "@/services/types/rider.types"
import MaterialIcon from "@/components/ui/material-icon"
import { formatCurrency } from "./utils"
import { formatJoinedDate } from "./modal-helpers"

export function RiderStatsGrid({ rider }: { rider: RiderProfile }) {
	const stats = [
		{ label: "Deliveries", value: rider.totalDeliveries ?? 0, icon: "local_shipping" },
		{ label: "Completion", value: `${rider.completionRate ?? 0}%`, icon: "verified" },
		{ label: "Earnings", value: formatCurrency(rider.pendingEarnings ?? 0), icon: "payments" },
		{ label: "Joined", value: formatJoinedDate(rider.createdAt), icon: "calendar_today" },
	]

	return (
		<div className="grid grid-cols-4 gap-2">
			{stats.map(s => (
				<div key={s.label} className="bg-silver-two rounded-xl p-2.5 text-center">
					<MaterialIcon name={s.icon} size={14} color="var(--muted-foreground)" />
					<div className="font-bold text-xs text-foreground mt-1">{s.value}</div>
					<div className="text-[9px] text-muted-foreground uppercase tracking-wide">{s.label}</div>
				</div>
			))}
		</div>
	)
}
