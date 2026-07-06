import Link from "next/link"
import MaterialIcon from "@/components/ui/material-icon"

const quickActions = [
	{ icon: "receipt_long", label: "View Quotations", href: "/dashboard/orders?tab=quotations", iconBg: "bg-amber-50", iconColor: "#D97706" },
	{ icon: "assignment_ind", label: "Assign Orders", href: "/dashboard/orders?tab=orders", iconBg: "bg-primary/5", iconColor: "var(--primary)" },
	{ icon: "group", label: "Manage Riders", href: "/dashboard/riders", iconBg: "bg-secondary/10", iconColor: "var(--secondary-two)" },
	{ icon: "account_balance_wallet", label: "Payout Riders", href: "/dashboard/payout", iconBg: "bg-primary/5", iconColor: "var(--primary)" },
]

export function QuickActions() {
	return (
		<div className="bg-popover rounded-2xl border border-border p-6">
			<h2 className="font-bold text-primary text-base mb-4">Quick Actions</h2>
			<div className="grid grid-cols-2 gap-3">
				{quickActions.map((a) => (
					<Link key={a.label} href={a.href}>
						<div className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer hover:scale-105 transition-transform text-center border border-border hover:border-secondary/30">
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg}`}>
								<MaterialIcon name={a.icon} size={20} color={a.iconColor} />
							</div>
							<span className="text-xs font-semibold text-foreground leading-tight">{a.label}</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
