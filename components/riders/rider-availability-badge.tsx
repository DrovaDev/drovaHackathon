import { RiderProfile } from "@/services/types/rider.types"
import { availabilityConfig } from "./utils"
import { getRelativeTime } from "./modal-helpers"
import MaterialIcon from "@/components/ui/material-icon"

export function RiderAvailabilityBadge({ rider }: { rider: RiderProfile }) {
	const avCfg = availabilityConfig[rider.availabilityStatus ?? "offline"]

	return (
		<div>
			<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Availability</p>
			<div className="bg-silver-two rounded-xl p-3 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<span className={`w-2.5 h-2.5 rounded-full ${avCfg.dot}`} />
					<span className={`text-sm font-bold ${avCfg.text}`}>{avCfg.label}</span>
				</div>
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<MaterialIcon name="schedule" size={12} />
					<span>{getRelativeTime(rider.lastLocationUpdatedAt)}</span>
				</div>
			</div>
		</div>
	)
}
