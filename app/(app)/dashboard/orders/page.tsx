"use client";

import { useState, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MaterialIcon from "@/components/ui/material-icon";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectPopup,
	SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getOrderStatusConfig } from "@/lib/order-status";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CreateOrderModal, OrderFilters } from "@/components/orders";
import { order } from "@/services/router";
import type {
	Order as OrderRecord,
	OrderDeliveryPriority,
	OrderPaymentStatus,
	OrderPickupMethod,
	OrderStatus,
	OrderStatusFilter,
	SortOrder,
} from "@/services/types/order.types";

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNaira(amount: number | null): string {
	if (amount === null) return "—";
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(amount);
}

// ─── Status config ────────────────────────────────────────────────────────────

const ORDER_STATUS_FILTERS: { value: OrderStatusFilter; label: string }[] = [
	{ value: "all", label: "All Statuses" },
	{ value: "payment_confirmed", label: "Payment Confirmed" },
	{ value: "offer_pending", label: "Offer Pending" },
	{ value: "assigned", label: "Assigned" },
	{ value: "en_route_pickup", label: "En Route Pickup" },
	{ value: "picked_up", label: "Picked Up" },
	{ value: "in_transit", label: "In Transit" },
	{ value: "arrived_at_delivery", label: "Arrived at Delivery" },
	{ value: "completed", label: "Completed" },
	{ value: "disputed", label: "Disputed" },
	{ value: "cancelled", label: "Cancelled" },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
	{ value: "desc", label: "Newest First" },
	{ value: "asc", label: "Oldest First" },
];

const PAYMENT_STATUS_FILTERS: { value: "all" | OrderPaymentStatus; label: string }[] = [
	{ value: "all", label: "All Payment Statuses" },
	{ value: "pending", label: "Pending" },
	{ value: "held", label: "Held" },
	{ value: "released", label: "Released" },
	{ value: "refunded", label: "Refunded" },
	{ value: "failed", label: "Failed" },
];

const PICKUP_METHOD_FILTERS: { value: "all" | OrderPickupMethod; label: string }[] = [
	{ value: "all", label: "All Pickup Methods" },
	{ value: "business_pickup", label: "Business Pickup" },
	{ value: "walk_in", label: "Walk-in" },
];

const DELIVERY_PRIORITY_FILTERS: { value: "all" | OrderDeliveryPriority; label: string }[] = [
	{ value: "all", label: "All Priorities" },
	{ value: "express", label: "Express" },
	{ value: "scheduled", label: "Scheduled" },
];

function getQuotationDisplayStatus(o: OrderRecord): {
	label: string;
	bg: string;
	text: string;
} {
	if (o.cancelledAt)
		return { label: "Cancelled", bg: "bg-gray-100", text: "text-gray-500" };
	if (o.status === "invoiced")
		return { label: "Invoiced", bg: "bg-blue-100", text: "text-blue-700" };
	if (o.offerExpiresAt && new Date(o.offerExpiresAt) < new Date()) {
		return { label: "Expired", bg: "bg-red-100", text: "text-red-600" };
	}
	return { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
	const cfg = getOrderStatusConfig(status);
	return (
		<span
			className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}
		>
			<MaterialIcon name={cfg.icon} size={12} color="currentColor" />
			{cfg.label}
		</span>
	);
}

function generatePageNumbers(
	current: number,
	total: number,
): (number | "...")[] {
	if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
	const pages: (number | "...")[] = [1];
	const start = Math.max(2, current - 1);
	const end = Math.min(total - 1, current + 1);
	if (start > 2) pages.push("...");
	for (let i = start; i <= end; i++) pages.push(i);
	if (end < total - 1) pages.push("...");
	if (total > 1) pages.push(total);
	return pages;
}

