import { RiderProfile } from "@/services/types/rider.types"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { StarRating } from "./star-rating"
import { availabilityConfig, getVehicleIcon, formatCurrency, getRiderName } from "./utils"

type Props = {
	rider: RiderProfile | null
	onClose: () => void
	onEdit: (rider: RiderProfile) => void
	onSuspend: (rider: RiderProfile) => void
	onResendOtp: (rider: RiderProfile) => void
	onUpdateAvailability: (riderId: string, status: RiderProfile["availabilityStatus"]) => void
	isUpdatingAvailability: boolean
}

export function RiderDetailModal({ rider, onClose, onEdit, onSuspend, onResendOtp, onUpdateAvailability, isUpdatingAvailability }: Props) {
	if (!rider) return null

	const riderName = getRiderName(rider.firstName, rider.lastName)
	const avCfg = availabilityConfig[rider.availabilityStatus ?? "offline"]
	const isPending = rider.inviteStatus === "pending"

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-base font-bold text-primary">Rider Profile</h3>
					<div className="flex items-center gap-1">
						<button onClick={() => onEdit(rider)} className="p-2 rounded-lg border-0 outline-none hover:bg-muted transition-colors" title="Edit rider">
							<MaterialIcon name="edit" size={18} color="var(--muted-foreground)" />
						</button>
						<button onClick={onClose} className="p-2 rounded-lg border-0 outline-none hover:bg-muted transition-colors">
							<MaterialIcon name="close" size={18} color="var(--muted-foreground)" />
						</button>
					</div>
				</div>

				{/* Profile header */}
				<div className="flex items-center gap-4 mb-6">
					<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-extrabold text-primary shrink-0">
						{riderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="font-bold text-foreground text-lg truncate">{riderName}</div>
						<div className="text-sm text-muted-foreground">{rider.telephoneNumber}</div>
						<StarRating rating={rider.rating ?? 0} />
					</div>
					<div className="ml-auto shrink-0">
						<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${avCfg.bg} ${avCfg.text}`}>
							<span className={`w-1.5 h-1.5 rounded-full ${avCfg.dot}`} />
							{avCfg.label}
						</span>
					</div>
				</div>

				{/* Invite status banner */}
				{isPending && (
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<MaterialIcon name="pending" size={16} color="#D97706" />
							<span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Invitation Pending</span>
						</div>
						<Button size="sm" variant="ghost" className="text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-100" onClick={() => onResendOtp(rider)}>
							Resend OTP
						</Button>
					</div>
				)}

				{/* Details grid */}
				<div className="grid grid-cols-2 gap-3 mb-6">
					{[
						{ label: "Vehicle", value: rider.vehicleType, icon: getVehicleIcon(rider.vehicleType ?? "bike") },
						{ label: "Plate", value: rider.vehiclePlateNumber ?? "—", icon: "confirmation_number" },
						{ label: "Model", value: rider.vehicleModel ?? "—", icon: "directions_car" },
						{ label: "Color", value: rider.vehicleColor ?? "—", icon: "palette" },
						{ label: "Joined", value: rider.createdAt ? new Date(rider.createdAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" }) : "—", icon: "calendar_today" },
						{ label: "Deliveries", value: rider.totalDeliveries ?? 0, icon: "local_shipping" },
						{ label: "Completion", value: `${rider.completionRate ?? 0}%`, icon: "verified" },
						{ label: "Earnings", value: formatCurrency(rider.pendingEarnings ?? 0), icon: "payments" },
					].map(item => (
						<div key={item.label} className="bg-silver-two rounded-xl p-3">
							<div className="flex items-center gap-1.5 mb-1">
								<MaterialIcon name={item.icon} size={13} color="var(--muted-foreground)" />
								<span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{item.label}</span>
							</div>
							<div className="font-bold text-sm text-foreground capitalize">{String(item.value)}</div>
						</div>
					))}
				</div>

				{/* Availability toggle */}
				<div className="mb-6">
					<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Availability</p>
					<div className="flex gap-2">
						{(["available", "on_trip", "offline"] as const).map(status => (
							<button
								key={status}
								disabled={isUpdatingAvailability}
								onClick={() => onUpdateAvailability(rider.id, status)}
								className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
									(rider.availabilityStatus ?? "offline") === status
										? "bg-primary text-white border-primary"
										: "bg-silver-two border-border text-muted-foreground hover:border-primary/40"
								}`}
							>
								{availabilityConfig[status].label}
							</button>
						))}
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3">
					<Button variant="ghost" className="flex-1 text-destructive hover:text-destructive" onClick={() => onSuspend(rider)}>
						Suspend Rider
					</Button>
					<Button className="flex-1" onClick={onClose}>
						<MaterialIcon name="account_balance_wallet" size={14} color="white" />
						Pay {formatCurrency(rider.pendingEarnings ?? 0)}
					</Button>
				</div>
			</div>
		</div>
	)
}
