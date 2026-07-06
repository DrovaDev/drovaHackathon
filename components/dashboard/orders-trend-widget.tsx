"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getBusinessOrdersTrend } from "@/api/analytics"
import { AnalyticsGranularity, OrdersTrendBucket } from "@/api/types/analytics.types"
import MaterialIcon from "@/components/ui/material-icon"

type Granularity = AnalyticsGranularity

const GRANULARITY_OPTIONS: { value: Granularity; label: string }[] = [
	{ value: "day", label: "Daily" },
	{ value: "week", label: "Weekly" },
	{ value: "month", label: "Monthly" },
]

function BarChart({ data }: { data: OrdersTrendBucket[] }) {
	if (!data.length) {
		return (
			<div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
				No trend data available
			</div>
		)
	}

	const maxVal = Math.max(...data.map(d => d.total), 1)

	return (
		<div className="flex items-end gap-1.5 h-40 px-1">
			{data.map((bucket, i) => {
				const completedHeight = (bucket.completed / maxVal) * 100
				const cancelledHeight = (bucket.cancelled / maxVal) * 100
				return (
					<div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
						<div className="w-full flex flex-col items-center justify-end h-36 gap-px">
							{bucket.cancelled > 0 && (
								<div
									className="w-full max-w-[24px] rounded-t-sm bg-red-400 transition-all"
									style={{ height: `${cancelledHeight}%` }}
									title={`Cancelled: ${bucket.cancelled}`}
								/>
							)}
							{bucket.completed > 0 && (
								<div
									className="w-full max-w-[24px] rounded-t-sm bg-secondary transition-all"
									style={{ height: `${completedHeight}%` }}
									title={`Completed: ${bucket.completed}`}
								/>
							)}
							{bucket.total === 0 && <div className="w-full max-w-[24px] h-1 bg-border rounded-t-sm" />}
						</div>
						<span className="text-[9px] text-muted-foreground truncate w-full text-center">
							{bucket.period}
						</span>
					</div>
				)
			})}
		</div>
	)
}

export function OrdersTrendWidget() {
	const [granularity, setGranularity] = useState<Granularity>("day")

	const { data, isLoading } = useQuery({
		queryKey: ["analytics", "businessOrdersTrend", granularity],
		queryFn: () => getBusinessOrdersTrend({ granularity }),
	})

	const trendData = data?.data ?? []
	const totalCompleted = trendData.reduce((sum, d) => sum + (d.completed ?? 0), 0)
	const totalCancelled = trendData.reduce((sum, d) => sum + (d.cancelled ?? 0), 0)
	const totalOrders = trendData.reduce((sum, d) => sum + (d.total ?? 0), 0)

	return (
		<div className="bg-popover rounded-2xl border border-border p-6">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="font-bold text-primary text-base">Orders Trend</h2>
					<p className="text-xs text-muted-foreground mt-0.5">
						{totalOrders} total · {totalCompleted} completed · {totalCancelled} cancelled
					</p>
				</div>
				<div className="flex gap-1 bg-silver-two rounded-lg p-0.5">
					{GRANULARITY_OPTIONS.map(opt => (
						<button
							key={opt.value}
							onClick={() => setGranularity(opt.value)}
							className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-colors ${
								granularity === opt.value
									? "bg-primary text-white"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>

			{/* Legend */}
			<div className="flex items-center gap-4 mb-3">
				<div className="flex items-center gap-1.5">
					<span className="w-2 h-2 rounded-full bg-secondary" />
					<span className="text-[10px] text-muted-foreground font-medium">Completed</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="w-2 h-2 rounded-full bg-red-400" />
					<span className="text-[10px] text-muted-foreground font-medium">Cancelled</span>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-end gap-1.5 h-40 animate-pulse">
					{[1, 2, 3, 4, 5, 6, 7].map(i => (
						<div key={i} className="flex-1 flex flex-col items-center justify-end h-36">
							<div className="w-full max-w-[24px] bg-muted rounded-t-sm" style={{ height: `${30 + Math.random() * 50}%` }} />
						</div>
					))}
				</div>
			) : (
				<BarChart data={trendData} />
			)}
		</div>
	)
}
