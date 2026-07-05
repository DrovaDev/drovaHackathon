import { useState, useEffect } from "react"
import { RiderProfile, UpdateRiderProfilePayload } from "@/api/types/rider.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	rider: RiderProfile | null
	onClose: () => void
	onSubmit: (payload: UpdateRiderProfilePayload & { riderId: string }) => void
	isPending: boolean
}

const vehicleTypes = ["bike", "car", "van", "truck", "bicycle"] as const

export function EditRiderModal({ rider, onClose, onSubmit, isPending }: Props) {
	const [form, setForm] = useState<UpdateRiderProfilePayload>({})

	useEffect(() => {
		if (rider) {
			setForm({
				firstName: rider.firstName ?? "",
				lastName: rider.lastName ?? "",
				otherName: rider.otherName ?? "",
				telephoneNumber: rider.telephoneNumber ?? "",
				vehicleType: rider.vehicleType,
				vehiclePlateNumber: rider.vehiclePlateNumber ?? "",
				vehicleModel: rider.vehicleModel ?? "",
				vehicleColor: rider.vehicleColor ?? "",
			})
		}
	}, [rider?.id])

	if (!rider) return null

	function handleSubmit() {
		if (!rider) return
		onSubmit({ ...form, riderId: rider.id })
	}

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
					<h3 className="text-base font-bold text-primary">Edit Rider Profile</h3>
					<button onClick={onClose} className="p-1.5 rounded-lg border-0 outline-none hover:bg-muted transition-colors">
						<MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
					</button>
				</div>

				{/* Rider info banner */}
				<div className="px-6 py-3 bg-silver-two/50 border-b border-border shrink-0">
					<p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Editing</p>
					<p className="font-bold text-foreground">{rider.firstName} {rider.lastName}</p>
				</div>

				{/* Scrollable form */}
				<div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">First Name</label>
							<Input value={form.firstName ?? ""} onChange={e => setForm({ ...form, firstName: e.target.value })} className="bg-silver-two border-0 focus-visible:ring-secondary" />
						</div>
						<div>
							<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Last Name</label>
							<Input value={form.lastName ?? ""} onChange={e => setForm({ ...form, lastName: e.target.value })} className="bg-silver-two border-0 focus-visible:ring-secondary" />
						</div>
					</div>

					<div>
						<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Phone Number (WhatsApp)</label>
						<Input value={form.telephoneNumber ?? ""} onChange={e => setForm({ ...form, telephoneNumber: e.target.value })} className="bg-silver-two border-0 focus-visible:ring-secondary" />
					</div>

					<div>
						<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Vehicle Type</label>
						<div className="flex gap-2 flex-wrap">
							{vehicleTypes.map(v => (
								<button
									key={v}
									onClick={() => setForm({ ...form, vehicleType: v })}
									className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
										form.vehicleType === v
											? "bg-primary text-white border-primary shadow-sm"
											: "bg-silver-two border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
									}`}
								>
									{v}
								</button>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Plate Number</label>
							<Input value={form.vehiclePlateNumber ?? ""} onChange={e => setForm({ ...form, vehiclePlateNumber: e.target.value })} className="bg-silver-two border-0 focus-visible:ring-secondary" />
						</div>
						<div>
							<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Vehicle Model</label>
							<Input value={form.vehicleModel ?? ""} onChange={e => setForm({ ...form, vehicleModel: e.target.value })} className="bg-silver-two border-0 focus-visible:ring-secondary" />
						</div>
					</div>

					<div>
						<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Vehicle Color</label>
						<Input value={form.vehicleColor ?? ""} onChange={e => setForm({ ...form, vehicleColor: e.target.value })} className="bg-silver-two border-0 focus-visible:ring-secondary" />
					</div>
				</div>

				{/* Sticky footer */}
				<div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
					<Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
					<Button className="flex-1" disabled={isPending} onClick={handleSubmit}>
						<MaterialIcon name="save" size={14} color="white" />
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>
		</div>
	)
}
