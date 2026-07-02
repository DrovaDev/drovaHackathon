"use client";

import { auth } from "@/api/router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	clearSignupSetupTempToken,
	storeSignupSetupEmail,
} from "@/lib/setup-session";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
	.object({
		email: z
			.string()
			.min(1, "Email is required")
			.email("Enter a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Confirm your password"),
		acceptTerms: z.boolean().refine((value) => value, {
			message:
				"You must agree to the Terms of Service and Privacy Policy",
		}),
	})
	.refine((values) => values.password === values.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			acceptTerms: false,
		},
	});

	const { mutate: registerAccount, isPending } = auth.register.useMutation({
		onSuccess: (response, variables) => {
			const email = (response.data?.email || variables.email) as string;
			storeSignupSetupEmail(email);
			clearSignupSetupTempToken();
			toast.success(response.message || "Account created successfully");
			router.push(`/setup?email=${encodeURIComponent(email)}`);
		},
		onError: (error) => {
			const message = axios.isAxiosError(error)
				? error.response?.data?.message
				: undefined;
			toast.error(message || "Unable to create your account right now.");
		},
	});

	const onSubmit = handleSubmit(({ email, password }) => {
		registerAccount({
			email,
			password,
			userType: "business",
		});
	});

	return (
		<section className="bg-muted min-h-screen flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-xl space-y-8">
				<div className="flex flex-col items-center space-y-3">
					<Image
						src="/assets/logo.png"
						alt="Drova logo"
						width={100}
						height={100}
					/>
					<h3 className="text-lg font-medium text-center">
						Business Intelligence Dashboard
					</h3>
				</div>

				<Card className="w-full px-4 py-6 sm:px-6 sm:py-8">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">
							Start your delivery business today.
						</CardTitle>
						<CardDescription>
							Join the network of premium logistics partners
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-6">
						<form
							className="space-y-6"
							onSubmit={onSubmit}
							noValidate
						>
							<div className="grid gap-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									type="email"
									id="email"
									placeholder="name@company.com"
									aria-invalid={!!errors.email}
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										type={
											showPassword ? "text" : "password"
										}
										id="password"
										placeholder="Enter your password"
										aria-invalid={!!errors.password}
										className="pr-12"
										{...register("password")}
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(
												(current) => !current,
											)
										}
										className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
										aria-label={
											showPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="confirm-password">
									Confirm Password
								</Label>
								<div className="relative">
									<Input
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										id="confirm-password"
										placeholder="Re-enter your password"
										aria-invalid={!!errors.confirmPassword}
										className="pr-12"
										{...register("confirmPassword")}
									/>
									<button
										type="button"
										onClick={() =>
											setShowConfirmPassword(
												(current) => !current,
											)
										}
										className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
										aria-label={
											showConfirmPassword
												? "Hide confirm password"
												: "Show confirm password"
										}
									>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
								{errors.confirmPassword && (
									<p className="text-sm text-destructive">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>

							<div className="flex items-start gap-2">
								<Controller
									name="acceptTerms"
									control={control}
									render={({ field }) => (
										<Checkbox
											id="toggle-reminder"
											name="toggle-reminder"
											checked={field.value}
											onCheckedChange={(checked) =>
												field.onChange(checked === true)
											}
										/>
									)}
								/>
								<div className="space-y-1">
									<Label htmlFor="toggle-reminder">
										I agree to the
										<span className="font-bold">
											Terms of Service
										</span>
										and{" "}
										<span className="font-bold">
											Privacy Policy
										</span>
									</Label>
									{errors.acceptTerms && (
										<p className="text-sm text-destructive">
											{errors.acceptTerms.message}
										</p>
									)}
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isPending}
							>
								{isPending
									? "Creating Account..."
									: "Create Account"}
							</Button>
						</form>

						<Separator className="my-6" />

						<p className="text-muted-foreground font-medium text-center">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-primary font-bold underline-offset-4 hover:underline"
							>
								Log in
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
			<div></div>
		</section>
	);
}
