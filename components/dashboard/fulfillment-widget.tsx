import { FulfillmentMetrics } from "@/api/types/analytics.types"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	data: FulfillmentMetrics | undefined
	isLoading: boolean
}

function formatMinutes(minutes: number): string {
	if (!minutes && minutes !== 0) return "—"
	if (minutes < 60) return `${Math.round(minutes)}m`
	const hrs = Math.floor(minutes / 60)
	const mins = Math.round(minutes % 60)
	return `${hrs}h ${mins}m`
}

export function FulfillmentWidget({ data, isLoading }: Props) {
	const metrics = [
		{ label: "Confirm → Assign", value: data?.avgConfirmToAssignMins, icon: "assignment_ind" },
		{ label: "Assign → Pickup", value: data?.avgAssignToPickupMins, icon: "inventory_2" },
		{ label: "Pickup → Complete", value: data?.avgPickupToCompleteMins, icon: "task_alt" },
		{ label: "End to End", value: data?.avgTotalDeliveryMins, icon: "schedule", highlighted: true },
	]

	return (
		<div className="bg-popover rounded-2xl border border-border p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-bold text-primary text-base">Fulfillment Speed</h2>
				<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
					<MaterialIcon name="speed" size={20} color="var(--primary)" />
				</div>
			</div>

			{isLoading ? (
				<div className="space-y-3 animate-pulse">
					{[1, 2, 3, 4].map(i => (
						<div key={i} className="flex items-center justify-between">
							<div className="h-4 bg-muted rounded w-28" />
							<div className="h-4 bg-muted rounded w-12" />
						</div>
					))}
				</div>
			) : (
				<div className="space-y-3">
					{metrics.map(m => (
						<div key={m.label} className={`flex items-center justify-between text-sm ${m.highlighted ? "pt-3 border-t border-border" : ""}`}>
							<div className="flex items-center gap-2">
								<MaterialIcon name={m.icon} size={14} color="var(--muted-foreground)" />
								<span className="text-muted-foreground">{m.label}</span>
							</div>
							<span className={`font-bold ${m.highlighted ? "text-primary text-base" : "text-foreground"}`}>
								{formatMinutes(m.value ?? 0)}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
