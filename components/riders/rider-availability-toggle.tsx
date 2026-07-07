import { RiderProfile } from "@/services/types/rider.types"
import { availabilityConfig } from "./utils"

type Props = {
	rider: RiderProfile
	onUpdate: (riderId: string, status: RiderProfile["availabilityStatus"]) => void
	isUpdating: boolean
}

export function RiderAvailabilityToggle({ rider, onUpdate, isUpdating }: Props) {
	return (
		<div>
			<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Availability</p>
			<div className="flex gap-2">
				{(["available", "on_trip", "offline"] as const).map(status => (
					<button
						key={status}
						disabled={isUpdating}
						onClick={() => onUpdate(rider.id, status)}
						className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
							(rider.availabilityStatus ?? "offline") === status
								? "bg-primary text-white border-primary shadow-sm"
								: "bg-silver-two border-border text-muted-foreground hover:border-primary/40"
						}`}
					>
						{availabilityConfig[status].label}
					</button>
				))}
			</div>
		</div>
	)
}
