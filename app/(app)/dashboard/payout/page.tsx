"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { account, transaction, wallet } from "@/services/router";
import { PayoutAccountPayload } from "@/services/types/account.types";
import {
	GetMyPayoutsParams,
	GetTransactionsParams,
	PayoutTransactionStatusFilter,
} from "@/services/types/transaction.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MaterialIcon from "@/components/ui/material-icon";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectPopup,
	SelectItem,
} from "@/components/ui/select";
import { PayoutAccountModal } from "@/components/payout/payout-account-modal";
import { NoPayoutAccountModal } from "@/components/payout/no-payout-account-modal";
import { SetPinPromptModal } from "@/components/payout/set-pin-prompt-modal";
import { Pagination } from "@/components/riders/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cacheRiderPayoutTransaction } from "@/lib/rider-payout-cache";
import { getRiderPayoutStatusConfig } from "@/lib/rider-payout-status";

const WITHDRAWAL_PAGE_SIZE = 10;
const RIDER_PAYOUT_PAGE_SIZE = 10;
const WITHDRAWAL_PIN_LENGTH = 4;

const withdrawalStatusConfig: Record<
	Exclude<PayoutTransactionStatusFilter, "all">,
	{ label: string; bg: string; text: string; icon: string }
> = {
	requested: {
		label: "Requested",
		bg: "bg-blue-100",
		text: "text-blue-700",
		icon: "schedule",
	},
	processing: {
		label: "Processing",
		bg: "bg-amber-100",
		text: "text-amber-700",
		icon: "sync",
	},
	success: {
		label: "Success",
		bg: "bg-secondary/10",
		text: "text-secondary-two",
		icon: "check_circle",
	},
	failed: {
		label: "Failed",
		bg: "bg-red-100",
		text: "text-red-600",
		icon: "error",
	},
	canceled: {
		label: "Canceled",
		bg: "bg-gray-100",
		text: "text-gray-500",
		icon: "cancel",
	},
};

const WITHDRAWAL_STATUS_FILTERS: {
	value: PayoutTransactionStatusFilter;
	label: string;
}[] = [
	{ value: "all", label: "All Statuses" },
	{ value: "requested", label: "Requested" },
	{ value: "processing", label: "Processing" },
	{ value: "success", label: "Success" },
	{ value: "failed", label: "Failed" },
	{ value: "canceled", label: "Canceled" },
];

const SORT_OPTIONS: {
	value: NonNullable<GetMyPayoutsParams["sortOrder"]>;
	label: string;
}[] = [
	{ value: "desc", label: "Newest First" },
	{ value: "asc", label: "Oldest First" },
];