function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;
	return (
		<div className="px-6 py-4 flex items-center justify-between bg-silver-two/30 border-t border-border">
			<p className="text-xs text-muted-foreground">
				Page{" "}
				<span className="font-bold text-foreground">{currentPage}</span>{" "}
				of{" "}
				<span className="font-bold text-foreground">{totalPages}</span>
			</p>
			<div className="flex items-center space-x-2">
				<button
					className="w-8 h-8 rounded-lg hover:bg-silver-two text-muted-foreground disabled:opacity-30 flex items-center justify-center"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(currentPage - 1)}
				>
					<MaterialIcon name="chevron_left" size={20} />
				</button>
				{generatePageNumbers(currentPage, totalPages).map((p, idx) =>
					p === "..." ? (
						<span
							key={`ellipsis-${idx}`}
							className="text-muted-foreground text-xs px-1"
						>
							...
						</span>
					) : (
						<button
							key={p}
							onClick={() => onPageChange(p as number)}
							className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
								currentPage === p
									? "bg-primary text-white"
									: "hover:bg-silver-two text-muted-foreground"
							}`}
						>
							{p}
						</button>
					),
				)}
				<button
					className="w-8 h-8 rounded-lg hover:bg-silver-two text-muted-foreground disabled:opacity-30 flex items-center justify-center"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(currentPage + 1)}
				>
					<MaterialIcon name="chevron_right" size={20} />
				</button>
			</div>
		</div>
	);
}

function FilterField({
	label,
	className,
	children,
}: {
	label: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("space-y-1.5", className)}>
			<label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
				{label}
			</label>
			{children}
		</div>
	);
}

function QuotationsTab() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const debouncedSearch = useDebouncedValue(search);

	const hasActiveFilters = sortOrder !== "desc" || !!startDate || !!endDate;

	const clearFilters = () => {
		setSortOrder("desc");
		setStartDate("");
		setEndDate("");
		setPage(1);
	};

	const { data, isLoading, isError } = order.getQuotations.useQuery({
		variables: {
			page,
			limit: PAGE_SIZE,
			search: debouncedSearch || undefined,
			sortOrder,
			startDate: startDate || undefined,
			endDate: endDate || undefined,
		},
	});

	const quotations = data?.data ?? [];
	const meta = data?.meta;

	return (
		<div className="space-y-5">
			{/* Filters */}
			<div className="flex flex-wrap items-end gap-3">
				<FilterField label="Search" className="flex-1 max-w-xs">
					<Input
						placeholder="Search quotations..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="bg-silver-two border-0 focus-visible:ring-secondary"
					/>
				</FilterField>
				<FilterField label="Sort By">
					<Select
						value={sortOrder}
						onValueChange={(v) => {
							setSortOrder(v as SortOrder);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-44">
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
				</FilterField>
				<FilterField label="From">
					<Input
						type="date"
						value={startDate}
						onChange={(e) => {
							setStartDate(e.target.value);
							setPage(1);
						}}
						className="w-40 bg-silver-two border-0 focus-visible:ring-secondary"
					/>
				</FilterField>
				<FilterField label="To">
					<Input
						type="date"
						value={endDate}
						onChange={(e) => {
							setEndDate(e.target.value);
							setPage(1);
						}}
						className="w-40 bg-silver-two border-0 focus-visible:ring-secondary"
					/>
				</FilterField>
				{hasActiveFilters && (
					<button
						onClick={clearFilters}
						className="text-xs font-bold text-secondary hover:underline pb-2.5"
					>
						Clear filters
					</button>
				)}
			</div>

			{/* Table */}
			<div className="bg-popover rounded-2xl border border-border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-silver-two border-b border-border">
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Reference
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Sender
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
									Pickup → Delivery
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
									Package
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Status
								</th>
								<th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{isLoading && (
								<tr>
									<td
										colSpan={6}
										className="text-center py-12 text-muted-foreground text-sm"
									>
										Loading quotations...
									</td>
								</tr>
							)}
							{isError && (
								<tr>
									<td
										colSpan={6}
										className="text-center py-12 text-destructive text-sm"
									>
										Failed to load quotations.
									</td>
								</tr>
							)}
							{!isLoading &&
								!isError &&
								quotations.length === 0 && (
									<tr>
										<td
											colSpan={6}
											className="text-center py-12 text-muted-foreground text-sm"
										>
											No quotations found
										</td>
									</tr>
								)}
							{!isLoading &&
								!isError &&
								quotations.map((q) => {
									const cfg = getQuotationDisplayStatus(q);
									const firstItem = q.items[0];
									return (
										<tr
											key={q.id}
											className="hover:bg-muted/20 transition-colors"
										>
											<td className="px-5 py-4 font-mono text-xs font-bold text-muted-foreground">
												{q.referenceCode}
											</td>
											<td className="px-5 py-4">
												<div className="font-semibold text-foreground">
													{q.parties.guestFullName}
												</div>
												<div className="text-xs text-muted-foreground">
													{q.parties.guestEmail}
												</div>
											</td>
											<td className="px-5 py-4 hidden md:table-cell">
												<div className="text-xs text-muted-foreground truncate max-w-[200px]">
													{q.locations.pickupAddress}
												</div>
												<div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
													<MaterialIcon
														name="arrow_downward"
														size={12}
														color="var(--secondary)"
													/>
													<span className="truncate max-w-[180px]">
														{
															q.locations
																.deliveryAddress
														}
													</span>
												</div>
											</td>
											<td className="px-5 py-4 hidden lg:table-cell">
												<span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
													{firstItem
														? `${firstItem.packageName}${q.items.length > 1 ? ` +${q.items.length - 1}` : ""}`
														: "—"}
												</span>
											</td>
											<td className="px-5 py-4">
												<span
													className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}
												>
													{cfg.label}
												</span>
											</td>
											<td className="px-5 py-4 text-right">
												<div className="flex items-center justify-end gap-2">
													<Link
														href={`/dashboard/orders/${q.id}`}
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
															View Detail
														</Button>
													</Link>
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
				{meta && (
					<Pagination
						currentPage={meta.currentPage ?? page}
						totalPages={meta.totalPages ?? 1}
						onPageChange={setPage}
					/>
				)}
			</div>
		</div>
	);
}

function OrdersTab() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<OrderStatusFilter>("all");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [paymentStatus, setPaymentStatus] = useState<"all" | OrderPaymentStatus>("all");
	const [pickupMethod, setPickupMethod] = useState<"all" | OrderPickupMethod>("all");
	const [deliveryPriority, setDeliveryPriority] = useState<"all" | OrderDeliveryPriority>("all");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const debouncedSearch = useDebouncedValue(search);

	const hasActiveFilters =
		status !== "all" ||
		sortOrder !== "desc" ||
		paymentStatus !== "all" ||
		pickupMethod !== "all" ||
		deliveryPriority !== "all" ||
		!!startDate ||
		!!endDate;

	const clearFilters = () => {
		setStatus("all");
		setSortOrder("desc");
		setPaymentStatus("all");
		setPickupMethod("all");
		setDeliveryPriority("all");
		setStartDate("");
		setEndDate("");
		setPage(1);
	};

	const { data, isLoading, isError } = order.getOrders.useQuery({
		variables: {
			page,
			limit: PAGE_SIZE,
			search: debouncedSearch || undefined,
			status,
			sortOrder,
			paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
			pickupMethod: pickupMethod === "all" ? undefined : pickupMethod,
			deliveryPriority: deliveryPriority === "all" ? undefined : deliveryPriority,
			startDate: startDate || undefined,
			endDate: endDate || undefined,
		},
	});

	const orders = data?.data ?? [];
	const meta = data?.meta;

	return (
		<div className="space-y-5">
			{/* Filters */}
			<OrderFilters
				search={search}
				onSearchChange={(v) => { setSearch(v); setPage(1) }}
				status={status}
				onStatusChange={(v) => { setStatus(v); setPage(1) }}
				sortOrder={sortOrder}
				onSortOrderChange={(v) => { setSortOrder(v); setPage(1) }}
				paymentStatus={paymentStatus}
				onPaymentStatusChange={(v) => { setPaymentStatus(v); setPage(1) }}
				pickupMethod={pickupMethod}
				onPickupMethodChange={(v) => { setPickupMethod(v); setPage(1) }}
				deliveryPriority={deliveryPriority}
				onDeliveryPriorityChange={(v) => { setDeliveryPriority(v); setPage(1) }}
				startDate={startDate}
				onStartDateChange={(v) => { setStartDate(v); setPage(1) }}
				endDate={endDate}
				onEndDateChange={(v) => { setEndDate(v); setPage(1) }}
				onClearFilters={clearFilters}
			/>

			{/* Table */}
			<div className="bg-popover rounded-2xl border border-border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-silver-two border-b border-border">
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Order
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Sender
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
									Route
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
									Rider
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Amount
								</th>
								<th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Status
								</th>
								<th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
									Actions
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
										Loading orders...
									</td>
								</tr>
							)}
							{isError && (
								<tr>
									<td
										colSpan={7}
										className="text-center py-12 text-destructive text-sm"
									>
										Failed to load orders.
									</td>
								</tr>
							)}
							{!isLoading && !isError && orders.length === 0 && (
								<tr>
									<td
										colSpan={7}
										className="text-center py-12 text-muted-foreground text-sm"
									>
										No orders found
									</td>
								</tr>
							)}
							{!isLoading &&
								!isError &&
								orders.map((o) => (
									<tr
										key={o.id}
										className="hover:bg-muted/20 transition-colors"
									>
										<td className="px-5 py-4">
											<div className="font-mono text-xs font-bold text-muted-foreground">
												{o.referenceCode}
											</div>
											{o.paymentReference && (
												<div className="text-[10px] text-muted-foreground/60 mt-0.5">
													{o.paymentReference}
												</div>
											)}
										</td>
										<td className="px-5 py-4 font-semibold text-foreground">
											{o.parties.guestFullName}
										</td>
										<td className="px-5 py-4 hidden md:table-cell">
											<div className="text-xs text-muted-foreground truncate max-w-[180px]">
												{o.locations.pickupAddress}
											</div>
											<div className="text-xs flex items-center gap-1 mt-0.5 text-muted-foreground">
												<MaterialIcon
													name="arrow_downward"
													size={12}
													color="var(--secondary)"
												/>
												<span className="truncate max-w-[160px]">
													{
														o.locations
															.deliveryAddress
													}
												</span>
											</div>
										</td>
										<td className="px-5 py-4 hidden lg:table-cell">
											{o.rider ? (
												<div className="flex items-center gap-2">
													<div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
														<MaterialIcon
															name="person"
															size={14}
															color="var(--primary)"
														/>
													</div>
													<span className="text-xs font-medium text-foreground">
														{o.rider.firstName} {o.rider.lastName}
													</span>
												</div>
											) : (
												<span className="text-xs text-muted-foreground italic">
													Unassigned
												</span>
											)}
										</td>
										<td className="px-5 py-4">
											<p className="font-bold text-primary">
												{formatNaira(o.totalAmount)}
											</p>
											<p className="text-[10px] text-muted-foreground capitalize">
												{o.paymentStatus}
											</p>
										</td>
										<td className="px-5 py-4">
											<StatusBadge status={o.status} />
										</td>
										<td className="px-5 py-4 text-right">
											<Link
												href={`/dashboard/orders/${o.id}`}
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
								))}
						</tbody>
					</table>
				</div>
				{meta && (
					<Pagination
						currentPage={meta.currentPage ?? page}
						totalPages={meta.totalPages ?? 1}
						onPageChange={setPage}
					/>
				)}
			</div>
		</div>
	);
}

// ─── Main page ────────────────────────────────────────────────────────────────

function OrdersContent() {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const initialTab =
		searchParams.get("tab") === "orders" ? "orders" : "quotations";
	const [activeTab, setActiveTab] = useState<"quotations" | "orders">(
		initialTab,
	);
	const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);

	const { data: quotationsSummary } = order.getQuotations.useQuery({
		variables: { page: 1, limit: 1 },
	});
	const { data: ordersSummary } = order.getOrders.useQuery({
		variables: { page: 1, limit: 1, status: "all" },
	});
	const { data: completedSummary } = order.getOrders.useQuery({
		variables: { page: 1, limit: 1, status: "completed" },
	});
	const { data: disputedSummary } = order.getOrders.useQuery({
		variables: { page: 1, limit: 1, status: "disputed" },
	});

	const quotationsCount = quotationsSummary?.meta?.count ?? 0;
	const ordersCount = ordersSummary?.meta?.count ?? 0;
	const completedCount = completedSummary?.meta?.count ?? 0;
	const disputedCount = disputedSummary?.meta?.count ?? 0;

	return (
		<div className="px-6 lg:px-10 py-8 space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-extrabold text-primary tracking-tight">
						Orders
					</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Manage quotations and deliveries across the full
						lifecycle
					</p>
				</div>
				<Button onClick={() => setCreateOrderModalOpen(true)}>
					<MaterialIcon name="add" size={16} color="white" />
					Create Order
				</Button>
			</div>

			{/* Stat summary */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				{[
					{
						label: "Quotations",
						value: quotationsCount,
						icon: "receipt_long",
						color: "bg-amber-50",
						iconColor: "#D97706",
					},
					{
						label: "Total Orders",
						value: ordersCount,
						icon: "local_shipping",
						color: "bg-primary/5",
						iconColor: "var(--primary)",
					},
					{
						label: "Completed",
						value: completedCount,
						icon: "task_alt",
						color: "bg-secondary/10",
						iconColor: "var(--secondary)",
					},
					{
						label: "Disputed",
						value: disputedCount,
						icon: "flag",
						color: "bg-red-50",
						iconColor: "#DC2626",
					},
				].map((s) => (
					<div
						key={s.label}
						className="bg-popover rounded-2xl border border-border p-4 flex items-center gap-3"
					>
						<div
							className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}
						>
							<MaterialIcon
								name={s.icon}
								size={20}
								color={s.iconColor}
							/>
						</div>
						<div>
							<div className="text-2xl font-extrabold text-primary">
								{s.value}
							</div>
							<div className="text-xs text-muted-foreground font-medium">
								{s.label}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className="border-b border-border flex gap-0">
				<button
					onClick={() => setActiveTab("quotations")}
					className={`relative px-5 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === "quotations" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
				>
					Quotations
					{quotationsCount > 0 && (
						<span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black">
							{quotationsCount}
						</span>
					)}
				</button>
				<button
					onClick={() => setActiveTab("orders")}
					className={`relative px-5 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === "orders" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
				>
					Orders
					{ordersCount > 0 && (
						<span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
							{ordersCount}
						</span>
					)}
				</button>
			</div>

			{/* Tab content */}
			{activeTab === "quotations" ? <QuotationsTab /> : <OrdersTab />}

			<CreateOrderModal
				open={createOrderModalOpen}
				onClose={() => setCreateOrderModalOpen(false)}
				onCreated={() => queryClient.invalidateQueries({ queryKey: ["order"] })}
			/>
		</div>
	);
}

export default function OrdersPage() {
	return (
		<Suspense
			fallback={
				<div className="px-6 py-8 text-muted-foreground text-sm">
					Loading...
				</div>
			}
		>
			<OrdersContent />
		</Suspense>
	);
}
