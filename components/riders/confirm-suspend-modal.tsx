import { RiderProfile } from "@/api/types/rider.types"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { getRiderName } from "./utils"

type Props = {
	rider: RiderProfile | null
	onClose: () => void
	onConfirm: () => void
	isPending: boolean
}

export function ConfirmSuspendModal({ rider, onClose, onConfirm, isPending }: Props) {
	if (!rider) return null

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-base font-bold text-destructive">Suspend Rider</h3>
					<button onClick={onClose} className="p-1.5 rounded-lg border-0 outline-none hover:bg-muted transition-colors">
						<MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
					</button>
				</div>
				<p className="text-sm text-muted-foreground mb-5">
					Are you sure you want to suspend <span className="font-bold text-foreground">{getRiderName(rider.firstName, rider.lastName)}</span>? They will no longer be able to accept deliveries.
				</p>
				<div className="flex gap-3">
					<Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
					<Button variant="destructive" className="flex-1" disabled={isPending} onClick={onConfirm}>
						{isPending ? "Suspending..." : "Suspend Rider"}
					</Button>
				</div>
			</div>
		</div>
	)
}
