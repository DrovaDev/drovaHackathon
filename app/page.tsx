"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MaterialIcon from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

const PROBLEM_POINTS = [
	"WhatsApp groups and phone calls to coordinate riders",
	"No branded page for customers to book or pay",
	"Cash handoffs and disputes with no paper trail",
	"No visibility into rider location or delivery status",
	"No record of revenue, order volume, or performance",
] as const;

const SOLUTION_POINTS = [
	"A structured dashboard for orders, riders, and payouts",
	"A branded storefront where customers book online",
	"P2P-secured payments held safely until delivery",
	"Real-time tracking links for every order",
	"Revenue, fulfillment, and trend analytics built in",
] as const;

const MODULES = [
	{
		icon: "dashboard",
		title: "Smart dashboard",
		description: "One home base for the health of the business.",
		points: ["Revenue and order-trend charts", "Fulfillment-rate tracking", "Peak-hour demand insights"],
	},
	{
		icon: "storefront",
		title: "Branded storefront",
		description: "A professional page customers can order from directly.",
		points: ["No website or code required", "Your logo, colors, and pricing", "Live order status for customers"],
	},
	{
		icon: "local_shipping",
		title: "Orders & tracking",
		description: "Create, assign, and follow every delivery.",
		points: ["Create and manage orders in one place", "Shareable live tracking links", "Full order history and notes"],
	},
	{
		icon: "people_alt",
		title: "Rider management",
		description: "Know who's available and how they're performing.",
		points: ["Live rider availability", "Assign deliveries in a click", "Per-rider payout records"],
	},
	{
		icon: "account_balance_wallet",
		title: "Secure payments",
		description: "Get paid without the manual reconciliation.",
		points: ["P2P-secured wallet", "Simple withdrawal requests", "Full transaction history"],
	},
] as const;

