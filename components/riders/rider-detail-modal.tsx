"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { RiderProfile } from "@/services/types/rider.types"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { StarRating } from "./star-rating"
import { availabilityConfig, formatCurrency, getRiderName } from "./utils"

type Props = {
	rider: RiderProfile | null
	onClose: () => void
	onEdit: (rider: RiderProfile) => void
	onSuspend: (rider: RiderProfile) => void
	onResendOtp: (rider: RiderProfile) => void
	onUpdateAvailability: (riderId: string, status: RiderProfile["availabilityStatus"]) => void
	isUpdatingAvailability: boolean
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
			{ headers: { "User-Agent": "DrovaDashboard/1.0" } }
		)
		const data = await res.json()
		if (data?.display_name) {
			const parts = data.display_name.split(", ")
			return parts.slice(0, 3).join(", ")
		}
	} catch {}
	return `${lat.toFixed(5)}, ${lon.toFixed(5)}`
}

function getRelativeTime(dateString: string | null | undefined): string {
	if (!dateString) return "No location data"
	const diffMs = Date.now() - new Date(dateString).getTime()
	const mins = Math.floor(diffMs / 60000)
	if (mins < 1) return "Just now"
	if (mins < 60) return `${mins}m ago`
	const hrs = Math.floor(mins / 60)
	if (hrs < 24) return `${hrs}h ago`
	return `${Math.floor(hrs / 24)}d ago`
}

function formatJoinedDate(dateString: string | undefined): string {
	if (!dateString) return "—"
	const d = new Date(dateString)
	return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function getVehicleEmoji(t: string | null): string {
	return { bike: "🏍️", bicycle: "🚲", car: "🚗", van: "🚐", truck: "🚚" }[t ?? ""] ?? "🏍️"
}

let pulseStyleInjected = false
function injectPulseStyle() {
	if (pulseStyleInjected || typeof document === "undefined") return
	const s = document.createElement("style")
	s.textContent = `@keyframes rider-pulse { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.5);opacity:0} }`
	document.head.appendChild(s)
	pulseStyleInjected = true
}

function RiderLocationMap({ rider }: { rider: RiderProfile }) {
	const mapContainer = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)
	const markerRef = useRef<maplibregl.Marker | null>(null)
	const [address, setAddress] = useState<string | null>(null)
	const [loadingAddr, setLoadingAddr] = useState(false)

	const coords = rider.lastKnownLocation?.coordinates as [number, number] | undefined
	const hasLocation = !!(coords && coords[0] && coords[1])
	const riderName = getRiderName(rider.firstName, rider.lastName)

	useEffect(() => {
		if (!hasLocation) { setAddress(null); return }
		let cancelled = false
		setLoadingAddr(true)
		reverseGeocode(coords[1], coords[0]).then(a => { if (!cancelled) { setAddress(a); setLoadingAddr(false) } })
		return () => { cancelled = true }
	}, [coords, hasLocation])

	useEffect(() => {
		if (!mapContainer.current || !hasLocation) return
		injectPulseStyle()
		if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null }

		const map = new maplibregl.Map({
			container: mapContainer.current,
			style: { version: 8, sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } }, layers: [{ id: "osm", type: "raster", source: "osm" }] },
			center: coords, zoom: 15, attributionControl: false, interactive: true,
		})
		map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: false }), "top-right")

		const el = document.createElement("div")
		el.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:4px"
		const label = document.createElement("div")
		label.style.cssText = "background:var(--primary);color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)"
		label.textContent = riderName
		const wrap = document.createElement("div")
		wrap.style.cssText = "position:relative;width:36px;height:36px"
		const pulse = document.createElement("div")
		pulse.style.cssText = "position:absolute;width:36px;height:36px;border-radius:50%;border:2px solid var(--primary);animation:rider-pulse 2s ease-out infinite"
		const icon = document.createElement("div")
		icon.style.cssText = "width:36px;height:36px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 12px rgba(0,0,0,0.3);border:3px solid white;position:relative;z-index:1"
		icon.textContent = getVehicleEmoji(rider.vehicleType)
		wrap.append(pulse, icon)
		el.append(label, wrap)

		markerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat(coords).addTo(map)
		mapRef.current = map
		return () => { map.remove(); mapRef.current = null; markerRef.current = null }
	}, [coords, hasLocation, riderName, rider.vehicleType])

	if (!hasLocation) return null

	return (
		<div className="relative">
			<div ref={mapContainer} className="h-52 w-full rounded-t-2xl" />
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5 min-w-0">
						<MaterialIcon name="location_on" size={12} color="white" />
						{loadingAddr ? (
							<div className="h-3 bg-white/20 rounded w-32 animate-pulse" />
						) : (
							<span className="text-xs font-semibold text-white truncate">{address}</span>
						)}
					</div>
					<div className="flex items-center gap-1.5 shrink-0 ml-2">
						<span className="w-1.5 h-1.5 rounded-full bg-green-400" />
						<span className="text-[10px] text-white/80">{getRelativeTime(rider.lastLocationUpdatedAt)}</span>
					</div>
				</div>
				<div className="text-[10px] text-white/50 mt-0.5 font-mono">
					{coords[1].toFixed(5)}, {coords[0].toFixed(5)}
				</div>
			</div>
		</div>
	)
}

