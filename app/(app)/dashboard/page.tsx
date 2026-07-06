"use client"

import { rider } from "@/services/router"
import { RiderProfile } from "@/services/types/rider.types"
import MaterialIcon from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  {
    icon: "pending_actions",
    label: "Pending Quotations",
    value: "12",
    sub: "Awaiting your review",
    iconBg: "bg-amber-50",
    iconColor: "#D97706",
    badge: "Action needed",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: "local_shipping",
    label: "Active Orders",
    value: "8",
    sub: "Currently in delivery",
    iconBg: "bg-primary/5",
    iconColor: "var(--primary)",
    badge: "Live",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: "check_circle",
    label: "Completed Today",
    value: "24",
    sub: "Delivered successfully",
    iconBg: "bg-secondary/10",
    iconColor: "var(--secondary)",
    badge: "Today",
    badgeColor: "bg-secondary/10 text-secondary-two",
  },
  {
    icon: "payments",
    label: "Total Earnings",
    value: "₦184,500",
    sub: "This month",
    iconBg: "bg-secondary",
    iconColor: "white",
    badge: "MTD",
    badgeColor: "bg-white/20 text-white",
    highlighted: true,
  },
]

const recentActivity = [
  {
    icon: "receipt_long",
    iconBg: "bg-amber-50",
    iconColor: "#D97706",
    title: "New quotation from Amara Obi",
    sub: "Victoria Island → Ikeja • 2 mins ago",
    badge: "PENDING",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: "payment",
    iconBg: "bg-secondary/10",
    iconColor: "var(--secondary)",
    title: "Payment confirmed — Order #DRV-0042",
    sub: "₦7,500 via Nomba • 15 mins ago",
    badge: "PAID",
    badgeColor: "bg-secondary/10 text-secondary-two",
  },
  {
    icon: "local_shipping",
    iconBg: "bg-primary/5",
    iconColor: "var(--primary)",
    title: "Order #DRV-0039 picked up",
    sub: "Rider: Chukwuemeka D. • 32 mins ago",
    badge: "IN TRANSIT",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: "receipt_long",
    iconBg: "bg-amber-50",
    iconColor: "#D97706",
    title: "New quotation from Fatima Bello",
    sub: "Lekki → Surulere • 1 hr ago",
    badge: "PENDING",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: "verified",
    iconBg: "bg-secondary/10",
    iconColor: "var(--secondary)",
    title: "Order #DRV-0038 delivered",
    sub: "Rider: Akin Joseph • 1.5 hrs ago",
    badge: "DELIVERED",
    badgeColor: "bg-secondary/10 text-secondary-two",
  },
  {
    icon: "account_balance_wallet",
    iconBg: "bg-primary/5",
    iconColor: "var(--primary)",
    title: "Withdrawal processed — ₦45,000",
    sub: "Nomba transfer to First Bank • 3 hrs ago",
    badge: "PROCESSED",
    badgeColor: "bg-primary/10 text-primary",
  },
]

const quickActions = [
  { icon: "receipt_long", label: "View Quotations", href: "/dashboard/orders?tab=quotations", iconBg: "bg-amber-50", iconColor: "#D97706" },
  { icon: "assignment_ind", label: "Assign Orders", href: "/dashboard/orders?tab=orders", iconBg: "bg-primary/5", iconColor: "var(--primary)" },
  { icon: "group", label: "Manage Riders", href: "/dashboard/riders", iconBg: "bg-secondary/10", iconColor: "var(--secondary-two)" },
  { icon: "account_balance_wallet", label: "Payout Riders", href: "/dashboard/payout", iconBg: "bg-primary/5", iconColor: "var(--primary)" },
]

export default function DashboardHome() {
  const { data: ridersData } = rider.list.useQuery()

  const riders = ridersData?.data ?? []
  const availableCount = riders.filter((r: RiderProfile) => r.availabilityStatus === "available").length
  const onDeliveryCount = riders.filter((r: RiderProfile) => r.availabilityStatus === "on_trip").length
  const offlineCount = riders.filter((r: RiderProfile) => r.availabilityStatus === "offline").length
  const totalCount = riders.length

  const riderStatus = [
    { label: "Available", count: availableCount, color: "bg-secondary", dot: "bg-secondary" },
    { label: "On Delivery", count: onDeliveryCount, color: "bg-primary", dot: "bg-primary" },
    { label: "Offline", count: offlineCount, color: "bg-muted-foreground", dot: "bg-muted-foreground" },
  ]

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">

      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Good morning, Speedex</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Here&apos;s what&apos;s happening with your logistics today.</p>
        </div>
        <Link href="/dashboard/orders?tab=quotations">
          <Button className="hidden sm:flex gap-2">
            <MaterialIcon name="receipt_long" size={16} color="white" />
            View Quotations
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl p-5 border border-border flex flex-col gap-3 ${s.highlighted ? "bg-primary text-primary-foreground" : "bg-popover"}`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                <MaterialIcon name={s.icon} size={20} color={s.iconColor} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${s.badgeColor}`}>
                {s.badge}
              </span>
            </div>
            <div>
              <div className={`text-3xl font-extrabold tracking-tight ${s.highlighted ? "text-white" : "text-primary"}`}>
                {s.value}
              </div>
              <div className={`text-sm font-semibold mt-0.5 ${s.highlighted ? "text-white/80" : "text-foreground"}`}>
                {s.label}
              </div>
              <div className={`text-xs mt-0.5 ${s.highlighted ? "text-white/60" : "text-muted-foreground"}`}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-popover rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold text-primary text-base">Recent Activity</h2>
            <Link href="/dashboard/orders" className="text-xs text-secondary font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.iconBg}`}>
                  <MaterialIcon name={a.icon} size={18} color={a.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">{a.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${a.badgeColor}`}>
                      {a.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Rider Availability */}
          <div className="bg-popover rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary text-base">Rider Availability</h2>
              <Link href="/dashboard/riders" className="text-xs text-secondary font-semibold hover:underline">Manage</Link>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10" />
                  {totalCount > 0 && (
                    <>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--secondary)" strokeWidth="10"
                        strokeDasharray={`${(availableCount / totalCount) * 251} 251`} strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="10"
                        strokeDasharray={`${(onDeliveryCount / totalCount) * 251} 251`} strokeDashoffset={`-${(availableCount / totalCount) * 251}`} strokeLinecap="round" />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-primary">{totalCount}</span>
                  <span className="text-xs text-muted-foreground">Riders</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {riderStatus.map((r) => (
                <div key={r.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`} />
                    <span className="text-muted-foreground">{r.label}</span>
                  </div>
                  <span className="font-bold text-foreground">{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
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

        </div>
      </div>
    </div>
  )
}
