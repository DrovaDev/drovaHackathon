export type PayoutTransactionStatus =
	"requested" | "processing" | "success" | "failed" | "canceled";

export type PayoutTransactionStatusFilter = "all" | PayoutTransactionStatus;

export type PayoutSortOrder = "asc" | "desc";

export interface PayoutDestination {
	bankCode: string;
	accountName: string;
	accountNumber: string;
}

export interface PayoutJournal {
	id: string;
	reference: string;
	type: string;
	status: string;
	orderId: string | null;
	reversalOfId: string | null;
	metadata: Record<string, unknown> | null;
	postedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PayoutTransaction {
	id: string;
	walletId: string;
	journalId: string;
	amount: number;
	currency: string;
	destination: PayoutDestination;
	status: PayoutTransactionStatus;
	provider: string;
	providerReference: string | null;
	idempotencyKey: string;
	metadata: Record<string, unknown> | null;
	journal: PayoutJournal;
	createdAt: string;
	updatedAt: string;
}

export interface GetMyPayoutsParams {
	page?: number;
	limit?: number;
	sortOrder?: PayoutSortOrder;
	search?: string;
	status?: PayoutTransactionStatusFilter;
}
