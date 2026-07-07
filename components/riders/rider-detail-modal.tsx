"use client"

import Link from "next/link"
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
import { RiderAvailabilityBadge } from "./rider-availability-badge"

type Props = {
	rider: RiderProfile | null
	onClose: () => void
	onEdit: (rider: RiderProfile) => void
	onSuspend: (rider: RiderProfile) => void
	onResendOtp: (rider: RiderProfile) => void
}

export function RiderDetailModal({ rider, onClose, onEdit, onSuspend, onResendOtp }: Props) {
	if (!rider) return null

	const isPending = rider.inviteStatus === "pending"
	const hasLocation = hasRiderLocation(rider)
	const phone = rider.phoneNumber || rider.telephoneNumber

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
					<RiderAvailabilityBadge rider={rider} />
				</div>

				{/* Sticky footer */}
				<div className="px-5 py-3.5 border-t border-border flex gap-3 shrink-0">
					{phone && (
						<a href={`tel:${phone}`} className="flex-1">
							<Button variant="outline" className="w-full gap-2">
								<MaterialIcon name="call" size={14} />
								Call
							</Button>
						</a>
					)}
					{phone && (
						<a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
							<Button variant="outline" className="w-full gap-2">
								<MaterialIcon name="chat" size={14} />
								WhatsApp
							</Button>
						</a>
					)}
					<Link href={`/dashboard/orders?tab=orders&search=${rider.firstName}`} className="flex-1">
						<Button variant="outline" className="w-full gap-2">
							<MaterialIcon name="receipt_long" size={14} />
							Orders
						</Button>
					</Link>
					<Button variant="ghost" className="text-destructive hover:text-destructive px-3" onClick={() => onSuspend(rider)}>
						<MaterialIcon name="block" size={16} />
					</Button>
				</div>
			</div>
		</div>
	)
}
