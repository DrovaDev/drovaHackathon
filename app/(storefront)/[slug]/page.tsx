"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { business } from "@/services/router";
import MaterialIcon from "@/components/ui/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/riders/star-rating";
import { Pagination } from "@/components/riders/pagination";
import { RequestQuotationModal } from "@/components/storefront/request-quotation-modal";
import {
	BusinessOperatingHourPayload,
	DeliveryScope,
	OperatingDay,
} from "@/services/types/business.types";

const REVIEWS_PAGE_SIZE = 10;

const DELIVERY_SCOPE_ICON: Record<DeliveryScope, string> = {
	intracity: "location_city",
	intercity: "alt_route",
	interstate: "map",
};

const DELIVERY_SCOPE_LABEL: Record<DeliveryScope, string> = {
	intracity: "Intracity delivery",
	intercity: "Intercity delivery",
	interstate: "Interstate delivery",
};

const DAY_LABEL: Record<OperatingDay, string> = {
	monday: "Monday",
	tuesday: "Tuesday",
	wednesday: "Wednesday",
	thursday: "Thursday",
	friday: "Friday",
	saturday: "Saturday",
	sunday: "Sunday",
};

const DAY_ORDER: OperatingDay[] = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];

function formatTime(time: string) {
	const [hourStr, minute] = time.split(":");
	const hour = parseInt(hourStr, 10);
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 === 0 ? 12 : hour % 12;
	return `${displayHour}:${minute} ${period}`;
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("en-NG", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	});
}

function getOpenStatus(operatingHours: BusinessOperatingHourPayload[]) {
	const now = new Date();
	const today = DAY_ORDER[now.getDay()];
	const todayHours = operatingHours.find((hour) => hour.day === today);
	if (!todayHours || todayHours.status !== "open")
		return { isOpen: false, todayHours };

	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const [openHour, openMinute] = todayHours.opensAt.split(":").map(Number);
	const [closeHour, closeMinute] = todayHours.closesAt.split(":").map(Number);
	const openMinutes = openHour * 60 + openMinute;
	const closeMinutes = closeHour * 60 + closeMinute;

	return {
		isOpen: currentMinutes >= openMinutes && currentMinutes <= closeMinutes,
		todayHours,
	};
}

