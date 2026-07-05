import { RiderProfile } from "@/api/types/rider.types"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { StarRating } from "./star-rating"
import { availabilityConfig, getVehicleIcon, formatCurrency, getRiderName } from "./utils"

type Props = {
	rider: RiderProfile
	onClick: () => void
}

export function RiderCard({ rider, onClick }: Props) {
	const avCfg = availabilityConfig[rider.availabilityStatus ?? "offline"]
	const riderName = getRiderName(rider.firstName, rider.lastName)

	return (
		<div
			onClick={onClick}
			className="bg-popover rounded-2xl border border-border p-5 cursor-pointer hover:border-secondary/40 hover:shadow-md transition-all group"
		>
			<div className="flex items-start justify-between mb-4">
				<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-extrabold text-primary">
					{riderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
				</div>
				<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${avCfg.bg} ${avCfg.text}`}>
					<span className={`w-1.5 h-1.5 rounded-full ${avCfg.dot}`} />
					{avCfg.label}
				</span>
			</div>

			<div className="mb-3">
				<div className="font-bold text-foreground text-sm">{riderName}</div>
				<div className="text-xs text-muted-foreground mt-0.5">{rider.telephoneNumber}</div>
			</div>

			<div className="flex items-center gap-2 mb-3">
				<MaterialIcon name={getVehicleIcon(rider.vehicleType ?? "bike")} size={14} color="var(--muted-foreground)" />
				<span className="text-xs text-muted-foreground capitalize">{rider.vehicleType}</span>
			</div>

			<StarRating rating={rider.rating ?? 0} />

			<div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
				<div>
					<div className="text-[10px] text-muted-foreground uppercase tracking-wide">Deliveries</div>
					<div className="font-bold text-sm text-foreground">{rider.totalDeliveries ?? 0}</div>
				</div>
				<div>
					<div className="text-[10px] text-muted-foreground uppercase tracking-wide">Completion</div>
					<div className="font-bold text-sm text-foreground">{rider.completionRate ?? 0}%</div>
				</div>
			</div>

			<div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
				<div>
					<div className="text-[10px] text-muted-foreground uppercase tracking-wide">Pending Earnings</div>
					<div className="font-bold text-sm text-primary">{formatCurrency(rider.pendingEarnings ?? 0)}</div>
				</div>
				<Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
					View
				</Button>
			</div>
		</div>
	)
}
