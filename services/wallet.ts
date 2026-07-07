import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import { Wallet } from "./types/wallet.types";

export async function getWallet() {
	const response = await apiClient.get<ApiResponse<Wallet>>("/wallets");
	return response.data;
}
