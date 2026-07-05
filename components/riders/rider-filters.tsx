import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { FilterStatus, filterOptions } from "./utils"
import { RiderInviteStatus, RiderStatus } from "@/api/types/rider.types"

type Props = {
	search: string
	onSearchChange: (value: string) => void
	filter: FilterStatus
	onFilterChange: (value: FilterStatus) => void
	inviteStatus: RiderInviteStatus | "ALL"
	onInviteStatusChange: (value: RiderInviteStatus | "ALL") => void
	riderStatus: RiderStatus | "ALL"
	onRiderStatusChange: (value: RiderStatus | "ALL") => void
	sortBy: string
	onSortByChange: (value: string) => void
	sortOrder: "asc" | "desc"
	onSortOrderChange: (value: "asc" | "desc") => void
	startDate: string
	onStartDateChange: (value: string) => void
	endDate: string
	onEndDateChange: (value: string) => void
	onClearFilters: () => void
}

const sortOptions = [
	{ value: "", label: "Default" },
	{ value: "firstName", label: "Name" },
	{ value: "createdAt", label: "Date Joined" },
	{ value: "totalDeliveries", label: "Deliveries" },
	{ value: "rating", label: "Rating" },
	{ value: "pendingEarnings", label: "Earnings" },
]

const inviteStatusOptions: { value: RiderInviteStatus | "ALL"; label: string }[] = [
	{ value: "ALL", label: "All" },
	{ value: "pending", label: "Pending" },
	{ value: "accepted", label: "Accepted" },
	{ value: "rejected", label: "Rejected" },
]

const riderStatusOptions: { value: RiderStatus | "ALL"; label: string }[] = [
	{ value: "ALL", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "pending", label: "Pending" },
	{ value: "suspended", label: "Suspended" },
	{ value: "inactive", label: "Inactive" },
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

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
	return (
		<div className="space-y-1.5">
			<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
			<input
				type="date"
				value={value}
				onChange={e => onChange(e.target.value)}
				className="w-full bg-silver-two border-0 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-secondary outline-none cursor-pointer"
			/>
		</div>
	)
}

function ActiveFilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
	return (
		<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
			{label}
			<button onClick={onRemove} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
				<MaterialIcon name="close" size={12} color="currentColor" />
			</button>
		</span>
	)
}

export function RiderFilters({
	search, onSearchChange,
	filter, onFilterChange,
	inviteStatus, onInviteStatusChange,
	riderStatus, onRiderStatusChange,
	sortBy, onSortByChange,
	sortOrder, onSortOrderChange,
	startDate, onStartDateChange,
	endDate, onEndDateChange,
	onClearFilters,
}: Props) {
	const [expanded, setExpanded] = useState(false)

	const activeFilters: { label: string; onRemove: () => void }[] = []
	if (inviteStatus !== "ALL") activeFilters.push({ label: `Invite: ${inviteStatus}`, onRemove: () => onInviteStatusChange("ALL") })
	if (riderStatus !== "ALL") activeFilters.push({ label: `Status: ${riderStatus}`, onRemove: () => onRiderStatusChange("ALL") })
	if (sortBy) activeFilters.push({ label: `Sort: ${sortOptions.find(o => o.value === sortBy)?.label}`, onRemove: () => onSortByChange("") })
	if (startDate) activeFilters.push({ label: `From: ${startDate}`, onRemove: () => onStartDateChange("") })
	if (endDate) activeFilters.push({ label: `To: ${endDate}`, onRemove: () => onEndDateChange("") })

	return (
		<div className="space-y-3">
			{/* Row 1: Search + Availability pills */}
			<div className="flex flex-col gap-3">
				<div className="relative">
					<MaterialIcon name="search" size={18} color="var(--muted-foreground)" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
					<Input
						placeholder="Search riders by name, phone, or vehicle..."
						value={search}
						onChange={e => onSearchChange(e.target.value)}
						className="pl-11 pr-4 bg-silver-two border-0 focus-visible:ring-secondary h-11"
					/>
				</div>
				<div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
					{filterOptions.map(f => (
						<button
							key={f.value}
							onClick={() => onFilterChange(f.value)}
							className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap ${
								filter === f.value
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
						<ActiveFilterBadge key={i} label={f.label} onRemove={f.onRemove} />
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
							{/* Sort */}
							<div className="space-y-3">
								<Select label="Sort by" value={sortBy} onChange={onSortByChange} options={sortOptions} />
								<div className="space-y-1.5">
									<label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Order</label>
								<button
									onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
									className="w-full flex items-center justify-between bg-silver-two rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors border-0 outline-none"
								>
										<span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
										<MaterialIcon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} size={16} color="var(--muted-foreground)" />
									</button>
								</div>
							</div>

							{/* Invite Status */}
							<Select
								label="Invite Status"
								value={inviteStatus}
								onChange={v => onInviteStatusChange(v as RiderInviteStatus | "ALL")}
								options={inviteStatusOptions}
							/>

							{/* Rider Status */}
							<Select
								label="Rider Status"
								value={riderStatus}
								onChange={v => onRiderStatusChange(v as RiderStatus | "ALL")}
								options={riderStatusOptions}
							/>

							{/* Date Range */}
							<div className="space-y-3">
								<DateInput label="Start Date" value={startDate} onChange={onStartDateChange} />
								<DateInput label="End Date" value={endDate} onChange={onEndDateChange} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
