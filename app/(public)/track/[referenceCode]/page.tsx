"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { trackOrder } from "@/services/tracking"
import Link from "next/link"
import MaterialIcon from "@/components/ui/material-icon"
import { TrackingStatusHeader, TrackingTimeline, TrackingRouteInfo } from "@/components/tracking"

const POLL_INTERVAL = 30000

export default function TrackOrderPage({ params }: { params: Promise<{ referenceCode: string }> }) {
	const { referenceCode } = use(params)

	const { data, isLoading, isError } = useQuery({
		queryKey: ["tracking", referenceCode],
		queryFn: () => trackOrder(referenceCode),
		refetchInterval: (query) => {
			const status = query.state.data?.data?.status
			if (status === "completed" || status === "cancelled" || status === "disputed") return false
			return POLL_INTERVAL
		},
	})

	const order = data?.data

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
			{/* Header */}
			<div className="bg-popover border-b border-border">
				<div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
							<MaterialIcon name="local_shipping" size={18} color="white" />
						</div>
						<span className="font-extrabold text-primary text-sm">Drova</span>
					</Link>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-lg mx-auto px-4 py-8">
				{isLoading && (
					<div className="space-y-6 animate-pulse">
						<div className="text-center space-y-3">
							<div className="w-16 h-16 rounded-full bg-muted mx-auto" />
							<div className="h-5 bg-muted rounded w-32 mx-auto" />
							<div className="h-4 bg-muted rounded w-48 mx-auto" />
						</div>
						<div className="bg-popover rounded-2xl border border-border p-6 space-y-4">
							{[1, 2, 3, 4].map(i => (
								<div key={i} className="flex gap-4">
									<div className="w-10 h-10 rounded-full bg-muted shrink-0" />
									<div className="flex-1 space-y-2 pt-2">
										<div className="h-4 bg-muted rounded w-2/3" />
										<div className="h-3 bg-muted rounded w-1/2" />
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{isError && (
					<div className="text-center py-16">
						<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
							<MaterialIcon name="search_off" size={32} color="#EF4444" />
						</div>
						<h2 className="text-lg font-bold text-foreground mb-1">Order Not Found</h2>
						<p className="text-sm text-muted-foreground">
							We couldn&apos;t find an order with reference <span className="font-mono font-bold">{referenceCode}</span>
						</p>
					</div>
				)}

				{order && (
					<div className="space-y-6">
						<TrackingStatusHeader data={order} />

						<div className="bg-popover rounded-2xl border border-border p-6">
							<h2 className="font-bold text-primary text-sm mb-4">Tracking Timeline</h2>
							<TrackingTimeline events={order.timeline} />
						</div>

						<div className="bg-popover rounded-2xl border border-border p-6">
							<h2 className="font-bold text-primary text-sm mb-4">Route</h2>
							<TrackingRouteInfo data={order} />
						</div>

						{order.status === "completed" && (
							<div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 text-center">
								<MaterialIcon name="task_alt" size={32} color="var(--secondary)" />
								<p className="font-bold text-foreground mt-2">Delivery Confirmed</p>
								<p className="text-xs text-muted-foreground mt-1">Your package has been delivered successfully</p>
							</div>
						)}

						{order.cancellationReason && (
							<div className="bg-red-50 border border-red-200 rounded-2xl p-5">
								<div className="flex items-center gap-2 mb-2">
									<MaterialIcon name="info" size={16} color="#EF4444" />
									<span className="font-bold text-red-700 text-sm">Cancellation Reason</span>
								</div>
								<p className="text-sm text-red-600">{order.cancellationReason}</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="max-w-lg mx-auto px-4 py-6 text-center">
				<p className="text-xs text-muted-foreground">
					Powered by <span className="font-bold text-primary">Drova</span> Logistics
				</p>
			</div>
		</div>
	)
}
