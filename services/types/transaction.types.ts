import { OrderRider } from "./order.types";

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

export interface RequestPayoutPayload {
	amount: number;
}

export interface GetMyPayoutsParams {
	page?: number;
	limit?: number;
	sortOrder?: PayoutSortOrder;
	search?: string;
	status?: PayoutTransactionStatusFilter;
}

export type LedgerTransactionDirection = "debit" | "credit";

export type TransactionType = "business_withdrawal" | "business_to_rider_payout";

export interface RiderPayoutTransactionMetadata {
	initiatedBy?: string;
	platformFee?: number;
	riderAmount?: number;
	totalAmount?: number;
}

export interface RiderPayoutJournal extends Omit<PayoutJournal, "metadata"> {
	metadata: RiderPayoutTransactionMetadata | null;
	rider: OrderRider;
}

export interface LedgerTransaction {
	id: string;
	journalId: string;
	walletId: string;
	direction: LedgerTransactionDirection;
	amount: number;
	currency: string;
	journal: RiderPayoutJournal;
	createdAt: string;
}

export interface GetTransactionsParams {
	page?: number;
	limit?: number;
	type?: TransactionType;
	sortOrder?: PayoutSortOrder;
	search?: string;
}
