"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { wallet } from "@/services/router";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/ui/material-icon";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

const PIN_LENGTH = 4;

function PinField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div>
			<label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
				{label}
			</label>
			<InputOTP
				maxLength={PIN_LENGTH}
				value={value}
				onChange={(val) => onChange(val.replace(/\D/g, ""))}
				inputMode="numeric"
			>
				<InputOTPGroup className="gap-2">
					{Array.from({ length: PIN_LENGTH }).map((_, i) => (
						<InputOTPSlot
							key={i}
							index={i}
							className="size-12 rounded-xl border-2 text-lg font-bold"
						/>
					))}
				</InputOTPGroup>
			</InputOTP>
		</div>
	);
}

function getErrorMessage(error: Error, fallback: string) {
	return (
		(error as AxiosError<{ message: string }>).response?.data?.message ||
		fallback
	);
}

export default function PayoutPinPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: walletData, isLoading: walletLoading } =
		wallet.get.useQuery();
	const hasWithdrawalPin = walletData?.data?.hasWithdrawalPin ?? false;

	const [pin, setPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
	const [currentPin, setCurrentPin] = useState("");
	const [newPin, setNewPin] = useState("");
	const [confirmNewPin, setConfirmNewPin] = useState("");

	const goBackToPayout = () => {
		queryClient.invalidateQueries({ queryKey: ["wallet"] });
		router.push("/dashboard/payout");
	};

	const setPinMutation = wallet.setWithdrawalPin.useMutation({
		onSuccess: () => {
			toast.success("Payout PIN set successfully");
			goBackToPayout();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Failed to set payout PIN")),
	});

	const updatePinMutation = wallet.updateWithdrawalPin.useMutation({
		onSuccess: () => {
			toast.success("Payout PIN updated successfully");
			goBackToPayout();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Failed to update payout PIN")),
	});

	const handleSetPin = () => {
		if (pin.length !== PIN_LENGTH || confirmPin.length !== PIN_LENGTH) return;
		if (pin !== confirmPin) {
			toast.error("PINs do not match");
			return;
		}
		setPinMutation.mutate({ pin });
	};

	const handleUpdatePin = () => {
		if (
			currentPin.length !== PIN_LENGTH ||
			newPin.length !== PIN_LENGTH ||
			confirmNewPin.length !== PIN_LENGTH
		)
			return;
		if (newPin !== confirmNewPin) {
			toast.error("New PINs do not match");
			return;
		}
		if (newPin === currentPin) {
			toast.error("New PIN must be different from current PIN");
			return;
		}
		updatePinMutation.mutate({ currentPin, newPin });
	};

	return (
		<div className="px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-xl mx-auto">
			<div>
				<button
					onClick={() => router.push("/dashboard/payout")}
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
				>
					<MaterialIcon
						name="arrow_back"
						size={16}
						color="var(--muted-foreground)"
					/>
					Back to Payout
				</button>
				<h1 className="text-2xl font-extrabold text-primary tracking-tight">
					{hasWithdrawalPin ? "Change Payout PIN" : "Set Payout PIN"}
				</h1>
				<p className="text-muted-foreground text-sm mt-0.5">
					{hasWithdrawalPin
						? "Update the PIN used to authorize withdrawals from your wallet."
						: "Create a 4-digit PIN to authorize withdrawals from your wallet."}
				</p>
			</div>

			<div className="bg-popover rounded-2xl border border-border p-6 sm:p-8">
				{walletLoading ? (
					<p className="text-sm text-muted-foreground">Loading...</p>
				) : hasWithdrawalPin ? (
					<div className="space-y-6">
						<PinField
							label="Current PIN"
							value={currentPin}
							onChange={setCurrentPin}
						/>
						<PinField label="New PIN" value={newPin} onChange={setNewPin} />
						<PinField
							label="Confirm New PIN"
							value={confirmNewPin}
							onChange={setConfirmNewPin}
						/>
						<div className="flex gap-3 pt-2">
							<Button
								variant="ghost"
								className="flex-1"
								onClick={() => router.push("/dashboard/payout")}
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={
									currentPin.length !== PIN_LENGTH ||
									newPin.length !== PIN_LENGTH ||
									confirmNewPin.length !== PIN_LENGTH ||
									updatePinMutation.isPending
								}
								onClick={handleUpdatePin}
							>
								<MaterialIcon name="lock_reset" size={14} color="white" />
								{updatePinMutation.isPending
									? "Updating..."
									: "Update PIN"}
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						<PinField label="Enter PIN" value={pin} onChange={setPin} />
						<PinField
							label="Confirm PIN"
							value={confirmPin}
							onChange={setConfirmPin}
						/>
						<div className="flex gap-3 pt-2">
							<Button
								variant="ghost"
								className="flex-1"
								onClick={() => router.push("/dashboard/payout")}
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={
									pin.length !== PIN_LENGTH ||
									confirmPin.length !== PIN_LENGTH ||
									setPinMutation.isPending
								}
								onClick={handleSetPin}
							>
								<MaterialIcon name="lock" size={14} color="white" />
								{setPinMutation.isPending ? "Saving..." : "Set PIN"}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
