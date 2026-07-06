import { RevenueBreakdown } from "@/services/types/analytics.types"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	data: RevenueBreakdown | undefined
	isLoading: boolean
}

function formatNaira(amount: number): string {
	return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount ?? 0)
}

function DonutSegment({ value, total, color, offset }: { value: number; total: number; color: string; offset: number }) {
	if (total === 0 || value === 0) return null
	const circumference = 251
	const dash = (value / total) * circumference
	return (
		<circle
			cx="50" cy="50" r="40"
			fill="none"
			stroke={color}
			strokeWidth="12"
			strokeDasharray={`${dash} ${circumference}`}
			strokeDashoffset={-offset}
			strokeLinecap="round"
		/>
	)
}

export function RevenueWidget({ data, isLoading }: Props) {
	const gross = data?.grossRevenue ?? 0
	const collected = data?.collected ?? 0
	const escrow = data?.inEscrow ?? 0
	const platformFees = data?.platformCommission ?? 0
	const nombaFees = data?.nombaFees ?? 0
	const net = data?.netPayout ?? 0

	const total = collected + escrow + platformFees + nombaFees
	const circumference = 251
	let offset = 0

	const segments = [
		{ label: "Collected", value: collected, color: "var(--secondary)" },
		{ label: "In Escrow", value: escrow, color: "var(--primary)" },
		{ label: "Platform Fees", value: platformFees, color: "#F59E0B" },
		{ label: "Nomba Fees", value: nombaFees, color: "#EF4444" },
	]

	return (
		<div className="bg-popover rounded-2xl border border-border p-6">
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-bold text-primary text-base">Revenue Breakdown</h2>
				<div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
					<MaterialIcon name="payments" size={20} color="white" />
				</div>
			</div>

			{isLoading ? (
				<div className="space-y-4 animate-pulse">
					<div className="w-32 h-32 rounded-full bg-muted mx-auto" />
					{[1, 2, 3, 4].map(i => (
						<div key={i} className="flex items-center justify-between">
							<div className="h-3 bg-muted rounded w-20" />
							<div className="h-3 bg-muted rounded w-16" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center gap-5">
					{/* Donut chart */}
					<div className="relative w-36 h-36">
						<svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
							<circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="12" />
							{segments.map((seg) => {
								const segOffset = offset
								offset += (seg.value / total) * circumference
								return (
									<DonutSegment
										key={seg.label}
										value={seg.value}
										total={total}
										color={seg.color}
										offset={segOffset}
									/>
								)
							})}
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center">
							<span className="text-lg font-extrabold text-primary">{formatNaira(net)}</span>
							<span className="text-[10px] text-muted-foreground uppercase tracking-wide">Net Payout</span>
						</div>
					</div>

					{/* Legend */}
					<div className="w-full space-y-2.5">
						{segments.map(seg => (
							<div key={seg.label} className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
									<span className="text-muted-foreground">{seg.label}</span>
								</div>
								<span className="font-bold text-foreground">{formatNaira(seg.value)}</span>
							</div>
						))}
						<div className="flex items-center justify-between text-sm pt-2.5 border-t border-border">
							<div className="flex items-center gap-2">
								<span className="w-2.5 h-2.5 rounded-full shrink-0 bg-muted-foreground" />
								<span className="text-muted-foreground">Gross Revenue</span>
							</div>
							<span className="font-bold text-foreground">{formatNaira(gross)}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
