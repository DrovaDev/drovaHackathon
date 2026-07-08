"use client";

import { auth } from "@/services/router";
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
import { setAccessTokenCookie } from "@/lib/auth-cookie";
import { storeUserSession } from "@/lib/user-session";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
	const router = useRouter();
	const [keepLoggedIn, setKeepLoggedIn] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const { mutate: login, isPending } = auth.login.useMutation({
		onSuccess: (response) => {
			if (response.data?.accessToken) {
				setAccessTokenCookie(response.data.accessToken, {
					persistent: keepLoggedIn,
				});
				window.localStorage.removeItem("token");
			}
			if (response.data?.user) {
				storeUserSession({
					businessName: response.data.user.business?.businessName ?? "",
					email: response.data.user.email ?? "",
				});
			}
			toast.success(response.message || "Logged in successfully");
			if (response.data?.user?.hasCompletedBusinessProfile === false) {
				const email = response.data.user.email ?? "";
				router.push(`/setup?step=2&email=${encodeURIComponent(email)}`);
			} else {
				router.push("/dashboard");
			}
		},
		onError: (error) => {
			const message = axios.isAxiosError(error)
				? error.response?.data?.message
				: undefined;
			toast.error(
				message || "Unable to log in. Please check your credentials and try again.",
			);
		},
	});

	const onSubmit = handleSubmit((values) => {
		login({ ...values, userType: "business" });
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
							Welcome back
						</CardTitle>
						<CardDescription>
							Please enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-6">
						<form className="space-y-6" onSubmit={onSubmit} noValidate>
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
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input
									type="password"
									id="password"
									placeholder="••••••••"
									aria-invalid={!!errors.password}
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Checkbox
									id="toggle-reminder"
									name="toggle-reminder"
									checked={keepLoggedIn}
									onCheckedChange={(checked) =>
										setKeepLoggedIn(checked === true)
									}
								/>
								<Label htmlFor="toggle-reminder">
									Keep me logged in
								</Label>
							</div>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Signing in..." : "Sign in to Dashboard"}
							</Button>
						</form>

						<Separator className="my-6" />

						<p className="text-muted-foreground font-medium text-center">
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="text-primary font-bold underline-offset-4 hover:underline"
							>
								Sign up
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
			<div></div>
		</section>
	);
};

export default Login;
