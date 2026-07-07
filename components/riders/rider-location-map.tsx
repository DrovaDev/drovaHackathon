"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { RiderProfile } from "@/services/types/rider.types"
import MaterialIcon from "@/components/ui/material-icon"
import { getRiderName } from "./utils"
import { getVehicleEmoji, getRelativeTime, reverseGeocode, injectPulseKeyframe } from "./modal-helpers"

type Props = { rider: RiderProfile }

export function RiderLocationMap({ rider }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)
	const markerRef = useRef<maplibregl.Marker | null>(null)
	const [address, setAddress] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const coords = rider.lastKnownLocation?.coordinates as [number, number] | undefined
	const hasLocation = !!(coords && coords[0] && coords[1])
	const riderName = getRiderName(rider.firstName, rider.lastName)

	// Reverse geocode
	useEffect(() => {
		if (!hasLocation) { setAddress(null); return }
		let cancelled = false
		setLoading(true)
		reverseGeocode(coords[1], coords[0]).then(a => {
			if (!cancelled) { setAddress(a); setLoading(false) }
		})
		return () => { cancelled = true }
	}, [coords, hasLocation])

	// Initialize map
	useEffect(() => {
		if (!containerRef.current || !hasLocation) return
		injectPulseKeyframe()
		if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null }

		const map = new maplibregl.Map({
			container: containerRef.current,
			style: {
				version: 8,
				sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } },
				layers: [{ id: "osm", type: "raster", source: "osm" }],
			},
			center: coords,
			zoom: 15,
			attributionControl: false,
			interactive: true,
		})
		map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: false }), "top-right")

		// Marker: name label + vehicle icon with pulse
		const wrapper = document.createElement("div")
		wrapper.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:4px"

		const label = document.createElement("div")
		label.style.cssText = "background:var(--primary);color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)"
		label.textContent = riderName

		const iconWrap = document.createElement("div")
		iconWrap.style.cssText = "position:relative;width:36px;height:36px"

		const pulse = document.createElement("div")
		pulse.style.cssText = "position:absolute;width:36px;height:36px;border-radius:50%;border:2px solid var(--primary);animation:rider-pulse 2s ease-out infinite"

		const icon = document.createElement("div")
		icon.style.cssText = "width:36px;height:36px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 12px rgba(0,0,0,0.3);border:3px solid white;position:relative;z-index:1"
		icon.textContent = getVehicleEmoji(rider.vehicleType)

		iconWrap.append(pulse, icon)
		wrapper.append(label, iconWrap)

		markerRef.current = new maplibregl.Marker({ element: wrapper, anchor: "bottom" }).setLngLat(coords).addTo(map)
		mapRef.current = map

		return () => { map.remove(); mapRef.current = null; markerRef.current = null }
	}, [coords, hasLocation, riderName, rider.vehicleType])

	if (!hasLocation) return null

	return (
		<div className="relative">
			<div ref={containerRef} className="h-52 w-full rounded-t-2xl" />
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5 min-w-0">
						<MaterialIcon name="location_on" size={12} color="white" />
						{loading ? (
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
