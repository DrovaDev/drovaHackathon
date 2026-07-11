import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	isOpen: boolean
	onClose: () => void
	onSetPin: () => void
}

export function SetPinPromptModal({ isOpen, onClose, onSetPin }: Props) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl text-center">
				<div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
					<MaterialIcon name="lock" size={28} color="#D97706" />
				</div>
				<h3 className="text-base font-bold text-primary mb-1.5">Set Your Payout PIN</h3>
				<p className="text-sm text-muted-foreground mb-6">
					You need to set up a payout PIN before you can withdraw funds. This keeps your wallet secure.
				</p>
				<div className="flex gap-3">
					<Button variant="ghost" className="flex-1" onClick={onClose}>Not Now</Button>
					<Button className="flex-1" onClick={onSetPin}>
						<MaterialIcon name="lock" size={14} color="white" />
						Set Pin
					</Button>
				</div>
			</div>
		</div>
	)
}
