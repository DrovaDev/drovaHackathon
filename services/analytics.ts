import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import {
	AnalyticsDateRange,
	AnalyticsGranularity,
	BusinessSummary,
	OrdersTrendBucket,
	OrdersBreakdown,
	RevenueBreakdown,
	BusinessRidersSummary,
	RiderPerformance,
	FulfillmentMetrics,
	RiderSummary,
	RiderEarningsSummary,
	EarningsTrendBucket,
	RiderOrdersTrendBucket,
	RiderPerformanceMetrics,
} from "./types/analytics.types";

// ─── Business Analytics ────────────────────────────────────────────────────────

export async function getBusinessSummary(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<BusinessSummary>>(
		"/analytics/business/summary",
		{ params },
	);
	return response.data;
}

export async function getBusinessOrdersTrend(
	params?: AnalyticsDateRange & { granularity?: AnalyticsGranularity },
) {
	const response = await apiClient.get<ApiResponse<OrdersTrendBucket[]>>(
		"/analytics/business/orders/trend",
		{ params },
	);
	return response.data;
}

export async function getBusinessOrdersBreakdown(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<OrdersBreakdown>>(
		"/analytics/business/orders/breakdown",
		{ params },
	);
	return response.data;
}

export async function getBusinessRevenueBreakdown(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<RevenueBreakdown>>(
		"/analytics/business/revenue/breakdown",
		{ params },
	);
	return response.data;
}

export async function getBusinessRidersSummary(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<BusinessRidersSummary>>(
		"/analytics/business/riders/summary",
		{ params },
	);
	return response.data;
}

export async function getBusinessRidersPerformance(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<RiderPerformance[]>>(
		"/analytics/business/riders/performance",
		{ params },
	);
	return response.data;
}

export async function getBusinessOrdersFulfillment(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<FulfillmentMetrics>>(
		"/analytics/business/orders/fulfillment",
		{ params },
	);
	return response.data;
}

// ─── Rider Analytics ───────────────────────────────────────────────────────────

export async function getRiderSummary(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<RiderSummary>>(
		"/analytics/rider/summary",
		{ params },
	);
	return response.data;
}

export async function getRiderEarningsSummary(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<RiderEarningsSummary>>(
		"/analytics/rider/earnings/summary",
		{ params },
	);
	return response.data;
}

export async function getRiderEarningsTrend(
	params?: AnalyticsDateRange & { granularity?: AnalyticsGranularity },
) {
	const response = await apiClient.get<ApiResponse<EarningsTrendBucket[]>>(
		"/analytics/rider/earnings/trend",
		{ params },
	);
	return response.data;
}

export async function getRiderOrdersTrend(
	params?: AnalyticsDateRange & { granularity?: AnalyticsGranularity },
) {
	const response = await apiClient.get<ApiResponse<RiderOrdersTrendBucket[]>>(
		"/analytics/rider/orders/trend",
		{ params },
	);
	return response.data;
}

export async function getRiderPerformance(params?: AnalyticsDateRange) {
	const response = await apiClient.get<ApiResponse<RiderPerformanceMetrics>>(
		"/analytics/rider/performance",
		{ params },
	);
	return response.data;
}
