"use client"

import { RiderProfile } from "@/services/types/rider.types"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { formatCurrency } from "./utils"
import { hasRiderLocation } from "./modal-helpers"
import { RiderLocationMap } from "./rider-location-map"
import { RiderInfoHeader } from "./rider-info-header"
import { RiderStatsGrid } from "./rider-stats-grid"
import { RiderVehicleInfo } from "./rider-vehicle-info"
import { RiderContact } from "./rider-contact"
import { RiderAvailabilityToggle } from "./rider-availability-toggle"

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

	const isPending = rider.inviteStatus === "pending"
	const hasLocation = hasRiderLocation(rider)

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

				{/* Header: map or standard */}
				{hasLocation ? (
					<div className="relative shrink-0">
						<RiderLocationMap rider={rider} />
						<RiderInfoHeader rider={rider} onEdit={() => onEdit(rider)} onClose={onClose} variant="map" />
					</div>
				) : (
					<RiderInfoHeader rider={rider} onEdit={() => onEdit(rider)} onClose={onClose} variant="standard" />
				)}

				{/* Scrollable content */}
				<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

					{isPending && (
						<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<MaterialIcon name="pending" size={16} color="#D97706" />
								<span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Invitation Pending</span>
							</div>
							<Button size="sm" variant="ghost" className="text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-100" onClick={() => onResendOtp(rider)}>
								Resend OTP
							</Button>
						</div>
					)}

					<RiderStatsGrid rider={rider} />
					<RiderVehicleInfo rider={rider} />
					<RiderContact rider={rider} />
					<RiderAvailabilityToggle rider={rider} onUpdate={onUpdateAvailability} isUpdating={isUpdatingAvailability} />
				</div>

				{/* Sticky footer */}
				<div className="px-5 py-3.5 border-t border-border flex gap-3 shrink-0">
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
