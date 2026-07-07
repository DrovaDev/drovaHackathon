"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MaterialIcon from "@/components/ui/material-icon";
import { business } from "@/services/router";
import {
	BusinessOperatingHourPayload,
	DeliveryScope,
} from "@/services/types/business.types";
import { MapPin, Store, Globe } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const DELIVERY_SCOPE_ICONS: Record<string, React.ElementType> = {
	intracity: MapPin,
	intercity: Store,
	interstate: Globe,
};

const dayLabels: Record<string, string> = {
	monday: "Monday",
	tuesday: "Tuesday",
	wednesday: "Wednesday",
	thursday: "Thursday",
	friday: "Friday",
	saturday: "Saturday",
	sunday: "Sunday",
};

const dayOrder = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

const buildFullWeek = (
	existing: BusinessOperatingHourPayload[] = [],
): BusinessOperatingHourPayload[] =>
	dayOrder.map((day) => {
		const found = existing.find((h) => h.day === day);
		return (
			found ?? {
				day: day as BusinessOperatingHourPayload["day"],
				opensAt: "09:00",
				closesAt: "17:00",
				status: "closed",
			}
		);
	});

export default function OperationsPage() {
	const queryClient = useQueryClient();
	const { data: profileResponse } = business.getProfile.useQuery();
	const profile = profileResponse?.data;

	const { data: lookupsResponse, isLoading: isLookupsLoading } =
		business.getBusinessLookups.useQuery();
	const lookups = lookupsResponse?.data;

	const [deliveryScope, setDeliveryScope] = useState<string[]>([]);
	const [fleetSize, setFleetSize] = useState<number | "">("");
	const [operatingHours, setOperatingHours] = useState<
		BusinessOperatingHourPayload[]
	>([]);

	useEffect(() => {
		if (!profile) return;

		if (profile.deliveryScope?.length) {
			setDeliveryScope(profile.deliveryScope);
		}

		if (typeof profile.fleetSize === "number") {
			setFleetSize(profile.fleetSize);
		}

		setOperatingHours(buildFullWeek(profile.operatingHours));
	}, [profile]);

	const toggleDeliveryScope = (value: string) => {
		setDeliveryScope((prev) =>
			prev.includes(value)
				? prev.filter((v) => v !== value)
				: [...prev, value],
		);
	};

	const updateDayHours = (
		day: string,
		field: "opensAt" | "closesAt",
		value: string,
	) => {
		setOperatingHours((prev) =>
			prev.map((h) => (h.day === day ? { ...h, [field]: value } : h)),
		);
	};

	const toggleDayStatus = (day: string) => {
		setOperatingHours((prev) =>
			prev.map((h) =>
				h.day === day
					? { ...h, status: h.status === "open" ? "closed" : "open" }
					: h,
			),
		);
	};

	const resetChanges = () => {
		if (!profile) return;
		setDeliveryScope(profile.deliveryScope ?? []);
		setFleetSize(
			typeof profile.fleetSize === "number" ? profile.fleetSize : "",
		);
		setOperatingHours(buildFullWeek(profile.operatingHours));
	};

	const { mutate: saveProfile, isPending: isSaving } =
		business.profileEdit.useMutation({
			onSuccess: (response) => {
				toast.success(response.message || "Operations updated");
				queryClient.invalidateQueries({
					queryKey: business.getProfile.getKey(),
				});
			},
			onError: (error) => {
				const message = axios.isAxiosError(error)
					? error.response?.data?.message
					: undefined;
				toast.error(
					message || "Unable to update operations. Try again.",
				);
			},
		});

	const handleSave = () => {
		if (!profile) return;
		saveProfile({
			businessName: profile.businessName,
			businessDescription: profile.businessDescription,
			businessAddress: profile.businessAddress,
			businessState: profile.businessState,
			location: profile.location,
			deliveryScope: deliveryScope as DeliveryScope[],
			fleetSize: typeof fleetSize === "number" ? fleetSize : 0,
			businessRegistrationNumber: profile.businessRegistrationNumber,
			taxIdentificationNumber: profile.taxIdentificationNumber,
			bvn: profile.bvn,
			contactNumber: profile.contactNumber,
			businessLogo: profile.businessLogo,
			coverImage: profile.coverImage,
			operatingHours,
		});
	};

	return (
		<div className="p-4 sm:p-8 lg:p-12 max-w-5xl">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
				<div>
					<h3 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-2">
						Configure Logistics
					</h3>
					<p className="text-muted-foreground max-w-md">
						Define the operational boundaries and resource
						allocation for your fleet to ensure optimal delivery
						flow.
					</p>
				</div>
				<div className="flex gap-3 sm:gap-4">
					<Button
						variant="ghost"
						className="text-primary font-bold hover:bg-silver-two"
						onClick={resetChanges}
						disabled={!profile}
					>
						Discard Changes
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving || !profile}
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>

			<div className="space-y-12">
				{/* Delivery Scope */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="space-y-2">
						<h4 className="text-lg font-bold text-primary">
							Delivery Scope
						</h4>
						<p className="text-sm text-muted-foreground">
							Specify the geographical reach of your current
							logistics infrastructure.
						</p>
					</div>
					<div className="md:col-span-2">
						<label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">
							Expansion Range
						</label>
						<div className="flex gap-3 flex-wrap">
							{isLookupsLoading && (
								<span className="text-xs text-muted-foreground">
									Loading scopes...
								</span>
							)}
							{lookups?.deliveryScope.map(({ key, value }) => {
								const Icon = DELIVERY_SCOPE_ICONS[key] ?? Globe;
								const isActive = deliveryScope.includes(value);
								return (
									<button
										key={key}
										type="button"
										onClick={() =>
											toggleDeliveryScope(value)
										}
										className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-bold transition-colors ${
											isActive
												? "bg-secondary/10 text-secondary border-secondary"
												: "bg-popover text-foreground border-border/60 hover:border-secondary"
										}`}
									>
										<Icon size={16} />
										{value}
									</button>
								);
							})}
						</div>
					</div>
				</section>

				<div className="h-px bg-border w-full" />

				{/* Fleet Size */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="space-y-2">
						<h4 className="text-lg font-bold text-primary">
							Fleet Size
						</h4>
						<p className="text-sm text-muted-foreground">
							Number of vehicles available in your network for
							delivery fulfillment.
						</p>
					</div>
					<div className="md:col-span-2 max-w-50">
						<label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1">
							Number of Vehicles
						</label>
						<Input
							type="number"
							min={0}
							value={fleetSize}
							onChange={(e) =>
								setFleetSize(
									e.target.value === ""
										? ""
										: Number(e.target.value),
								)
							}
							className="bg-silver-two border-0 focus-visible:ring-secondary"
						/>
					</div>
				</section>

				<div className="h-px bg-border w-full" />

				{/* Operating Hours */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="space-y-2">
						<h4 className="text-lg font-bold text-primary">
							Operating Hours
						</h4>
						<p className="text-sm text-muted-foreground">
							Set your business availability to manage customer
							expectations and driver shifts.
						</p>
					</div>
					<div className="md:col-span-2 space-y-4">
						{operatingHours.map((hours) => {
							const isOpen = hours.status === "open";
							return (
								<div
									key={hours.day}
									className="flex flex-col sm:flex-row sm:items-center gap-4 bg-silver-two p-6 rounded-2xl"
								>
									<button
										type="button"
										onClick={() =>
											toggleDayStatus(hours.day)
										}
										className="flex items-center gap-3 min-w-30 text-left"
									>
										<MaterialIcon
											name={
												isOpen
													? "calendar_view_week"
													: "event_busy"
											}
											size={20}
											color={
												isOpen
													? "var(--secondary)"
													: "var(--muted-foreground)"
											}
										/>
										<span
											className={`font-bold ${isOpen ? "" : "text-muted-foreground"}`}
										>
											{dayLabels[hours.day] ?? hours.day}
										</span>
									</button>
									{isOpen ? (
										<div className="flex-1 flex items-center gap-4">
											<Input
												type="time"
												value={hours.opensAt}
												onChange={(e) =>
													updateDayHours(
														hours.day,
														"opensAt",
														e.target.value,
													)
												}
												className="flex-1 bg-popover border-0 text-center font-bold focus-visible:ring-2 focus-visible:ring-secondary"
											/>
											<span className="text-muted-foreground font-bold">
												to
											</span>
											<Input
												type="time"
												value={hours.closesAt}
												onChange={(e) =>
													updateDayHours(
														hours.day,
														"closesAt",
														e.target.value,
													)
												}
												className="flex-1 bg-popover border-0 text-center font-bold focus-visible:ring-2 focus-visible:ring-secondary"
											/>
										</div>
									) : (
										<span className="text-sm text-muted-foreground italic">
											Closed
										</span>
									)}
								</div>
							);
						})}
					</div>
				</section>

				{/* Finalize CTA */}
				{/* <div className="pt-8 pb-16">
					<div className="bg-primary p-8 rounded-3xl relative overflow-hidden group">
						<div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
							<div>
								<h5 className="text-white text-xl font-bold mb-2">
									Ready to optimize?
								</h5>
								<p className="text-white/80 text-sm opacity-80 max-w-sm">
									Changes will be pushed to the real-time
									driver dispatcher system immediately upon
									saving.
								</p>
							</div>
							<Button
								variant="default"
								className="bg-secondary hover:bg-secondary/90 px-10 py-6 rounded-xl font-black uppercase tracking-wider text-sm shadow-xl shadow-black/20 active:scale-95"
								onClick={handleSave}
								disabled={isSaving || !profile}
							>
								Finalize Ops Plan
							</Button>
						</div>
						<div className="absolute -right-16 -bottom-16 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
						<div className="absolute -left-16 -top-16 w-48 h-48 bg-secondary opacity-5 rounded-full blur-2xl" />
					</div>
				</div> */}
			</div>
		</div>
	);
}
