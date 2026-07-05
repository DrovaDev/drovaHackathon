import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";

export interface ManuallyAssignOrderPayload {
	orderId: string;
	riderId: string;
}

export async function manuallyAssignOrder(payload: ManuallyAssignOrderPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/order/assign",
		payload,
	);
	return response.data;
}