const STEPS = [
	{
		step: "01",
		icon: "person_add",
		title: "Create your account",
		description: "Sign up and tell us a little about your delivery business.",
	},
	{
		step: "02",
		icon: "storefront",
		title: "Set up your storefront",
		description: "Add your branding and delivery pricing — your storefront is ready in minutes.",
	},
	{
		step: "03",
		icon: "local_shipping",
		title: "Take orders and get paid",
		description: "Start receiving orders, dispatch riders, and track payouts from one dashboard.",
	},
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.93 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

const stagger = (amount = 0.12): Variants => ({
	hidden: {},
	visible: { transition: { staggerChildren: amount } },
});

const viewportOnce = { once: true, amount: 0.25 as const };

function PillBadge({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<Badge
			variant="outline"
			className={cn(
				"gap-1.5 rounded-full border-secondary/30 bg-secondary/10 px-3 py-1 text-secondary",
				className
			)}
		>
			<MaterialIcon name="bolt" size={13} />
			{children}
		</Badge>
	);
}

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="fixed top-3 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4">
				<div className="flex items-center justify-between rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md sm:px-5">
					<div className="flex items-center gap-2">
						<Image src="/assets/logo.png" alt="Drova logo" width={64} height={64} className="rounded-md" />
					</div>
					<nav className="flex items-center gap-2">
						<Button variant="ghost" className="rounded-full" nativeButton={false} render={<Link href="/login" />}>
							Log in
						</Button>
						<Button
							className="rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-95"
							nativeButton={false}
							render={<Link href="/signup" />}
						>
							Get started
						</Button>
					</nav>
				</div>
			</header>

			<main>
				{/* Hero */}
				<section className="relative overflow-hidden bg-primary text-primary-foreground">
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.15]"
						style={{
							backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
							backgroundSize: "22px 22px",
						}}
						aria-hidden
					/>
					<motion.div
						className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-secondary/20 blur-3xl"
						animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
						transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
						aria-hidden
					/>
					<motion.div
						className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-accent/15 blur-3xl"
						animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
						transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
						aria-hidden
					/>

					<motion.div
						className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
						variants={stagger(0.14)}
						initial="hidden"
						animate="visible"
					>
						<div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
							<motion.div variants={fadeUp}>
								<PillBadge>Business intelligence dashboard for couriers</PillBadge>
							</motion.div>
							<motion.h1
								variants={fadeUp}
								className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl"
							>
								Run your delivery
								<br />
								<span className="text-secondary">business like a pro</span>
							</motion.h1>
							<motion.p variants={fadeUp} className="text-balance text-lg text-primary-foreground/75">
								Drova gives your courier company a branded storefront, smart dashboard,
								P2P-secured payments, and real-time rider tracking — with zero technical
								setup required.
							</motion.p>
							<motion.div variants={fadeUp} className="mt-2 flex flex-col gap-3 sm:flex-row">
								<Button
									size="lg"
									variant="secondary"
									className="rounded-full px-7 transition-transform duration-200 hover:scale-[1.04] active:scale-95"
									nativeButton={false}
									render={<Link href="/signup" />}
								>
									Get started free
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="rounded-full border-primary-foreground/25 bg-transparent px-7 text-primary-foreground transition-transform duration-200 hover:scale-[1.04] hover:bg-primary-foreground/10 hover:text-primary-foreground active:scale-95"
									nativeButton={false}
									render={<Link href="#features" />}
								>
									See how it works
								</Button>
							</motion.div>
						</div>
						<motion.div
							variants={fadeUp}
							className="mx-auto mt-16 flex max-w-2xl flex-col gap-6 border-t border-primary-foreground/15 pt-8 text-center sm:flex-row sm:justify-between sm:text-left"
						>
							<div>
								<p className="text-2xl font-bold text-secondary">Zero</p>
								<p className="text-sm text-primary-foreground/60">Technical setup</p>
							</div>
							<div>
								<p className="text-2xl font-bold text-secondary">P2P</p>
								<p className="text-sm text-primary-foreground/60">Secured payments</p>
							</div>
							<div>
								<p className="text-2xl font-bold text-secondary">Real-time</p>
								<p className="text-sm text-primary-foreground/60">Rider tracking</p>
							</div>
						</motion.div>
					</motion.div>

					<motion.div
						className="relative flex justify-center pb-6 text-primary-foreground/50"
						animate={{ y: [0, 8, 0] }}
						transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
						aria-hidden
					>
						<MaterialIcon name="expand_more" size={26} />
					</motion.div>
				</section>

				{/* Problem / Solution */}
				<motion.section
					className="bg-primary/95 text-primary-foreground"
					variants={stagger()}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
						<motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
							<p className="text-sm font-semibold tracking-wide text-secondary uppercase">The problem</p>
							<h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
								Running deliveries shouldn&apos;t mean juggling five apps and a notebook
							</h2>
						</motion.div>
						<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
							<motion.div
								variants={scaleIn}
								className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 sm:p-8"
							>
								<div className="flex items-center gap-2.5">
									<span className="flex size-6 items-center justify-center rounded-full bg-destructive/20 text-destructive">
										<MaterialIcon name="close" size={14} />
									</span>
									<h3 className="text-base font-medium">Without Drova</h3>
								</div>
								<motion.ul variants={stagger(0.08)} className="mt-5 space-y-3.5">
									{PROBLEM_POINTS.map((point) => (
										<motion.li
											key={point}
											variants={fadeUp}
											className="flex items-start gap-2.5 text-sm text-primary-foreground/70"
										>
											<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/60" />
											{point}
										</motion.li>
									))}
								</motion.ul>
							</motion.div>
							<motion.div
								variants={scaleIn}
								className="rounded-2xl border border-secondary/25 bg-secondary/10 p-6 sm:p-8"
							>
								<div className="flex items-center gap-2.5">
									<span className="flex size-6 items-center justify-center rounded-full bg-secondary/25 text-secondary">
										<MaterialIcon name="check" size={14} />
									</span>
									<h3 className="text-base font-medium">With Drova</h3>
								</div>
								<motion.ul variants={stagger(0.08)} className="mt-5 space-y-3.5">
									{SOLUTION_POINTS.map((point) => (
										<motion.li
											key={point}
											variants={fadeUp}
											className="flex items-start gap-2.5 text-sm text-primary-foreground/90"
										>
											<MaterialIcon name="check_circle" size={16} className="mt-0.5 shrink-0 text-secondary" />
											{point}
										</motion.li>
									))}
								</motion.ul>
							</motion.div>
						</div>
					</div>
				</motion.section>

				{/* Features */}
				<motion.section
					id="features"
					className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
					variants={stagger()}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
						<p className="text-sm font-semibold tracking-wide text-secondary-two uppercase">The platform</p>
						<h2 className="mt-2 text-3xl font-extrabold tracking-tight">
							Everything you need, nothing you don&apos;t
						</h2>
						<p className="mt-3 text-muted-foreground">
							Five modules, one dashboard — from your customer-facing storefront to rider payouts.
						</p>
					</motion.div>
					<motion.div variants={stagger(0.1)} className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
						{MODULES.map((module, i) => (
							<motion.div
								key={module.title}
								variants={scaleIn}
								whileHover={{ y: -5 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className={cn(
									"rounded-2xl border p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-7",
									i % 2 === 0 ? "border-border bg-card" : "border-secondary/25 bg-secondary/[0.06]"
								)}
							>
								<div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<MaterialIcon name={module.icon} size={22} />
								</div>
								<h3 className="mt-4 text-base font-semibold">{module.title}</h3>
								<p className="mt-1.5 text-sm text-muted-foreground">{module.description}</p>
								<ul className="mt-4 space-y-2">
									{module.points.map((point) => (
										<li key={point} className="flex items-start gap-2 text-sm text-foreground/80">
											<MaterialIcon name="check_circle" size={15} className="mt-0.5 shrink-0 text-secondary-two" />
											{point}
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</motion.div>
				</motion.section>

				{/* How it works */}
				<motion.section
					className="bg-muted-alternative"
					variants={stagger()}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
						<motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
							<p className="text-sm font-semibold tracking-wide text-secondary-two uppercase">How it works</p>
							<h2 className="mt-2 text-3xl font-extrabold tracking-tight">Live in minutes, not months</h2>
						</motion.div>
						<motion.div
							variants={stagger(0.15)}
							className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3"
						>
							{STEPS.map((item) => (
								<motion.div
									key={item.step}
									variants={fadeUp}
									className="relative flex flex-col items-center text-center"
								>
									<span className="text-6xl font-bold text-primary/10 select-none">{item.step}</span>
									<span className="-mt-8 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
										<MaterialIcon name={item.icon} size={22} />
									</span>
									<h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
									<p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{item.description}</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</motion.section>

				{/* Final CTA */}
				<motion.section
					className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
					variants={stagger()}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<div className="flex flex-col items-center gap-5 text-center">
						<motion.div variants={fadeUp}>
							<PillBadge>Now accepting sign-ups</PillBadge>
						</motion.div>
						<motion.h2
							variants={fadeUp}
							className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
						>
							Ready to grow your
							<br />
							<span className="text-secondary-two">delivery business?</span>
						</motion.h2>
						<motion.p variants={fadeUp} className="max-w-xl text-balance text-muted-foreground">
							Join Drova and give your customers a branded, trackable delivery experience today.
						</motion.p>
						<motion.div variants={fadeUp}>
							<Button
								size="lg"
								className="rounded-full px-7 transition-transform duration-200 hover:scale-[1.04] active:scale-95"
								nativeButton={false}
								render={<Link href="/signup" />}
							>
								Create your account
							</Button>
						</motion.div>
					</div>
				</motion.section>
			</main>

			<footer className="bg-primary text-primary-foreground">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
					<div className="flex items-center gap-2">
						<span className="text-lg font-medium">Drova</span>
					</div>
					<p className="text-sm text-primary-foreground/60">
						&copy; {new Date().getFullYear()} Drova. All rights reserved.
					</p>
					<div className="flex items-center gap-4 text-sm">
						<Link href="/login" className="text-primary-foreground/70 hover:text-primary-foreground">
							Log in
						</Link>
						<Link href="/signup" className="text-primary-foreground/70 hover:text-primary-foreground">
							Sign up
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
