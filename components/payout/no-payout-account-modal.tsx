import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	isOpen: boolean
	onClose: () => void
	onAddAccount: () => void
}

export function NoPayoutAccountModal({ isOpen, onClose, onAddAccount }: Props) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl text-center">
				<div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
					<MaterialIcon name="account_balance" size={28} color="#D97706" />
				</div>
				<h3 className="text-base font-bold text-primary mb-1.5">No Payout Account</h3>
				<p className="text-sm text-muted-foreground mb-6">
					You haven&apos;t added a bank account yet. Add one to withdraw funds and pay riders via the Nomba Transfer API.
				</p>
				<div className="flex gap-3">
					<Button variant="ghost" className="flex-1" onClick={onClose}>Not Now</Button>
					<Button className="flex-1" onClick={onAddAccount}>
						<MaterialIcon name="add" size={14} color="white" />
						Add Bank Account
					</Button>
				</div>
			</div>
		</div>
	)
}