function initialsOf(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export default function StorefrontPage() {
	const params = useParams<{ slug: string }>();
	const slug = params.slug;
	const [page, setPage] = useState(1);
	const [quotationModalOpen, setQuotationModalOpen] = useState(false);

	const { data, isLoading, isError, error } = business.getStorefront.useQuery(
		{
			variables: { slug, page, limit: REVIEWS_PAGE_SIZE },
			enabled: !!slug,
		},
	);

	const storefront = data?.data;
	const meta = data?.meta;

	const openStatus = useMemo(
		() =>
			storefront
				? getOpenStatus(storefront.business.operatingHours)
				: null,
		[storefront],
	);

	if (isLoading) {
		return <StorefrontSkeleton />;
	}

	if (isError || !storefront) {
		const message = axios.isAxiosError(error)
			? error.response?.data?.message
			: undefined;
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center space-y-3 max-w-sm">
					<MaterialIcon
						name="storefront"
						size={40}
						color="var(--muted-foreground)"
					/>
					<h1 className="text-lg font-bold text-primary">
						Storefront not found
					</h1>
					<p className="text-sm text-muted-foreground">
						{message ||
							"We couldn't find a storefront at this address. Double-check the link and try again."}
					</p>
				</div>
			</div>
		);
	}

	const { business: profile, averageRating, reviews } = storefront;
	const telHref = `tel:${profile.contactNumber.replace(/[^+\d]/g, "")}`;

	return (
		<div className="min-h-screen bg-muted/30">
			<header className="sticky top-0 z-10 border-b border-border bg-popover/80 backdrop-blur-md">
				<div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Image
							src="/assets/logo.png"
							alt="Drova"
							width={100}
							height={100}
						/>
					</div>
					<Button
						size="sm"
						onClick={() => setQuotationModalOpen(true)}
						className="gap-1.5"
					>
						<MaterialIcon
							name="request_quote"
							size={14}
							color="var(--primary-foreground)"
						/>
						Get a Quote
					</Button>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
				{/* Cover + logo + summary */}
				<div className="bg-popover rounded-2xl border border-border overflow-hidden shadow-sm">
					<div className="w-full h-40 sm:h-56 relative bg-gradient-to-br from-primary/20 to-primary/5">
						{profile.coverImage && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={profile.coverImage}
								alt=""
								className="w-full h-full object-cover"
							/>
						)}
						<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
						{openStatus && (
							<div className="absolute top-3 right-3">
								<Badge
									className={
										openStatus.isOpen
											? "bg-secondary text-secondary-foreground border-0"
											: "bg-black/50 text-white border-0"
									}
								>
									<span
										className={`w-1.5 h-1.5 rounded-full ${openStatus.isOpen ? "bg-secondary-foreground" : "bg-white"}`}
									/>
									{openStatus.isOpen
										? "Open now"
										: "Closed now"}
								</Badge>
							</div>
						)}
					</div>
					<div className="md:px-6 pb-6 px-4 pt-4">
						<div className="flex items-end gap-4 flex-wrap">
							<div className="w-20 h-20 rounded-2xl border-4 border-popover bg-silver-two overflow-hidden shrink-0 shadow-md">
								{profile.businessLogo ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={profile.businessLogo}
										alt={profile.businessName}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-xl font-extrabold text-primary">
										{profile.businessName.charAt(0)}
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0 pb-1">
								<div className="flex items-center gap-2 flex-wrap">
									<h1 className="text-xl font-extrabold text-primary truncate">
										{profile.businessName}
									</h1>
									{profile.isVerified && (
										<MaterialIcon
											name="verified"
											size={18}
											color="var(--secondary)"
										/>
									)}
								</div>
								<div className="flex items-center gap-2 mt-1">
									<StarRating rating={averageRating} />
									<span className="text-xs text-muted-foreground">
										({meta?.count ?? reviews.length}{" "}
										reviews)
									</span>
								</div>
							</div>
							<div className="flex items-center gap-2 mt-4">
								<a
									href={telHref}
									className="flex-1 sm:flex-initial"
								>
									<Button
										variant="outline"
										className="gap-2 w-full"
									>
										<MaterialIcon
											name="call"
											size={16}
											color="var(--primary)"
										/>
										Call
									</Button>
								</a>
								<Button
									className="gap-2 flex-1 sm:flex-initial"
									onClick={() => setQuotationModalOpen(true)}
								>
									<MaterialIcon
										name="request_quote"
										size={16}
										color="var(--primary-foreground)"
									/>
									Request Quotation
								</Button>
							</div>
						</div>

						{profile.businessDescription && (
							<p className="text-sm text-foreground mt-4">
								{profile.businessDescription}
							</p>
						)}

						<div className="flex flex-wrap gap-2 mt-4">
							{profile.deliveryScope.map((scope) => (
								<Badge
									key={scope}
									variant="outline"
									className="gap-1"
								>
									<MaterialIcon
										name={
											DELIVERY_SCOPE_ICON[scope] ??
											"local_shipping"
										}
										size={12}
										color="var(--foreground)"
									/>
									{DELIVERY_SCOPE_LABEL[scope] ?? scope}
								</Badge>
							))}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm">
							<div className="flex items-start gap-2">
								<MaterialIcon
									name="location_on"
									size={16}
									color="var(--muted-foreground)"
								/>
								<span className="text-foreground">
									{profile.businessAddress},{" "}
									{profile.businessState}
								</span>
							</div>
							<a
								href={telHref}
								className="flex items-start gap-2 hover:text-secondary transition-colors"
							>
								<MaterialIcon
									name="call"
									size={16}
									color="var(--muted-foreground)"
								/>
								<span className="text-foreground">
									{profile.contactNumber}
								</span>
							</a>
							<div className="flex items-start gap-2">
								<MaterialIcon
									name="local_shipping"
									size={16}
									color="var(--muted-foreground)"
								/>
								<span className="text-foreground">
									{profile.fleetSize} vehicle fleet
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Operating hours */}
				{profile.operatingHours.length > 0 && (
					<div className="bg-popover rounded-2xl border border-border p-6 shadow-sm">
						<h2 className="font-bold text-primary text-base mb-4">
							Operating Hours
						</h2>
						<div className="space-y-2">
							{profile.operatingHours.map((hour) => {
								const isToday =
									openStatus?.todayHours?.day === hour.day;
								return (
									<div
										key={hour.day}
										className={`flex items-center justify-between text-sm py-1.5 px-2 -mx-2 rounded-lg border-b border-border last:border-0 ${isToday ? "bg-secondary/5 font-semibold" : ""}`}
									>
										<span className="text-foreground font-medium flex items-center gap-2">
											{DAY_LABEL[hour.day] ?? hour.day}
											{isToday && (
												<span className="text-[10px] font-bold text-secondary uppercase tracking-wide">
													Today
												</span>
											)}
										</span>
										<span
											className={
												hour.status === "open"
													? "text-foreground"
													: "text-muted-foreground"
											}
										>
											{hour.status === "open"
												? `${formatTime(hour.opensAt)} - ${formatTime(hour.closesAt)}`
												: "Closed"}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Reviews */}
				<div className="bg-popover rounded-2xl border border-border p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-bold text-primary text-base">
							Customer Reviews
						</h2>
						<StarRating rating={averageRating} />
					</div>

					{reviews.length === 0 ? (
						<div className="text-center py-8">
							<MaterialIcon
								name="reviews"
								size={28}
								color="var(--muted-foreground)"
							/>
							<p className="text-sm text-muted-foreground mt-2">
								No reviews yet.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{reviews.map((review) => (
								<div
									key={review.id}
									className="border-b border-border last:border-0 pb-4 last:pb-0 flex gap-3"
								>
									<div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
										{initialsOf(
											review.customerName ?? "Anonymous",
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-1 gap-2">
											<span className="font-semibold text-sm text-foreground truncate">
												{review.customerName ??
													"Anonymous"}
											</span>
											<span className="text-xs text-muted-foreground shrink-0">
												{formatDate(review.createdAt)}
											</span>
										</div>
										<StarRating rating={review.rating} />
										{review.comment && (
											<p className="text-sm text-foreground mt-2">
												{review.comment}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					)}

					{(meta?.totalPages ?? 0) > 1 && (
						<div className="pt-5 mt-1">
							<Pagination
								currentPage={meta?.currentPage ?? page}
								totalPages={meta?.totalPages ?? 1}
								onPageChange={setPage}
							/>
						</div>
					)}
				</div>
			</main>

			<RequestQuotationModal
				open={quotationModalOpen}
				onClose={() => setQuotationModalOpen(false)}
				businessSlug={slug}
			/>
		</div>
	);
}

function StorefrontSkeleton() {
	return (
		<div className="min-h-screen bg-muted/30">
			<div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
				<Skeleton className="w-full h-56 rounded-2xl" />
				<Skeleton className="w-full h-32 rounded-2xl" />
				<Skeleton className="w-full h-48 rounded-2xl" />
			</div>
		</div>
	);
}
