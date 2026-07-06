export interface AnalyticsDateRange {
	startDate?: string
	endDate?: string
}

export type AnalyticsGranularity = "day" | "week" | "month"

// ─── Business Analytics ────────────────────────────────────────────────────────

export interface BusinessSummary {
	total: number
	quotations: number
	active: number
	completed: number
	cancelled: number
	disputed: number
	inEscrow: number
	totalCollected: number
	platformFeesPaid: number
}

export interface OrdersTrendBucket {
	period: string
	total: number
	completed: number
	cancelled: number
}

export interface StatusBreakdownItem {
	status: string
	count: number
}

export interface PriorityBreakdownItem {
	priority: string
	count: number
}

export interface OrdersBreakdown {
	statusBreakdown: StatusBreakdownItem[]
	priorityBreakdown: PriorityBreakdownItem[]
}

export interface RevenueBreakdown {
	grossRevenue: number
	collected: number
	inEscrow: number
	platformCommission: number
	nombaFees: number
	netPayout: number
}

export interface BusinessRidersSummary {
	total: number
	available: number
	offline: number
	onTrip: number
	verified: number
}

export interface RiderPerformance {
	riderId: string
	firstName: string | null
	lastName: string | null
	phoneNumber: string
	profilePhoto: string | null
	totalAssigned: number
	completed: number
	cancelled: number
	completionRatePct: string | null
	avgRating: string
}

export interface FulfillmentMetrics {
	avgConfirmToAssignMins: number
	avgAssignToPickupMins: number
	avgPickupToCompleteMins: number
	avgTotalDeliveryMins: number
}

// ─── Rider Analytics ───────────────────────────────────────────────────────────

export interface RiderSummary {
	totalAssigned: number
	completed: number
	cancelled: number
	averageRating: number
}

export interface RiderEarningsSummary {
	walletBalance: number
	totalEarned: number
	totalWithdrawn: number
	pendingPayout: number
	payoutCount: number
}

export interface EarningsTrendBucket {
	period: string
	earned: number
	payoutCount: number
}

export interface RiderOrdersTrendBucket {
	period: string
	completed: number
}

export interface RiderPerformanceMetrics {
	completionRate: number
	averageDeliveryDurationMinutes: number
	averageRating: number
	totalDeliveries: number
	completedDeliveries: number
	cancelledDeliveries: number
}
