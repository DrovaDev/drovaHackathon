import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import {
	SetWithdrawalPinPayload,
	UpdateWithdrawalPinPayload,
	Wallet,
} from "./types/wallet.types";

export async function getWallet() {
	const response = await apiClient.get<ApiResponse<Wallet>>("/wallets");
	return response.data;
}

export async function setWithdrawalPin(payload: SetWithdrawalPinPayload) {
	const response = await apiClient.post<ApiResponse<null>>(
		"/wallets/withdrawal-pin",
		payload,
	);
	return response.data;
}

export async function updateWithdrawalPin(
	payload: UpdateWithdrawalPinPayload,
) {
	const response = await apiClient.patch<ApiResponse<null>>(
		"/wallets/withdrawal-pin",
		payload,
	);
	return response.data;
}
