export type PayoutAccountOwnerType = "BUSINESS" | "RIDER";

export interface PayoutAccount {
	id: string;
	ownerId: string;
	ownerType: PayoutAccountOwnerType;
	bankCode: string;
	bankName: string;
	accountNumber: string;
	accountName: string;
	createdAt: string;
	updatedAt: string;
}

export interface Bank {
	name: string;
	code: string;
	nipCode: string | null;
	logo: string;
}

export interface PayoutAccountPayload {
	bankCode: string;
	bankName: string;
	accountNumber: string;
	accountName: string;
}

export interface ResolveBankAccountParams {
	accountNumber: string;
	bankCode: string;
}

export interface ResolvedBankAccount {
	accountName: string;
	accountNumber: string;
}
