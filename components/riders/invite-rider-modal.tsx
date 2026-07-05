import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"
import { CreateRiderProfilePayload } from "@/api/types/rider.types"

type Props = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (payload: CreateRiderProfilePayload) => void
	isPending: boolean
}

export function InviteRiderModal({ isOpen, onClose, onSubmit, isPending }: Props) {
	const [name, setName] = useState("")
	const [phone, setPhone] = useState("")
	const [vehicleType, setVehicleType] = useState<CreateRiderProfilePayload["vehicleType"]>("bike")
	const [plateNumber, setPlateNumber] = useState("")
	const [vehicleModel, setVehicleModel] = useState("")

	if (!isOpen) return null

	function handleSubmit() {
		const nameParts = name.trim().split(" ")
		const firstName = nameParts[0] ?? ""
		const lastName = nameParts.slice(1).join(" ") || firstName
		onSubmit({
			telephoneNumber: phone,
			firstName,
			lastName,
			vehicleType,
			vehiclePlateNumber: plateNumber || undefined,
			vehicleModel: vehicleModel || undefined,
		})
	}

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-base font-bold text-primary">Invite Rider</h3>
					<button onClick={onClose}>
						<MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
					</button>
				</div>
				<p className="text-sm text-muted-foreground mb-4">
					Enter the rider&apos;s details. They&apos;ll receive an OTP on WhatsApp to join your fleet.
				</p>
				<div className="space-y-3">
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Full Name</label>
						<Input placeholder="e.g. Chukwuemeka Dike" value={name} onChange={e => setName(e.target.value)} className="bg-silver-two border-0 focus-visible:ring-secondary" />
					</div>
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Phone Number (WhatsApp)</label>
						<Input placeholder="e.g. +2348012345678" value={phone} onChange={e => setPhone(e.target.value)} className="bg-silver-two border-0 focus-visible:ring-secondary" />
					</div>
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Vehicle Type</label>
						<div className="flex gap-2">
							{(["bike", "car", "van", "truck", "bicycle"] as const).map(v => (
								<button key={v} onClick={() => setVehicleType(v)} className={`flex-1 py-2 rounded-lg text-xs font-bold border capitalize transition-colors ${vehicleType === v ? "bg-primary text-white border-primary" : "bg-silver-two border-border text-muted-foreground hover:border-primary/40"}`}>
									{v}
								</button>
							))}
						</div>
					</div>
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Plate Number (optional)</label>
						<Input placeholder="e.g. ABC-123XY" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} className="bg-silver-two border-0 focus-visible:ring-secondary" />
					</div>
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Vehicle Model (optional)</label>
						<Input placeholder="e.g. Boxer" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} className="bg-silver-two border-0 focus-visible:ring-secondary" />
					</div>
					<div className="flex gap-3 pt-2">
						<Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
						<Button className="flex-1" disabled={!name || !phone || isPending} onClick={handleSubmit}>
							<MaterialIcon name="send" size={14} color="white" />
							{isPending ? "Sending..." : "Send Invite"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
