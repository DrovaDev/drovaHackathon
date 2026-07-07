import { OrderTrackingData } from "@/services/types/tracking.types"
import MaterialIcon from "@/components/ui/material-icon"

type Props = { data: OrderTrackingData }

export function TrackingRouteInfo({ data }: Props) {
	return (
		<div className="bg-silver-two rounded-2xl p-4 space-y-3">
			<div className="flex items-start gap-3">
				<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
					<MaterialIcon name="circle" size={10} color="var(--primary)" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pickup</div>
					<div className="text-sm font-semibold text-foreground mt-0.5">{data.pickup.address}</div>
					{data.pickup.city && (
						<div className="text-xs text-muted-foreground mt-0.5">{data.pickup.city}, {data.pickup.state}</div>
					)}
				</div>
			</div>

			<div className="flex items-center gap-3 pl-4">
				<div className="w-0.5 h-4 bg-border" />
			</div>

			<div className="flex items-start gap-3">
				<div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
					<MaterialIcon name="flag" size={10} color="var(--secondary)" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivery</div>
					<div className="text-sm font-semibold text-foreground mt-0.5">{data.delivery.address}</div>
				</div>
			</div>
		</div>
	)
}
