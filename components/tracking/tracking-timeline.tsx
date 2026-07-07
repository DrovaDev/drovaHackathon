import { TrackingTimelineEvent } from "@/services/types/tracking.types"
import MaterialIcon from "@/components/ui/material-icon"

type Props = { events: TrackingTimelineEvent[] }

function formatTime(timestamp: string): string {
	const date = new Date(timestamp)
	return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" }) + " at " +
		date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
}

const EVENT_ICONS: Record<string, string> = {
	order_placed: "receipt_long",
	invoice_sent: "description",
	payment_confirmed: "payments",
	rider_assigned: "assignment_ind",
	en_route_pickup: "directions_bike",
	picked_up: "inventory_2",
	in_transit: "local_shipping",
	arrived_at_delivery: "location_on",
	completed: "task_alt",
	cancelled: "cancel",
}

export function TrackingTimeline({ events }: Props) {
	if (!events.length) return null

	const completedEvents = events.filter(e => e.event !== "cancelled")
	const isCancelled = events.some(e => e.event === "cancelled")
	const lastEvent = completedEvents[completedEvents.length - 1]
	const isComplete = lastEvent?.event === "completed"

	return (
		<div className="space-y-0">
			{completedEvents.map((event, i) => {
				const isLast = i === completedEvents.length - 1
				const isActive = isLast && !isComplete
				const icon = EVENT_ICONS[event.event] ?? "circle"

				return (
					<div key={event.event} className="flex gap-4">
						{/* Timeline line + dot */}
						<div className="flex flex-col items-center">
							<div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
								isLast ? "bg-primary text-white" : "bg-secondary/10"
							}`}>
								<MaterialIcon name={icon} size={18} color={isLast ? "white" : "var(--secondary)"} />
							</div>
							{i < completedEvents.length - 1 && (
								<div className={`w-0.5 flex-1 min-h-[40px] ${isComplete || i < completedEvents.length - 2 ? "bg-secondary/30" : "bg-border"}`} />
							)}
						</div>

						{/* Content */}
						<div className={`pb-6 pt-2 ${isLast ? "" : ""}`}>
							<div className="font-bold text-sm text-foreground">{event.label}</div>
							<div className="text-xs text-muted-foreground mt-0.5">{formatTime(event.timestamp)}</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
