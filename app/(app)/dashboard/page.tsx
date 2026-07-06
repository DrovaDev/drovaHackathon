"use client"

import { useQuery } from "@tanstack/react-query"
import { getBusinessSummary, getBusinessRidersSummary, getBusinessRevenueBreakdown, getBusinessOrdersFulfillment } from "@/services/analytics"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import Link from "next/link"
import { StatCards, StatCard, RiderAvailabilityWidget, QuickActions, RevenueWidget, FulfillmentWidget, OrdersTrendWidget } from "@/components/dashboard"

function formatNaira(amount: number): string {
	return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount ?? 0)
}

export default function DashboardHome() {
	const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
		queryKey: ["analytics", "businessSummary"],
		queryFn: () => getBusinessSummary(),
	})

	const { data: ridersSummary, isLoading: isLoadingRiders } = useQuery({
		queryKey: ["analytics", "businessRidersSummary"],
		queryFn: () => getBusinessRidersSummary(),
	})

	const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
		queryKey: ["analytics", "businessRevenueBreakdown"],
		queryFn: () => getBusinessRevenueBreakdown(),
	})

	const { data: fulfillmentData, isLoading: isLoadingFulfillment } = useQuery({
		queryKey: ["analytics", "businessOrdersFulfillment"],
		queryFn: () => getBusinessOrdersFulfillment(),
	})

	const summary = summaryData?.data

	const stats: StatCard[] = [
		{
			icon: "pending_actions",
			label: "Total Orders",
			value: summary?.total ?? 0,
			sub: "All time orders",
			iconBg: "bg-amber-50",
			iconColor: "#D97706",
			badge: "Total",
			badgeColor: "bg-amber-100 text-amber-700",
		},
		{
			icon: "local_shipping",
			label: "Active Orders",
			value: summary?.active ?? 0,
			sub: "Currently in delivery",
			iconBg: "bg-primary/5",
			iconColor: "var(--primary)",
			badge: "Live",
			badgeColor: "bg-primary/10 text-primary",
		},
		{
			icon: "check_circle",
			label: "Completed Orders",
			value: summary?.completed ?? 0,
			sub: "Delivered successfully",
			iconBg: "bg-secondary/10",
			iconColor: "var(--secondary)",
			badge: "Done",
			badgeColor: "bg-secondary/10 text-secondary-two",
		},
		{
			icon: "payments",
			label: "Total Collected",
			value: formatNaira(summary?.totalCollected ?? 0),
			sub: "Revenue collected",
			iconBg: "bg-secondary",
			iconColor: "white",
			badge: "Revenue",
			badgeColor: "bg-white/20 text-white",
			highlighted: true,
		},
	]

	return (
		<div className="px-6 lg:px-10 py-8 space-y-8">

			{/* Welcome banner */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-extrabold text-primary tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground text-sm mt-0.5">Here&apos;s what&apos;s happening with your logistics today.</p>
				</div>
				<Link href="/dashboard/orders?tab=quotations">
					<Button className="hidden sm:flex gap-2">
						<MaterialIcon name="receipt_long" size={16} color="white" />
						View Quotations
					</Button>
				</Link>
			</div>

			{/* Stat cards */}
			<StatCards stats={stats} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

				{/* Charts column */}
				<div className="lg:col-span-2 flex flex-col gap-6">
					<OrdersTrendWidget />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<RevenueWidget data={revenueData?.data} isLoading={isLoadingRevenue} />
						<FulfillmentWidget data={fulfillmentData?.data} isLoading={isLoadingFulfillment} />
					</div>
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-6">
					<RiderAvailabilityWidget data={ridersSummary?.data} isLoading={isLoadingRiders} />
					<QuickActions />
				</div>
			</div>
		</div>
	)
}
