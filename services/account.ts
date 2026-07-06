import { apiClient } from "./client";

import { ApiResponse } from "./types/general.types";
import {
	Bank,
	PayoutAccount,
	PayoutAccountPayload,
	ResolveBankAccountParams,
	ResolvedBankAccount,
} from "./types/account.types";

export async function getBusinessPayoutAccount() {
	const response = await apiClient.get<ApiResponse<PayoutAccount>>(
		"/account/business/payout-account",
	);
	return response.data;
}

export async function createBusinessPayoutAccount(
	payload: PayoutAccountPayload,
) {
	const response = await apiClient.post<ApiResponse<PayoutAccount>>(
		"/account/business/payout-account",
		payload,
	);
	return response.data;
}

export async function updateBusinessPayoutAccount(
	payload: PayoutAccountPayload,
) {
	const response = await apiClient.patch<ApiResponse<PayoutAccount>>(
		"/account/business/payout-account",
		payload,
	);
	return response.data;
}

export async function getBanks() {
	const response = await apiClient.get<ApiResponse<Bank[]>>("/account/banks");
	return response.data;
}

export async function resolveBankAccount(params: ResolveBankAccountParams) {
	const response = await apiClient.get<ApiResponse<ResolvedBankAccount>>(
		"/account/banks/resolve",
		{ params },
	);
	return response.data;
}
