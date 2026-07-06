"use client";

import { auth, business, upload } from "@/api/router";
import {
	BusinessOperatingHourPayload,
	DeliveryScope,
	GetBusinessLookupsResponse,
	OperatingDay,
} from "@/api/types/business.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	clearSignupSetupEmail,
	clearSignupSetupTempToken,
	getSignupSetupEmail,
	storeSignupSetupEmail,
	storeSignupSetupTempToken,
} from "@/lib/setup-session";
import { cn } from "@/lib/utils";
import { matchState } from "@/lib/match-state";
import { AddressMapPicker } from "@/components/orders";
import axios from "axios";
import {
	ShieldCheck,
	Check,
	Lock,
	Phone,
	MapPin,
	HelpCircle,
	User,
	ArrowRight,
	ArrowLeft,
	Info,
	ChevronDown,
	BadgeCheck,
	Upload,
	Store,
	Rocket,
	Eye,
	Globe,
	ShieldAlert,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────────

type LookupItem = GetBusinessLookupsResponse["states"][number];

type BusinessDetailsState = {
	businessName: string;
	businessState: string;
	businessAddress: string;
	longitude: string;
	latitude: string;
	businessRegistrationNumber: string;
	taxIdentificationNumber: string;
	bvn: string;
};

type OperationsDetailsState = {
	contactNumber: string;
	fleetSize: number;
};

type IdentityDetailsState = {
	businessDescription: string;
	logoPreviewUrl: string | null;
	coverPreviewUrl: string | null;
	logoUrl: string | null;
	coverUrl: string | null;
};

const DELIVERY_SCOPE_ICONS: Record<string, React.ElementType> = {
	intracity: MapPin,
	intercity: Store,
	interstate: Globe,
};

// ─── Top Navigation ─────────────────────────────────────────────────────────────

function TopNav({ step }: { step: number }) {
	const navLabels = [
		"Verification",
		"Business Details",
		"Operations",
		"Identity",
	];
	return (
		<header className="bg-white border-b border-border px-4 sm:px-8 h-14 flex items-center justify-between shrink-0 gap-4">
			<div className="flex items-center gap-4 sm:gap-10 min-w-0">
				<span className="text-lg sm:text-xl font-bold tracking-tight shrink-0">
					Drova
				</span>
				<nav className="hidden sm:flex items-center gap-6 overflow-x-auto">
					{navLabels.map((label, i) => (
						<span
							key={label}
							className={cn(
								"text-sm font-medium py-1 transition-colors whitespace-nowrap",
								i + 1 === step
									? "text-primary border-b-2 border-primary"
									: "text-muted-foreground",
							)}
						>
							{label}
						</span>
					))}
				</nav>
				<span className="sm:hidden text-sm font-medium text-primary whitespace-nowrap">
					{navLabels[step - 1]}
				</span>
			</div>
			<div className="flex items-center gap-2 shrink-0">
				<button className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
					<HelpCircle size={15} />
				</button>
				<button className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
					<User size={15} />
				</button>
			</div>
		</header>
	);
}

// ─── Stepper: numbered circles (steps 1–2) ──────────────────────────────────────

function CircleStepper({ currentStep }: { currentStep: number }) {
	const steps = [
		{ id: 1, label: "VERIFY" },
		{ id: 2, label: "BUSINESS" },
		{ id: 3, label: "OPS" },
		{ id: 4, label: "ID" },
	];
	return (
		<div className="flex items-center justify-center mb-6 sm:mb-10">
			{steps.map(({ id, label }, i, arr) => (
				<React.Fragment key={id}>
					<div className="flex flex-col items-center gap-1.5">
						<div
							className={cn(
								"size-8 sm:size-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all",
								id < currentStep
									? "bg-primary text-primary-foreground border-primary"
									: id === currentStep
										? "bg-primary text-primary-foreground border-primary"
										: "bg-white text-muted-foreground border-border",
							)}
						>
							{id < currentStep ? <Check size={16} /> : id}
						</div>
						<span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
							{label}
						</span>
					</div>
					{i < arr.length - 1 && (
						<div
							className={cn(
								"h-0.5 w-8 sm:w-24 mb-0 sm:mb-5 mx-0.5 transition-colors",
								id < currentStep ? "bg-primary" : "bg-border",
							)}
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}

// ─── Step 1: Verification ───────────────────────────────────────────────────────

function Step1({
	email,
	otp,
	setOtp,
	onNext,
	onResend,
	isVerifying,
	isResending,
}: {
	email: string;
	otp: string;
	setOtp: (v: string) => void;
	onNext: () => void;
	onResend: () => void;
	isVerifying: boolean;
	isResending: boolean;
}) {
	return (
		<main className="flex-1 flex flex-col items-center py-6 sm:py-10 px-4 sm:px-8 overflow-y-auto">
			<CircleStepper currentStep={1} />

			{/* Split card */}
			<div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-md w-full max-w-2xl">
				{/* Left – dark green panel */}
				<div className="sm:w-52 bg-primary flex flex-col justify-between p-6 sm:p-8 shrink-0">
					<div>
						<div className="w-8 h-1 bg-secondary rounded-full mb-4 sm:mb-6" />
						<h2 className="text-white font-bold text-xl sm:text-2xl leading-snug">
							Securing your journey.
						</h2>
						<p className="text-white/60 text-sm mt-4 leading-relaxed">
							Verification ensures every partner in the Drova
							network is trusted and verified.
						</p>
					</div>
					<div className="hidden sm:flex items-center gap-2 mt-6">
						<div className="flex -space-x-2">
							<div className="size-7 rounded-full bg-amber-300 border-2 border-primary" />
							<div className="size-7 rounded-full bg-sky-300 border-2 border-primary" />
							<div className="size-7 rounded-full bg-rose-300 border-2 border-primary" />
						</div>
						<p className="text-white/80 text-xs leading-tight">
							Trusted by 2k+
							<br />
							businesses
						</p>
					</div>
				</div>

				{/* Right – white panel */}
				<div className="flex-1 bg-white p-6 sm:p-10 flex flex-col items-center justify-center">
					<div className="size-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
						<ShieldCheck size={30} className="text-secondary" />
					</div>
					<h3 className="text-2xl font-bold mb-2">
						Verify your email.
					</h3>
					<p className="text-muted-foreground text-sm text-center mb-8 leading-relaxed break-all">
						We&apos;ve sent a 6-digit code to
						<br />
						<span className="text-foreground font-medium">
							{email || "your email address"}
						</span>
					</p>
					<p className="text-muted-foreground text-xs text-center mb-8 leading-relaxed">
						Enter it below to proceed to business setup.
					</p>

					<InputOTP maxLength={6} value={otp} onChange={setOtp}>
						<InputOTPGroup className="gap-1.5 sm:gap-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<InputOTPSlot
									key={i}
									index={i}
									className="size-10 sm:size-12 rounded-xl border-2 text-base font-bold"
								/>
							))}
						</InputOTPGroup>
					</InputOTP>

					<Button
						onClick={onNext}
						disabled={otp.length !== 6 || isVerifying || !email}
						className="w-full mt-8 h-12 text-base font-semibold rounded-xl"
					>
						{isVerifying ? "Verifying..." : "Verify & Continue"}
						<ArrowRight size={18} className="ml-2" />
					</Button>

					<p className="text-muted-foreground text-sm mt-5">
						Didn&apos;t receive a code?{" "}
						<button
							type="button"
							onClick={onResend}
							disabled={isResending || !email}
							className="text-primary font-semibold hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
						>
							{isResending ? "Resending..." : "Resend Code"}
						</button>
					</p>
				</div>
			</div>

			{/* Encrypted footer */}
			<div className="flex items-center gap-2 mt-8 text-muted-foreground text-[11px] font-semibold uppercase tracking-widest text-center">
				<Lock size={12} className="shrink-0" />
				End-to-end encrypted verification
			</div>
		</main>
	);
}

// ─── Step 2: Business Details ────────────────────────────────────────────────────

function Step2({
	states,
	isLookupsLoading,
	details,
	onChange,
	isBusinessValidated,
	isValidatingTIN,
	onValidate,
	onNext,
}: {
	states: LookupItem[];
	isLookupsLoading: boolean;
	details: BusinessDetailsState;
	onChange: <K extends keyof BusinessDetailsState>(
		field: K,
		value: BusinessDetailsState[K],
	) => void;
	isBusinessValidated: boolean;
	isValidatingTIN: boolean;
	onValidate: () => void;
	onNext: () => void;
}) {
	const canContinue =
		isBusinessValidated &&
		!!details.businessName &&
		!!details.businessState &&
		!!details.businessAddress &&
		!!details.longitude &&
		!!details.latitude;

	return (
		<div className="flex-1 overflow-y-auto py-6 sm:py-8 px-4 sm:px-8">
			<div className="max-w-2xl mx-auto">
				<CircleStepper currentStep={2} />

				<div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
					<h2 className="text-xl sm:text-2xl font-bold mb-1">
						Tell us about your business.
					</h2>
					<p className="text-muted-foreground text-sm mb-6 sm:mb-8">
						We need these details to verify your commercial
						operations.
					</p>

					<div className="space-y-5">
						{/* Name + State */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
									Business Name
								</Label>
								<Input
									placeholder="Enter legal business name"
									value={details.businessName}
									onChange={(e) =>
										onChange("businessName", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
									Business State
								</Label>
								<div className="relative">
									<select
										className="w-full h-10 px-3 pr-9 rounded-lg border border-input bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/50 text-muted-foreground disabled:opacity-60"
										value={details.businessState}
										disabled={isLookupsLoading}
										onChange={(e) =>
											onChange(
												"businessState",
												e.target.value,
											)
										}
									>
										<option value="">
											{isLookupsLoading
												? "Loading states..."
												: "Select a state"}
										</option>
										{states.map(({ key, value }) => (
											<option key={key} value={value}>
												{value}
											</option>
										))}
									</select>
									<ChevronDown
										size={15}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
									/>
								</div>
							</div>
						</div>

						{/* Address */}
						<div className="space-y-2">
							<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
								Business Address
							</Label>
							<AddressMapPicker
								markerColor="primary"
								placeholder="Search for your business address..."
								value={{
									address: details.businessAddress,
									longitude:
										details.longitude !== ""
											? Number(details.longitude)
											: null,
									latitude:
										details.latitude !== ""
											? Number(details.latitude)
											: null,
								}}
								onChange={(next) => {
									onChange("businessAddress", next.address);
									onChange(
										"longitude",
										String(next.longitude),
									);
									onChange(
										"latitude",
										String(next.latitude),
									);
									const matchedState = matchState(
										next.state,
										states,
									);
									if (matchedState) {
										onChange(
											"businessState",
											matchedState,
										);
									}
								}}
							/>
						</div>

						{/* Registration + TIN + BVN */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
									Registration Number
								</Label>
								<Input
									placeholder="e.g. 123456789"
									value={details.businessRegistrationNumber}
									onChange={(e) =>
										onChange(
											"businessRegistrationNumber",
											e.target.value,
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
									Tax Identification Number
								</Label>
								<Input
									placeholder="e.g. XX-XXXXXXX"
									value={details.taxIdentificationNumber}
									onChange={(e) =>
										onChange(
											"taxIdentificationNumber",
											e.target.value,
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
									BVN
								</Label>
								<Input
									placeholder="e.g. 22112233445"
									value={details.bvn}
									onChange={(e) =>
										onChange("bvn", e.target.value)
									}
								/>
							</div>
						</div>

						{/* Validate business */}
						<div
							className={cn(
								"flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border px-4 py-3",
								isBusinessValidated
									? "border-secondary/30 bg-secondary/5"
									: "border-border bg-muted/30",
							)}
						>
							<div className="flex items-center gap-2.5">
								{isBusinessValidated ? (
									<BadgeCheck
										size={18}
										className="text-secondary shrink-0"
									/>
								) : (
									<ShieldAlert
										size={18}
										className="text-muted-foreground shrink-0"
									/>
								)}
								<div>
									<p className="text-sm font-semibold">
										{isBusinessValidated
											? "Business validated"
											: "Business not yet validated"}
									</p>
									<p className="text-xs text-muted-foreground">
										We confirm your registration and TIN
										match official records.
									</p>
								</div>
							</div>
							<Button
								type="button"
								variant={
									isBusinessValidated ? "outline" : "default"
								}
								className="h-9 px-4 rounded-lg shrink-0 w-full sm:w-auto"
								onClick={onValidate}
								disabled={
									isValidatingTIN || isBusinessValidated
								}
							>
								{isValidatingTIN
									? "Validating..."
									: isBusinessValidated
										? "Validated"
										: "Validate Business"}
							</Button>
						</div>
					</div>

					<div className="flex items-center justify-end mt-8">
						<Button
							onClick={onNext}
							disabled={!canContinue}
							className="h-11 px-8 rounded-xl w-full sm:w-auto"
						>
							Continue <ArrowRight size={16} className="ml-2" />
						</Button>
					</div>
				</div>

				{/* Info cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
					<div className="bg-white rounded-xl p-4 border border-border flex items-start gap-3">
						<BadgeCheck
							size={18}
							className="text-primary mt-0.5 shrink-0"
						/>
						<div>
							<p className="text-sm font-semibold">
								Compliance Secure
							</p>
							<p className="text-muted-foreground text-xs mt-1 leading-relaxed">
								Your data is encrypted using banking-grade
								security standards during verification.
							</p>
						</div>
					</div>
					<div className="bg-white rounded-xl p-4 border border-border flex items-start gap-3">
						<div className="size-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
							<Info size={14} className="text-secondary" />
						</div>
						<div>
							<p className="text-sm font-semibold">
								Need assistance?
							</p>
							<p className="text-muted-foreground text-xs mt-1 leading-relaxed">
								Our support team is online and ready to help you
								with your business details.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Step 3: Operations ──────────────────────────────────────────────────────────

function Step3({
	lookups,
	isLookupsLoading,
	details,
	onChange,
	deliveryScope,
	toggleDeliveryScope,
	operatingHours,
	onUpdateOperatingHour,
	onNext,
	onBack,
}: {
	lookups: GetBusinessLookupsResponse | undefined;
	isLookupsLoading: boolean;
	details: OperationsDetailsState;
	onChange: <K extends keyof OperationsDetailsState>(
		field: K,
		value: OperationsDetailsState[K],
	) => void;
	deliveryScope: string[];
	toggleDeliveryScope: (key: string) => void;
	operatingHours: BusinessOperatingHourPayload[];
	onUpdateOperatingHour: (
		day: OperatingDay,
		field: "opensAt" | "closesAt" | "status",
		value: string,
	) => void;
	onNext: () => void;
	onBack: () => void;
}) {
	return (
		<div className="flex-1 overflow-y-auto py-6 sm:py-8 px-4 sm:px-8">
			<div className="max-w-2xl mx-auto">
				<CircleStepper currentStep={3} />

				<div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm space-y-6 sm:space-y-8">
					<div>
						<h2 className="text-2xl font-bold mb-2">
							Configure your operations.
						</h2>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Define how your logistics flow will function.
							We&apos;ll use these details to optimize your
							delivery matching and fleet management.
						</p>
					</div>

					{/* Contact */}
					<div className="space-y-2">
						<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
							Contact Number
						</Label>
						<div className="relative">
							<Phone
								size={15}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								className="pl-9"
								placeholder="+1 (555) 000-0000"
								value={details.contactNumber}
								onChange={(e) =>
									onChange("contactNumber", e.target.value)
								}
							/>
						</div>
					</div>

					{/* Delivery Scope */}
					<div className="space-y-3">
						<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
							Delivery Scope
						</Label>
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
										onClick={() => toggleDeliveryScope(value)}
										className={cn(
											"flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
											isActive
												? "bg-primary text-primary-foreground border-primary"
												: "bg-white text-foreground border-border hover:border-primary/50",
										)}
									>
										<Icon size={14} />
										{value}
									</button>
								);
							})}
						</div>
					</div>

					{/* Operating Hours */}
					<div className="space-y-3">
						<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
							Operating Hours
						</Label>
						<div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
							{operatingHours.length === 0 && (
								<p className="px-3 py-2.5 text-sm text-muted-foreground">
									{isLookupsLoading
										? "Loading operating days..."
										: "No operating days available."}
								</p>
							)}
							{operatingHours.map((hour) => {
								const label =
									lookups?.businessDaysOfWeek.find(
										(day) => day.key.toLowerCase() === hour.day,
									)?.value ??
									hour.day.charAt(0).toUpperCase() +
										hour.day.slice(1);
								const isOpen = hour.status === "open";
								return (
									<div
										key={hour.day}
										className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2.5 gap-2 sm:gap-3"
									>
										<div className="flex items-center gap-2.5 sm:w-32 shrink-0">
											<Switch
												checked={isOpen}
												onCheckedChange={(checked) =>
													onUpdateOperatingHour(
														hour.day,
														"status",
														checked
															? "open"
															: "closed",
													)
												}
											/>
											<span className="text-sm text-muted-foreground font-medium">
												{label}
											</span>
										</div>
										<div className="flex items-center gap-2 text-sm pl-11 sm:pl-0">
											<input
												type="time"
												value={hour.opensAt}
												disabled={!isOpen}
												onChange={(e) =>
													onUpdateOperatingHour(
														hour.day,
														"opensAt",
														e.target.value,
													)
												}
												className="border-0 bg-transparent text-sm focus:outline-none disabled:opacity-40"
											/>
											<span className="text-muted-foreground">
												–
											</span>
											<input
												type="time"
												value={hour.closesAt}
												disabled={!isOpen}
												onChange={(e) =>
													onUpdateOperatingHour(
														hour.day,
														"closesAt",
														e.target.value,
													)
												}
												className="border-0 bg-transparent text-sm focus:outline-none disabled:opacity-40"
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Fleet */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
								Fleet Size
							</Label>
							<Input
								type="number"
								min={1}
								value={details.fleetSize}
								onChange={(e) =>
									onChange(
										"fleetSize",
										Number(e.target.value),
									)
								}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between mt-6 gap-3">
					<Button
						onClick={onBack}
						variant="outline"
						className="h-11 px-4 sm:px-6 gap-2 rounded-xl"
					>
						<ArrowLeft size={16} /> Back
					</Button>
					<Button onClick={onNext} className="h-11 px-6 sm:px-8 rounded-xl">
						Continue <ArrowRight size={16} className="ml-2" />
					</Button>
				</div>
			</div>
		</div>
	);
}

// ─── Step 4: Identity ────────────────────────────────────────────────────────────

function Step4({
	details,
	onChange,
	onLogoSelect,
	onCoverSelect,
	businessName,
	deliveryScope,
	onBack,
	onComplete,
	isCompletingSetup,
	isUploadingLogo,
	isUploadingCover,
	logoProgress,
	coverProgress,
}: {
	details: IdentityDetailsState;
	onChange: <K extends keyof IdentityDetailsState>(
		field: K,
		value: IdentityDetailsState[K],
	) => void;
	onLogoSelect: (file: File | null) => void;
	onCoverSelect: (file: File | null) => void;
	businessName: string;
	deliveryScope: string[];
	onBack: () => void;
	onComplete: () => void;
	isCompletingSetup: boolean;
	isUploadingLogo: boolean;
	isUploadingCover: boolean;
	logoProgress: number;
	coverProgress: number;
}) {
	const scopeTags = deliveryScope;

	return (
		<div className="flex-1 overflow-y-auto py-6 sm:py-8 px-4 sm:px-8">
			<div className="max-w-4xl mx-auto">
				<CircleStepper currentStep={4} />
				<h2 className="text-xl sm:text-2xl font-bold mb-4">
					Finalize your identity.
				</h2>

				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left: Form */}
					<div className="flex-1 space-y-5 min-w-0">
						{/* Description */}
						<div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
							<h3 className="text-base font-semibold">
								Business Description
							</h3>
							<Textarea
								rows={5}
								placeholder="Describe your logistics specialty, service areas, and company mission..."
								className="resize-none"
								value={details.businessDescription}
								onChange={(e) =>
									onChange(
										"businessDescription",
										e.target.value,
									)
								}
							/>
							<p className="text-xs text-muted-foreground italic">
								This description will be visible to potential
								partners and clients on your profile.
							</p>
						</div>

						{/* Logo + Cover */}
						<div className="bg-white rounded-2xl p-6 shadow-sm">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<h3 className="text-base font-semibold">
										Business Logo
									</h3>
									<label className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center py-10 gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden relative">
										{details.logoPreviewUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={details.logoPreviewUrl}
												alt="Business logo preview"
												className="absolute inset-0 w-full h-full object-cover"
											/>
										) : (
											<>
												<Upload
													size={26}
													className="text-muted-foreground"
												/>
												<p className="text-sm font-medium">
													Upload Logo
												</p>
												<p className="text-xs text-muted-foreground text-center leading-relaxed">
													Drag and drop or click
													<br />
													to browse
												</p>
											</>
										)}
										{isUploadingLogo && (
											<div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 z-10 px-6">
												<p className="text-xs font-semibold text-primary">
													{logoProgress}%
												</p>
												<div className="w-full bg-muted rounded-full h-1.5">
													<div
														className="bg-primary h-1.5 rounded-full transition-all duration-150"
														style={{ width: `${logoProgress}%` }}
													/>
												</div>
												<p className="text-[11px] text-muted-foreground">
													Uploading logo...
												</p>
											</div>
										)}
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) =>
												onLogoSelect(
													e.target.files?.[0] ?? null,
												)
											}
										/>
									</label>
								</div>
								<div className="space-y-2">
									<h3 className="text-base font-semibold">
										Cover Image
									</h3>
									<label className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center py-10 gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors bg-muted/20 overflow-hidden relative">
										{details.coverPreviewUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={details.coverPreviewUrl}
												alt="Cover image preview"
												className="absolute inset-0 w-full h-full object-cover"
											/>
										) : (
											<>
												<Upload
													size={26}
													className="text-muted-foreground"
												/>
												<p className="text-sm font-medium">
													Upload Cover
												</p>
												<p className="text-xs text-muted-foreground">
													Optimal size 1200x400px
												</p>
											</>
										)}
										{isUploadingCover && (
											<div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 z-10 px-6">
												<p className="text-xs font-semibold text-primary">
													{coverProgress}%
												</p>
												<div className="w-full bg-muted rounded-full h-1.5">
													<div
														className="bg-primary h-1.5 rounded-full transition-all duration-150"
														style={{ width: `${coverProgress}%` }}
													/>
												</div>
												<p className="text-[11px] text-muted-foreground">
													Uploading cover...
												</p>
											</div>
										)}
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) =>
												onCoverSelect(
													e.target.files?.[0] ?? null,
												)
											}
										/>
									</label>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-between gap-3">
							<Button
								onClick={onBack}
								variant="outline"
								className="h-11 px-4 sm:px-6 gap-2 rounded-xl"
								disabled={isCompletingSetup}
							>
								<ArrowLeft size={16} /> Back
							</Button>
							<Button
								onClick={onComplete}
								disabled={isCompletingSetup}
								className="h-11 px-6 sm:px-8 rounded-xl"
							>
								{isCompletingSetup
									? "Completing..."
									: "Complete Setup"}{" "}
								<Rocket size={16} className="ml-2" />
							</Button>
						</div>
					</div>

					{/* Right: Storefront Preview */}
					<div className="w-full lg:w-72 shrink-0 space-y-4">
						<div className="flex items-center gap-2">
							<Eye size={14} className="text-primary" />
							<span className="text-[11px] font-bold uppercase tracking-wider text-primary">
								Storefront Preview
							</span>
						</div>

						<div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border">
							{/* Cover image placeholder */}
							<div
								className="h-24 bg-gradient-to-br from-amber-700 to-amber-900 relative bg-cover bg-center"
								style={
									details.coverPreviewUrl
										? {
												backgroundImage: `url(${details.coverPreviewUrl})`,
											}
										: undefined
								}
							>
								<div className="absolute bottom-0 left-4 translate-y-1/2 size-11 rounded-xl bg-white border-2 border-white flex items-center justify-center shadow overflow-hidden">
									{details.logoPreviewUrl ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={details.logoPreviewUrl}
											alt="Business logo"
											className="w-full h-full object-cover"
										/>
									) : (
										<Store
											size={18}
											className="text-foreground"
										/>
									)}
								</div>
							</div>
							<div className="px-4 pt-8 pb-4">
								<h4 className="font-bold text-base truncate">
									{businessName || "Your Business Name"}
								</h4>
								<div className="flex items-center gap-1 mt-0.5">
									<BadgeCheck
										size={13}
										className="text-primary"
									/>
									<span className="text-xs text-primary font-medium">
										Verified Fleet Provider
									</span>
								</div>
								<div className="mt-3 space-y-1.5 min-h-8">
									{details.businessDescription ? (
										<p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
											{details.businessDescription}
										</p>
									) : (
										<>
											<div className="h-2 bg-muted rounded-full w-full" />
											<div className="h-2 bg-muted rounded-full w-3/4" />
										</>
									)}
								</div>
								<div className="flex gap-2 mt-3 flex-wrap">
									{scopeTags.length > 0 ? (
										scopeTags.map((tag) => (
											<span
												key={tag}
												className="text-[10px] font-semibold bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase"
											>
												{tag}
											</span>
										))
									) : (
										<span className="text-[10px] font-semibold bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
											LAST MILE
										</span>
									)}
								</div>
								<button className="w-full mt-4 text-[11px] font-semibold border border-border rounded-lg py-2 hover:bg-muted transition-colors uppercase tracking-wider">
									View Full Profile
								</button>
							</div>
						</div>

						{/* Why identity matters */}
						<div className="bg-primary rounded-2xl p-4 text-white">
							<p className="text-sm font-bold mb-1">
								Why identity matters?
							</p>
							<p className="text-white/70 text-xs leading-relaxed">
								Profiles with complete descriptions and
								high-quality visuals receive 45% more booking
								requests on the Drova network.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Main Page ───────────────────────────────────────────────────────────────────

const DEFAULT_OPERATING_HOURS_BY_DAY: Record<
	string,
	{ opensAt: string; closesAt: string }
> = {
	saturday: { opensAt: "09:00", closesAt: "14:00" },
	sunday: { opensAt: "09:00", closesAt: "14:00" },
};

function SetupPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [step, setStep] = useState(1);
	const [otp, setOtp] = useState("");
	const email = searchParams.get("email") || getSignupSetupEmail() || "";

	const { data: lookupsResponse, isLoading: isLookupsLoading } =
		business.getBusinessLookups.useQuery();
	const lookups = lookupsResponse?.data;

	const [businessDetails, setBusinessDetails] =
		useState<BusinessDetailsState>({
			businessName: "",
			businessState: "",
			businessAddress: "",
			longitude: "",
			latitude: "",
			businessRegistrationNumber: "",
			taxIdentificationNumber: "",
			bvn: "",
		});
	const [isBusinessValidated, setIsBusinessValidated] = useState(false);

	const [operationsDetails, setOperationsDetails] =
		useState<OperationsDetailsState>({
			contactNumber: "",
			fleetSize: 1,
		});
	const [deliveryScope, setDeliveryScope] = useState<string[]>([]);
	const [operatingHours, setOperatingHours] = useState<
		BusinessOperatingHourPayload[]
	>([]);

	const [identityDetails, setIdentityDetails] =
		useState<IdentityDetailsState>({
			businessDescription: "",
			logoPreviewUrl: null,
			coverPreviewUrl: null,
			logoUrl: null,
			coverUrl: null,
		});

	useEffect(() => {
		if (!email) {
			router.replace("/signup");
			return;
		}

		storeSignupSetupEmail(email);
	}, [email, router]);

	useEffect(() => {
		if (!lookups?.businessDaysOfWeek?.length || operatingHours.length > 0) {
			return;
		}

		setOperatingHours(
			lookups.businessDaysOfWeek.map(({ key }) => ({
				day: key.toLowerCase() as OperatingDay,
				opensAt:
					DEFAULT_OPERATING_HOURS_BY_DAY[key]?.opensAt ?? "08:00",
				closesAt:
					DEFAULT_OPERATING_HOURS_BY_DAY[key]?.closesAt ?? "18:00",
				status: "open",
			})),
		);
	}, [lookups?.businessDaysOfWeek, operatingHours.length]);

	useEffect(() => {
		return () => {
			if (identityDetails.logoPreviewUrl) {
				URL.revokeObjectURL(identityDetails.logoPreviewUrl);
			}
			if (identityDetails.coverPreviewUrl) {
				URL.revokeObjectURL(identityDetails.coverPreviewUrl);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { mutate: validateEmail, isPending: isVerifying } =
		auth.validateEmail.useMutation({
			onSuccess: (response) => {
				const tempToken = response.data?.tempToken;

				if (!tempToken) {
					toast.error(
						"Verification succeeded but no temp token was returned.",
					);
					return;
				}

				storeSignupSetupTempToken(tempToken);
				toast.success(
					response.message || "Email verified successfully",
				);
				setStep(2);
			},
			onError: (error) => {
				const message = axios.isAxiosError(error)
					? error.response?.data?.message
					: undefined;

				if (message === "Email is already verified") {
					toast.info(message);
					router.replace("/login");
					return;
				}

				toast.error(message || "Unable to verify email. Try again.");
			},
		});

	const { mutate: resendOTP, isPending: isResending } =
		auth.resendOTP.useMutation({
			onSuccess: (response) => {
				toast.success(response.message || "A new OTP has been sent.");
			},
			onError: (error) => {
				const message = axios.isAxiosError(error)
					? error.response?.data?.message
					: undefined;
				toast.error(message || "Unable to resend OTP right now.");
			},
		});

	const { mutate: validateTIN, isPending: isValidatingTIN } =
		business.validateTIN.useMutation({
			onSuccess: (response) => {
				setIsBusinessValidated(true);
				toast.success(
					response.message || "Business validated successfully",
				);
			},
			onError: (error) => {
				const message = axios.isAxiosError(error)
					? error.response?.data?.message
					: undefined;
				toast.error(
					message || "Unable to validate business right now.",
				);
			},
		});

	const { mutate: completeSetup, isPending: isCompletingSetup } =
		business.profileSetup.useMutation({
			onSuccess: (response) => {
				toast.success(
					response.message || "Business profile setup complete",
				);
				clearSignupSetupEmail();
				clearSignupSetupTempToken();
				router.push("/dashboard");
			},
			onError: (error) => {
				const message = axios.isAxiosError(error)
					? error.response?.data?.message
					: undefined;
				toast.error(
					message || "Unable to complete business setup. Try again.",
				);
			},
		});

	const [logoProgress, setLogoProgress] = useState(0);
	const [coverProgress, setCoverProgress] = useState(0);

	const { mutate: uploadLogoMutation, isPending: isUploadingLogo } =
		upload.logo.useMutation({
			onSuccess: (response) => {
				setLogoProgress(0);
				if (response.data?.url) {
					setIdentityDetails((prev) => ({
						...prev,
						logoUrl: response.data!.url,
					}));
				}
			},
			onError: () => {
				setLogoProgress(0);
				toast.error("Logo upload failed. Please try again.");
				setIdentityDetails((prev) => ({
					...prev,
					logoPreviewUrl: null,
					logoUrl: null,
				}));
			},
		});

	const { mutate: uploadCoverMutation, isPending: isUploadingCover } =
		upload.cover.useMutation({
			onSuccess: (response) => {
				setCoverProgress(0);
				if (response.data?.url) {
					setIdentityDetails((prev) => ({
						...prev,
						coverUrl: response.data!.url,
					}));
				}
			},
			onError: () => {
				setCoverProgress(0);
				toast.error("Cover upload failed. Please try again.");
				setIdentityDetails((prev) => ({
					...prev,
					coverPreviewUrl: null,
					coverUrl: null,
				}));
			},
		});

	const handleVerifyEmail = () => {
		if (!email) {
			router.replace("/signup");
			return;
		}

		if (otp.length !== 6) {
			toast.error("Enter the 6-digit OTP sent to your email.");
			return;
		}

		validateEmail({ email, otp });
	};

	const handleResendOTP = () => {
		if (!email) {
			router.replace("/signup");
			return;
		}

		resendOTP({ email });
	};

	const handleBusinessDetailsChange = <K extends keyof BusinessDetailsState>(
		field: K,
		value: BusinessDetailsState[K],
	) => {
		setBusinessDetails((prev) => ({ ...prev, [field]: value }));

		if (
			isBusinessValidated &&
			(field === "businessName" ||
				field === "businessRegistrationNumber" ||
				field === "taxIdentificationNumber")
		) {
			setIsBusinessValidated(false);
		}
	};

	const handleValidateBusiness = () => {
		if (
			!businessDetails.businessName ||
			!businessDetails.businessRegistrationNumber ||
			!businessDetails.taxIdentificationNumber
		) {
			toast.error(
				"Enter the business name, registration number, and TIN before validating.",
			);
			return;
		}

		validateTIN({
			businessName: businessDetails.businessName,
			businessRegistrationNumber:
				businessDetails.businessRegistrationNumber,
			taxIdentificationNumber: businessDetails.taxIdentificationNumber,
		});
	};

	const handleOperationsDetailsChange = <
		K extends keyof OperationsDetailsState,
	>(
		field: K,
		value: OperationsDetailsState[K],
	) => {
		setOperationsDetails((prev) => ({ ...prev, [field]: value }));
	};

	const toggleInArray = (
		setter: React.Dispatch<React.SetStateAction<string[]>>,
		key: string,
	) => {
		setter((prev) =>
			prev.includes(key)
				? prev.filter((item) => item !== key)
				: [...prev, key],
		);
	};

	const handleUpdateOperatingHour = (
		day: OperatingDay,
		field: "opensAt" | "closesAt" | "status",
		value: string,
	) => {
		setOperatingHours((prev) =>
			prev.map((hour) =>
				hour.day === day ? { ...hour, [field]: value } : hour,
			),
		);
	};

	const handleIdentityDetailsChange = <K extends keyof IdentityDetailsState>(
		field: K,
		value: IdentityDetailsState[K],
	) => {
		setIdentityDetails((prev) => ({ ...prev, [field]: value }));
	};

	const handleLogoSelect = (file: File | null) => {
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			toast.error("Logo must be under 2MB.");
			return;
		}

		setIdentityDetails((prev) => {
			if (prev.logoPreviewUrl) URL.revokeObjectURL(prev.logoPreviewUrl);
			return {
				...prev,
				logoPreviewUrl: URL.createObjectURL(file),
				logoUrl: null,
			};
		});

		uploadLogoMutation({ file, onProgress: setLogoProgress });
	};

	const handleCoverSelect = (file: File | null) => {
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			toast.error("Cover image must be under 2MB.");
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			if (img.naturalWidth < 1200 || img.naturalHeight < 400) {
				toast.warning(
					`Image is ${img.naturalWidth}×${img.naturalHeight}px — it will be cropped to 1200×400px.`,
				);
			}

			setIdentityDetails((prev) => {
				if (prev.coverPreviewUrl) URL.revokeObjectURL(prev.coverPreviewUrl);
				return { ...prev, coverPreviewUrl: objectUrl, coverUrl: null };
			});

			uploadCoverMutation({ file, onProgress: setCoverProgress });
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			toast.error("Could not read image file. Please try another.");
		};

		img.src = objectUrl;
	};

	const handleCompleteSetup = () => {
		completeSetup({
			businessName: businessDetails.businessName,
			businessDescription: identityDetails.businessDescription,
			businessAddress: businessDetails.businessAddress,
			businessState: businessDetails.businessState,
			location: {
				type: "Point",
				coordinates: [
					Number(businessDetails.longitude),
					Number(businessDetails.latitude),
				],
			},
			deliveryScope: deliveryScope as DeliveryScope[],
			fleetSize: operationsDetails.fleetSize,
			businessRegistrationNumber:
				businessDetails.businessRegistrationNumber,
			taxIdentificationNumber: businessDetails.taxIdentificationNumber,
			bvn: businessDetails.bvn,
			contactNumber: operationsDetails.contactNumber,
			businessLogo: identityDetails.logoUrl ?? "",
			coverImage: identityDetails.coverUrl ?? "",
			operatingHours,
		});
	};

	const states = useMemo(() => lookups?.states ?? [], [lookups]);

	return (
		<div className="min-h-screen flex flex-col bg-muted">
			<TopNav step={step} />

			{step === 1 ? (
				<Step1
					email={email}
					otp={otp}
					setOtp={setOtp}
					onNext={handleVerifyEmail}
					onResend={handleResendOTP}
					isVerifying={isVerifying}
					isResending={isResending}
				/>
			) : (
				<div className="flex flex-1 overflow-hidden">
					{step === 2 && (
						<Step2
							states={states}
							isLookupsLoading={isLookupsLoading}
							details={businessDetails}
							onChange={handleBusinessDetailsChange}
							isBusinessValidated={isBusinessValidated}
							isValidatingTIN={isValidatingTIN}
							onValidate={handleValidateBusiness}
							onNext={() => setStep(3)}
						/>
					)}
					{step === 3 && (
						<Step3
							lookups={lookups}
							isLookupsLoading={isLookupsLoading}
							details={operationsDetails}
							onChange={handleOperationsDetailsChange}
							deliveryScope={deliveryScope}
							toggleDeliveryScope={(key) =>
								toggleInArray(setDeliveryScope, key)
							}
							operatingHours={operatingHours}
							onUpdateOperatingHour={handleUpdateOperatingHour}
							onNext={() => setStep(4)}
							onBack={() => setStep(2)}
						/>
					)}
					{step === 4 && (
						<Step4
							details={identityDetails}
							onChange={handleIdentityDetailsChange}
							onLogoSelect={handleLogoSelect}
							onCoverSelect={handleCoverSelect}
							businessName={businessDetails.businessName}
							deliveryScope={deliveryScope}
							onBack={() => setStep(3)}
							onComplete={handleCompleteSetup}
							isCompletingSetup={
								isCompletingSetup ||
								isUploadingLogo ||
								isUploadingCover
							}
							isUploadingLogo={isUploadingLogo}
							isUploadingCover={isUploadingCover}
							logoProgress={logoProgress}
							coverProgress={coverProgress}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default function SetupPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
					Loading...
				</div>
			}
		>
			<SetupPageContent />
		</Suspense>
	);
}
