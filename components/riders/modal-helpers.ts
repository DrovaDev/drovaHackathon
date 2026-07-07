import { RiderProfile } from "@/services/types/rider.types"

export function getVehicleEmoji(type: string | null): string {
	return { bike: "🏍️", bicycle: "🚲", car: "🚗", van: "🚐", truck: "🚚" }[type ?? ""] ?? "🏍️"
}

export function getRelativeTime(dateString: string | null | undefined): string {
	if (!dateString) return "No location data"
	const diffMs = Date.now() - new Date(dateString).getTime()
	const mins = Math.floor(diffMs / 60000)
	if (mins < 1) return "Just now"
	if (mins < 60) return `${mins}m ago`
	const hrs = Math.floor(mins / 60)
	if (hrs < 24) return `${hrs}h ago`
	return `${Math.floor(hrs / 24)}d ago`
}

export function formatJoinedDate(dateString: string | undefined): string {
	if (!dateString) return "—"
	const d = new Date(dateString)
	return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function hasRiderLocation(rider: RiderProfile): boolean {
	const coords = rider.lastKnownLocation?.coordinates
	return !!(coords && coords[0] && coords[1])
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
			{ headers: { "User-Agent": "DrovaDashboard/1.0" } }
		)
		const data = await res.json()
		if (data?.display_name) {
			return data.display_name.split(", ").slice(0, 3).join(", ")
		}
	} catch {}
	return `${lat.toFixed(5)}, ${lon.toFixed(5)}`
}

let pulseInjected = false
export function injectPulseKeyframe() {
	if (pulseInjected || typeof document === "undefined") return
	const s = document.createElement("style")
	s.textContent = `@keyframes rider-pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.5);opacity:0}}`
	document.head.appendChild(s)
	pulseInjected = true
}
