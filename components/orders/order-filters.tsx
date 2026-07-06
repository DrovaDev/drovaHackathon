import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { OrderStatusFilter, OrderPaymentStatus, OrderPickupMethod, OrderDeliveryPriority, SortOrder } from "@/api/types/order.types"

type Props = {
	// Search
	search: string
	onSearchChange: (v: string) => void
	// Status
	status: OrderStatusFilter
	onStatusChange: (v: OrderStatusFilter) => void
	// Sort
	sortOrder: SortOrder
	onSortOrderChange: (v: SortOrder) => void
	// Payment
	paymentStatus: "all" | OrderPaymentStatus
	onPaymentStatusChange: (v: "all" | OrderPaymentStatus) => void
	// Pickup
	pickupMethod: "all" | OrderPickupMethod
	onPickupMethodChange: (v: "all" | OrderPickupMethod) => void
	// Priority
	deliveryPriority: "all" | OrderDeliveryPriority
	onDeliveryPriorityChange: (v: "all" | OrderDeliveryPriority) => void
	// Dates
	startDate: string
	onStartDateChange: (v: string) => void
	endDate: string
	onEndDateChange: (v: string) => void
	// Actions
	onClearFilters: () => void
}

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "payment_confirmed", label: "Confirmed" },
	{ value: "assigned", label: "Assigned" },
	{ value: "in_transit", label: "In Transit" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
]

const PAYMENT_OPTIONS: { value: "all" | OrderPaymentStatus; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "pending", label: "Pending" },
	{ value: "held", label: "Held" },
	{ value: "released", label: "Released" },
	{ value: "refunded", label: "Refunded" },
	{ value: "failed", label: "Failed" },
]

const PICKUP_OPTIONS: { value: "all" | OrderPickupMethod; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "business_pickup", label: "Business Pickup" },
	{ value: "walk_in", label: "Walk-in" },
]

const PRIORITY_OPTIONS: { value: "all" | OrderDeliveryPriority; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "express", label: "Express" },
	{ value: "scheduled", label: "Scheduled" },
]

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
	return (
		<div className="space-y-1.5">
			<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
			<select
				value={value}
				onChange={e => onChange(e.target.value)}
				className="w-full bg-silver-two border-0 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-secondary outline-none cursor-pointer appearance-none"
				style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
			>
				{options.map(opt => (
					<option key={opt.value} value={opt.value}>{opt.label}</option>
				))}
			</select>
		</div>
	)
}

export function OrderFilters({
	search, onSearchChange,
	status, onStatusChange,
	sortOrder, onSortOrderChange,
	paymentStatus, onPaymentStatusChange,
	pickupMethod, onPickupMethodChange,
	deliveryPriority, onDeliveryPriorityChange,
	startDate, onStartDateChange,
	endDate, onEndDateChange,
	onClearFilters,
}: Props) {
	const [expanded, setExpanded] = useState(false)

	const activeFilters: { label: string; onRemove: () => void }[] = []
	if (status !== "all") activeFilters.push({ label: `Status: ${status}`, onRemove: () => onStatusChange("all") })
	if (paymentStatus !== "all") activeFilters.push({ label: `Payment: ${paymentStatus}`, onRemove: () => onPaymentStatusChange("all") })
	if (pickupMethod !== "all") activeFilters.push({ label: `Pickup: ${pickupMethod}`, onRemove: () => onPickupMethodChange("all") })
	if (deliveryPriority !== "all") activeFilters.push({ label: `Priority: ${deliveryPriority}`, onRemove: () => onDeliveryPriorityChange("all") })
	if (startDate) activeFilters.push({ label: `From: ${startDate}`, onRemove: () => onStartDateChange("") })
	if (endDate) activeFilters.push({ label: `To: ${endDate}`, onRemove: () => onEndDateChange("") })

	return (
		<div className="space-y-3">
			{/* Row 1: Search + Status pills */}
			<div className="flex flex-col gap-3">
				<div className="relative">
					<MaterialIcon name="search" size={18} color="var(--muted-foreground)" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
					<Input
						placeholder="Search orders by reference, sender, or rider..."
						value={search}
						onChange={e => onSearchChange(e.target.value)}
						className="pl-11 pr-4 bg-silver-two border-0 focus-visible:ring-secondary h-11"
					/>
				</div>
				<div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
					{STATUS_OPTIONS.map(f => (
						<button
							key={f.value}
							onClick={() => onStatusChange(f.value)}
							className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap ${
								status === f.value
									? "bg-primary text-white border-primary shadow-sm"
									: "bg-popover text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
							}`}
						>
							{f.label}
						</button>
					))}
					<div className="w-px h-6 bg-border mx-1 shrink-0" />
					<button
						onClick={() => setExpanded(!expanded)}
						className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
							expanded || activeFilters.length > 0
								? "bg-primary/10 text-primary border-primary/30"
								: "bg-popover text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
						}`}
					>
						<MaterialIcon name="tune" size={14} />
						Filters
						{activeFilters.length > 0 && (
							<span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
								{activeFilters.length}
							</span>
						)}
						<MaterialIcon name={expanded ? "expand_less" : "expand_more"} size={14} />
					</button>
				</div>
			</div>

			{/* Active filter badges */}
			{activeFilters.length > 0 && !expanded && (
				<div className="flex items-center gap-2 flex-wrap">
					{activeFilters.map((f, i) => (
						<span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
							{f.label}
							<button onClick={f.onRemove} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
								<MaterialIcon name="close" size={12} color="currentColor" />
							</button>
						</span>
					))}
					<button onClick={onClearFilters} className="text-[11px] text-muted-foreground hover:text-foreground font-medium underline underline-offset-2">
						Clear all
					</button>
				</div>
			)}

			{/* Expanded panel */}
			{expanded && (
				<div className="bg-popover rounded-2xl border border-border overflow-hidden">
					<div className="flex items-center justify-between px-5 py-3 border-b border-border bg-silver-two/50">
						<h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Advanced Filters</h3>
						{activeFilters.length > 0 && (
							<button onClick={onClearFilters} className="text-xs text-primary font-semibold hover:underline">
								Clear all
							</button>
						)}
					</div>
					<div className="p-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<Select label="Sort By" value={sortOrder} onChange={v => onSortOrderChange(v as SortOrder)} options={[
								{ value: "desc", label: "Newest First" },
								{ value: "asc", label: "Oldest First" },
							]} />
							<Select label="Payment Status" value={paymentStatus} onChange={v => onPaymentStatusChange(v as "all" | OrderPaymentStatus)} options={PAYMENT_OPTIONS} />
							<Select label="Pickup Method" value={pickupMethod} onChange={v => onPickupMethodChange(v as "all" | OrderPickupMethod)} options={PICKUP_OPTIONS} />
							<Select label="Delivery Priority" value={deliveryPriority} onChange={v => onDeliveryPriorityChange(v as "all" | OrderDeliveryPriority)} options={PRIORITY_OPTIONS} />
							<div className="space-y-1.5">
								<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
								<input type="date" value={startDate} onChange={e => onStartDateChange(e.target.value)} className="w-full bg-silver-two border-0 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-secondary outline-none cursor-pointer" />
							</div>
							<div className="space-y-1.5">
								<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
								<input type="date" value={endDate} onChange={e => onEndDateChange(e.target.value)} className="w-full bg-silver-two border-0 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-secondary outline-none cursor-pointer" />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