function formatNaira(amount: number): string {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatNairaDecimal(amount: number): string {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString("en-NG", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function WithdrawModal({ onClose }: { onClose: () => void }) {
	const [amount, setAmount] = useState("");
	const [withdrawalPin, setWithdrawalPin] = useState("");
	const queryClient = useQueryClient();

	const requestPayoutMutation = transaction.requestPayout.useMutation({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["transaction"] });
			toast.success("Withdrawal requested");
			onClose();
		},
		onError: (error) =>
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data
					?.message || "Failed to request withdrawal",
			),
	});

	const handleSubmit = () => {
		const numericAmount = Number(amount);
		if (!numericAmount || numericAmount <= 0) return;
		if (withdrawalPin.length !== WITHDRAWAL_PIN_LENGTH) return;
		requestPayoutMutation.mutate({
			amount: numericAmount,
			withdrawalPin,
		});
	};

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-base font-bold text-primary">
						Withdraw Funds
					</h3>
					<button onClick={onClose}>
						<MaterialIcon
							name="close"
							size={20}
							color="var(--muted-foreground)"
						/>
					</button>
				</div>

				{/* Nomba badge */}
				<div className="flex items-center gap-2 bg-primary/5 rounded-xl p-3 mb-5">
					<MaterialIcon
						name="verified_user"
						size={16}
						color="var(--primary)"
					/>
					<span className="text-xs text-muted-foreground font-medium">
						Powered by{" "}
						<strong className="text-primary">Nomba</strong> Transfer
						API
					</span>
				</div>

				<div className="space-y-4">
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">
							Withdrawal Amount (₦)
						</label>
						<Input
							type="number"
							placeholder="Enter amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="bg-silver-two border-0 focus-visible:ring-secondary text-lg font-bold"
						/>
						<p className="text-xs text-muted-foreground mt-1.5">
							Nomba charges ₦20 per bank transaction.
						</p>
					</div>
					<div>
						<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">
							Payout PIN
						</label>
						<InputOTP
							maxLength={WITHDRAWAL_PIN_LENGTH}
							value={withdrawalPin}
							onChange={(val) =>
								setWithdrawalPin(val.replace(/\D/g, ""))
							}
							inputMode="numeric"
						>
							<InputOTPGroup className="gap-2">
								{Array.from({ length: WITHDRAWAL_PIN_LENGTH }).map(
									(_, i) => (
										<InputOTPSlot
											key={i}
											index={i}
											className="size-11 rounded-xl border-2 text-base font-bold"
										/>
									),
								)}
							</InputOTPGroup>
						</InputOTP>
					</div>
					<div className="flex gap-3 pt-2">
						<Button
							variant="ghost"
							className="flex-1"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							className="flex-1"
							disabled={
								!amount ||
								Number(amount) <= 0 ||
								withdrawalPin.length !== WITHDRAWAL_PIN_LENGTH ||
								requestPayoutMutation.isPending
							}
							onClick={handleSubmit}
						>
							<MaterialIcon name="send" size={14} color="white" />
							{requestPayoutMutation.isPending
								? "Submitting..."
								: "Submit"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function RiderPayoutsSection() {
	const [page, setPage] = useState(1);

	const { data, isLoading, isError } = transaction.getTransactions.useQuery({
		variables: {
			page,
			limit: RIDER_PAYOUT_PAGE_SIZE,
			type: "business_to_rider_payout",
		} satisfies GetTransactionsParams,
	});

	const payouts = data?.data ?? [];
	const meta = data?.meta;

	return (
		<div className="bg-popover rounded-2xl border border-border overflow-hidden">
			<div className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div>
					<h2 className="font-bold text-primary">Rider Payouts</h2>
					<p className="text-xs text-muted-foreground mt-0.5">
						Settled after each delivery via Nomba Transfer API
					</p>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-silver-two border-b border-border">
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								Rider
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
								Order
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
								Rider Amount
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								Amount
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
								Date
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								Status
							</th>
							<th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								<span className="sr-only">View</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{isLoading && (
							<tr>
								<td
									colSpan={7}
									className="text-center py-12 text-muted-foreground text-sm"
								>
									Loading rider payouts...
								</td>
							</tr>
						)}
						{isError && (
							<tr>
								<td
									colSpan={7}
									className="text-center py-12 text-destructive text-sm"
								>
									Failed to load rider payouts.
								</td>
							</tr>
						)}
						{!isLoading && !isError && payouts.length === 0 && (
							<tr>
								<td
									colSpan={7}
									className="text-center py-12 text-muted-foreground text-sm"
								>
									No rider payouts found
								</td>
							</tr>
						)}
						{!isLoading &&
							!isError &&
							payouts.map((p) => {
								const cfg = getRiderPayoutStatusConfig(
									p.journal.status,
								);
								const rider = p.journal.rider;
								const riderName =
									`${rider.firstName} ${rider.lastName}`.trim();
								return (
									<tr
										key={p.id}
										className="hover:bg-muted/20 transition-colors"
									>
										<td className="px-5 py-4">
											<div className="flex items-center gap-2.5">
												{rider.profilePhoto ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={rider.profilePhoto}
														alt=""
														className="w-8 h-8 rounded-full object-cover shrink-0"
													/>
												) : (
													<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-extrabold text-primary shrink-0">
														{riderName
															.split(" ")
															.map((n) => n[0])
															.join("")
															.slice(0, 2)}
													</div>
												)}
												<div>
													<div className="font-semibold text-foreground text-sm">
														{riderName}
													</div>
													<div className="text-xs text-muted-foreground capitalize">
														{rider.vehicleType}
													</div>
												</div>
											</div>
										</td>
										<td className="px-5 py-4 hidden lg:table-cell font-mono text-xs text-muted-foreground/70">
											{p.journal.orderId ?? "—"}
										</td>
										<td className="px-5 py-4 hidden md:table-cell text-xs text-muted-foreground">
											{p.journal.metadata?.riderAmount !=
											null
												? formatNaira(
														p.journal.metadata
															.riderAmount,
													)
												: "—"}
										</td>
										<td className="px-5 py-4 font-extrabold text-primary">
											{formatNaira(p.amount)}
										</td>
										<td className="px-5 py-4 hidden md:table-cell text-xs text-muted-foreground">
											{formatDateTime(p.createdAt)}
										</td>
										<td className="px-5 py-4">
											<span
												className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}
											>
												<MaterialIcon
													name={cfg.icon}
													size={11}
													color="currentColor"
												/>
												{cfg.label}
											</span>
										</td>
										<td className="px-5 py-4 text-right">
											<Link
												href={`/dashboard/payout/rider/${p.id}`}
												onClick={() =>
													cacheRiderPayoutTransaction(
														p,
													)
												}
											>
												<Button
													size="sm"
													variant="ghost"
													className="text-primary"
												>
													<MaterialIcon
														name="visibility"
														size={14}
														color="var(--primary)"
													/>
													View Details
												</Button>
											</Link>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
			{meta && (
				<div className="px-6 py-4 border-t border-border flex items-center justify-between">
					<p className="text-xs text-muted-foreground">
						Page{" "}
						<span className="font-bold text-foreground">
							{meta.currentPage ?? page}
						</span>{" "}
						of{" "}
						<span className="font-bold text-foreground">
							{meta.totalPages ?? 1}
						</span>
					</p>
					<Pagination
						currentPage={meta.currentPage ?? page}
						totalPages={meta.totalPages ?? 1}
						onPageChange={setPage}
					/>
				</div>
			)}
		</div>
	);
}

function WithdrawalHistorySection() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<PayoutTransactionStatusFilter>("all");
	const [sortOrder, setSortOrder] =
		useState<NonNullable<GetMyPayoutsParams["sortOrder"]>>("desc");
	const debouncedSearch = useDebouncedValue(search);

	const { data, isLoading, isError } = transaction.getMyPayouts.useQuery({
		variables: {
			page,
			limit: WITHDRAWAL_PAGE_SIZE,
			search: debouncedSearch || undefined,
			status: status === "all" ? undefined : status,
			sortOrder,
		},
	});

	const { data: banksData } = account.getBanks.useQuery();
	const bankNameByCode = new Map(
		(banksData?.data ?? []).map((b) => [b.code, b.name]),
	);

	const withdrawals = data?.data ?? [];
	const meta = data?.meta;

	const hasActiveFilters = status !== "all" || sortOrder !== "desc";
	const clearFilters = () => {
		setStatus("all");
		setSortOrder("desc");
		setPage(1);
	};

	return (
		<div className="bg-popover rounded-2xl border border-border overflow-hidden">
			<div className="flex items-center justify-between px-6 py-4 border-b border-border flex-wrap gap-3">
				<h2 className="font-bold text-primary">Withdrawal History</h2>
				<div className="flex items-end gap-3 flex-wrap">
					<Input
						placeholder="Search by reference..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="w-48 h-9 bg-silver-two border-0 focus-visible:ring-secondary text-xs"
					/>
					<Select
						value={status}
						onValueChange={(v) => {
							setStatus(v as PayoutTransactionStatusFilter);
							setPage(1);
						}}
						items={WITHDRAWAL_STATUS_FILTERS}
					>
						<SelectTrigger className="w-40 h-9 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectPopup>
							{WITHDRAWAL_STATUS_FILTERS.map((s) => (
								<SelectItem key={s.value} value={s.value}>
									{s.label}
								</SelectItem>
							))}
						</SelectPopup>
					</Select>
					<Select
						value={sortOrder}
						onValueChange={(v) => {
							setSortOrder(
								v as NonNullable<
									GetMyPayoutsParams["sortOrder"]
								>,
							);
							setPage(1);
						}}
						items={SORT_OPTIONS}
					>
						<SelectTrigger className="w-36 h-9 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectPopup>
							{SORT_OPTIONS.map((s) => (
								<SelectItem key={s.value} value={s.value}>
									{s.label}
								</SelectItem>
							))}
						</SelectPopup>
					</Select>
					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="text-xs font-bold text-secondary hover:underline h-9"
						>
							Clear filters
						</button>
					)}
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-silver-two border-b border-border">
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								Amount
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
								Destination
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
								Nomba Ref
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
								Date
							</th>
							<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{isLoading && (
							<tr>
								<td
									colSpan={5}
									className="text-center py-12 text-muted-foreground text-sm"
								>
									Loading withdrawals...
								</td>
							</tr>
						)}
						{isError && (
							<tr>
								<td
									colSpan={5}
									className="text-center py-12 text-destructive text-sm"
								>
									Failed to load withdrawal history.
								</td>
							</tr>
						)}
						{!isLoading && !isError && withdrawals.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="text-center py-12 text-muted-foreground text-sm"
								>
									No withdrawals found
								</td>
							</tr>
						)}
						{!isLoading &&
							!isError &&
							withdrawals.map((w) => {
								const cfg = withdrawalStatusConfig[w.status];
								return (
									<tr
										key={w.id}
										className="hover:bg-muted/20 transition-colors"
									>
										<td className="px-5 py-4 font-extrabold text-primary">
											{formatNaira(w.amount)}
										</td>
										<td className="px-5 py-4 hidden md:table-cell text-sm text-muted-foreground">
											{bankNameByCode.get(
												w.destination.bankCode,
											) ?? w.destination.bankCode}{" "}
											· {w.destination.accountNumber}
											<div className="text-xs text-muted-foreground/70">
												{w.destination.accountName}
											</div>
										</td>
										<td className="px-5 py-4 hidden lg:table-cell font-mono text-xs text-muted-foreground/70">
											{w.providerReference ?? "—"}
										</td>
										<td className="px-5 py-4 hidden md:table-cell text-xs text-muted-foreground">
											{formatDateTime(w.createdAt)}
										</td>
										<td className="px-5 py-4">
											<span
												className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}
											>
												<MaterialIcon
													name={cfg.icon}
													size={11}
													color="currentColor"
												/>
												{cfg.label}
											</span>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
			{meta && (
				<div className="px-6 py-4 border-t border-border flex items-center justify-between">
					<p className="text-xs text-muted-foreground">
						Page{" "}
						<span className="font-bold text-foreground">
							{meta.currentPage ?? page}
						</span>{" "}
						of{" "}
						<span className="font-bold text-foreground">
							{meta.totalPages ?? 1}
						</span>
					</p>
					<Pagination
						currentPage={meta.currentPage ?? page}
						totalPages={meta.totalPages ?? 1}
						onPageChange={setPage}
					/>
				</div>
			)}
		</div>
	);
}

export default function PayoutPage() {
	const router = useRouter();
	const [withdrawModal, setWithdrawModal] = useState(false);
	const [pinPromptOpen, setPinPromptOpen] = useState(false);
	const [accountFormOpen, setAccountFormOpen] = useState(false);
	const [noAccountPromptDismissed, setNoAccountPromptDismissed] =
		useState(false);

	const queryClient = useQueryClient();

	const { data: walletData, isLoading: walletLoading } =
		wallet.get.useQuery();
	const walletBalance = walletData?.data?.balance ?? 0;
	const hasWithdrawalPin = walletData?.data?.hasWithdrawalPin ?? false;

	const handleWithdrawClick = () => {
		if (!hasWithdrawalPin) {
			setPinPromptOpen(true);
			return;
		}
		setWithdrawModal(true);
	};

	const {
		data: payoutAccountData,
		isLoading: accountLoading,
		isError: accountIsError,
		error: accountError,
	} = account.getPayoutAccount.useQuery({ retry: false });

	const payoutAccount = payoutAccountData?.data ?? null;
	const accountNotFound =
		!accountLoading &&
		(!payoutAccount ||
			(accountIsError &&
				(accountError as AxiosError)?.response?.status === 404));
	const noAccountPromptOpen = accountNotFound && !noAccountPromptDismissed;

	const invalidateAccount = () =>
		queryClient.invalidateQueries({ queryKey: ["account"] });

	const handleAccountError = (error: Error, fallback: string) =>
		toast.error(
			(error as AxiosError<{ message: string }>).response?.data
				?.message || fallback,
		);

	const createAccountMutation = account.createPayoutAccount.useMutation({
		onSuccess: () => {
			invalidateAccount();
			toast.success("Payout account added");
			setAccountFormOpen(false);
			setNoAccountPromptDismissed(true);
		},
		onError: (e) => handleAccountError(e, "Failed to add payout account"),
	});

	const updateAccountMutation = account.updatePayoutAccount.useMutation({
		onSuccess: () => {
			invalidateAccount();
			toast.success("Payout account updated");
			setAccountFormOpen(false);
		},
		onError: (e) =>
			handleAccountError(e, "Failed to update payout account"),
	});

	const handleAccountSubmit = (payload: PayoutAccountPayload) => {
		if (payoutAccount) {
			updateAccountMutation.mutate(payload);
		} else {
			createAccountMutation.mutate(payload);
		}
	};

	return (
		<div className="px-6 lg:px-10 py-8 space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-2xl font-extrabold text-primary tracking-tight">
						Payout
					</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Business wallet and Nomba-powered withdrawals & rider
						payouts
					</p>
				</div>
				<div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-2">
					<MaterialIcon
						name="verified_user"
						size={16}
						color="var(--primary)"
					/>
					<span className="text-xs font-bold text-primary">
						Powered by Nomba API
					</span>
				</div>
			</div>

			{/* Payout Account */}
			<div className="bg-popover rounded-2xl border border-border p-5 flex items-center justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
						<MaterialIcon
							name="account_balance"
							size={22}
							color="var(--primary)"
						/>
					</div>
					<div>
						<div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
							Payout Account
						</div>
						{accountLoading ? (
							<div className="text-sm font-semibold text-muted-foreground mt-0.5">
								Loading account...
							</div>
						) : payoutAccount ? (
							<>
								<div className="font-bold text-foreground text-sm">
									{payoutAccount.accountName}
								</div>
								<div className="text-xs text-muted-foreground">
									{payoutAccount.bankName} ·{" "}
									{payoutAccount.accountNumber}
								</div>
							</>
						) : (
							<div className="text-sm font-bold text-amber-700 mt-0.5">
								No bank account added
							</div>
						)}
					</div>
				</div>
				{!accountLoading &&
					(payoutAccount ? (
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setAccountFormOpen(true)}
						>
							<MaterialIcon
								name="edit"
								size={14}
								color="var(--primary)"
							/>
							Edit
						</Button>
					) : (
						<Button
							size="sm"
							onClick={() => setAccountFormOpen(true)}
						>
							<MaterialIcon name="add" size={14} color="white" />
							Add Account
						</Button>
					))}
			</div>

			{/* Wallet */}
			<div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#00251c] p-8 text-primary-foreground shadow-xl shadow-primary/20">
				<div className="absolute -top-20 -left-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
				<div className="absolute -right-16 -bottom-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
				<div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div>
						<div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 mb-5">
							<MaterialIcon
								name="verified_user"
								size={13}
								color="var(--secondary)"
							/>
							<span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
								Powered by Nomba
							</span>
						</div>

						<div className="text-5xl font-extrabold tracking-tight mb-1.5">
							{walletLoading
								? "—"
								: formatNairaDecimal(walletBalance)}
						</div>
						<div className="text-sm text-white/50">
							Available balance
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
						{!walletLoading && !hasWithdrawalPin && (
							<Button
								variant="ghost"
								onClick={() => router.push("/dashboard/payout/pin")}
								className="w-full lg:w-auto h-12 text-sm font-extrabold text-white bg-white/10 hover:bg-white/20 hover:text-white"
							>
								<MaterialIcon name="lock" size={16} color="white" />
								Set Pin
							</Button>
						)}
						<Button
							variant="secondary"
							onClick={handleWithdrawClick}
							className="w-full lg:w-auto lg:min-w-[220px] h-12 text-sm font-extrabold shadow-lg shadow-secondary/30 hover:shadow-secondary/50 hover:-translate-y-0.5 transition-all"
						>
							<MaterialIcon
								name="send"
								size={16}
								color="var(--secondary-foreground)"
							/>
							Withdraw Funds
						</Button>
					</div>
				</div>
			</div>

			{/* Rider Payouts */}
			<RiderPayoutsSection />

			{/* Withdrawal History */}
			<WithdrawalHistorySection />

			{withdrawModal && (
				<WithdrawModal onClose={() => setWithdrawModal(false)} />
			)}

			<SetPinPromptModal
				isOpen={pinPromptOpen}
				onClose={() => setPinPromptOpen(false)}
				onSetPin={() => {
					setPinPromptOpen(false);
					router.push("/dashboard/payout/pin");
				}}
			/>

			<NoPayoutAccountModal
				isOpen={noAccountPromptOpen}
				onClose={() => setNoAccountPromptDismissed(true)}
				onAddAccount={() => {
					setNoAccountPromptDismissed(true);
					setAccountFormOpen(true);
				}}
			/>

			{accountFormOpen && (
				<PayoutAccountModal
					isOpen={accountFormOpen}
					account={payoutAccount}
					onClose={() => setAccountFormOpen(false)}
					onSubmit={handleAccountSubmit}
					isPending={
						createAccountMutation.isPending ||
						updateAccountMutation.isPending
					}
				/>
			)}
		</div>
	);
}