export function RiderDetailModal({ rider, onClose, onEdit, onSuspend, onResendOtp, onUpdateAvailability, isUpdatingAvailability }: Props) {
	if (!rider) return null

	const riderName = getRiderName(rider.firstName, rider.lastName)
	const avCfg = availabilityConfig[rider.availabilityStatus ?? "offline"]
	const isPending = rider.inviteStatus === "pending"
	const coords = rider.lastKnownLocation?.coordinates as [number, number] | undefined
	const hasLocation = !!(coords && coords[0] && coords[1])

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

				{/* Map header */}
				{hasLocation && (
					<div className="relative shrink-0">
						<RiderLocationMap rider={rider} />
						<div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
							<button onClick={() => onEdit(rider)} className="w-8 h-8 rounded-full bg-popover/90 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors flex items-center justify-center" title="Edit rider">
								<MaterialIcon name="edit" size={14} color="var(--muted-foreground)" />
							</button>
							<button onClick={onClose} className="w-8 h-8 rounded-full bg-popover/90 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors flex items-center justify-center">
								<MaterialIcon name="close" size={14} color="var(--muted-foreground)" />
							</button>
						</div>
						<div className="absolute top-3 left-3 z-10">
							<div className="bg-popover/90 backdrop-blur-sm rounded-xl border border-border shadow-sm px-3 py-2 flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-extrabold text-primary shrink-0">
									{riderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
								</div>
								<div className="min-w-0">
									<div className="font-bold text-foreground text-sm truncate">{riderName}</div>
									<div className="flex items-center gap-2">
										<StarRating rating={rider.rating ?? 0} />
										<span className={`text-[10px] font-bold uppercase ${avCfg.text}`}>{avCfg.label}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Header when no location */}
				{!hasLocation && (
					<div className="px-5 py-4 border-b border-border shrink-0 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-extrabold text-primary shrink-0">
								{riderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
							</div>
							<div>
								<div className="font-bold text-foreground">{riderName}</div>
								<div className="flex items-center gap-2">
									<StarRating rating={rider.rating ?? 0} />
									<span className={`text-[10px] font-bold uppercase ${avCfg.text}`}>{avCfg.label}</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-1">
							<button onClick={() => onEdit(rider)} className="p-2 rounded-lg border-0 outline-none hover:bg-muted transition-colors" title="Edit rider">
								<MaterialIcon name="edit" size={18} color="var(--muted-foreground)" />
							</button>
							<button onClick={onClose} className="p-2 rounded-lg border-0 outline-none hover:bg-muted transition-colors">
								<MaterialIcon name="close" size={18} color="var(--muted-foreground)" />
							</button>
						</div>
					</div>
				)}

				{/* Scrollable content */}
				<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

					{/* Invite banner */}
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

					{/* Quick stats */}
					<div className="grid grid-cols-4 gap-2">
						{[
							{ label: "Deliveries", value: rider.totalDeliveries ?? 0, icon: "local_shipping" },
							{ label: "Completion", value: `${rider.completionRate ?? 0}%`, icon: "verified" },
							{ label: "Earnings", value: formatCurrency(rider.pendingEarnings ?? 0), icon: "payments" },
							{ label: "Joined", value: formatJoinedDate(rider.createdAt), icon: "calendar_today" },
						].map(s => (
							<div key={s.label} className="bg-silver-two rounded-xl p-2.5 text-center">
								<MaterialIcon name={s.icon} size={14} color="var(--muted-foreground)" />
								<div className="font-bold text-xs text-foreground mt-1">{s.value}</div>
								<div className="text-[9px] text-muted-foreground uppercase tracking-wide">{s.label}</div>
							</div>
						))}
					</div>

					{/* Vehicle info */}
					<div>
						<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Vehicle</p>
						<div className="grid grid-cols-4 gap-2">
							{[
								{ label: "Type", value: rider.vehicleType, icon: getVehicleEmoji(rider.vehicleType) },
								{ label: "Plate", value: rider.vehiclePlateNumber ?? "—" },
								{ label: "Model", value: rider.vehicleModel ?? "—" },
								{ label: "Color", value: rider.vehicleColor ?? "—" },
							].map(v => (
								<div key={v.label} className="bg-silver-two rounded-xl p-2.5">
									<div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">{v.label}</div>
									<div className="font-bold text-xs text-foreground truncate">{v.icon ? `${v.icon} ${v.value}` : v.value}</div>
								</div>
							))}
						</div>
					</div>

					{/* Contact */}
					<div>
						<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Contact</p>
						<div className="bg-silver-two rounded-xl p-3 flex items-center gap-3">
							<MaterialIcon name="phone" size={14} color="var(--muted-foreground)" />
							<span className="text-sm font-medium text-foreground">{rider.phoneNumber || rider.telephoneNumber || "—"}</span>
						</div>
					</div>

					{/* Availability */}
					<div>
						<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Availability</p>
						<div className="flex gap-2">
							{(["available", "on_trip", "offline"] as const).map(status => (
								<button
									key={status}
									disabled={isUpdatingAvailability}
									onClick={() => onUpdateAvailability(rider.id, status)}
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
