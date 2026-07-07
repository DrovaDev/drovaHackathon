import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import {
	GetMyPayoutsParams,
	GetTransactionsParams,
	LedgerTransaction,
	PayoutTransaction,
	RequestPayoutPayload,
	RiderTransferPayload,
} from "./types/transaction.types";

export async function getMyPayouts(params?: GetMyPayoutsParams) {
	const response = await apiClient.get<ApiResponse<PayoutTransaction[]>>(
		"/transactions/payouts/mine",
		{ params },
	);
	return response.data;
}

export async function getTransactions(params?: GetTransactionsParams) {
	const response = await apiClient.get<ApiResponse<LedgerTransaction[]>>(
		"/transactions",
		{ params },
	);
	return response.data;
}

export async function requestPayout(payload: RequestPayoutPayload) {
	const response = await apiClient.post<ApiResponse<PayoutTransaction>>(
		"/transactions/payouts/request",
		payload,
	);
	return response.data;
}

export async function riderTransfer(payload: RiderTransferPayload) {
	const response = await apiClient.post<ApiResponse<LedgerTransaction>>(
		"/transactions/rider-transfer",
		payload,
	);
	return response.data;
}
