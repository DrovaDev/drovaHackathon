import { RiderProfile } from "@/services/types/rider.types"
import { RiderCard } from "./rider-card"

type Props = {
	riders: RiderProfile[]
	isLoading: boolean
	onRiderClick: (rider: RiderProfile) => void
}

export function RiderGrid({ riders, isLoading, onRiderClick }: Props) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map(i => (
					<div key={i} className="bg-popover rounded-2xl border border-border p-5 animate-pulse">
						<div className="flex items-start justify-between mb-4">
							<div className="w-12 h-12 rounded-full bg-muted" />
							<div className="w-16 h-5 rounded-full bg-muted" />
						</div>
						<div className="h-4 bg-muted rounded w-2/3 mb-2" />
						<div className="h-3 bg-muted rounded w-1/2 mb-3" />
						<div className="h-3 bg-muted rounded w-1/3 mb-3" />
						<div className="h-3 bg-muted rounded w-1/4" />
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{riders.map(rider => (
				<RiderCard key={rider.id} rider={rider} onClick={() => onRiderClick(rider)} />
			))}

			{riders.length === 0 && (
				<div className="col-span-full text-center py-16 text-muted-foreground text-sm">
					No riders found matching your search
				</div>
			)}
		</div>
	)
}
