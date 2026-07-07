import { RiderProfile } from "@/services/types/rider.types"
import MaterialIcon from "@/components/ui/material-icon"

export function RiderContact({ rider }: { rider: RiderProfile }) {
	const phone = rider.phoneNumber || rider.telephoneNumber
	if (!phone) return null

	return (
		<div>
			<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Contact</p>
			<div className="bg-silver-two rounded-xl p-3 flex items-center gap-3">
				<MaterialIcon name="phone" size={14} color="var(--muted-foreground)" />
				<span className="text-sm font-medium text-foreground">{phone}</span>
			</div>
		</div>
	)
}
