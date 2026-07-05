import { RiderAvailabilityStatus } from "@/api/types/rider.types"

export type FilterStatus = "ALL" | RiderAvailabilityStatus

export const availabilityConfig: Record<RiderAvailabilityStatus, { label: string; bg: string; text: string; dot: string }> = {
	available: { label: "Available", bg: "bg-secondary/10", text: "text-secondary-two", dot: "bg-secondary" },
	on_trip: { label: "On Delivery", bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
	offline: { label: "Offline", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
}

export const filterOptions: { value: FilterStatus; label: string }[] = [
	{ value: "ALL", label: "All" },
	{ value: "available", label: "Available" },
	{ value: "on_trip", label: "On Delivery" },
	{ value: "offline", label: "Offline" },
]

export function getVehicleIcon(vehicleType: string): string {
	switch (vehicleType) {
		case "bike": return "two_wheeler"
		case "bicycle": return "pedal_bike"
		case "car": return "directions_car"
		case "van": return "local_shipping"
		case "truck": return "local_shipping"
		default: return "two_wheeler"
	}
}

export function formatCurrency(amount: number): string {
	return `₦${amount.toLocaleString()}`
}

export function getRiderName(firstName?: string, lastName?: string): string {
	return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unknown"
}
