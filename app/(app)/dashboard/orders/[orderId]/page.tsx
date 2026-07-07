"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MaterialIcon from "@/components/ui/material-icon";
import {
	CustomerInfoCard,
	MapCard,
	DeliveryTimeline,
} from "@/components/orders";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { order, rider, transaction } from "@/services/router";
import { getOrderStatusConfig } from "@/lib/order-status";
import type { OrderStatus, OrderTracking } from "@/services/types/order.types";

type TrackingKey =
	| "confirmedAt"
	| "assignedAt"
	| "enRoutePickupAt"
	| "pickedUpAt"
	| "inTransitAt"
	| "arrivedAtDeliveryAt"
	| "deliveredAt"
	| "completedAt";

const TRACKING_STEPS: { key: TrackingKey; label: string }[] = [
	{ key: "confirmedAt", label: "Order Confirmed" },
	{ key: "assignedAt", label: "Rider Assigned" },
	{ key: "enRoutePickupAt", label: "En Route to Pickup" },
	{ key: "pickedUpAt", label: "Picked Up" },
	{ key: "inTransitAt", label: "In Transit" },
	{ key: "arrivedAtDeliveryAt", label: "Arrived at Delivery" },
	{ key: "deliveredAt", label: "Delivered" },
	{ key: "completedAt", label: "Completed" },
];

