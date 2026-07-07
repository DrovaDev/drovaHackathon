import { RiderProfile } from "@/services/types/rider.types"
import { getVehicleEmoji } from "./modal-helpers"

export function RiderVehicleInfo({ rider }: { rider: RiderProfile }) {
	const fields = [
		{ label: "Type", value: `${getVehicleEmoji(rider.vehicleType)} ${rider.vehicleType ?? "—"}` },
		{ label: "Plate", value: rider.vehiclePlateNumber ?? "—" },
		{ label: "Model", value: rider.vehicleModel ?? "—" },
		{ label: "Color", value: rider.vehicleColor ?? "—" },
	]

	return (
		<div>
			<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Vehicle</p>
			<div className="grid grid-cols-4 gap-2">
				{fields.map(f => (
					<div key={f.label} className="bg-silver-two rounded-xl p-2.5">
						<div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">{f.label}</div>
						<div className="font-bold text-xs text-foreground truncate capitalize">{f.value}</div>
					</div>
				))}
			</div>
		</div>
	)
}
