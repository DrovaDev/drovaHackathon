import { OrderTrackingData } from "@/services/types/tracking.types"
import MaterialIcon from "@/components/ui/material-icon"

type Props = { data: OrderTrackingData }

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
	pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", icon: "hourglass_empty" },
	quotation: { label: "Quotation", bg: "bg-amber-100", text: "text-amber-700", icon: "request_quote" },
	invoiced: { label: "Awaiting Payment", bg: "bg-blue-100", text: "text-blue-700", icon: "receipt" },
	payment_confirmed: { label: "Payment Confirmed", bg: "bg-secondary/10", text: "text-secondary-two", icon: "payments" },
	offer_pending: { label: "Finding Rider", bg: "bg-primary/10", text: "text-primary", icon: "person_search" },
	assigned: { label: "Rider Assigned", bg: "bg-primary/10", text: "text-primary", icon: "assignment_ind" },
	en_route_pickup: { label: "En Route to Pickup", bg: "bg-primary/10", text: "text-primary", icon: "directions_bike" },
	picked_up: { label: "Picked Up", bg: "bg-primary/10", text: "text-primary", icon: "inventory_2" },
	in_transit: { label: "In Transit", bg: "bg-primary/10", text: "text-primary", icon: "local_shipping" },
	arrived_at_delivery: { label: "Arrived at Delivery", bg: "bg-secondary/10", text: "text-secondary-two", icon: "location_on" },
	completed: { label: "Delivered", bg: "bg-secondary/10", text: "text-secondary-two", icon: "task_alt" },
	disputed: { label: "Disputed", bg: "bg-red-100", text: "text-red-600", icon: "flag" },
	cancelled: { label: "Cancelled", bg: "bg-gray-100", text: "text-gray-500", icon: "cancel" },
}

export function TrackingStatusHeader({ data }: Props) {
	const cfg = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.pending

	return (
		<div className="text-center">
			<div className={`w-16 h-16 rounded-full ${cfg.bg} flex items-center justify-center mx-auto mb-3`}>
				<MaterialIcon name={cfg.icon} size={32} color={data.status === "completed" ? "var(--secondary)" : "var(--primary)"} />
			</div>
			<h1 className="text-xl font-extrabold text-primary mb-1">{cfg.label}</h1>
			<p className="text-sm text-muted-foreground">
				Order <span className="font-mono font-bold text-foreground">{data.referenceCode}</span>
			</p>
			<p className="text-xs text-muted-foreground mt-1">{data.business.name}</p>
		</div>
	)
}
