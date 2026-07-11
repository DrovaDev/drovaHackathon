export type WalletOwnerType = "BUSINESS" | "RIDER";

export type WalletStatus = "READY" | "PENDING" | "SUSPENDED";

export interface Wallet {
	id: string;
	ownerType: WalletOwnerType;
	ownerId: string;
	currency: string;
	balance: number;
	ledgerBalance: number;
	status: WalletStatus;
	provider: string;
	hasWithdrawalPin: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface SetWithdrawalPinPayload {
	pin: string;
}

export interface UpdateWithdrawalPinPayload {
	currentPin: string;
	newPin: string;
}
