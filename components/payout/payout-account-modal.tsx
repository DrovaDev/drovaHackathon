import { useEffect, useState } from "react"
import { account } from "@/services/router"
import { Bank, PayoutAccount, PayoutAccountPayload } from "@/services/types/account.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxInputGroup, ComboboxInput, ComboboxPopup, ComboboxList, ComboboxEmpty, ComboboxItem } from "@/components/ui/combobox"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	isOpen: boolean
	account: PayoutAccount | null
	onClose: () => void
	onSubmit: (payload: PayoutAccountPayload) => void
	isPending: boolean
}

const isSameBank = (a: Bank, b: Bank) => a.code === b.code

export function PayoutAccountModal({ isOpen, account: existingAccount, onClose, onSubmit, isPending }: Props) {
	const isEdit = !!existingAccount
	const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
	const [accountNumber, setAccountNumber] = useState("")
	const [accountName, setAccountName] = useState("")

	const { data: banksData, isLoading: banksLoading } = account.getBanks.useQuery({ enabled: isOpen })
	const banks = banksData?.data ?? []

	const resolveMutation = account.resolveBankAccount.useMutation({
		onSuccess: (data) => setAccountName(data?.data?.accountName ?? ""),
		onError: () => setAccountName(""),
	})

	useEffect(() => {
		if (!isOpen) return
		setSelectedBank(
			existingAccount
				? { code: existingAccount.bankCode, name: existingAccount.bankName, nipCode: null, logo: "" }
				: null,
		)
		setAccountNumber(existingAccount?.accountNumber ?? "")
		setAccountName(existingAccount?.accountName ?? "")
	}, [isOpen, existingAccount])

	useEffect(() => {
		if (!isOpen) return
		if (selectedBank?.code && accountNumber.length === 10) {
			resolveMutation.mutate({ bankCode: selectedBank.code, accountNumber })
		} else {
			setAccountName("")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBank, accountNumber, isOpen])

	if (!isOpen) return null

	const canSubmit = !!selectedBank && accountNumber.length === 10 && !!accountName && !resolveMutation.isPending

	function handleSubmit() {
		if (!selectedBank || !accountName) return
		onSubmit({
			bankCode: selectedBank.code,
			bankName: selectedBank.name.trim(),
			accountNumber,
			accountName,
		})
	}

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-base font-bold text-primary">{isEdit ? "Edit Payout Account" : "Add Payout Account"}</h3>
					<button onClick={onClose} className="p-1.5 rounded-lg border-0 outline-none hover:bg-muted transition-colors">
						<MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
					</button>
				</div>

				<div className="flex items-center gap-2 bg-primary/5 rounded-xl p-3 mb-5">
					<MaterialIcon name="verified_user" size={16} color="var(--primary)" />
					<span className="text-xs text-muted-foreground font-medium">Account name is resolved via <strong className="text-primary">Nomba Bank Lookup</strong></span>
				</div>

				<div className="space-y-4">
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Bank</label>
						<Combobox<Bank>
							items={banks}
							value={selectedBank}
							onValueChange={setSelectedBank}
							itemToStringLabel={(b) => b.name.trim()}
							isItemEqualToValue={isSameBank}
						>
							<ComboboxInputGroup>
								<ComboboxInput placeholder={banksLoading ? "Loading banks..." : "Search bank..."} />
							</ComboboxInputGroup>
							<ComboboxPopup>
								<ComboboxEmpty>No banks found</ComboboxEmpty>
								<ComboboxList>
									{(b: Bank) => (
										<ComboboxItem key={b.code} value={b}>{b.name.trim()}</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxPopup>
						</Combobox>
					</div>

					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Account Number</label>
						<Input
							placeholder="10-digit account number"
							maxLength={10}
							value={accountNumber}
							onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ""))}
							className="bg-silver-two border-0 focus-visible:ring-secondary"
						/>
						{resolveMutation.isPending && (
							<div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground font-bold">
								<MaterialIcon name="hourglass_empty" size={14} color="var(--muted-foreground)" />
								Resolving account name...
							</div>
						)}
						{!resolveMutation.isPending && accountName && (
							<div className="mt-2 flex items-center gap-2 text-xs text-secondary-two font-bold">
								<MaterialIcon name="check_circle" size={14} color="var(--secondary)" />
								{accountName}
							</div>
						)}
						{!resolveMutation.isPending && resolveMutation.isError && (
							<div className="mt-2 flex items-center gap-2 text-xs text-red-600 font-bold">
								<MaterialIcon name="error" size={14} color="currentColor" />
								Could not resolve account name
							</div>
						)}
					</div>

					<div className="flex gap-3 pt-2">
						<Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
						<Button className="flex-1" disabled={!canSubmit || isPending} onClick={handleSubmit}>
							{isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Account"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
