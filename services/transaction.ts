import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import { GetMyPayoutsParams, PayoutTransaction } from "./types/transaction.types";

export async function getMyPayouts(params?: GetMyPayoutsParams) {
	const response = await apiClient.get<ApiResponse<PayoutTransaction[]>>(
		"/transactions/payouts/mine",
		{ params },
	);
	return response.data;
}
