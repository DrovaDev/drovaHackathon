import { RiderProfile } from "@/services/types/rider.types"
import MaterialIcon from "@/components/ui/material-icon"
import { StarRating } from "./star-rating"
import { availabilityConfig, getRiderName } from "./utils"

type Props = {
	rider: RiderProfile
	onEdit: () => void
	onClose: () => void
	variant: "map" | "standard"
}

export function RiderInfoHeader({ rider, onEdit, onClose, variant }: Props) {
	const name = getRiderName(rider.firstName, rider.lastName)
	const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2)
	const avCfg = availabilityConfig[rider.availabilityStatus ?? "offline"]
	const phone = rider.phoneNumber || rider.telephoneNumber

	if (variant === "map") {
		return (
			<div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
				<div className="bg-popover/90 backdrop-blur-sm rounded-xl border border-border shadow-sm px-3 py-2 flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-extrabold text-primary shrink-0">
						{initials}
					</div>
					<div className="min-w-0">
						<div className="font-bold text-foreground text-sm truncate">{name}</div>
						<div className="flex items-center gap-2">
							<StarRating rating={rider.rating ?? 0} />
							<span className={`text-[10px] font-bold uppercase ${avCfg.text}`}>{avCfg.label}</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-1.5">
					<button onClick={onEdit} className="w-8 h-8 rounded-full bg-popover/90 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors flex items-center justify-center" title="Edit rider">
						<MaterialIcon name="edit" size={14} color="var(--muted-foreground)" />
					</button>
					<button onClick={onClose} className="w-8 h-8 rounded-full bg-popover/90 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors flex items-center justify-center">
						<MaterialIcon name="close" size={14} color="var(--muted-foreground)" />
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="px-5 py-4 border-b border-border shrink-0 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-extrabold text-primary shrink-0">
					{initials}
				</div>
				<div>
					<div className="font-bold text-foreground">{name}</div>
					<div className="flex items-center gap-2">
						<StarRating rating={rider.rating ?? 0} />
						<span className={`text-[10px] font-bold uppercase ${avCfg.text}`}>{avCfg.label}</span>
						{phone && <span className="text-xs text-muted-foreground">· {phone}</span>}
					</div>
				</div>
			</div>
			<div className="flex items-center gap-1">
				<button onClick={onEdit} className="p-2 rounded-lg border-0 outline-none hover:bg-muted transition-colors" title="Edit rider">
					<MaterialIcon name="edit" size={18} color="var(--muted-foreground)" />
				</button>
				<button onClick={onClose} className="p-2 rounded-lg border-0 outline-none hover:bg-muted transition-colors">
					<MaterialIcon name="close" size={18} color="var(--muted-foreground)" />
				</button>
			</div>
		</div>
	)
}
