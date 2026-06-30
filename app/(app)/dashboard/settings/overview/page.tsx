import Link from "next/link"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"

export default function OverviewPage() {
  return (
    <div className="px-8 lg:px-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 1. Business Profile Card */}
        <section className="md:col-span-8 bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center overflow-hidden ring-1 ring-primary/10">
                <MaterialIcon name="hub" size={40} color="var(--primary)" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">Drova Logistics Global</h3>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="verified" size={16} color="var(--secondary)" />
                  <span className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">Verified Business Entity</span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/settings/profile">
              <Button variant="default" size="lg">
                Manage Profile
                <MaterialIcon name="arrow_forward" size={16} color="var(--primary-foreground)" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-silver-two p-4 rounded-lg">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Tax ID</p>
              <p className="text-foreground font-semibold">RC-98234-L</p>
            </div>
            <div className="bg-silver-two p-4 rounded-lg">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">HQ Location</p>
              <p className="text-foreground font-semibold">Lagos, Nigeria</p>
            </div>
            <div className="bg-silver-two p-4 rounded-lg">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
              <p className="text-foreground font-semibold">ops@drova.log</p>
            </div>
          </div>
        </section>

        {/* 2. Operations Scope Card */}
        <section className="md:col-span-4 bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
              <MaterialIcon name="local_shipping" size={24} color="var(--secondary)" />
            </div>
            <Link href="/dashboard/settings/operations" className="text-secondary font-bold text-sm hover:underline">Manage</Link>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Operations Scope</h3>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Active coverage for intracity express and interstate freight logistics.</p>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Intracity</span>
              <span className="bg-primary/5 text-primary text-xs font-black px-2 py-0.5 rounded uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Interstate</span>
              <span className="bg-primary/5 text-primary text-xs font-black px-2 py-0.5 rounded uppercase">Active</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Vehicle Fleet</p>
            <div className="flex flex-wrap gap-2">
              {["Bikes", "Vans", "10-Ton Trucks"].map((v) => (
                <span key={v} className="bg-silver-two px-3 py-1 rounded-full text-xs font-bold">{v}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Identity & Branding Card */}
        <section className="md:col-span-4 bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-silver-two rounded-lg flex items-center justify-center text-primary">
              <MaterialIcon name="palette" size={24} color="var(--primary)" />
            </div>
            <Link href="/dashboard/settings/branding" className="text-secondary font-bold text-sm hover:underline">Manage</Link>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Identity &amp; Branding</h3>
          <div className="mt-4 space-y-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Brand Palette</p>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-primary border-4 border-background shadow-sm" />
                <div className="w-10 h-10 rounded-full bg-secondary border-4 border-background shadow-sm" />
                <div className="w-10 h-10 rounded-full bg-chart-2 border-4 border-background shadow-sm" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Primary Font</p>
              <p className="text-lg font-extrabold text-primary">Onest</p>
            </div>
          </div>
        </section>

        {/* 4. Delivery Pricing Card */}
        <section className="md:col-span-4 bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700">
              <MaterialIcon name="payments" size={24} color="#a16207" />
            </div>
            <Link href="/dashboard/settings/delivery-pricing" className="text-secondary font-bold text-sm hover:underline">Manage</Link>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Delivery Pricing</h3>
          <p className="text-muted-foreground text-sm mb-6">Base rates for local fulfillment routes.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-silver-two rounded-lg">
              <span className="text-sm font-medium">Standard (0-5km)</span>
              <span className="font-bold text-primary">₦1,500</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-silver-two rounded-lg">
              <span className="text-sm font-medium">Extra per km</span>
              <span className="font-bold text-primary">₦150</span>
            </div>
          </div>
        </section>

        {/* 5. Payout Details Card — credit card style */}
        <section className="md:col-span-4 bg-primary text-white rounded-xl p-8 border border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-20" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-chart-2">
              <MaterialIcon name="account_balance" size={24} color="var(--chart-2)" />
            </div>
            <Link href="/dashboard/settings/payout" className="text-chart-2 font-bold text-sm hover:underline">Manage</Link>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">Payout Details</h3>
          <p className="text-white/70 text-sm mb-8 relative z-10">Funds are settled automatically every Friday.</p>
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <MaterialIcon name="account_balance" size={20} color="var(--primary)" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Access Bank PLC</p>
                <p className="text-xs text-white/60">Corporate Account</p>
              </div>
            </div>
            <p className="text-lg font-bold tracking-[0.15em]">**** 1234</p>
          </div>
        </section>
      </div>
    </div>
  )
}
