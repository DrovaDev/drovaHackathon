import Link from "next/link"
import { BusinessRidersSummary } from "@/services/types/analytics.types"

type Props = {
	data: BusinessRidersSummary | undefined
	isLoading: boolean
}

export function RiderAvailabilityWidget({ data, isLoading }: Props) {
	const total = data?.total ?? 0
	const available = data?.available ?? 0
	const onTrip = data?.onTrip ?? 0
	const offline = data?.offline ?? 0

	const riderStatus = [
		{ label: "Available", count: available, dot: "bg-secondary" },
		{ label: "On Delivery", count: onTrip, dot: "bg-primary" },
		{ label: "Offline", count: offline, dot: "bg-muted-foreground" },
	]

	return (
		<div className="bg-popover rounded-2xl border border-border p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-bold text-primary text-base">Rider Availability</h2>
				<Link href="/dashboard/riders" className="text-xs text-secondary font-semibold hover:underline">Manage</Link>
			</div>

			{isLoading ? (
				<div className="space-y-3 animate-pulse">
					<div className="w-28 h-28 rounded-full bg-muted mx-auto" />
					{[1, 2, 3].map(i => (
						<div key={i} className="flex items-center justify-between">
							<div className="h-4 bg-muted rounded w-20" />
							<div className="h-4 bg-muted rounded w-6" />
						</div>
					))}
				</div>
			) : (
				<>
					<div className="flex items-center justify-center mb-4">
						<div className="relative w-28 h-28">
							<svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
								<circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10" />
								{total > 0 && (
									<>
										<circle cx="50" cy="50" r="40" fill="none" stroke="var(--secondary)" strokeWidth="10"
											strokeDasharray={`${(available / total) * 251} 251`} strokeLinecap="round" />
										<circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="10"
											strokeDasharray={`${(onTrip / total) * 251} 251`} strokeDashoffset={`-${(available / total) * 251}`} strokeLinecap="round" />
									</>
								)}
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-2xl font-extrabold text-primary">{total}</span>
								<span className="text-xs text-muted-foreground">Riders</span>
							</div>
						</div>
					</div>
					<div className="space-y-2">
						{riderStatus.map((r) => (
							<div key={r.label} className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<span className={`w-2.5 h-2.5 rounded-full ${r.dot}`} />
									<span className="text-muted-foreground">{r.label}</span>
								</div>
								<span className="font-bold text-foreground">{r.count}</span>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
