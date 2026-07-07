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
	createdAt: string;
	updatedAt: string;
}