function formatNaira(amount: number | null): string {
	if (amount === null) return "—";
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatDateTime(value: string | null): string {
	if (!value) return "—";
	return new Date(value).toLocaleString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

function capitalize(value: string): string {
	return value
		.split("_")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function buildTimelineSteps(tracking: OrderTracking) {
	if (tracking.cancelledAt) {
		return [
			{
				label: "Order Cancelled",
				time: formatDateTime(tracking.cancelledAt),
				description: tracking.cancellationReason ?? "",
				completed: true,
			},
		];
	}

	const lastCompletedIndex = TRACKING_STEPS.reduce(
		(acc, step, idx) => (tracking[step.key] ? idx : acc),
		-1,
	);

	return TRACKING_STEPS.map((step, idx) => ({
		label: step.label,
		time: tracking[step.key]
			? formatDateTime(tracking[step.key])
			: "Pending",
		description: "",
		completed: idx < lastCompletedIndex,
		active: idx === lastCompletedIndex,
		upcoming: idx > lastCompletedIndex,
	}));
}

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

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-semibold text-foreground text-right">
				{value}
			</span>
		</div>
	);
}

function NoteRow({
	icon,
	label,
	value,
}: {
	icon: string;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
				<MaterialIcon name={icon} size={16} color="var(--primary)" />
			</div>
			<div>
				<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
					{label}
				</p>
				<p className="text-sm text-foreground mt-0.5">{value}</p>
			</div>
		</div>
	);
}

export default function OrderDetailPage() {
	const params = useParams<{ orderId: string }>();
	const router = useRouter();

	const { data, isLoading, isError, refetch } = order.getOrder.useQuery({
		variables: { id: params.orderId },
	});
	const orderData = data?.data;

	const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
	const [deliveryFee, setDeliveryFee] = useState("");
	const [pickupFee, setPickupFee] = useState("");
	const [packagingFee, setPackagingFee] = useState("");
	const [note, setNote] = useState("");

	const closeInvoiceModal = () => {
		setInvoiceModalOpen(false);
		setDeliveryFee("");
		setPickupFee("");
		setPackagingFee("");
		setNote("");
	};

	const createInvoiceMutation = order.createInvoice.useMutation({
		onSuccess: () => {
			toast.success("Invoice generated successfully");
			closeInvoiceModal();
			refetch();
		},
		onError: (error) => {
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data
					?.message || "Failed to generate invoice",
			);
		},
	});

	const resendInvoiceMutation = order.resendInvoice.useMutation({
		onSuccess: () => {
			toast.success("Invoice resent successfully");
			refetch();
		},
		onError: (error) => {
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data
					?.message || "Failed to resend invoice",
			);
		},
	});

	const [assignModalOpen, setAssignModalOpen] = useState(false);
	const [riderSearch, setRiderSearch] = useState("");
	const [riderPage, setRiderPage] = useState(1);
	const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
	const debouncedRiderSearch = useDebouncedValue(riderSearch);

	const closeAssignModal = () => {
		setAssignModalOpen(false);
		setRiderSearch("");
		setRiderPage(1);
		setSelectedRiderId(null);
	};

	const { data: ridersData, isLoading: isRidersLoading } =
		rider.listAssignable.useQuery({
			variables: {
				page: riderPage,
				limit: 8,
				search: debouncedRiderSearch || undefined,
			},
			enabled: assignModalOpen,
		});
	const riders = ridersData?.data ?? [];
	const ridersMeta = ridersData?.meta;

	const manuallyAssignMutation = order.manuallyAssignOrder.useMutation({
		onSuccess: () => {
			toast.success("Rider assigned successfully");
			closeAssignModal();
			refetch();
		},
		onError: (error) => {
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data
					?.message || "Failed to assign rider",
			);
		},
	});

	const [payRiderModalOpen, setPayRiderModalOpen] = useState(false);
	const [riderPayAmount, setRiderPayAmount] = useState("");

	const closePayRiderModal = () => {
		setPayRiderModalOpen(false);
		setRiderPayAmount("");
	};

	const payRiderMutation = transaction.riderTransfer.useMutation({
		onSuccess: () => {
			toast.success("Rider paid successfully");
			closePayRiderModal();
			refetch();
		},
		onError: (error) => {
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data
					?.message || "Failed to pay rider",
			);
		},
	});

	if (isLoading) {
		return (
			<div className="px-6 lg:px-10 py-8 text-muted-foreground text-sm">
				Loading order...
			</div>
		);
	}

	if (isError || !orderData) {
		return (
			<div className="px-6 lg:px-10 py-8">
				<div className="bg-popover rounded-2xl border border-border p-10 text-center space-y-3">
					<MaterialIcon
						name="search_off"
						size={32}
						color="var(--muted-foreground)"
					/>
					<h2 className="text-lg font-bold text-primary">
						Order not found
					</h2>
					<p className="text-sm text-muted-foreground">
						We couldn&apos;t find an order with ID &quot;
						{params.orderId}&quot;.
					</p>
					<Link href="/dashboard/orders">
						<Button variant="secondary" className="mt-2">
							Back to Orders
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const isQuotationStage =
		orderData.status === "quotation" ||
		orderData.status === "pending" ||
		!orderData.paidAt;

	const handleGenerateInvoice = () => {
		createInvoiceMutation.mutate({
			id: orderData.id,
			deliveryFee: Number(deliveryFee) || 0,
			pickupFee: Number(pickupFee) || 0,
			packagingFee: Number(packagingFee) || 0,
			note: note.trim() || undefined,
		});
	};

	const handleAssignRider = () => {
		if (!selectedRiderId) return;
		manuallyAssignMutation.mutate({
			orderId: orderData.id,
			riderId: selectedRiderId,
		});
	};

	const canPayRider =
		!orderData.riderFundedAt &&
		!orderData.riderFundedAmount &&
		!!orderData.riderId &&
		orderData.status === "completed";

	const handlePayRider = () => {
		if (!orderData.riderId || !riderPayAmount) return;
		payRiderMutation.mutate({
			orderId: orderData.id,
			riderId: orderData.riderId,
			amount: Number(riderPayAmount),
		});
	};

	return (
		<div className="px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-6xl">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<button
						onClick={() => router.push("/dashboard/orders")}
						className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
					>
						<MaterialIcon
							name="arrow_back"
							size={16}
							color="var(--muted-foreground)"
						/>
						Back to Orders
					</button>
					<div className="flex items-center gap-3 flex-wrap">
						<h1 className="text-2xl font-extrabold text-primary tracking-tight">
							{orderData.referenceCode}
						</h1>
						<StatusBadge status={orderData.status} />
					</div>
					<p className="text-muted-foreground text-sm mt-0.5">
						Created {formatDateTime(orderData.createdAt)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					{orderData.status === "pending" && (
						<Button onClick={() => setInvoiceModalOpen(true)}>
							<MaterialIcon
								name="receipt_long"
								size={14}
								color="white"
							/>
							Generate Invoice
						</Button>
					)}
					{orderData.status === "invoiced" && (
						<Button
							variant="secondary"
							disabled={resendInvoiceMutation.isPending}
							onClick={() =>
								resendInvoiceMutation.mutate({
									id: orderData.id,
								})
							}
						>
							<MaterialIcon name="send" size={14} color="white" />
							{resendInvoiceMutation.isPending
								? "Resending..."
								: "Resend Invoice"}
						</Button>
					)}
					{orderData.status === "payment_confirmed" && (
						<Button onClick={() => setAssignModalOpen(true)}>
							<MaterialIcon
								name="assignment_ind"
								size={14}
								color="white"
							/>
							Assign Rider
						</Button>
					)}
					{canPayRider && (
						<Button onClick={() => setPayRiderModalOpen(true)}>
							<MaterialIcon
								name="payments"
								size={14}
								color="white"
							/>
							Pay Rider
						</Button>
					)}
				</div>
			</div>

			{orderData.cancelledAt && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
					<MaterialIcon name="cancel" size={20} color="#DC2626" />
					<div>
						<p className="font-bold text-red-700 text-sm">
							Order Cancelled
						</p>
						<p className="text-xs text-red-600 mt-0.5">
							{orderData.cancellationReason ??
								"No reason provided."}{" "}
							· {formatDateTime(orderData.cancelledAt)}
						</p>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left column */}
				<div className="lg:col-span-2 space-y-6">
					<MapCard
						pickupAddress={orderData.locations.pickupAddress}
						deliveryAddress={orderData.locations.deliveryAddress}
						pickupCoords={
							orderData.locations.pickupCoordinates.coordinates
						}
						deliveryCoords={
							orderData.locations.deliveryCoordinates.coordinates
						}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<CustomerInfoCard
							title="Sender"
							name={orderData.parties.guestFullName}
							phone={orderData.parties.guestContactNumber}
							email={orderData.parties.guestEmail}
						/>
						<CustomerInfoCard
							title="Recipient"
							name={orderData.parties.recipientFullName}
							phone={orderData.parties.recipientContactNumber}
							email={orderData.parties.recipientEmail}
						/>
					</div>

					{/* Package items */}
					<div className="bg-popover rounded-xl p-8 border border-border space-y-5">
						<div className="flex items-center justify-between">
							<h3 className="font-bold text-lg text-primary">
								Package Items
							</h3>
							<MaterialIcon
								name="inventory_2"
								size={20}
								color="var(--muted-foreground)"
							/>
						</div>
						<div className="divide-y divide-border">
							{orderData.items.map((item) => (
								<div
									key={item.id}
									className="py-4 first:pt-0 last:pb-0"
								>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="font-bold text-foreground">
												{item.packageName}
											</p>
											<p className="text-xs text-muted-foreground mt-0.5">
												{item.packageDescription}
											</p>
										</div>
										<span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium capitalize shrink-0">
											{item.packageType}
										</span>
									</div>
									<div className="grid grid-cols-3 gap-4 mt-3">
										<div>
											<p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">
												Quantity
											</p>
											<p className="font-bold text-foreground text-sm">
												{item.quantity}
											</p>
										</div>
										<div>
											<p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">
												Weight
											</p>
											<p className="font-bold text-foreground text-sm">
												{item.estimatedWeight} kg
											</p>
										</div>
										<div>
											<p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">
												Est. Value
											</p>
											<p className="font-bold text-foreground text-sm">
												{formatNaira(
													item.estimatedValue,
												)}
											</p>
										</div>
									</div>
									{item.specialInstructions && (
										<div className="flex items-start gap-2 bg-silver-two p-3 rounded-lg mt-3">
											<MaterialIcon
												name="warning"
												size={16}
												className="text-amber-600 shrink-0 mt-0.5"
											/>
											<p className="text-xs font-semibold text-muted-foreground">
												{item.specialInstructions}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					<DeliveryTimeline
						steps={buildTimelineSteps(orderData.tracking)}
					/>

					{(orderData.customerNote ||
						orderData.pickupInstructions ||
						orderData.deliveryInstructions) && (
						<div className="bg-popover rounded-xl p-8 border border-border space-y-4">
							<h3 className="font-bold text-lg text-primary">
								Notes &amp; Instructions
							</h3>
							{orderData.customerNote && (
								<NoteRow
									icon="sticky_note_2"
									label="Customer Note"
									value={orderData.customerNote}
								/>
							)}
							{orderData.pickupInstructions && (
								<NoteRow
									icon="assignment"
									label="Pickup Instructions"
									value={orderData.pickupInstructions}
								/>
							)}
							{orderData.deliveryInstructions && (
								<NoteRow
									icon="local_shipping"
									label="Delivery Instructions"
									value={orderData.deliveryInstructions}
								/>
							)}
						</div>
					)}
				</div>

				{/* Right column */}
				<div className="space-y-6">
					{/* Order summary */}
					<div className="bg-popover rounded-xl p-8 border border-border space-y-4">
						<h3 className="font-bold text-lg text-primary">
							Order Summary
						</h3>
						<div className="space-y-2.5 text-sm">
							<SummaryRow
								label="Pickup Method"
								value={
									orderData.pickupMethod === "business_pickup"
										? "Business Pickup"
										: "Walk-in"
								}
							/>
							<SummaryRow
								label="Delivery Priority"
								value={
									orderData.deliveryPriority
										? capitalize(orderData.deliveryPriority)
										: "—"
								}
							/>
							{orderData.prefferedDeliveryTime && (
								<SummaryRow
									label="Preferred Delivery"
									value={formatDateTime(
										orderData.prefferedDeliveryTime,
									)}
								/>
							)}
							<div className="pt-3 border-t border-border/60 space-y-2.5">
								<SummaryRow
									label="Delivery Fee"
									value={formatNaira(orderData.deliveryFee)}
								/>
								<SummaryRow
									label="Pickup Fee"
									value={formatNaira(orderData.pickupFee)}
								/>
								<SummaryRow
									label="Packaging Fee"
									value={formatNaira(orderData.packagingFee)}
								/>
								<SummaryRow
									label="Platform Fee"
									value={formatNaira(orderData.serviceFee)}
								/>
								{orderData.priceBreakdown && (
									<SummaryRow
										label="Payment Processing Fee"
										value={formatNaira(
											orderData.priceBreakdown.nombaFee,
										)}
									/>
								)}
							</div>
							<div className="pt-3 border-t border-border/60 flex items-center justify-between">
								<span className="text-muted-foreground font-medium">
									Total Amount
								</span>
								<span className="font-extrabold text-primary text-lg">
									{formatNaira(orderData.totalAmount)}
								</span>
							</div>
						</div>
					</div>

					{/* Payment */}
					{!isQuotationStage && (
						<div className="bg-popover rounded-xl p-8 border border-border space-y-3">
							<h3 className="font-bold text-lg text-primary">
								Payment
							</h3>
							<div className="space-y-2.5 text-sm">
								<SummaryRow
									label="Status"
									value={capitalize(orderData.paymentStatus)}
								/>
								{orderData.paymentReference && (
									<SummaryRow
										label="Reference"
										value={orderData.paymentReference}
									/>
								)}
								{orderData.invoiceSentAt && (
									<SummaryRow
										label="Invoice Sent"
										value={formatDateTime(
											orderData.invoiceSentAt,
										)}
									/>
								)}
								{orderData.paidAt && (
									<SummaryRow
										label="Paid At"
										value={formatDateTime(orderData.paidAt)}
									/>
								)}
								{orderData.offerExpiresAt && (
									<SummaryRow
										label="Offer Expires"
										value={formatDateTime(
											orderData.offerExpiresAt,
										)}
									/>
								)}
								{orderData.riderFundedAt && (
									<SummaryRow
										label="Rider Paid"
										value={formatNaira(
											orderData.riderFundedAmount,
										)}
									/>
								)}
								{orderData.riderFundedAt && (
									<SummaryRow
										label="Rider Funded At"
										value={formatDateTime(
											orderData.riderFundedAt,
										)}
									/>
								)}
							</div>
						</div>
					)}

					{/* Rider */}
					{!isQuotationStage && (
						<div className="bg-primary text-white rounded-xl p-8 border border-primary/20 space-y-4">
							<h3 className="font-bold text-lg">
								Assigned Rider
							</h3>
							{orderData.rider ? (
								<>
									<div className="flex items-center gap-3">
										{orderData.rider.profilePhoto ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={
													orderData.rider.profilePhoto
												}
												alt=""
												className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white/20"
											/>
										) : (
											<div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
												<MaterialIcon
													name="person"
													size={24}
													color="white"
												/>
											</div>
										)}
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className="font-bold truncate">
													{orderData.rider.firstName}{" "}
													{orderData.rider.lastName}
												</p>
												<a
													href={`tel:${orderData.rider.phoneNumber}`}
													className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
												>
													<MaterialIcon
														name="call"
														size={14}
														color="white"
													/>
												</a>
											</div>
											<p className="text-white/60 text-xs">
												{orderData.rider.phoneNumber}
											</p>
											<span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wide">
												{
													orderData.rider
														.availabilityStatus
												}
											</span>
										</div>
									</div>
									<div className="pt-4 border-t border-white/10 space-y-2.5 text-sm">
										<div className="flex justify-between items-center">
											<span className="text-white/60">
												Vehicle
											</span>
											<span className="font-bold capitalize">
												{orderData.rider.vehicleType} ·{" "}
												{orderData.rider.vehicleModel}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-white/60">
												Color
											</span>
											<span className="font-bold capitalize">
												{orderData.rider.vehicleColor}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-white/60">
												Plate Number
											</span>
											<span className="font-bold px-2 py-0.5 bg-white/10 rounded uppercase tracking-tighter">
												{
													orderData.rider
														.vehiclePlateNumber
												}
											</span>
										</div>
									</div>
								</>
							) : (
								<div className="text-center py-4">
									<MaterialIcon
										name="person_search"
										size={32}
										color="var(--chart-2)"
									/>
									<p className="text-white/70 text-sm mt-2">
										No rider assigned yet
									</p>
								</div>
							)}
						</div>
					)}

					{/* Business */}
					<div className="bg-popover rounded-xl p-8 border border-border space-y-4">
						<h3 className="font-bold text-lg text-primary">
							Business
						</h3>
						<div className="flex items-center gap-3">
							{orderData.business.businessLogo ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={orderData.business.businessLogo}
									alt=""
									className="w-12 h-12 rounded-full object-cover shrink-0"
								/>
							) : (
								<div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
									<MaterialIcon
										name="storefront"
										size={20}
										color="var(--primary)"
									/>
								</div>
							)}
							<div className="min-w-0">
								<p className="font-bold text-foreground truncate">
									{orderData.business.businessName}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{orderData.business.businessAddress}
								</p>
							</div>
						</div>
						<SummaryRow
							label="Contact"
							value={orderData.business.contactNumber}
						/>
					</div>
				</div>
			</div>

			{/* Generate Invoice Modal */}
			{invoiceModalOpen && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
					<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
						<div className="flex items-center justify-between mb-5">
							<h3 className="text-base font-bold text-primary">
								Generate Invoice
							</h3>
							<button
								onClick={closeInvoiceModal}
								className="text-muted-foreground hover:text-foreground"
							>
								<MaterialIcon
									name="close"
									size={20}
									color="var(--muted-foreground)"
								/>
							</button>
						</div>
						<div className="space-y-1 mb-5 bg-silver-two rounded-xl p-4">
							<p className="text-xs text-muted-foreground uppercase tracking-wide font-bold">
								Order
							</p>
							<p className="font-bold text-foreground">
								{orderData.referenceCode} —{" "}
								{orderData.parties.guestFullName}
							</p>
							<p className="text-xs text-muted-foreground">
								{orderData.locations.pickupAddress} →{" "}
								{orderData.locations.deliveryAddress}
							</p>
						</div>
						<div className="space-y-4">
							<div className="grid grid-cols-3 gap-3">
								<div className="space-y-1.5">
									<Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
										Delivery Fee (₦)
									</Label>
									<Input
										type="number"
										placeholder="e.g. 3000"
										value={deliveryFee}
										onChange={(e) =>
											setDeliveryFee(e.target.value)
										}
										className="bg-silver-two border-0 focus-visible:ring-secondary"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
										Pickup Fee (₦)
									</Label>
									<Input
										type="number"
										placeholder="e.g. 500"
										value={pickupFee}
										onChange={(e) =>
											setPickupFee(e.target.value)
										}
										className="bg-silver-two border-0 focus-visible:ring-secondary"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
										Packaging Fee (₦)
									</Label>
									<Input
										type="number"
										placeholder="e.g. 500"
										value={packagingFee}
										onChange={(e) =>
											setPackagingFee(e.target.value)
										}
										className="bg-silver-two border-0 focus-visible:ring-secondary"
									/>
								</div>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
									Note (optional)
								</Label>
								<Textarea
									placeholder="e.g. Includes fragile item handling surcharge"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									className="bg-silver-two border-0 focus-visible:ring-secondary"
									rows={3}
								/>
							</div>
							<div className="pt-2">
								<p className="text-xs text-muted-foreground mb-1">
									A Nomba payment link will be generated and
									sent to the customer.
								</p>
							</div>
							<div className="flex gap-3 pt-2">
								<Button
									variant="ghost"
									className="flex-1"
									onClick={closeInvoiceModal}
								>
									Cancel
								</Button>
								<Button
									className="flex-1"
									disabled={
										!deliveryFee ||
										!pickupFee ||
										!packagingFee ||
										createInvoiceMutation.isPending
									}
									onClick={handleGenerateInvoice}
								>
									<MaterialIcon
										name="send"
										size={14}
										color="white"
									/>
									{createInvoiceMutation.isPending
										? "Sending..."
										: "Send Invoice"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Assign Rider Modal */}
			{assignModalOpen && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
					<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
						<div className="flex items-center justify-between mb-5">
							<h3 className="text-base font-bold text-primary">
								Assign Rider
							</h3>
							<button
								onClick={closeAssignModal}
								className="text-muted-foreground hover:text-foreground"
							>
								<MaterialIcon
									name="close"
									size={20}
									color="var(--muted-foreground)"
								/>
							</button>
						</div>

						<Input
							placeholder="Search riders..."
							value={riderSearch}
							onChange={(e) => {
								setRiderSearch(e.target.value);
								setRiderPage(1);
								setSelectedRiderId(null);
							}}
							className="bg-silver-two border-0 focus-visible:ring-secondary mb-4"
						/>

						<div className="space-y-2 mb-4 min-h-[220px] max-h-72 overflow-y-auto">
							{isRidersLoading && (
								<p className="text-sm text-muted-foreground text-center py-10">
									Loading riders...
								</p>
							)}
							{!isRidersLoading && riders.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-10">
									No riders found
								</p>
							)}
							{!isRidersLoading &&
								riders.map((r) => {
									const name =
										r.firstName && r.lastName
											? `${r.firstName} ${r.lastName}`
											: r.phoneNumber;
									const isSelected = selectedRiderId === r.id;
									return (
										<div
											key={r.id}
											onClick={() =>
												setSelectedRiderId(r.id)
											}
											className={cn(
												"flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors",
												isSelected
													? "border-secondary bg-secondary/5"
													: "border-border hover:border-secondary/40 hover:bg-secondary/5",
											)}
										>
											<div className="flex items-center gap-3 min-w-0">
												{r.profilePhoto ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={r.profilePhoto}
														alt=""
														className="w-8 h-8 rounded-full object-cover shrink-0"
													/>
												) : (
													<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
														<MaterialIcon
															name="person"
															size={16}
															color="var(--primary)"
														/>
													</div>
												)}
												<div className="min-w-0">
													<p className="text-sm font-semibold text-foreground truncate">
														{name}
													</p>
													<p className="text-xs text-muted-foreground">
														{r.phoneNumber}
													</p>
												</div>
											</div>
											<span
												className={cn(
													"w-2 h-2 rounded-full shrink-0",
													r.availabilityStatus ===
														"available"
														? "bg-secondary"
														: "bg-muted-foreground/30",
												)}
											/>
										</div>
									);
								})}
						</div>

						{ridersMeta &&
							ridersMeta.totalPages &&
							ridersMeta.totalPages > 1 && (
								<div className="flex items-center justify-between mb-4">
									<button
										className="text-xs font-bold text-muted-foreground disabled:opacity-30"
										disabled={riderPage <= 1}
										onClick={() =>
											setRiderPage((p) => p - 1)
										}
									>
										Previous
									</button>
									<span className="text-xs text-muted-foreground">
										Page {riderPage} of{" "}
										{ridersMeta.totalPages}
									</span>
									<button
										className="text-xs font-bold text-muted-foreground disabled:opacity-30"
										disabled={
											riderPage >=
											(ridersMeta.totalPages ?? 1)
										}
										onClick={() =>
											setRiderPage((p) => p + 1)
										}
									>
										Next
									</button>
								</div>
							)}

						<div className="flex gap-3">
							<Button
								variant="ghost"
								className="flex-1"
								onClick={closeAssignModal}
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={
									!selectedRiderId ||
									manuallyAssignMutation.isPending
								}
								onClick={handleAssignRider}
							>
								{manuallyAssignMutation.isPending
									? "Assigning..."
									: "Confirm Assignment"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Pay Rider Modal */}
			{payRiderModalOpen && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
					<div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
						<div className="flex items-center justify-between mb-5">
							<h3 className="text-base font-bold text-primary">
								Pay Rider
							</h3>
							<button
								onClick={closePayRiderModal}
								className="text-muted-foreground hover:text-foreground"
							>
								<MaterialIcon
									name="close"
									size={20}
									color="var(--muted-foreground)"
								/>
							</button>
						</div>
						{orderData.rider && (
							<div className="space-y-1 mb-5 bg-silver-two rounded-xl p-4">
								<p className="text-xs text-muted-foreground uppercase tracking-wide font-bold">
									Rider
								</p>
								<p className="font-bold text-foreground">
									{orderData.rider.firstName}{" "}
									{orderData.rider.lastName}
								</p>
								<p className="text-xs text-muted-foreground">
									{orderData.rider.phoneNumber}
								</p>
							</div>
						)}
						<div className="space-y-4">
							<div className="space-y-1.5">
								<Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
									Amount (₦)
								</Label>
								<Input
									type="number"
									placeholder="e.g. 2500"
									value={riderPayAmount}
									onChange={(e) =>
										setRiderPayAmount(e.target.value)
									}
									className="bg-silver-two border-0 focus-visible:ring-secondary"
								/>
							</div>
							<div className="flex gap-3 pt-2">
								<Button
									variant="ghost"
									className="flex-1"
									onClick={closePayRiderModal}
								>
									Cancel
								</Button>
								<Button
									className="flex-1"
									disabled={
										!riderPayAmount ||
										Number(riderPayAmount) <= 0 ||
										payRiderMutation.isPending
									}
									onClick={handlePayRider}
								>
									<MaterialIcon
										name="payments"
										size={14}
										color="white"
									/>
									{payRiderMutation.isPending
										? "Paying..."
										: "Pay Rider"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
